import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const SYSTEM_PROMPT = `You are a cheatsheet curator for Claude Code (Anthropic's AI coding assistant).

Your job: given the current cheatsheet.json and new CHANGELOG entries, produce an updated cheatsheet.json.

OUTPUT:
1. ONLY output valid JSON. No markdown fences, no explanation, no comments. Just the raw JSON object.
2. Update meta.lastVersion to the newest version from the changelog.
3. Update meta.lastUpdated to today's date in YYYY-MM-DD format.

WHAT TO ADD (cheatsheet-relevant):
4. New slash commands → section "slash-commands", correct group (Session/Config/Tools/Special)
5. New keyboard shortcuts → section "keyboard-shortcuts", correct group
6. New CLI flags → section "cli-flags"
7. New environment variables → section "config-env", group "Key Env Vars"
8. New hooks → section "config-env", group "Hooks"
9. New agent/skill features (frontmatter keys, built-in agents/skills) → section "skills-agents"
10. New MCP features → section "mcp-servers"
11. New workflow-changing features (voice, worktrees, remote, scheduling) → section "workflows-tips"
12. New config files/settings → section "config-env"
13. New memory/rules features → section "memory-files"

WHAT TO SKIP (NOT cheatsheet-relevant):
14. Bug fixes, crash fixes, memory leak fixes
15. Performance improvements, latency optimizations
16. Internal refactors, code cleanup
17. Platform-specific fixes ([VSCode], [macOS] etc.) unless they add new features
18. UI polish (rendering, flickering, scrolling fixes)

SECTION LIMITS:
19. Each section has a maxItems cap. NEVER exceed it. Count ALL items across ALL groups.
20. When adding a new item would exceed maxItems, REPLACE the least important or most outdated item.
21. Prefer replacing old items that are no longer relevant over items that are still actively used.

NEW BADGES:
22. Set isNew=true ONLY for items added or meaningfully modified in THIS update.
23. Set isNew=false for ALL previously-existing items (clear any old isNew=true flags).

RECENT CHANGES:
24. Replace recentChanges array with the 5-7 most notable USER-FACING changes from the new version(s).
25. Each entry: { "version": "X.Y.Z", "text": "concise description under 80 chars", "date": "YYYY-MM-DD" }
26. Prioritize: new features > new commands > behavior changes > deprecations.

CHANGELOG ARRAY:
27. PREPEND a new entry to the changelog array (newest first).
28. Entry format: { "version": "X.Y.Z", "date": "YYYY-MM-DD", "added": [{"section":"id","key":"...","value":"..."}], "updated": [{"section":"id","key":"...","oldValue":"...","newValue":"..."}], "removed": [{"section":"id","key":"..."}] }
29. Only include items you actually added/updated/removed in the cheatsheet, not all changelog entries.
30. Keep only the last 20 changelog entries. Trim older ones.

KEY FORMAT:
31. Keyboard shortcuts: "Ctrl C", "Alt T", "Shift Tab", "Ctrl+X Ctrl+E" (use + for chords within a combo, space between separate presses)
32. Slash commands: "/command [args]" — include common arguments in brackets
33. CLI flags: "--flag-name" with leading dashes
34. Environment variables: "VARIABLE_NAME" in caps
35. Hooks: "HookName" in PascalCase
36. Paths: use ~ for home dir, ./ for project

VALUE FORMAT:
37. Concise descriptions, under 80 characters.
38. No trailing periods.
39. Use imperative voice when possible: "Toggle vim mode" not "Toggles vim mode"

STRUCTURE PRESERVATION:
40. Maintain ALL existing section IDs, titles, colors, column, row, maxItems, and group names.
41. Do NOT reorder sections, groups, or change any metadata fields.
42. Do NOT add new groups unless a genuinely new category of items emerges.
43. Do NOT duplicate items across sections. Each item belongs in exactly one section.
44. Preserve the exact JSON structure — same nesting, same field names.`;

