#!/bin/bash
# Create a new blog post with frontmatter and its media folder
# Usage: ./_tools/new-post.sh "Post Title" [YYYY-MM-DD]

set -e

title="$1"
date="${2:-$(date +%Y-%m-%d)}"

if [ -z "$title" ]; then
  echo "Usage: $0 \"Post Title\" [YYYY-MM-DD]"
  exit 1
fi

# Validate date format
if ! echo "$date" | grep -qE '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'; then
  echo "Invalid date format. Use YYYY-MM-DD"
  exit 1
fi

# Derive slug: lowercase, spaces to hyphens, strip non-alphanumeric, collapse hyphens
slug=$(echo "$title" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g; s/[^a-z0-9-]//g; s/-\+/-/g; s/^-//; s/-$//')

file="_posts/${date}-${slug}.md"
media="img/blog/${slug}"
timestamp="${date}T12:00:00$(date +%:z)"

if [ -f "$file" ]; then
  echo "File already exists: $file"
  exit 1
fi

cat > "$file" << EOF
---
layout: layouts/post.njk
status: draft
author: Carlos
title: ${title}
date: ${timestamp}
categories:
  -
tags:
  -
---
EOF

mkdir -p "$media"

echo "Created: $file"
echo "Media:   $media/"
