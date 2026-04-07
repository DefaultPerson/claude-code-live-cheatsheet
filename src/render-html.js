import { readFileSync } from 'fs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function renderHtml(data, { forPng = false } = {}) {
  const recentHtml = data.recentChanges
    .map(rc => `<span class="rc-item">• ${esc(rc.text)}</span>`)
    .join('  ');

  const sectionsHtml = buildGrid(data.sections, forPng);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Claude Code Cheat Sheet</title>
${forPng ? '' : `
<meta name="description" content="Self-updating visual cheatsheet for Claude Code — keyboard shortcuts, commands, tips, and more.">
<meta property="og:title" content="Claude Code Cheat Sheet">
<meta property="og:description" content="Auto-updated every 6h from the official CHANGELOG.">
<meta property="og:image" content="cheatsheet.png">
<link rel="alternate" type="application/rss+xml" title="Claude Code Cheatsheet Updates" href="feed.xml">
`}
<style>
${getStyles(forPng)}
</style>
</head>
<body${forPng ? ' class="png-mode"' : ''}>

<header class="header">
  <h1>Claude Code Cheat Sheet</h1>
  <div class="header-right">
    <span class="version-label">Claude Code v${esc(data.meta.lastVersion)}</span>
    <span class="date-label">Last updated: ${formatDate(data.meta.lastUpdated)}</span>
  </div>
</header>

<div class="recent-bar">
  <div class="rc-header"><span class="rc-icon">🔔</span> <span class="rc-title">Recent Changes</span></div>
  <div class="rc-content">${recentHtml}</div>
  ${!forPng ? '<button class="rc-close" onclick="this.parentElement.style.display=\'none\'" aria-label="Close">×</button>' : ''}
</div>

<div class="grid">
${sectionsHtml}
</div>

${!forPng ? `
<footer class="footer">
  <p>Auto-generated from <a href="https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md">CHANGELOG.md</a> every 6h · <a href="changelog.html">Changelog</a> · <a href="feed.xml">RSS</a></p>
</footer>
${getInteractiveScript()}
` : ''}

</body>
</html>`;
}

function buildGrid(sections, forPng = false) {
  // Group sections into 4 columns (col1=[row1,row2], col2=[row1,row2], etc.)
  const columns = [[], [], [], []];
  const sorted = [...sections].sort((a, b) => a.column - b.column || a.row - b.row);
  for (const s of sorted) columns[s.column - 1].push(s);

  const colsHtml = columns.map(col => {
    const cardsHtml = col.map(section => {
      const groupsHtml = section.groups.map(group => {
        const itemsHtml = group.items.map(item => `
              <div class="item"${forPng ? '' : ` data-copy="${esc(item.key)}"`}>
                <span class="item-key">${renderKey(item.key, section.id)}</span>
                <span class="item-val">${esc(item.value)}${item.isNew ? ' <b class="new">NEW</b>' : ''}</span>
              </div>`).join('');
        return `
            <div class="group">
              <div class="group-label">${esc(group.title)}</div>
              ${itemsHtml}
            </div>`;
      }).join('');

      return `
      <section class="card" style="border-color:${section.color}40">
        <div class="card-head" style="background:${section.color}">${getSectionIcon(section.id)} ${esc(section.title).toUpperCase()}</div>
        <div class="card-body" style="background:${section.color}18">
${groupsHtml}
        </div>
      </section>`;
    }).join('');

    return `<div class="col">${cardsHtml}</div>`;
  }).join('');

  return colsHtml;
}

const KBD_TOKENS = new Set(['Ctrl','Alt','Shift','Esc','Enter','Space','Tab','Meta','Cmd','Fn','↑','↓','←','→']);

function renderKey(key, sectionId) {
  if (sectionId === 'keyboard-shortcuts') {
    // All keys in this section get kbd treatment
    return key.split(/\s+/).map(part => {
      const subkeys = part.split('+');
      return subkeys.map(k => `<kbd>${esc(k)}</kbd>`).join('');
    }).join(' ');
  }

  if (sectionId === 'workflows-tips') {
    // Only wrap if the key looks like a keyboard combo (contains modifier keys or is a single known key)
    const parts = key.split(/\s+/);
    const hasKbdToken = parts.some(p => p.split('+').some(k => KBD_TOKENS.has(k) || (k.length === 1 && k >= 'A' && k <= 'Z')));
    if (hasKbdToken && !key.startsWith('/') && !key.startsWith('-') && !key.startsWith('"')) {
      return parts.map(part => {
        const subkeys = part.split('+');
        return subkeys.map(k => `<kbd>${esc(k)}</kbd>`).join('');
      }).join(' ');
    }
  }

  return esc(key);
}

function getSectionIcon(id) {
  return { 'keyboard-shortcuts':'⌨️', 'mcp-servers':'🔌', 'slash-commands':'⚡', 'memory-files':'📁', 'workflows-tips':'💡', 'config-env':'⚙️', 'skills-agents':'🤖', 'cli-flags':'🖥️' }[id] || '📋';
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
}

/* ─────────────── CSS ─────────────── */
function getStyles(forPng) {
  return `
