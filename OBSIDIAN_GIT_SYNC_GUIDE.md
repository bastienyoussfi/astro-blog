# Obsidian Git Sync Setup Guide

This guide will help you set up automatic content synchronization from your Obsidian vault to your Astro blog using Git, enabling you to write content in Obsidian and have it automatically published to your blog.

## Overview

**Workflow:**
1. Write/edit content in Obsidian
2. Obsidian Git plugin auto-commits changes
3. GitHub receives the changes
4. Hosting platform (Vercel/Netlify) detects changes and rebuilds
5. Your blog is updated automatically (2-5 minutes)

## Prerequisites

- [ ] Obsidian installed with an existing vault
- [ ] GitHub account
- [ ] Your Astro blog deployed to Vercel/Netlify/similar
- [ ] Basic familiarity with Git (the plugin handles most of it)

---

## Part 1: Obsidian Vault Structure Setup

### Step 1: Organize Your Obsidian Vault

Create a folder structure in your Obsidian vault that mirrors your blog's content collections:

```
Your Obsidian Vault/
├── Blog/              # Regular blog posts
├── Journeys/          # Journey metadata files
├── Learn/             # Learning content
│   ├── DevOps/
│   └── ML/
└── Projects/          # Project showcases
    ├── DevOps/
    └── ML/
```

**Tips:**
- Use subfolders to organize by journey/topic
- Keep the same naming conventions as your current content
- You can have other folders for personal notes - they won't be synced to the blog

### Step 2: Understand Content Frontmatter Requirements

Each markdown file must have proper frontmatter to work with your blog. Here are templates:

#### Blog Post Template
```markdown
---
title: "Your Post Title"
date: 2025-10-16
description: "A brief description of your post"
---

Your content here...
```

#### Learn Post Template
```markdown
---
title: "Learning Topic Title"
date: 2025-10-16
description: "What you'll learn in this post"
journey: devops  # or 'ml'
category: "Linux Fundamentals"
difficulty: beginner  # beginner, intermediate, or advanced
estimatedTime: "15 min"
tags: ["linux", "terminal", "bash"]
keyTakeaways:
  - "First key takeaway"
  - "Second key takeaway"
prerequisites:
  - "Basic command line knowledge"
resources:
  - title: "Official Documentation"
    url: "https://example.com"
    type: docs  # docs, video, course, article, or tool
---

Your content here...
```

#### Journey Metadata Template
```markdown
---
title: "DevOps Journey"
description: "Master modern DevOps practices and tools"
color: "#00D4AA"
startDate: 2025-01-15
status: active  # planning, active, paused, or completed
goals:
  - "Master Linux fundamentals"
  - "Learn Docker and Kubernetes"
  - "Build CI/CD pipelines"
tags: ["devops", "infrastructure", "automation"]
totalTopics: 50
completedTopics: 5
estimatedDuration: "6 months"
---

Optional journey description/overview content...
```

#### Project Template
```markdown
---
title: "Project Name"
date: 2025-10-16
description: "Brief project description"
journey: devops  # or 'ml'
category: "Infrastructure"
techStack: ["Docker", "Kubernetes", "Terraform"]
status: in-progress  # planning, in-progress, completed, or archived
difficulty: intermediate
githubUrl: "https://github.com/username/repo"
keyLearnings:
  - "What you learned from this project"
tags: ["docker", "k8s"]
---

Your project details...
```

---

## Part 2: GitHub Repository Setup

### Option A: Separate Content Repository (Recommended)

This keeps your content separate from your blog code.

#### Step 1: Create New GitHub Repo

```bash
# On GitHub, create a new repository called "blog-content"
# Then clone it locally (not in your Obsidian vault yet)
git clone https://github.com/YOUR_USERNAME/blog-content.git
```

#### Step 2: Initialize in Obsidian

Move the `.git` folder from the cloned repo into your Obsidian vault's content folders, or initialize Git directly in your vault:

```bash
cd /path/to/your/obsidian/vault
git init
git remote add origin https://github.com/YOUR_USERNAME/blog-content.git
```

#### Step 3: Create .gitignore

Create a `.gitignore` file in your vault root to exclude Obsidian-specific files:

```gitignore
# Obsidian files
.obsidian/
.trash/

# OS files
.DS_Store
Thumbs.db

# Personal notes (optional - exclude folders you don't want published)
Personal/
Private/
Drafts/

# Obsidian plugins cache
.obsidian/workspace
.obsidian/workspace.json
```
---

## Part 3: Obsidian Git Plugin Installation

### Step 1: Install the Plugin

