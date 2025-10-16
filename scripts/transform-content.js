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
 * Main execution
 */
console.log('🔄 Transforming content files...');

// Process each collection
processCollection(path.join(CONTENT_DIR, 'blog'), 'blog');
processCollection(path.join(CONTENT_DIR, 'journeys'), 'journeys');
processCollection(path.join(CONTENT_DIR, 'learn'), 'learn');
processCollection(path.join(CONTENT_DIR, 'projects'), 'projects');

console.log('\n✅ Content transformation complete!\n');
