import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { detect } from './detect.js';
import { update } from './update.js';
import { renderHtml } from './render-html.js';
import { renderPng } from './render-png.js';
import { renderCheatsheet } from './render-cheatsheet.js';
import { renderReadme } from './render-readme.js';
import { renderFeed } from './render-feed.js';
import { renderChangelog } from './render-changelog.js';

const args = process.argv.slice(2);
const force = args.includes('--force');
const renderOnly = args.includes('--render-only');

// How many recent non-empty changelog entries contribute to the NEW badge.
// "Non-empty" = the version actually added or updated cheatsheet items.
const RECENT_VERSIONS_FOR_NEW_BADGE = 3;

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

// LLM has no access to system time and hallucinates dates; the pipeline is
// the source of truth. Restamp the given versions with today's date.
function stampVersionDates(data, versions) {
  const today = todayIso();
  const set = new Set(versions);
  for (const entry of (data.changelog || [])) {
    if (set.has(entry.version)) entry.date = today;
  }
  for (const rc of (data.recentChanges || [])) {
    if (set.has(rc.version)) rc.date = today;
  }
}

function recomputeIsNew(data, count = RECENT_VERSIONS_FOR_NEW_BADGE) {
  const meaningful = [];
  for (const c of (data.changelog || [])) {
    if ((c.added?.length || 0) + (c.updated?.length || 0) > 0) {
      meaningful.push(c);
      if (meaningful.length >= count) break;
    }
  }
  const flagged = new Set();
  for (const c of meaningful) {
    for (const a of (c.added || [])) flagged.add(`${a.section}|${a.key}`);
    for (const u of (c.updated || [])) flagged.add(`${u.section}|${u.key}`);
  }
  for (const sec of (data.sections || [])) {
    for (const g of (sec.groups || [])) {
      for (const item of (g.items || [])) {
        item.isNew = flagged.has(`${sec.id}|${item.key}`);
      }
    }
  }
}

async function main() {
  console.log('=== Claude Code Live Cheatsheet Pipeline ===\n');

  let data = JSON.parse(readFileSync('cheatsheet.json', 'utf8'));

  if (!renderOnly) {
    // Step 1: Detect new version
    console.log('[1/3] Detecting new versions...');
    const result = await detect(data.meta.lastVersion);

    if (!result && !force) {
      console.log('\nNo updates needed. Use --force to regenerate anyway.');
      return;
    }

    let versionsToStamp = [];

    if (result) {
      // Step 2: Update via Claude API
      console.log('\n[2/3] Updating cheatsheet via Claude AI...');
      try {
        data = await update(data, result.newEntries);
      } catch (err) {
        if (err.noRetry) {
          console.error('Non-retryable error:', err.message);
          process.exit(1);
        }
        console.error('Update failed, retrying once...');
        try {
          data = await update(data, result.newEntries);
        } catch (retryErr) {
          console.error('Retry failed:', retryErr.message);
          process.exit(1);
        }
      }

      // Inject raw changelog entries (AI doesn't need to do this)
      for (const v of result.newEntries) {
        const entry = (data.changelog || []).find(c => c.version === v.version);
        if (entry) entry.raw = v.entries;
      }

      versionsToStamp = result.newEntries.map(v => v.version);
    } else {
      console.log('No new version, but --force specified. Regenerating outputs...');
      // Treat --force as "this is the moment this cheatsheet state was
      // re-validated" — restamp the current latest version to repair any
      // historical date drift from prior LLM runs.
      versionsToStamp = [data.meta.lastVersion];
    }

    stampVersionDates(data, versionsToStamp);
    data.meta.lastUpdated = todayIso();
    recomputeIsNew(data);

    writeFileSync('cheatsheet.json', JSON.stringify(data, null, 2));
    console.log(`cheatsheet.json: v${data.meta.lastVersion}, lastUpdated=${data.meta.lastUpdated}`);
  } else {
    // Render-only stays read-only on cheatsheet.json, but renders must
    // still reflect the current isNew policy.
    recomputeIsNew(data);
  }

  // Step 3: Render all outputs
  console.log('\n[3/3] Rendering outputs...');
  mkdirSync('docs', { recursive: true });

  // PNG
  console.log('  → cheatsheet.png');
  await renderPng(data);

  // CHEATSHEET.md
  console.log('  → CHEATSHEET.md');
  writeFileSync('CHEATSHEET.md', renderCheatsheet(data));

  // README.md
  console.log('  → README.md');
  writeFileSync('README.md', renderReadme(data));

  // GH Pages index.html
  console.log('  → docs/index.html');
  writeFileSync('docs/index.html', renderHtml(data));

  // RSS feed
  console.log('  → docs/feed.xml');
  writeFileSync('docs/feed.xml', renderFeed(data));

  // Changelog
  console.log('  → docs/changelog.html');
  writeFileSync('docs/changelog.html', renderChangelog(data));

  console.log('\n✓ All outputs generated successfully.');
}

main().catch(err => {
  console.error('Pipeline failed:', err);
  process.exit(1);
});
