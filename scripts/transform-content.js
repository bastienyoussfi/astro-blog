#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../src/content');

/**
 * Generate URL-friendly slug from filename
 * "Dockerized Node.js App.md" -> "dockerized-nodejs-app"
 */
function generateSlug(filename) {
  return filename
    .replace(/\.mdx?$/, '') // Remove .md or .mdx extension
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

/**
 * Add type field to frontmatter and normalize time fields
 */
function addTypeToFrontmatter(content, type) {
  // Match YAML frontmatter between --- markers
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    // No frontmatter, add it
    return `---\ntype: "${type}"\n---\n\n${content}`;
  }

  let frontmatter = match[1];

  // Check if type already exists
  if (!frontmatter.includes('type:')) {
    // Add type field after the first line (usually title)
    const lines = frontmatter.split('\n');
    lines.splice(1, 0, `type: "${type}"`);
    frontmatter = lines.join('\n');
  }

  // Normalize time fields based on type
  if (type === 'blog') {
    frontmatter = frontmatter.replace(/readingTime:/g, 'timeEstimate:');
  } else if (type === 'learn') {
    frontmatter = frontmatter.replace(/estimatedTime:/g, 'timeEstimate:');
  } else if (type === 'project') {
    frontmatter = frontmatter.replace(/duration:/g, 'timeEstimate:');
  }

  // Replace the frontmatter in the content
  return content.replace(frontmatterRegex, `---\n${frontmatter}\n---`);
}

/**
 * Process a single content collection directory
 */
function processCollection(collectionPath, collectionName) {
  if (!fs.existsSync(collectionPath)) {
    console.log(`⏭️  Skipping ${collectionName} (directory doesn't exist)`);
    return;
  }

  console.log(`\n📂 Processing ${collectionName}...`);

  const filesToProcess = [];

  // Recursively find all markdown files
  function findMarkdownFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        findMarkdownFiles(fullPath);
      } else if (entry.name.match(/\.mdx?$/)) {
        filesToProcess.push(fullPath);
      }
    }
  }

  findMarkdownFiles(collectionPath);

  console.log(`   Found ${filesToProcess.length} files`);

  // Process each file
  for (const filePath of filesToProcess) {
    const filename = path.basename(filePath);
    const slug = generateSlug(filename);
    const newFilename = `${slug}.md`;
    const newPath = path.join(collectionPath, newFilename);

    // Skip if already in correct format
    if (filePath === newPath) {
      console.log(`   ✓ ${filename} (already correct)`);
      continue;
    }

    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');

    // Write to new location with .md extension
    fs.writeFileSync(newPath, content, 'utf8');
    console.log(`   ✓ ${filename} -> ${newFilename}`);

    // Remove old file if different
    if (filePath !== newPath) {
      fs.unlinkSync(filePath);
    }
  }

  // Clean up empty subdirectories
  function removeEmptyDirs(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const fullPath = path.join(dir, entry.name);
        removeEmptyDirs(fullPath);

        // After processing subdirectory, check if it's now empty
        try {
          const remaining = fs.readdirSync(fullPath);
          if (remaining.length === 0) {
            fs.rmdirSync(fullPath);
            console.log(`   🗑️  Removed empty directory: ${entry.name}/`);
          }
        } catch (err) {
          // Directory already removed or doesn't exist
        }
      }
    }
  }

  removeEmptyDirs(collectionPath);
}

/**
 * Process unified posts collection with type subdirectories
 */
function processUnifiedPosts() {
  const postsDir = path.join(CONTENT_DIR, 'posts');

  if (!fs.existsSync(postsDir)) {
    console.log('⏭️  Skipping posts (directory doesn\'t exist)');
    return;
  }

  console.log('\n📂 Processing unified posts collection...');

  const types = ['blog', 'learn', 'projects'];

  for (const type of types) {
    const typeNormalized = type === 'projects' ? 'project' : type; // Normalize plural to singular
    const typePath = path.join(postsDir, type);

    if (!fs.existsSync(typePath)) {
      console.log(`   ⏭️  No ${type} content found`);
      continue;
    }

    const filesToProcess = [];

    // Find all markdown files in this type directory
    function findMarkdownFiles(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          findMarkdownFiles(fullPath);
        } else if (entry.name.match(/\.mdx?$/)) {
          filesToProcess.push(fullPath);
        }
      }
    }

    findMarkdownFiles(typePath);

    console.log(`   Found ${filesToProcess.length} ${type} files`);

    // Process each file
    for (const filePath of filesToProcess) {
      const filename = path.basename(filePath);
      const slug = generateSlug(filename);
      const newFilename = `${slug}.md`;

      // Read file content
      let content = fs.readFileSync(filePath, 'utf8');

      // Add type field and normalize time fields (use normalized type)
      content = addTypeToFrontmatter(content, typeNormalized);

      // Write to posts root directory
      const newPath = path.join(postsDir, newFilename);
      fs.writeFileSync(newPath, content, 'utf8');
      console.log(`   ✓ ${type}/${filename} -> ${newFilename}`);
    }

    // Remove the type subdirectory after processing
    fs.rmSync(typePath, { recursive: true, force: true });
    console.log(`   🗑️  Removed ${type}/ subdirectory`);
  }
}

/**
 * Main execution
 */
console.log('🔄 Transforming content files...');

// Process unified posts collection
processUnifiedPosts();

// Process journeys collection (still separate)
processCollection(path.join(CONTENT_DIR, 'journeys'), 'journeys');

console.log('\n✅ Content transformation complete!\n');
