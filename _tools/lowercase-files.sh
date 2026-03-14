#!/bin/bash
# Lowercase all filenames in a given directory (non-recursive)
# Usage: ./_tools/lowercase-files.sh <folder>

dir="${1:-.}"

if [ ! -d "$dir" ]; then
  echo "Not a directory: $dir"
  exit 1
fi

for f in "$dir"/*; do
  [ -f "$f" ] || continue
  base=$(basename "$f")
  lower=$(echo "$base" | tr '[:upper:]' '[:lower:]')
  if [ "$base" != "$lower" ]; then
    mv "$f" "$dir/$lower"
    echo "$base -> $lower"
  fi
done
