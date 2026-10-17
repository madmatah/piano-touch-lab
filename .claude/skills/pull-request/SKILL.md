---
name: pull-request
description: Takes a piece of work in Piano Touch Lab from a new branch to a merged pull request, and reviews someone else's pull request. Use when starting a piece of work or a branch, stacking a branch on an unmerged one, preparing the commits of a branch before pushing it, opening or updating a pull request, folding review fixes, or moving a branch after its base changed or was merged.
---

# Pull request

`CLAUDE.md` > Workflow holds the rules this procedure applies. Below, `<base>` is `origin/main`, or the unmerged branch the work is stacked on.

## Start a branch

1. Run `git fetch origin`, then `git worktree add --no-track -b <kind>/<topic> "$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")/.claude/worktrees/<name>" origin/main`, with a kind from `CLAUDE.md` > Workflow, "Each piece of work has its own short-lived branch". The path starts from the main checkout, so that a worktree added from another one never nests inside it.
2. A worktree started with `claude --worktree <name>` instead has a branch named `worktree-<name>`: rename it with `git branch -m <kind>/<topic>`.
3. Install the dependencies of a worktree you add during a session, as `CLAUDE.md` > Workflow, "Dependencies" says.

## Stack on an unmerged branch

- **A branch may start from another unmerged branch whose work it needs:** give that branch instead of `origin/main` to `git worktree add`. Until it is merged, it is `<base>`: review with `/expert-review <branch>...HEAD`, autosquash onto it, and open the pull request against it, naming it in the Proposal.
- **Whenever the base is rewritten,** by its review fixes or by its merge, move only your own commits: `git rebase --onto <new base> $(git merge-base --fork-point <branch> HEAD)`. The new base is the branch itself, or `origin/main` once it is merged; the old copies of its commits would conflict with the new ones. Once the base is merged, retarget the pull request to `main`.
- **The owner of a base keeps it until the branches built on it have moved.** Each of those branches is moved by its own owner.

## Shape the history

1. Before pushing, rewrite the branch into atomic commits, as `CLAUDE.md` > Workflow, "Commits" and "A commit message says why" ask. Interactive editors are unavailable: fold a change into its commit with `git commit --fixup=<commit>`, then `GIT_SEQUENCE_EDITOR=: git rebase -i --autosquash <base>`.
2. Check that every commit passes: `git rebase --exec 'bun checks' <base>`. A commit that changes `bun.lock` needs `bun install --frozen-lockfile` before its check: add it to the command for such a branch.

## Review

1. Run `/expert-review` on the branch, or `/expert-review <base>...HEAD` when it is stacked.
2. Settle each finding as `CLAUDE.md` > Workflow, "Review before pushing" says, folding each fix into its commit as [Fold review fixes](#fold-review-fixes) shows.
3. If the review returns while experts are still running, its message says how to finish it when their reports arrive.

## Push and open the pull request

1. Push the branch: `git push -u origin HEAD` the first time.
2. Write the body from `.github/pull_request_template.md`, which `gh pr create --body-file` does not apply: fill each section in place of its comment, and tick a checklist item only once it holds.
3. Open the pull request against `main`, or against the base it is stacked on: `gh pr create --base <branch> --title "<title>" --body-file <file>`. The title is an English sentence that names the change, without a gitmoji. Without a terminal, `gh` needs both the title and the body.
4. Make sure CI (`bun checks` on GitHub Actions) passes on it: `gh pr checks <number> --watch`. A pull request against `main` also deploys a preview of the demo, whose address the deploy posts on the commit.

## Fold review fixes

1. Commit each fix with `git commit --fixup=<commit>`, naming the commit it belongs to.
2. Run `GIT_SEQUENCE_EDITOR=: git rebase -i --autosquash <base>`. Git before 2.44 ignores `--autosquash` without `-i`, and the `-i` form works with every version.
3. Push with `git push --force-with-lease`, then keep the body true: update every section the fixes changed.

## Merge

- **The user merges the pull request,** as `CLAUDE.md` > Workflow, "A branch reaches `main` only through a pull request whose CI passes" says.
- **After the merge,** keep the branch until the branches stacked on it have moved, as [Stack on an unmerged branch](#stack-on-an-unmerged-branch) says.

## Review someone else's pull request

From the main checkout, run `/expert-review <number>`. The skill checks the pull request out in a temporary directory outside the repository, so it never touches a session's worktree.
