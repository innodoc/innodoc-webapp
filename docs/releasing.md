# Releasing

How to cut a 2.x release from this repo. The tooling is `commit-and-tag-version`, wired to the `release*` scripts in the root `package.json`.

## The version ladder

2.x ships through the standard prerelease ladder, all on the same `2.0.0` base:

`2.0.0-alpha.N` → `2.0.0-beta.N` → `2.0.0-rc.N` → `2.0.0`

What each stage means for a staging cut:

| Stage | Meaning                                                    |
| ----- | ---------------------------------------------------------- |
| alpha | Early staging: anything may change, API included           |
| beta  | Feature-complete: the shape is settled, rough edges remain |
| rc    | Release candidate: bug fixes only                          |
| ga    | The final release: the version resets to exactly `2.0.0`   |

## Commands

The exact entries from the root `package.json` (section `========= Release`):

```json
"release": "commit-and-tag-version",
"release:alpha": "commit-and-tag-version -p alpha",
"release:beta": "commit-and-tag-version -p beta",
"release:rc": "commit-and-tag-version -p rc",
"release:ga": "commit-and-tag-version -r 2.0.0"
```

| Command              | Effect                                          |
| -------------------- | ----------------------------------------------- |
| `pnpm release:alpha` | Bumps to the next `2.0.0-alpha.N`               |
| `pnpm release:beta`  | Bumps to the next `2.0.0-beta.N`                |
| `pnpm release:rc`    | Bumps to the next `2.0.0-rc.N`                  |
| `pnpm release:ga`    | Resets to exactly `2.0.0` (a reset, not a bump) |
| `pnpm release`       | Plain bump, no prerelease suffix                |

## What the tool touches

- The **root** `package.json` only — `packageFiles`/`bumpFiles` stay at the tool default. The 16 workspace packages stay at `0.0.0` on purpose: they are all `private: true`, and nothing in this repo is ever published.
- `CHANGELOG.md`: one section per version, built from the commits since the last tag.
- One commit, `chore(release): <version>`, plus one **annotated** tag `v<version>` on top of it.

## Commit types drive the changelog

The tool keeps its default (angular) type filter:

| Commit type                             | Changelog section                   |
| --------------------------------------- | ----------------------------------- |
| `feat`                                  | Features                            |
| `fix`                                   | Bug Fixes                           |
| `perf`                                  | Performance Improvements            |
| `!` suffix or `BREAKING CHANGE:` footer | BREAKING CHANGES (top of the entry) |

`chore`, `refactor`, `test`, `build`, and `docs` are hidden by design — housekeeping does not belong in release notes. So pick types deliberately: a user-visible fix committed as `chore` disappears from the changelog.

## Tags

Only annotated tags created by the tool count as release tags. Do not hand-create or re-point one: the tool anchors every cut on the last tag it finds, so a foreign tag silently moves the changelog range and the next version.

Tags are local until pushed. Push them together with the branch via `git push --follow-tags`.

## Ranges are tag-bound

`commit-and-tag-version` takes no `--from`, so every cut collects exactly the commits between the last tag and HEAD. Consequence: cut from a clean tip — everything that belongs in the release must already be merged, because the range cannot be chosen afterwards.

## Cadence

Cut from the tip of `dev`, and only while `dev`'s CI is green. The CI pipeline runs on `dev` (push and pull request) and doubles as the release gate.

## The release-cut contract

1. A human runs the stage command on `dev`'s tip. The tool bumps the root version, rewrites `CHANGELOG.md`, commits `chore(release): <version>`, and tags that commit.
2. A human pushes: `git push --follow-tags`. Releases are cut by a human, on purpose — CI never bumps a version and never creates a tag.
3. Publishing the GitHub Release is handled by a separate tag-triggered workflow that does nothing else (no build, no deploy).

## Bootstrap (one-time)

The very first cut, `2.0.0-alpha.0`, carries two hand-done pieces: a hand-written `2.0.0-alpha.0` entry in `CHANGELOG.md` and the first hand-created annotated tag. Neither applies afterwards — from `2.0.0-alpha.1` on, every cut is a plain `pnpm release:alpha` (and the matching stage command for later stages).

## 1.x

The 1.x line is maintained outside this repo's release flow and is not released from this repo — which is why CI runs on `dev` and never fires on `main`.