*{margin:0;padding:0;box-sizing:border-box}

:root {
  --bg:#fafafa; --card:#fff; --text:#222; --muted:#666; --key:#1a1a2e;
  --border:#ddd; --group-c:#333; --hover:#f5f5f5;
  --header-line:#e0e0e040;
  --rc-bg:linear-gradient(to bottom,#fef0d5,#fce8c0); --rc-border:#e8d09a; --rc-text:#5c4813; --rc-dash:#c8a86080; --rc-close:#8a7030;
  --kbd-color:#444; --kbd-bg:#f3f4f6; --kbd-border:#cfd3d8; --kbd-bottom:#bcc0c6;
}
@media(prefers-color-scheme:dark){
  :root:not(.light){
    --bg:#0d1117; --card:#161b22; --text:#c9d1d9; --muted:#8b949e; --key:#e2b714;
    --border:#30363d; --group-c:#ccc; --hover:#1c2128;
    --header-line:#ffffff15;
    --rc-bg:linear-gradient(to bottom,#2a2518,#252010); --rc-border:#3a3520; --rc-text:#c0a050; --rc-dash:#70602880; --rc-close:#a09040;
    --kbd-color:#d0d0d0; --kbd-bg:#2a2f38; --kbd-border:#3e444d; --kbd-bottom:#4a5058;
  }
}
:root.dark{
  --bg:#0d1117;--card:#161b22;--text:#c9d1d9;--muted:#8b949e;--key:#e2b714;
  --border:#30363d;--group-c:#ccc;--hover:#1c2128;
  --header-line:#ffffff15;
  --rc-bg:linear-gradient(to bottom,#2a2518,#252010);--rc-border:#3a3520;--rc-text:#c0a050;--rc-dash:#70602880;--rc-close:#a09040;
  --kbd-color:#d0d0d0;--kbd-bg:#2a2f38;--kbd-border:#3e444d;--kbd-bottom:#4a5058;
}

body{
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;
  font-size:11.5px; line-height:1.35; color:var(--text); background:var(--bg);
  padding:10px 14px;
  ${forPng ? 'width:1400px;' : 'max-width:1400px;margin:0 auto;'}
}
body.png-mode{--bg:#fafafa;--card:#fff;--text:#222;--muted:#666;--key:#1a1a2e;--border:#ddd;--group-c:#333;--hover:#f5f5f5;--header-line:#e0e0e040;--rc-bg:linear-gradient(to bottom,#fef0d5,#fce8c0);--rc-border:#e8d09a;--rc-text:#5c4813;--rc-dash:#c8a86080;--rc-close:#8a7030;--kbd-color:#444;--kbd-bg:#f3f4f6;--kbd-border:#cfd3d8;--kbd-bottom:#bcc0c6}

/* ── HEADER ── */
.header{display:flex;justify-content:space-between;align-items:center;padding:6px 2px 8px;margin-bottom:0;border-bottom:1px solid var(--header-line)}
.header h1{font-size:20px;font-weight:800;letter-spacing:-0.3px;color:var(--text)}
.header-right{text-align:right}
.version-label{display:block;font-size:13px;font-weight:600;color:var(--text)}
.date-label{display:block;font-size:11px;color:var(--muted)}

/* ── RECENT CHANGES BAR ── */
.recent-bar{
  padding:6px 14px 8px;margin-top:6px;margin-bottom:8px;border-radius:5px;
  background:var(--rc-bg);border:1px solid var(--rc-border);
  font-family:'SFMono-Regular','Cascadia Code',Consolas,monospace;
  font-size:10.5px;color:var(--rc-text);position:relative;
}

.rc-header{display:flex;align-items:center;gap:4px;margin-bottom:4px;padding-bottom:3px;border-bottom:1px dashed var(--rc-dash)}
.rc-icon{font-size:12px}
.rc-title{font-weight:700;font-size:11px}
.rc-content{display:flex;flex-wrap:wrap;gap:1px 8px}
.rc-item{white-space:nowrap}
.rc-close{position:absolute;right:10px;top:8px;background:none;border:none;font-size:18px;cursor:pointer;color:var(--rc-close);font-weight:300}

/* ── GRID ── */
.grid{display:flex;gap:6px}
.col{flex:1;display:flex;flex-direction:column;gap:6px}
@media(max-width:1200px){.grid{flex-wrap:wrap}.col{flex:0 0 calc(50% - 3px)}}
@media(max-width:700px){.col{flex:0 0 100%}}

/* ── CARDS ── */
.card{background:var(--card);border:1px solid var(--border);border-radius:5px;overflow:hidden}
.card-head{
  padding:5px 10px;font-weight:700;font-size:10.5px;
  text-transform:uppercase;letter-spacing:.7px;color:#fff;
}
.card-body{padding:2px 0}

/* ── GROUPS & ITEMS ── */
.group{margin-bottom:0}
.group-label{padding:3px 10px 1px;font-weight:700;font-size:10px;color:var(--group-c);font-style:italic}

.item{
  display:flex;align-items:baseline;gap:8px;
  padding:1.5px 10px;font-size:11px;line-height:1.45;
  border-bottom:1px solid color-mix(in srgb,var(--border) 35%,transparent);
}
.item:hover{background:var(--hover)}
.item[data-copy]{cursor:pointer}

.item-key{
  flex:0 0 auto;white-space:nowrap;
  font-family:'SFMono-Regular','Cascadia Code','Fira Code',Consolas,monospace;
  font-weight:600;font-size:10.5px;color:var(--key);
}
.item-val{flex:1;color:var(--muted);font-size:10.5px}

/* ── KBD ── */
kbd{
  display:inline-block;padding:1px 5px;
  font-family:inherit;font-size:10px;font-weight:600;line-height:1.5;
  color:var(--kbd-color);background:var(--kbd-bg);
  border:1px solid var(--kbd-border);border-bottom:2px solid var(--kbd-bottom);
  border-radius:3px;
}

/* ── BADGE ── */
.new{
  display:inline-block;background:#e74c3c;color:#fff;
  font-size:7.5px;font-weight:700;font-style:normal;
  padding:1px 4px;border-radius:3px;margin-left:3px;
  vertical-align:middle;text-transform:uppercase;
}

/* ── FOOTER ── */
.footer{margin-top:14px;text-align:center;font-size:10.5px;color:var(--muted);padding:8px}
.footer a{color:var(--key);text-decoration:none}
.footer a:hover{text-decoration:underline}

/* ── THEME TOGGLE ── */
.theme-toggle{
  position:fixed;top:12px;right:12px;
  background:var(--card);border:1px solid var(--border);
  border-radius:8px;padding:6px 10px;cursor:pointer;font-size:14px;z-index:100;
}
`;
}

/* ─────────────── Interactive JS ─────────────── */
function getInteractiveScript() {
  return `
<button class="theme-toggle" id="themeToggle" title="Toggle theme">🌓</button>
<script>
(function(){
  const r=document.documentElement,b=document.getElementById('themeToggle'),s=localStorage.getItem('theme');
  if(s)r.classList.add(s);
  b.addEventListener('click',()=>{
    if(r.classList.contains('dark')){r.classList.remove('dark');r.classList.add('light');localStorage.setItem('theme','light');b.textContent='☀️'}
    else if(r.classList.contains('light')){r.classList.remove('light');r.classList.add('dark');localStorage.setItem('theme','dark');b.textContent='🌙'}
    else{r.classList.add('dark');localStorage.setItem('theme','dark');b.textContent='🌙'}
  });
  if(s==='dark')b.textContent='🌙';else if(s==='light')b.textContent='☀️';
})();
document.addEventListener('click',function(e){
  var t=e.target.closest('[data-copy]');if(!t)return;
  navigator.clipboard.writeText(t.dataset.copy).then(function(){
    var k=t.querySelector('.item-key'),o=k.innerHTML;
    k.innerHTML='<span style="color:#27ae60">✓ copied</span>';
    setTimeout(function(){k.innerHTML=o},700);
  });
});
</script>`;
}

// CLI entrypoint
if (process.argv[1] && process.argv[1].endsWith('render-html.js')) {
  const data = JSON.parse(readFileSync('cheatsheet.json', 'utf8'));
  const mode = process.argv.includes('--png') ? { forPng: true } : {};
  console.log(renderHtml(data, mode));
}
