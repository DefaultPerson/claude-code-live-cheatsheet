import { readFileSync, writeFileSync } from 'fs';

export function renderCheatsheet(data) {
  const lines = [];

  lines.push(`# Claude Code Cheatsheet v${data.meta.lastVersion}`);
  lines.push('');
  lines.push(`> Auto-generated from [cheatsheet.json](cheatsheet.json) | [Visual version](cheatsheet.png) | [Interactive](https://defaultperson.github.io/claude-code-live-cheatsheet/)`);
  lines.push('');

  // Recent changes
  lines.push(`## Recent Changes`);
  lines.push('');
  for (const rc of data.recentChanges) {
    lines.push(`- ${rc.text} *(v${rc.version})*`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  // Sections ordered by column, row
  const sorted = [...data.sections].sort((a, b) => a.column - b.column || a.row - b.row);

  for (const section of sorted) {
    const icon = getSectionEmoji(section.id);
    lines.push(`## ${icon} ${section.title}`);
    lines.push('');

    for (const group of section.groups) {
      lines.push(`### ${group.title}`);
      lines.push('');
      lines.push('| Key | Description |');
      lines.push('|-----|-------------|');

      for (const item of group.items) {
        const newBadge = item.isNew ? ' **NEW**' : '';
        lines.push(`| \`${item.key}\` | ${item.value}${newBadge} |`);
      }

      lines.push('');
    }
  }

  lines.push('---');
  lines.push('');
  lines.push(`*Auto-updated every 6h from [CHANGELOG.md](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) via GitHub Actions + Claude AI*`);

  return lines.join('\n');
}

function getSectionEmoji(id) {
  const map = {
    'keyboard-shortcuts': '⌨️',
    'mcp-servers': '🔌',
    'slash-commands': '⚡',
    'memory-files': '📁',
    'workflows-tips': '💡',
    'config-env': '⚙️',
    'skills-agents': '🤖',
    'cli-flags': '🖥️',
  };
  return map[id] || '📋';
}

// CLI entrypoint
if (process.argv[1] && process.argv[1].endsWith('render-cheatsheet.js')) {
  const data = JSON.parse(readFileSync('cheatsheet.json', 'utf8'));
  const md = renderCheatsheet(data);
  writeFileSync('CHEATSHEET.md', md);
  console.log(`CHEATSHEET.md generated (${md.length} bytes)`);
}
