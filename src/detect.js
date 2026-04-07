import { readFileSync } from 'fs';
import { gt as semverGt } from 'semver';

const CHANGELOG_URL = 'https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md';
const VERSION_RE = /^## (\d+\.\d+\.\d+)\s*$/gm;

export async function detect(currentVersion) {
  console.log(`Fetching CHANGELOG.md...`);
  const res = await fetch(CHANGELOG_URL);
  if (!res.ok) throw new Error(`Failed to fetch CHANGELOG.md: ${res.status}`);
  const changelog = await res.text();

  // Extract all versions
  const versions = [];
  let match;
  while ((match = VERSION_RE.exec(changelog)) !== null) {
    versions.push({ version: match[1], index: match.index });
  }

  if (versions.length === 0) throw new Error('No versions found in CHANGELOG.md');

  const latestVersion = versions[0].version;
  console.log(`Latest version: ${latestVersion}, current: ${currentVersion}`);

  if (!semverGt(latestVersion, currentVersion)) {
    console.log('No new version detected.');
    return null;
  }

  // Extract entries between current and latest
  const newEntries = [];
  for (let i = 0; i < versions.length; i++) {
    const v = versions[i];
    if (!semverGt(v.version, currentVersion)) break;

    const start = v.index;
    const end = i + 1 < versions.length ? versions[i + 1].index : changelog.length;
    const section = changelog.slice(start, end);

    // Extract bullet points
    const bullets = section
      .split('\n')
      .filter(line => line.startsWith('- '))
      .map(line => line.slice(2).trim());

    newEntries.push({ version: v.version, entries: bullets });
  }

  console.log(`Found ${newEntries.length} new version(s) with ${newEntries.reduce((a, v) => a + v.entries.length, 0)} total entries.`);

  return {
    latestVersion,
    newEntries,
  };
}

// CLI entrypoint
if (process.argv[1] && process.argv[1].endsWith('detect.js')) {
  const data = JSON.parse(readFileSync('cheatsheet.json', 'utf8'));
  detect(data.meta.lastVersion).then(result => {
    if (result) {
      console.log(JSON.stringify(result, null, 2));
    }
  }).catch(console.error);
}
