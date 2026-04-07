# Claude Code Cheatsheet v2.1.92

> Auto-generated from [cheatsheet.json](cheatsheet.json) | [Visual version](cheatsheet.png) | [Interactive](https://defaultperson.github.io/claude-code-live-cheatsheet/)

## Recent Changes

- Removed /vim and /tag commands *(v2.1.92)*
- /release-notes is now interactive version picker *(v2.1.92)*
- MCP result size override up to 500K chars *(v2.1.91)*
- Plugins can ship executables under bin/ *(v2.1.91)*
- /powerup — interactive feature lessons *(v2.1.90)*
- PreToolUse defer decision for headless sessions *(v2.1.89)*
- MCP_CONNECTION_NONBLOCKING for -p mode *(v2.1.89)*

---

## ⌨️ Keyboard Shortcuts

### General Controls

| Key | Description |
|-----|-------------|
| `Ctrl C` | Cancel input/generation |
| `Ctrl D` | Exit session |
| `Ctrl L` | Clear screen |
| `Ctrl O` | Toggle verbose output |
| `Ctrl R` | Reverse search history |
| `Ctrl G` | Open prompt in editor |
| `Ctrl+X Ctrl+E` | Open in editor (alias) |
| `Ctrl B` | Background running task |
| `Ctrl T` | Toggle task list |
| `Ctrl V` | Paste image |
| `Ctrl+X Ctrl+K` | Kill background agents |
| `Esc Esc` | Rewind / undo |

### Mode Switching

| Key | Description |
|-----|-------------|
| `Shift Tab` | Cycle permission modes |
| `Alt P` | Switch model |
| `Alt T` | Toggle thinking |

### Input

| Key | Description |
|-----|-------------|
| `\ Enter` | Newline (quick) |
| `Ctrl J` | Newline (control seq) |

### Prefixes

| Key | Description |
|-----|-------------|
| `/` | Slash command |
| `!` | Direct bash |
| `@` | File mention + autocomplete |

### Session Picker

| Key | Description |
|-----|-------------|
| `↑↓` | Navigate |
| `←→` | Expand/collapse |
| `P` | Preview |
| `R` | Rename |
| `/` | Search |
| `A` | All projects |
| `B` | Current branch |

## 🔌 MCP Servers

### Add Servers

| Key | Description |
|-----|-------------|
| `--transport http` | Remote HTTP (recommended) |
| `--transport stdio` | Local process |
| `--transport sse` | Remote SSE |

### Scopes

| Key | Description |
|-----|-------------|
| `Local` | settings.local.json (you only) |
| `Project` | .mcp.json (shared/VCS) |
| `User` | ~/.claude.json (global) |

### Manage

| Key | Description |
|-----|-------------|
| `/mcp` | Interactive UI |
| `claude mcp list` | List all servers |
| `claude mcp serve` | CC as MCP server |
| `Elicitation` | Servers request input mid-task |
| `_meta maxResultSizeChars` | Override result size up to 500K **NEW** |

## ⚡ Slash Commands

### Session

| Key | Description |
|-----|-------------|
| `/clear` | Clear conversation |
| `/compact [focus]` | Compact context |
| `/resume` | Resume/switch session |
| `/rename [name]` | Name current session |
| `/branch [name]` | Branch conversation (/fork alias) |
| `/cost` | Token usage stats |
| `/context` | Visualize context (grid) |
| `/diff` | Interactive diff viewer |
| `/copy [N]` | Copy last (or Nth) response |
| `/rewind` | Rewind conv / code checkpoint |
| `/export` | Export conversation |

### Config

| Key | Description |
|-----|-------------|
| `/config` | Open settings |
| `/model [model]` | Switch model (←→ effort) |
| `/fast [on|off]` | Toggle fast mode |
| `/theme` | Change color theme |
| `/permissions` | View/update permissions |
| `/effort [level]` | Set effort (low/med/high/max/auto) |
| `/color [color]` | Set prompt-bar color |
| `/keybindings` | Customize keyboard shortcuts |
| `/terminal-setup` | Configure terminal keybindings |

### Tools

| Key | Description |
|-----|-------------|
| `/init` | Create CLAUDE.md |
| `/memory` | Edit CLAUDE.md files |
| `/mcp` | Manage MCP servers |
| `/hooks` | Manage hooks |
| `/skills` | List available skills |
| `/agents` | Manage agents |
| `/chrome` | Chrome integration |
| `/reload-plugins` | Hot-reload plugins |
| `/add-dir <path>` | Add working directory |

### Special

| Key | Description |
|-----|-------------|
| `/btw <question>` | Side question (no context) |
| `/plan [desc]` | Plan mode (+ auto-start) |
| `/loop [interval]` | Schedule recurring task |
| `/voice` | Push-to-talk voice (20 langs) |
| `/doctor` | Diagnose installation |
| `/pr-comments [PR]` | Fetch GitHub PR comments |
| `/stats` | Usage streaks & prefs |
| `/insights` | Analyze sessions report |
| `/desktop` | Continue in Desktop app |
| `/remote-control` | Bridge to claude.ai/code (/rc) |
| `/usage` | Plan limits & rate status |
| `/schedule` | Cloud scheduled tasks |
| `/security-review` | Security analysis of changes |
| `/release-notes` | Interactive version picker **NEW** |
| `/feedback` | Submit feedback (alias: /bug) |
| `/powerup` | Interactive lessons + animated demos **NEW** |

## 📁 Memory & Files

### CLAUDE.md Locations

| Key | Description |
|-----|-------------|
| `./CLAUDE.md` | Project (team-shared) |
| `~/.claude/CLAUDE.md` | Personal (all projects) |
| `/etc/claude-code/` | Managed (org-wide) |

### Rules & Import

| Key | Description |
|-----|-------------|
| `.claude/rules/*.md` | Project rules |
| `~/.claude/rules/*.md` | User rules |
| `paths: frontmatter` | Path-specific rules |
| `@path/to/file` | Import in CLAUDE.md |

### Auto Memory

| Key | Description |
|-----|-------------|
| `~/.claude/projects/<proj>/memory/` | Auto-loaded per project |
| `MEMORY.md` | Memory index + topic files |

## 💡 Workflows & Tips

### Plan Mode

| Key | Description |
|-----|-------------|
| `Shift Tab` | Normal → Auto-Accept → Plan |
| `--permission-mode plan` | Start in plan mode |

### Thinking & Effort

| Key | Description |
|-----|-------------|
| `Alt T` | Toggle thinking on/off |
| `"ultrathink"` | Max effort for turn |
| `Ctrl O` | See thinking (verbose) |
| `/effort` | ○ low · ◐ med · ● high |

### Git Worktrees

| Key | Description |
|-----|-------------|
| `--worktree name` | Isolated branch per feature |
| `isolation: worktree` | Agent in own worktree |
| `sparsePaths` | Checkout only needed dirs |
| `/batch` | Auto-creates worktrees |

### Voice Mode

| Key | Description |
|-----|-------------|
| `/voice` | Enable push-to-talk |
| `Space (hold)` | Record, release to send |
| `20 languages` | EN, ES, FR, DE, CZ, PL… |

### Context Management

| Key | Description |
|-----|-------------|
| `/context` | Usage + optimization tips |
| `/compact [focus]` | Compress with focus |
| `Auto-compact` | ~95% capacity |
| `1M context` | Opus 4.6 (Max/Team/Ent) |
| `CLAUDE.md` | Survives compaction! |

### Session Power Moves

| Key | Description |
|-----|-------------|
| `claude -c` | Continue last conv |
| `claude -r "name"` | Resume by name |
| `/btw question` | Side Q, no context cost |

### SDK / Headless

| Key | Description |
|-----|-------------|
| `claude -p "query"` | Non-interactive |
| `--output-format json` | Structured output |
| `--max-budget-usd 5` | Cost cap |
| `cat file | claude -p` | Pipe input |

### Scheduling & Remote

| Key | Description |
|-----|-------------|
| `/loop 5m msg` | Recurring task |
| `/rc` | Remote control |
| `--remote` | Web session on claude.ai |

## 🖥️ CLI & Flags

### Core Commands

| Key | Description |
|-----|-------------|
| `claude` | Interactive |
| `claude "q"` | With prompt |
| `claude -p "q"` | Headless |
| `claude -c` | Continue last |
| `claude -r "n"` | Resume |
| `claude update` | Update |

### Key Flags

| Key | Description |
|-----|-------------|
| `--model` | Set model |
| `-w` | Git worktree |
| `-n / --name` | Session name |
| `--add-dir` | Add dir |
| `--agent` | Use agent |
| `--allowedTools` | Pre-approve |
| `--output-format` | json/stream |
| `--json-schema` | Structured |
| `--max-turns` | Limit turns |
| `--max-budget-usd` | Cost cap |
| `--console` | Auth via Anthropic Console |
| `--verbose` | Verbose |
| `--bare` | Minimal headless (no hooks/LSP) |
| `--channels` | Permission relay / MCP push |
| `--remote` | Web session |
| `--effort` | low/med/high/max |
| `--permission-mode` | plan/default/… |
| `--dangerously-skip-permissions` | Skip all prompts ⚠️ |
| `--chrome` | Chrome |

## 🤖 Skills & Agents

### Built-in Skills

| Key | Description |
|-----|-------------|
| `/simplify` | Code review (3 parallel agents) |
| `/batch` | Large parallel changes (5-30 worktrees) |
| `/debug [desc]` | Troubleshoot from debug log |
| `/loop [interval]` | Recurring scheduled task |
| `/claude-api` | Load API + SDK reference |

### Custom Skill Locations

| Key | Description |
|-----|-------------|
| `.claude/skills/<name>/` | Project skills |
| `~/.claude/skills/<name>/` | Personal skills |

### Skill Frontmatter

| Key | Description |
|-----|-------------|
| `description` | Auto-invocation trigger |
| `allowed-tools` | Skip permission prompts |
| `model` | Override model for skill |
| `effort` | Override effort level |
| `context: fork` | Run in subagent |
| `$ARGUMENTS` | User input placeholder |
| `${CLAUDE_SKILL_DIR}` | Skill's own directory |
| `!`cmd`` | Dynamic context injection |
| `bin/` | Plugin ships executables **NEW** |

### Built-in Agents

| Key | Description |
|-----|-------------|
| `Explore` | Fast read-only (Haiku) |
| `Plan` | Research for plan mode |
| `General` | Full tools, complex tasks |
| `Bash` | Terminal separate context |

### Agent Frontmatter

| Key | Description |
|-----|-------------|
| `permissionMode` | default/acceptEdits/plan/dontAsk/bypass |
| `isolation: worktree` | Run in git worktree |
| `memory: user|project` | Persistent memory |
| `background: true` | Background task |
| `maxTurns` | Limit agentic turns |
| `SendMessage` | Resume agents (replaces resume) |
| `initialPrompt` | Auto-submit first turn |

## ⚙️ Config & Env

### Config Files

| Key | Description |
|-----|-------------|
| `~/.claude/settings.json` | User settings |
| `.claude/settings.json` | Project (shared) |
| `.claude/settings.local.json` | Local only |
| `~/.claude.json` | OAuth, MCP, state |
| `.mcp.json` | Project MCP servers |

### Key Settings

| Key | Description |
|-----|-------------|
| `modelOverrides` | Map model picker → custom IDs |
| `autoMemoryDirectory` | Custom memory dir |
| `worktree.sparsePaths` | Sparse checkout dirs |
| `disableSkillShellExecution` | Disable shell exec in skills/commands **NEW** |
| `showThinkingSummaries` | Restore thinking summaries in sessions **NEW** |
| `forceRemoteSettingsRefresh` | Fail-closed remote settings fetch **NEW** |

### Key Env Vars

| Key | Description |
|-----|-------------|
| `ANTHROPIC_API_KEY` | API key |
| `ANTHROPIC_MODEL` | Default model |
| `CLAUDE_CODE_EFFORT_LEVEL` | low/med/high |
| `MAX_THINKING_TOKENS` | 0=off |
| `ANTHROPIC_CUSTOM_MODEL_OPTION` | Custom /model entry |
| `CLAUDE_CODE_PLUGIN_SEED_DIR` | Multiple plugin seed dirs |
| `CLAUDECODE` | Detect CC shell (=1) |
| `IS_DEMO` | Demo mode (hide email/org) |
| `CLAUDE_CODE_NO_FLICKER` | Flicker-free alt-screen rendering |
| `MCP_CONNECTION_NONBLOCKING` | Skip MCP wait in -p mode **NEW** |

### Hooks

| Key | Description |
|-----|-------------|
| `PreToolUse` | Before tool executes |
| `PostToolUse` | After tool executes |
| `Notification` | When Claude sends notification |
| `Stop` | When Claude finishes response |
| `SubagentStop` | When subagent finishes |
| `CwdChanged` | Working directory changed |
| `FileChanged` | File changed on disk |
| `PermissionDenied` | After auto mode denials |
| `TaskCreated` | When task created via TaskCreate |
| `"defer" decision` | Pause tool, resume with -p --resume **NEW** |

---

*Auto-updated every 6h from [CHANGELOG.md](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) via GitHub Actions + Claude AI*