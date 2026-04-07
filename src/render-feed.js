import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const BASE_URL = 'https://defaultperson.github.io/claude-code-live-cheatsheet';

export function renderFeed(data) {
  const items = (data.changelog || []).slice(0, 20).map(entry => {
    const cheatsheetDiff = [
      ...entry.added.map(a => `+ [${a.section}] ${a.key}: ${a.value}`),
      ...entry.updated.map(u => `~ [${u.section}] ${u.key}: ${u.newValue}`),
      ...entry.removed.map(r => `- [${r.section}] ${r.key}`),
    ].join('\n');

    const rawEntries = (entry.raw || []).map(e => `• ${e}`).join('\n');

    const desc = [
      cheatsheetDiff ? `<h3>Cheatsheet changes</h3><pre>${esc(cheatsheetDiff)}</pre>` : '',
      rawEntries ? `<h3>Full changelog</h3><pre>${esc(rawEntries)}</pre>` : '',
    ].filter(Boolean).join('\n') || 'Minor updates';

    const pubDate = new Date(entry.date).toUTCString();

    return `    <item>
      <title>Claude Code v${esc(entry.version)}</title>
      <description><![CDATA[${desc}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="false">v${esc(entry.version)}</guid>
      <link>${BASE_URL}/changelog.html#v${esc(entry.version)}</link>
    </item>`;
  }).join('\n');

  // Also add recentChanges as latest item if no changelog
  const recentItem = data.recentChanges.length > 0 ? `    <item>
      <title>Claude Code v${esc(data.meta.lastVersion)} highlights</title>
      <description><![CDATA[<ul>${data.recentChanges.map(rc => `<li>${esc(rc.text)} (v${rc.version})</li>`).join('')}</ul>]]></description>
      <pubDate>${new Date(data.meta.lastUpdated).toUTCString()}</pubDate>
      <guid isPermaLink="false">highlights-v${esc(data.meta.lastVersion)}</guid>
      <link>${BASE_URL}/</link>
    </item>` : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Claude Code Live Cheatsheet</title>
    <link>${BASE_URL}/</link>
    <description>Auto-updating cheatsheet for Claude Code — keyboard shortcuts, commands, tips, and more.</description>
    <language>en</language>
    <lastBuildDate>${new Date(data.meta.lastUpdated).toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${recentItem}
${items}
  </channel>
</rss>`;
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// CLI entrypoint
if (process.argv[1] && process.argv[1].endsWith('render-feed.js')) {
  const data = JSON.parse(readFileSync('cheatsheet.json', 'utf8'));
  const xml = renderFeed(data);
  mkdirSync('docs', { recursive: true });
  writeFileSync('docs/feed.xml', xml);
  console.log(`docs/feed.xml generated (${xml.length} bytes)`);
}
