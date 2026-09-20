#!/usr/bin/env bash
# Refuse to commit a file larger than LIMIT_MB (default 10).
#
# Git keeps every blob forever, so deleting an oversized file in a later commit
# does not shrink the repo, and GitLab rejects any single push over 100 MiB.
# This repo learned that the hard way: a 195 MB phone video rode in on an
# unrelated `git add` and blocked a release until the history was rewritten.
#
#   _tools/check-file-size.sh              # checks the staged tree
#   LIMIT_MB=25 _tools/check-file-size.sh  # for a one-off larger limit
set -euo pipefail

limit_mb=${LIMIT_MB:-10}
limit=$((limit_mb * 1024 * 1024))
offenders=""

# Sizes come from the index, not the working tree, because the index is what the
# commit will actually contain. Deletions and pure renames add no blob, so ACM.
while IFS= read -r path; do
  [ -n "$path" ] || continue
  size=$(git cat-file -s ":$path" 2>/dev/null) || continue
  if [ "$size" -gt "$limit" ]; then
    offenders+=$(awk -v b="$size" -v p="$path" 'BEGIN{printf "  %8.1f MB  %s\n", b/1048576, p}')
    offenders+=$'\n'
  fi
done < <(git diff --cached --name-only --diff-filter=ACM -z | tr '\0' '\n')

[ -n "$offenders" ] || exit 0

{
  printf '\nRefusing to commit, over the %s MB limit:\n\n%s\n' "$limit_mb" "$offenders"
  cat <<'EOF'
A big blob is permanent: removing the file later leaves it in history, and it
counts against GitLab's 100 MiB push limit every time anyone clones. Instead:

  - ignore it. Camera originals already match VID*, DSC*, *.MP4, *.MOV, *.mkv
  - ship a web-sized version. _tools/make-clip.sh turns any video into an
    MP4, a WebM and a poster, all of which belong in the repo
  - override, if it truly belongs here:  git commit --no-verify
EOF
} >&2
exit 1
