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

      writeFileSync('cheatsheet.json', JSON.stringify(data, null, 2));
      console.log(`cheatsheet.json updated to v${data.meta.lastVersion}`);
    } else {
      console.log('No new version, but --force specified. Regenerating outputs...');
    }
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