1. Open Obsidian
2. Go to **Settings** → **Community Plugins**
3. Click **Browse** and search for "Obsidian Git"
4. Click **Install**, then **Enable**

### Step 2: Configure the Plugin

Navigate to **Settings** → **Obsidian Git**:

#### Basic Settings:
- **Vault backup interval (minutes)**: `5` (auto-commits every 5 minutes)
- **Commit message**: `vault backup: {{date}}`
- **Auto pull interval (minutes)**: `5` (checks for remote changes)
- **Auto-push**: Enable (automatically pushes commits)
- **Pull updates on startup**: Enable

#### Advanced Settings:
- **Disable notifications**: Optional (reduce noise)
- **Show status bar**: Enable (shows sync status)
- **Sync method**: `merge` (default)

### Step 3: Authenticate with GitHub

#### Using Personal Access Token (Recommended):

1. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Generate new token with `repo` permissions
3. Copy the token
4. When Obsidian Git prompts for credentials:
   - **Username**: Your GitHub username
   - **Password**: Your personal access token

#### Alternative: SSH Keys

If you prefer SSH:

1. Generate SSH key: `ssh-keygen -t ed25519 -C "your_email@example.com"`
2. Add to GitHub: **Settings** → **SSH and GPG keys**
3. Use SSH remote URL: `git@github.com:username/blog-content.git`

### Step 4: Initial Commit

1. Open Command Palette in Obsidian: `Cmd/Ctrl + P`
2. Type "Obsidian Git: Commit all changes"
3. Type "Obsidian Git: Push"
4. Verify files appear in your GitHub repository

---

## Part 4: Astro Blog Integration

Now configure your Astro blog to use content from the external repository.

### Option 1: Git Submodule (If using separate repo)

Add your content repo as a submodule:

```bash
cd /path/to/astro-blog
git submodule add https://github.com/YOUR_USERNAME/blog-content.git content-source
```

### Option 2: Build-Time Sync Script

Create a script that pulls content during build.

#### Create sync script:

```bash
# scripts/sync-content.sh
#!/bin/bash

CONTENT_REPO="https://github.com/YOUR_USERNAME/blog-content.git"
TEMP_DIR="./temp-content"
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
rsync -av --delete $TEMP_DIR/Blog/ $TARGET_DIR/blog/

# Copy journeys
rsync -av --delete $TEMP_DIR/Journeys/ $TARGET_DIR/journeys/

# Copy learn content
rsync -av --delete $TEMP_DIR/Learn/ $TARGET_DIR/learn/

# Copy projects
rsync -av --delete $TEMP_DIR/Projects/ $TARGET_DIR/projects/

echo "✅ Content synced successfully!"
```

Make it executable:

```bash
chmod +x scripts/sync-content.sh
```

#### Update package.json:

```json
{
  "scripts": {
    "sync": "./scripts/sync-content.sh",
    "prebuild": "npm run sync",
    "dev": "npm run sync && astro dev",
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

Now content syncs automatically before every build!

---

## Part 5: Deployment Configuration

### Vercel Setup

1. Go to your project in Vercel dashboard
2. **Settings** → **Git**
3. Ensure "Auto-deploy" is enabled
4. **Settings** → **Environment Variables**:
   - Add `GITHUB_TOKEN` if using API approach

**Build settings:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

The `prebuild` script will automatically sync content before each build.

---

## Part 6: Content Repository Webhook (Optional)

To trigger immediate builds when you push from Obsidian:

### Vercel Deploy Hook

1. Go to Vercel → **Settings** → **Git** → **Deploy Hooks**
2. Create hook named "Content Update"
3. Copy the webhook URL

### GitHub Repository Webhook

1. Go to your `blog-content` repo → **Settings** → **Webhooks**
2. **Add webhook**:
   - Payload URL: Your Vercel deploy hook URL
   - Content type: `application/json`
   - Events: Just the `push` event
3. Save

Now every Obsidian auto-commit triggers a blog rebuild!

---

## Part 7: Testing the Workflow

### Test Checklist:

1. **Create a test post in Obsidian**:
   ```markdown
   ---
   title: "Test Post from Obsidian"
   date: 2025-10-16
   description: "Testing the sync workflow"
   ---

   This is a test post written in Obsidian!
   ```

2. **Wait for auto-commit** (or manually trigger):
   - Cmd/Ctrl + P → "Obsidian Git: Commit all changes"
   - Cmd/Ctrl + P → "Obsidian Git: Push"

3. **Check GitHub**: Verify the file appears in your content repo

4. **Check hosting platform**:
   - Vercel/Netlify should show a new deployment starting
   - Wait 2-5 minutes for build to complete

5. **Verify on live site**: Visit your blog and confirm the post appears
---

## Part 8: Tips & Best Practices

### Writing in Obsidian

1. **Use templates**: Create Obsidian templates for each content type
   - Settings → Core Plugins → Templates
   - Create template files with frontmatter pre-filled

2. **Preview before publish**:
   - Keep posts in a `Drafts/` folder (add to .gitignore)
   - Move to proper folder when ready to publish

3. **Use Obsidian's frontmatter editor**:
   - Settings → Core Plugins → Properties
   - Edit frontmatter visually

4. **Leverage Obsidian features**:
   - Internal links: `[[Other Post]]` (may need processing)
   - Tags: Use both YAML tags and `#tags`
   - Images: Store in `assets/` folder and reference

