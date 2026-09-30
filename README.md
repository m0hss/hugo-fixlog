# Fixlog: a Hugo theme for unfiltered dev logs

A dark "terminal × lab notebook" theme for developers who log experiments, wins, and dead ends. Every entry carries an outcome badge: **Worked**, **Didn't work**, **In progress**, or **Still poking**.

![Fixlog home](https://raw.githubusercontent.com/m0hss/hugo-fixlog/main/images/screenshot.png)

## Features

- Outcome badges plus client-side outcome filters on the home page and archive
- ⌘K / Ctrl+K / `/` command palette over a JSON index (no dependencies)
- Filterable archive, grouped by year, with a grep box, tag chips, and outcome chips
- Posts with numbered sections, a sticky table of contents, code blocks with a copy button, a "Core lesson" callout (blockquote), a checklist (task lists), and a sources list
- Status page driven by `data/status.yaml`: services, day-by-day history bars, and incidents with a "cause not confirmed yet" state
- Animated hero title with typed endings (static when `prefers-reduced-motion` is set, and in the HTML for SEO)
- RSS, JSON index, sitemap, favicons and PWA icons, mobile bottom tab bar
- No CSS framework and no JS dependencies. Uses Hugo Pipes only, so the standard (non-extended) Hugo works.

| Post | Archive | Status |
|---|---|---|
| ![Post](https://raw.githubusercontent.com/m0hss/hugo-fixlog/main/images/post.png) | ![Archive](https://raw.githubusercontent.com/m0hss/hugo-fixlog/main/images/archive.png) | ![Status](https://raw.githubusercontent.com/m0hss/hugo-fixlog/main/images/status.png) |

## Requirements

Hugo **0.146.0** or newer (the theme uses the new template system).

## Install

As a Git submodule:

```bash
git submodule add https://github.com/m0hss/hugo-fixlog.git themes/fixlog
```

Then set `theme = "fixlog"` in your `hugo.toml`.

Or as a Hugo module (needs Go):

```toml
[module]
  [[module.imports]]
    path = "github.com/m0hss/hugo-fixlog"
```

## Quick start

```bash
git clone https://github.com/m0hss/hugo-fixlog.git fixlog
cd fixlog/exampleSite
hugo server --themesDir ../..
```

The [exampleSite](https://github.com/m0hss/hugo-fixlog/tree/main/exampleSite) has a full config and sample content. Copy it as a starting point.

## Configuration

The theme expects these sections and menu identifiers, used for the active nav state and the mobile tab bar icons:

| Section | Page | Menu identifier |
|---|---|---|
| `/` | home | `home` |
| `content/posts/` | log | `log` |
| `content/archive/_index.md` | archive | `archive` |
| `content/status/_index.md` + `data/status.yaml` | status | `status` |

Enable the JSON output on the home page. The palette and the footer curl line use it:

```toml
[outputs]
  home = ["HTML", "RSS", "JSON"]
```

Site params:

| Param | Purpose |
|---|---|
| `description` | Meta description and hero fallback |
| `author`, `authorRole` | Header chip and post author card |
| `avatar` | Path in `static/` to a square avatar (optional) |
| `repo` | Footer GitHub icon (optional) |
| `publicURL` | Domain shown in the footer curl line (optional) |
| `version` | Small chip next to the logo (optional) |
| `manifest` | Path to a web manifest in `static/` (optional) |
| `footer` | Small print under the footer (optional) |

Home page front matter (`content/_index.md`): `tagline`, `intro` (Markdown), `building` (the "Currently building" pill), `taglinePrefix` plus `taglineEndings` (the animated title, where the first ending is the static fallback).

## Writing posts

```bash
hugo new posts/my-experiment.md
```

The archetype scaffolds Context, What I tried, What happened, Takeaway, and Next steps. Front matter the theme reads:

| Field | Values |
|---|---|
| `outcome` | `worked`, `failed`, `in-progress`, `poking` |
| `summary` | One-line hook on cards |
| `tags` | List of tags |
| `entry` | Override the automatic entry number |
| `metrics` | Up to 3 `{label, value, note}` shown on the card |
| `snippet` | `{file, code, tag}` mini code box on the card |
| `note` | `{label, text}` callout on the card |
| `facts` | `{label, value}` list in the post sidebar |
| `sources` | `{kind, ref, url, note}` list at the end of the post |

Markdown extras: `> quote` renders as the "Core lesson" callout, `- [ ]` task lists render as a checklist, and fenced code takes `{file="path"}` for the window title.

## Status page

`data/status.yaml` holds `services` (name, url, description, state, probe, uptime, history, note) and `incidents` (id, date, service, title, status, duration, impact, cause, cause_confirmed, fix, evidence). The headline is computed from the service states. See the exampleSite for the full schema. Set `sample: true` to show a "sample data" notice.

## License

[MIT](https://github.com/m0hss/hugo-fixlog/blob/main/LICENSE) © 2026 Sassi. Fonts: Space Grotesk, Inter, and JetBrains Mono via Google Fonts (SIL OFL).
