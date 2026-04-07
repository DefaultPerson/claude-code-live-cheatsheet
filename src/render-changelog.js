import { readFileSync, writeFileSync, mkdirSync } from 'fs';

export function renderChangelog(data) {
  const entries = (data.changelog || []);

  const entriesHtml = entries.map(entry => {
    const added = entry.added.map(a =>
      `<div class="diff-item diff-add">+ <strong>${esc(a.key)}</strong> → ${esc(a.value)} <span class="diff-section">[${esc(a.section)}]</span></div>`
    ).join('');

    const updated = entry.updated.map(u =>
      `<div class="diff-item diff-update">~ <strong>${esc(u.key)}</strong>: <del>${esc(u.oldValue)}</del> → ${esc(u.newValue)} <span class="diff-section">[${esc(u.section)}]</span></div>`
    ).join('');

    const removed = entry.removed.map(r =>
      `<div class="diff-item diff-remove">- <strong>${esc(r.key)}</strong> <span class="diff-section">[${esc(r.section)}]</span></div>`
    ).join('');

    const total = entry.added.length + entry.updated.length + entry.removed.length;

    return `
    <details id="v${esc(entry.version)}" ${entries.indexOf(entry) === 0 ? 'open' : ''}>
      <summary>
        <strong>v${esc(entry.version)}</strong>
        <span class="changelog-date">${esc(entry.date)}</span>
        <span class="changelog-stats">
          ${entry.added.length ? `<span class="stat-add">+${entry.added.length}</span>` : ''}
          ${entry.updated.length ? `<span class="stat-update">~${entry.updated.length}</span>` : ''}
          ${entry.removed.length ? `<span class="stat-remove">-${entry.removed.length}</span>` : ''}
        </span>
      </summary>
      <div class="diff-body">
        ${total > 0 ? '<div class="diff-label">Cheatsheet changes:</div>' : ''}
        ${added}${updated}${removed}
        ${total === 0 ? '<div class="diff-item">No cheatsheet changes in this version</div>' : ''}
        ${(entry.raw && entry.raw.length) ? `<div class="raw-section"><div class="diff-label">Full changelog (${entry.raw.length} entries):</div><div class="raw-entries">${entry.raw.map(e => `<div class="raw-entry">• ${esc(e)}</div>`).join('')}</div></div>` : ''}
      </div>
    </details>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Changelog — Claude Code Cheatsheet</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, 'Segoe UI', Roboto, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 16px;
  background: #fff;
  color: #333;
}
@media (prefers-color-scheme: dark) {
  body { background: #1a1a2e; color: #e0e0e0; }
  details { border-color: #2a2a4a; }
  summary:hover { background: #16213e; }
}
h1 { font-size: 24px; margin-bottom: 8px; }
.subtitle { color: #666; margin-bottom: 24px; font-size: 14px; }
.subtitle a { color: #2980b9; }
details {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 8px;
}
summary {
  padding: 10px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}
summary:hover { background: #f8f9fa; }
.changelog-date { color: #888; font-size: 12px; }
.changelog-stats { margin-left: auto; display: flex; gap: 6px; }
.stat-add { color: #27ae60; font-size: 12px; font-weight: 600; }
.stat-update { color: #e67e22; font-size: 12px; font-weight: 600; }
.stat-remove { color: #e74c3c; font-size: 12px; font-weight: 600; }
.diff-body { padding: 8px 14px 12px; }
.diff-item {
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 12px;
  padding: 3px 6px;
  border-radius: 3px;
  margin-bottom: 2px;
}
.diff-add { background: #e8f5e9; color: #1b5e20; }
.diff-update { background: #fff3e0; color: #e65100; }
.diff-remove { background: #fce4ec; color: #b71c1c; }
@media (prefers-color-scheme: dark) {
  .diff-add { background: #1b3a1b; color: #81c784; }
  .diff-update { background: #3a2e1b; color: #ffb74d; }
  .diff-remove { background: #3a1b1b; color: #ef9a9a; }
}
.diff-section { opacity: 0.5; font-size: 10px; }
.diff-label { font-weight: 600; font-size: 12px; margin: 8px 0 4px; color: #555; }
@media (prefers-color-scheme: dark) { .diff-label { color: #aaa; } }
del { opacity: 0.5; text-decoration: line-through; }
.raw-section { margin-top: 10px; border-top: 1px dashed #e0e0e0; padding-top: 8px; }
@media (prefers-color-scheme: dark) { .raw-section { border-top-color: #333; } }
.raw-entries { max-height: 300px; overflow-y: auto; }
.raw-entry { font-size: 11px; padding: 1px 6px; color: #555; }
@media (prefers-color-scheme: dark) { .raw-entry { color: #999; } }
</style>
</head>
<body>

<h1>Changelog</h1>
<p class="subtitle">
  Cheatsheet diff per Claude Code version.
  <a href="index.html">← Back to cheatsheet</a> ·
  <a href="feed.xml">RSS</a>
</p>

${entriesHtml || '<p>No changelog entries yet. Updates will appear here after the first auto-update.</p>'}

</body>
</html>`;
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// CLI entrypoint
if (process.argv[1] && process.argv[1].endsWith('render-changelog.js')) {
  const data = JSON.parse(readFileSync('cheatsheet.json', 'utf8'));
  const html = renderChangelog(data);
  mkdirSync('docs', { recursive: true });
  writeFileSync('docs/changelog.html', html);
  console.log(`docs/changelog.html generated (${html.length} bytes)`);
}