### Content Workflow

1. **Draft → Review → Publish**:
   ```
   Drafts/          # Gitignored, not published
   ├── idea.md

   Blog/            # Auto-published
   └── published-post.md
   ```

2. **Set `draft: true` in frontmatter**:
   ```yaml
   ---
   title: "Work in Progress"
   draft: true
   ---
   ```

   Then filter in Astro:
   ```typescript
   const posts = await getCollection('blog', ({ data }) => !data.draft);
   ```

3. **Use git branches** for major content updates:
   - Create feature branch in Obsidian Git
   - Review on preview deployment
   - Merge to main when ready

### Performance Optimization

1. **Scheduled builds**: If you don't need instant publishing
   - Disable webhook
   - Use scheduled GitHub Action (e.g., daily at 6 AM)
   ```yaml
   on:
     schedule:
       - cron: '0 6 * * *'  # Daily at 6 AM UTC
   ```

2. **Incremental builds** (Vercel/Netlify):
   - Only rebuilds changed pages
   - Automatically enabled on most platforms

### Backup Strategy

Your content now lives in 3 places:
1. **Local Obsidian vault** (iCloud synced)
2. **GitHub repository** (version controlled)
3. **Deployed blog** (static files)

This is redundant backup by design!

---

## Part 9: Advanced Enhancements

### Content Transformation

Some Obsidian syntax might need transformation:

#### Create a content processor:

```javascript
// scripts/process-obsidian-content.js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

function processObsidianLinks(content) {
  // Convert [[Wiki Links]] to [Wiki Links](wiki-links)
  return content.replace(/\[\[([^\]]+)\]\]/g, (match, p1) => {
    const slug = p1.toLowerCase().replace(/\s+/g, '-');
    return `[${p1}](/${slug})`;
  });
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const { data, content: markdown } = matter(content);

  const processed = processObsidianLinks(markdown);

  const output = matter.stringify(processed, data);
  fs.writeFileSync(filePath, output);
}

// Run on all markdown files after sync
```

Add to sync script:

```bash
# At end of sync-content.sh
node scripts/process-obsidian-content.js
```

### Image Handling

If you use images in Obsidian:

1. **Store images in Obsidian**:
   ```
   Blog/
   ├── my-post.md
   └── attachments/
       └── image.png
   ```

2. **Update sync script to copy images**:
   ```bash
   # Copy images to Astro public folder
   rsync -av --delete $TEMP_DIR/Blog/attachments/ $TARGET_DIR/../public/blog-images/
   ```

3. **Update image paths in markdown**:
   ```markdown
   ![Alt text](/blog-images/image.png)
   ```

### Mobile Editing

Use Obsidian mobile app:
- iOS/Android Obsidian Git works!
- Sync using iCloud or Obsidian Sync
- Git commits happen on mobile too
- Blog updates from anywhere

---

## Summary

You now have a powerful workflow:

✅ Write in Obsidian with full Obsidian features
✅ Auto-sync via Git every 5 minutes
✅ Auto-deploy to your blog
✅ Version controlled content
✅ Three-way backup (local, GitHub, deployed)
✅ Edit from desktop or mobile

**Typical workflow:**
1. Open Obsidian
2. Write/edit content
3. Save file
4. Wait ~5 minutes for auto-commit
5. Wait ~2-5 minutes for auto-deploy
6. Content live on blog!

Total time from save to publish: **7-10 minutes** (fully automatic)

---

## Next Steps

- [ ] Set up Obsidian vault folder structure
- [ ] Install and configure Obsidian Git plugin
- [ ] Create GitHub content repository
- [ ] Add sync script to your Astro blog
- [ ] Test with a sample post
- [ ] Configure deploy webhook for instant updates
- [ ] Create Obsidian templates for content types
- [ ] Set up draft workflow

Happy writing! 🚀
