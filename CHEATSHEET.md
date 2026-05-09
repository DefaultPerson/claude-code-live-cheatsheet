# Claude Code Cheatsheet v2.1.138

> Auto-generated from [cheatsheet.json](cheatsheet.json) | [Visual version](cheatsheet.png) | [Interactive](https://defaultperson.github.io/cc-live-cheatsheet/)

## Recent Changes

- autoMode.hard_deny blocks unconditionally regardless of allow exceptions *(v2.1.136)*
- CLAUDE_CODE_ENABLE_FEEDBACK_SURVEY_FOR_OTEL for enterprise OTEL *(v2.1.136)*
- Fixed MCP servers disappearing after /clear in VS Code/JetBrains/SDK *(v2.1.136)*
- Fixed MCP OAuth refresh tokens lost with concurrent refreshes *(v2.1.136)*
- Fixed plan mode not blocking file writes with matching Edit allow rule *(v2.1.136)*
- Fixed --resume/--continue not finding sessions when path has underscores *(v2.1.136)*

---

## ⌨️ Keyboard Shortcuts

### General Controls

| Key | Description |
|-----|-------------|
| `Ctrl C` | Cancel input/generation |
| `Ctrl D` | Exit session |
| `Ctrl L` | Clear screen + force full redraw |
| `Ctrl O` | Toggle verbose transcript |
| `Ctrl R` | Reverse search history |
| `Ctrl G` | Open prompt in editor |
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
| `Ctrl+U` | Clear input buffer (Ctrl+Y to restore) |
| `Ctrl+E` | Move to end of line (multiline) |
| `v / V (vim mode)` | Visual / visual-line mode with selection |

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
| `Ctrl+A` | Show all projects (in /resume) |

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
| `_meta maxResultSizeChars` | Override result size up to 500K |
| `alwaysLoad` | Skip tool-search deferral for server tools |
| `workspace` | Reserved server name — skipped with warning |

## ⚡ Slash Commands

### Session

| Key | Description |
|-----|-------------|
| `/clear` | Clear conversation |
| `/compact [focus]` | Compact context |
| `/resume` | Resume/switch session |
| `/rename [name]` | Name current session |
| `/branch [name]` | Branch conversation (/fork alias) |
| `/cost` | Alias for /usage (cost tab) |
| `/context` | Visualize context (grid) |
| `/diff` | Interactive diff viewer |
| `/rewind` | Rewind conv / code checkpoint (/undo alias) |
| `/recap` | Context summary when returning to session |
| `/focus` | Toggle focus view |
| `/export` | Export conversation |

### Config

| Key | Description |
|-----|-------------|
| `/config` | Open settings |
| `/model [model]` | Switch model (←→ effort) |
| `/fast [on|off]` | Toggle fast mode |
| `/theme` | Change color theme; Auto matches terminal |
| `/permissions` | View/update permissions |
| `/effort [level]` | Set effort; interactive slider (low/med/xhigh/high/max/auto) |
| `/color [color]` | Set prompt-bar color; bare = random |
| `/keybindings` | Customize keyboard shortcuts |
| `/terminal-setup` | Configure terminal keybindings |
| `/tui [fullscreen]` | Switch to flicker-free TUI rendering |

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
| `/loop [interval]` | Recurring task (/proactive alias) |
| `/voice` | Push-to-talk voice (20 langs) |
| `/doctor` | Diagnose installation |
| `/pr-comments [PR]` | Fetch GitHub PR comments |
| `/remote-control` | Bridge to claude.ai/code (/rc) |
| `/usage` | Usage stats, cost, and rate status |
| `/schedule` | Cloud scheduled tasks |
| `/security-review` | Security analysis of changes |
| `/release-notes` | Interactive version picker |
| `/feedback` | Submit feedback (alias: /bug) |
| `/powerup` | Interactive lessons + animated demos |
| `/team-onboarding` | Generate teammate ramp-up guide |

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
| `Auto mode` | Built-in for Max subscribers |

### Thinking & Effort

| Key | Description |
|-----|-------------|
| `Alt T` | Toggle thinking on/off |
| `"ultrathink"` | Max effort for turn |
| `Ctrl O` | Toggle verbose transcript |
| `/effort` | ○ low · ◐ med · ◑ xhigh · ● high/max |

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
| `1M context` | Opus 4.7 (Max/Team/Ent) |
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
| `/loop 5m msg` | Recurring task (/proactive) |
| `/rc` | Remote Control |
| `--remote` | Web session on claude.ai |
| `Push notifications` | Mobile push via Remote Control |

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
| `claude plugin tag` | Create release git tag for plugin |
| `claude plugin prune` | Remove orphaned auto-installed plugins |
| `claude ultrareview [target]` | Run /ultrareview non-interactively; --json for raw |
| `claude project purge [path]` | Delete all CC state; --dry-run, -y, -i, --all |

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
| `--from-pr` | Load PR/MR from GitHub/GitLab/Bitbucket/GHE |
| `--effort` | low/med/xhigh/high/max |
| `--permission-mode` | plan/default/… |
| `--dangerously-skip-permissions` | Skip all prompts; catastrophic rm still prompts ⚠️ |
| `--chrome` | Chrome |
| `--exclude-dynamic-system-prompt-sections` | Print mode cross-user prompt caching |
| `--plugin-dir` | Load plugin from directory or .zip archive |
| `--plugin-url` | Fetch plugin .zip archive from URL for session |

## 🤖 Skills & Agents

### Built-in Skills

| Key | Description |
|-----|-------------|
| `/simplify` | Code review (3 parallel agents) |
| `/batch` | Large parallel changes (5-30 worktrees) |
| `/debug [desc]` | Troubleshoot from debug log |
| `/loop [interval]` | Recurring task (/proactive alias) |
| `/claude-api` | Load API + SDK reference |
| `/ultrareview [PR#]` | Cloud code review (parallel multi-agent) |
| `/less-permission-prompts` | Scan transcripts for allowlist proposals |

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
| `bin/` | Plugin ships executables |
| `keep-coding-instructions` | Frontmatter for plugin output styles |
| `monitors` | Plugin background monitors (auto-arm on session/skill) |
| `slash commands (Skill)` | Model discovers/invokes built-in commands |
| `${CLAUDE_EFFORT}` | Current effort level (skills, hooks, Bash tool) |

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
| `mcpServers` | Load MCP servers for agent session |

## ⚙️ Config & Env

### Config Files

| Key | Description |
|-----|-------------|
| `~/.claude/settings.json` | User settings |
| `.claude/settings.json` | Project (shared) |
| `.claude/settings.local.json` | Local only |
| `~/.claude.json` | OAuth, MCP, state |
| `.mcp.json` | Project MCP servers |
| `~/.claude/themes/` | Custom theme JSON files |

### Key Settings

| Key | Description |
|-----|-------------|
| `modelOverrides` | Map model picker → custom IDs |
| `worktree.sparsePaths` | Sparse checkout dirs |
| `sandbox.network.deniedDomains` | Block domains even when allowedDomains wildcard permits |
| `wslInheritsWindowsSettings` | WSL inherits Windows managed settings |
| `autoMode.$defaults` | Extend built-in auto mode rules instead of replacing |
| `skillOverrides` | Control skill visibility: off/user-invocable-only/name-only |
| `worktree.baseRef` | fresh|head — base branch for worktrees (default changed) |
| `autoMode.hard_deny` | Block unconditionally regardless of user intent or allow exceptions |

### Key Env Vars

| Key | Description |
|-----|-------------|
| `ANTHROPIC_API_KEY` | API key |
| `ANTHROPIC_MODEL` | Default model |
| `CLAUDE_CODE_EFFORT_LEVEL` | low/med/high |
| `MAX_THINKING_TOKENS` | 0=off |
| `DISABLE_UPDATES` | Block all update paths including manual |
| `ANTHROPIC_BEDROCK_SERVICE_TIER` | Select Bedrock tier (default/flex/priority) |
| `CLAUDE_CODE_SESSION_ID` | Session ID in Bash tool subprocess env |
| `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN` | Opt out of fullscreen alternate-screen renderer |
| `CLAUDE_EFFORT` | Current effort level in hooks and Bash tool |
| `CLAUDE_CODE_ENABLE_FEEDBACK_SURVEY_FOR_OTEL` | Re-enable session quality survey for OTEL enterprises |

### Hooks

| Key | Description |
|-----|-------------|
| `PreToolUse` | Before tool executes |
| `PostToolUse` | After tool executes (duration_ms; can replace output) |
| `PostToolUseFailure` | After tool fails (duration_ms included) |
| `Notification` | When Claude sends notification |
| `Stop` | When Claude finishes response |
| `SubagentStop` | When subagent finishes |
| `CwdChanged` | Working directory changed |
| `FileChanged` | File changed on disk |
| `PermissionDenied` | After auto mode denials |
| `TaskCreated` | When task created via TaskCreate |
| `PreCompact` | Block compaction (exit 2 or decision:block) |
| `mcp_tool type` | Invoke MCP tool directly from hook |

---

*Auto-updated every 6h from [CHANGELOG.md](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) via GitHub Actions + Claude AI*