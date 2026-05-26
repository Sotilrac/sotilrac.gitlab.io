#!/bin/bash
# Create a new draft post in _drafts/ with frontmatter and its media folder.
# Drafts are dateless; the date is added when you publish with ./_tools/publish.sh
# Usage: ./_tools/new-post.sh "Post Title"

set -e

title="$1"

if [ -z "$title" ]; then
  echo "Usage: $0 \"Post Title\""
  exit 1
fi

# Derive slug: lowercase, spaces to hyphens, strip non-alphanumeric, collapse hyphens
slug=$(echo "$title" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g; s/[^a-z0-9-]//g; s/-\+/-/g; s/^-//; s/-$//')

file="_drafts/${slug}.md"
media="img/blog/${slug}"

if [ -f "$file" ]; then
  echo "File already exists: $file"
  exit 1
fi

cat > "$file" << EOF
---
layout: layouts/post.njk
author: Carlos
title: ${title}
categories:
  -
tags:
  -
---
EOF

mkdir -p "$media"

echo "Created: $file"
echo "Media:   $media/"
echo "Publish with: ./_tools/publish.sh ${slug}"
