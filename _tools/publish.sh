#!/bin/bash
# Promote a draft from _drafts/ to _posts/ with today's date (or a given one).
# Adds `date:` frontmatter and renames the file with a YYYY-MM-DD prefix.
# Usage: ./_tools/publish.sh slug [YYYY-MM-DD]

set -e

slug="$1"
date="${2:-$(date +%Y-%m-%d)}"

if [ -z "$slug" ]; then
  echo "Usage: $0 slug [YYYY-MM-DD]"
  exit 1
fi

# Validate date format
if ! echo "$date" | grep -qE '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'; then
  echo "Invalid date format. Use YYYY-MM-DD"
  exit 1
fi

src="_drafts/${slug}.md"
dest="_posts/${date}-${slug}.md"
timestamp="${date}T12:00:00$(date +%:z)"

if [ ! -f "$src" ]; then
  echo "Draft not found: $src"
  exit 1
fi

if [ -f "$dest" ]; then
  echo "Destination already exists: $dest"
  exit 1
fi

# Insert `date:` line into the frontmatter if not present. Look for the
# opening `---`, then insert after the `title:` line (or before the closing
# `---` if no title). Using awk to keep this portable.
awk -v ts="$timestamp" '
  BEGIN { in_fm = 0; fm_count = 0; date_printed = 0 }
  /^---$/ {
    fm_count++
    if (fm_count == 1) in_fm = 1
    else if (fm_count == 2) {
      if (!date_printed) print "date: " ts
      in_fm = 0
    }
    print
    next
  }
  in_fm && /^date:/ {
    print "date: " ts
    date_printed = 1
    next
  }
  { print }
' "$src" > "$src.tmp" && mv "$src.tmp" "$src"

git mv "$src" "$dest" 2>/dev/null || mv "$src" "$dest"

echo "Published: $dest"
echo "Dated:     $timestamp"
