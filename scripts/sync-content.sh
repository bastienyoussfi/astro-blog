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
echo "📁 Copying files to unified posts directory..."

# Create posts directory and temporary type-specific subdirectories
rm -rf $TARGET_DIR/posts
mkdir -p $TARGET_DIR/posts/blog
mkdir -p $TARGET_DIR/posts/learn
mkdir -p $TARGET_DIR/posts/projects

# Copy content to type-specific subdirectories (temporary structure for transform script)
cp -r $CONTENT_SOURCE/Blog/. $TARGET_DIR/posts/blog/
cp -r $CONTENT_SOURCE/Learn/. $TARGET_DIR/posts/learn/
cp -r $CONTENT_SOURCE/Projects/. $TARGET_DIR/posts/projects/

# Copy journeys (still separate collection)
rm -rf $TARGET_DIR/journeys
mkdir -p $TARGET_DIR/journeys
cp -r $CONTENT_SOURCE/Journeys/. $TARGET_DIR/journeys/

echo ""
echo "🔧 Transforming content files..."
node ./scripts/transform-content.js

echo ""
echo "✅ Content synced and transformed successfully!"