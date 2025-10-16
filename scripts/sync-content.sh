#!/bin/bash

CONTENT_REPO="https://github.com/bastienyoussfi/blog-content.git"
TEMP_DIR="./temp-content"
CONTENT_SOURCE="$TEMP_DIR/bastienyoussfi.dev"
TARGET_DIR="./src/content"

echo "🔄 Syncing content from Obsidian..."

# Clone or pull latest content
if [ -d "$TEMP_DIR" ]; then
  cd $TEMP_DIR && git pull
  cd ..
else
  git clone $CONTENT_REPO $TEMP_DIR
fi

# Copy content to Astro content directory
echo "📁 Copying files..."

# Copy blog posts
rsync -av --delete $CONTENT_SOURCE/Blog/ $TARGET_DIR/blog/

# Copy journeys
rsync -av --delete $CONTENT_SOURCE/Journeys/ $TARGET_DIR/journeys/

# Copy learn content
rsync -av --delete $CONTENT_SOURCE/Learn/ $TARGET_DIR/learn/

# Copy projects
rsync -av --delete $CONTENT_SOURCE/Projects/ $TARGET_DIR/projects/

echo ""
echo "🔧 Transforming content files..."
node ./scripts/transform-content.js

echo ""
echo "✅ Content synced and transformed successfully!"