export async function update(currentData, newEntries) {
  const changelogText = newEntries
    .map(v => `## ${v.version}\n${v.entries.map(e => `- ${e}`).join('\n')}`)
    .join('\n\n');

  // Compact JSON (no indentation) saves ~40% tokens vs pretty-printed
  const userPrompt = `Here is the current cheatsheet.json (compact format):

<cheatsheet>
${JSON.stringify(currentData)}
</cheatsheet>

New CHANGELOG entries since version ${currentData.meta.lastVersion}:

<changelog>
${changelogText}
</changelog>

Update the cheatsheet.json with any relevant changes. Output ONLY the complete updated JSON in COMPACT format (no whitespace/newlines).`;

  let result;

  if (process.env.OPENROUTER_API_KEY) {
    result = await updateViaOpenRouter(userPrompt);
  } else if (process.env.ANTHROPIC_API_KEY) {
    result = await updateViaSDK(userPrompt);
  } else {
    throw new Error('Set OPENROUTER_API_KEY or ANTHROPIC_API_KEY');
  }

  // Validate
  validateCheatsheet(result);
  return result;
}

const MODEL = process.env.CHEATSHEET_MODEL || 'z-ai/glm-5.1';
const MAX_TOKENS = 16384;
const REQUEST_TIMEOUT_MS = 300_000;

// Errors that should NOT be retried (retry is pointless and wastes money)
export class NoRetryError extends Error {
  constructor(message) { super(message); this.noRetry = true; }
}

async function updateViaOpenRouter(userPrompt) {
  console.log(`Calling OpenRouter API (${MODEL}, timeout ${REQUEST_TIMEOUT_MS / 1000}s)...`);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res;
  try {
    res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
      }),
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`OpenRouter request timed out after ${REQUEST_TIMEOUT_MS / 1000}s`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const err = await res.text();
    // 402 = insufficient credits, 401 = bad auth, 403 = forbidden — don't retry
    if ([401, 402, 403].includes(res.status)) {
      throw new NoRetryError(`OpenRouter ${res.status}: ${err}`);
    }
    throw new Error(`OpenRouter ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text = data.choices[0].message.content;
  const u = data.usage || {};
  console.log(`Tokens: ${u.prompt_tokens || '?'} in (${u.prompt_tokens_details?.cached_tokens || 0} cached), ${u.completion_tokens || '?'} out`);
  return parseJsonResponse(text);
}

async function updateViaSDK(userPrompt) {
  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const client = new Anthropic();

  const anthropicModel = MODEL.replace(/^anthropic\//, '');
  console.log(`Calling Anthropic API (${anthropicModel})...`);
  const response = await client.messages.create({
    model: anthropicModel,
    max_tokens: MAX_TOKENS,
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: userPrompt }],
  });

  const text = response.content[0].text;
  const u = response.usage || {};
  console.log(`Tokens: ${u.input_tokens} in (${u.cache_read_input_tokens || 0} cached, ${u.cache_creation_input_tokens || 0} written), ${u.output_tokens} out`);
  return parseJsonResponse(text);
}

function parseJsonResponse(text) {
  // Strip markdown fences if present
  let clean = text.trim();
  if (clean.startsWith('```')) {
    clean = clean.replace(/^```\w*\n/, '').replace(/\n```$/, '');
  }

  try {
    return JSON.parse(clean);
  } catch (e) {
    throw new Error(`Failed to parse Claude response as JSON: ${e.message}\nFirst 200 chars: ${clean.slice(0, 200)}`);
  }
}

function validateCheatsheet(data) {
  if (!data.meta?.lastVersion) throw new Error('Missing meta.lastVersion');
  if (!data.meta?.lastUpdated) throw new Error('Missing meta.lastUpdated');
  if (!Array.isArray(data.sections)) throw new Error('Missing sections array');
  if (data.sections.length !== 8) throw new Error(`Expected 8 sections, got ${data.sections.length}`);

  for (const section of data.sections) {
    const totalItems = section.groups.reduce((a, g) => a + g.items.length, 0);
    if (totalItems > section.maxItems) {
      throw new Error(`Section "${section.id}" has ${totalItems} items but maxItems is ${section.maxItems}`);
    }
  }

  if (!Array.isArray(data.recentChanges) || data.recentChanges.length === 0) {
    throw new Error('Missing or empty recentChanges');
  }

  console.log('Validation passed.');
}

// CLI entrypoint
if (process.argv[1] && process.argv[1].endsWith('update.js')) {
  const data = JSON.parse(readFileSync('cheatsheet.json', 'utf8'));
  const mockEntries = [{ version: '99.0.0', entries: ['Added test feature for validation'] }];
  update(data, mockEntries).then(result => {
    console.log('Updated version:', result.meta.lastVersion);
  }).catch(console.error);
}
