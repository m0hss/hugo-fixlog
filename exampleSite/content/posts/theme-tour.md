---
title: "A tour of the Fixlog theme"
date: 2026-09-28
summary: "Every front matter field and Markdown extra the theme understands, in one post."
tags: ["hugo", "theme"]
outcome: "worked"
metrics:
  - label: "Templates"
    value: "Hugo 0.146+"
  - label: "JS deps"
    value: "0"
    note: "vanilla JS only"
snippet:
  file: "terminal"
  code: "hugo new posts/my-experiment.md"
  tag: "START"
facts:
  - label: "Outcome"
    value: "worked"
sources:
  - kind: "repo"
    ref: "m0hss/hugo-fixlog"
    url: "https://github.com/m0hss/hugo-fixlog"
    note: "theme source"
---

Headings get numbered automatically and show up in the sidebar contents.

## Context

Each post carries an `outcome`: `worked`, `failed`, `in-progress`, or `poking`.

## What I tried

Fenced code gets a window bar and a copy button. Add a file name with `{file="..."}`:

```bash {file="terminal"}
hugo new posts/my-experiment.md
hugo server -D
```

## What happened

Tables, lists, and `inline code` all render in the notebook style.

| field | purpose |
|---|---|
| `summary` | one-line hook on cards |
| `sources` | evidence list at the end |

## Takeaway

> A blockquote renders as the "Core lesson" callout.

## Next steps

- [x] Task lists render as a checklist
- [ ] Write a real entry
