import { readFileSync, writeFileSync } from 'fs';

export function renderReadme(data) {
  const v = data.meta.lastVersion;
  const date = new Date(data.meta.lastUpdated).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const recentMd = data.recentChanges
    .map(rc => `- ${rc.text} *(v${rc.version})*`)
    .join('\n');

  const totalItems = data.sections.reduce(
    (acc, s) => acc + s.groups.reduce((a, g) => a + g.items.length, 0), 0
  );

  return `# Claude Code Live Cheatsheet

![Claude Code Cheatsheet](cheatsheet.png)

> Self-updating visual reference for [Claude Code](https://claude.com/code).
> Refreshed every 5 minutes from the official [CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md).

[![Version](https://img.shields.io/badge/Claude_Code-v${v}-blue)](https://github.com/anthropics/claude-code)
[![Items](https://img.shields.io/badge/items-${totalItems}-green)](CHEATSHEET.md)
[![RSS](https://img.shields.io/badge/RSS-feed-orange)](https://defaultperson.github.io/claude-code-live-cheatsheet/feed.xml)

**[Live interactive version →](https://defaultperson.github.io/claude-code-live-cheatsheet/)**

## How It Works

1. GitHub Actions checks npm for new Claude Code releases every 5 minutes
2. Claude AI parses the [CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) and updates [\`cheatsheet.json\`](cheatsheet.json)
3. Auto-generates: [PNG](cheatsheet.png), [interactive HTML](https://defaultperson.github.io/claude-code-live-cheatsheet/), [RSS](https://defaultperson.github.io/claude-code-live-cheatsheet/feed.xml)

## License

MIT
`;
}

// CLI entrypoint
if (process.argv[1] && process.argv[1].endsWith('render-readme.js')) {
  const data = JSON.parse(readFileSync('cheatsheet.json', 'utf8'));
  const md = renderReadme(data);
  writeFileSync('README.md', md);
  console.log(`README.md generated (${md.length} bytes)`);
}
