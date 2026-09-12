#!/bin/bash
# Change the date of a blog post (renames file and updates frontmatter)
# Usage: ./_tools/redate-post.sh <post-file> <YYYY-MM-DD>

set -e

file="$1"
new_date="$2"

if [ -z "$file" ] || [ -z "$new_date" ]; then
  echo "Usage: $0 <post-file> <YYYY-MM-DD>"
  exit 1
fi

if [ ! -f "$file" ]; then
  echo "File not found: $file"
  exit 1
fi

if ! echo "$new_date" | grep -qE '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'; then
  echo "Invalid date format. Use YYYY-MM-DD"
  exit 1
fi

dir=$(dirname "$file")
base=$(basename "$file")

# Extract slug (strip date prefix)
slug=$(echo "$base" | sed 's/^[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}-//')
new_file="${dir}/${new_date}-${slug}"
new_timestamp="${new_date}T12:00:00$(date +%:z)"

if [ "$file" != "$new_file" ] && [ -e "$new_file" ]; then
  echo "Destination already exists: $new_file"
  exit 1
fi

# Rewrite `date:` inside the frontmatter only, so a body line starting with
# `date:` is left alone.
awk -v ts="$new_timestamp" '
  BEGIN { in_fm = 0; fm_count = 0 }
  /^---$/ {
    fm_count++
    if (fm_count == 1) in_fm = 1
    else if (fm_count == 2) in_fm = 0
    print
    next
  }
  in_fm && /^date:/ {
    print "date: " ts
    next
  }
  { print }
' "$file" > "$file.tmp" && mv "$file.tmp" "$file"

# Rename file if date changed
if [ "$file" != "$new_file" ]; then
  mv "$file" "$new_file"
  echo "Renamed: $base -> $(basename "$new_file")"
else
  echo "Date updated in frontmatter (filename unchanged)"
fi

echo "New date: $new_timestamp"
