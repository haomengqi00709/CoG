# Contributing to CoG Research Intelligence

Thank you for your interest in contributing to CoG! This guide will help you get started with the project and understand how to collaborate using GitHub.

## Table of Contents

- [What is CoG?](#what-is-cog)
- [Repository Setup for Maintainers](#repository-setup-for-maintainers)
- [Getting Started](#getting-started)
- [GitHub Basics](#github-basics)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Submitting Your Work](#submitting-your-work)
- [Code Style & Guidelines](#code-style--guidelines)
- [Getting Help](#getting-help)

---

## What is CoG?

CoG (Community of Goals) Research Intelligence is a web application that:
- Analyzes research papers using AI (Google Gemini)
- Identifies connections to UN Sustainable Development Goals (SDGs)
- Searches PubMed Central (PMC) for open-access papers
- Generates plain-language summaries and actionable challenges
- Exports insights to Excel for further analysis

**Tech Stack:**
- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **AI:** Google Gemini 2.0 Flash
- **Data Sources:** NCBI PMC (PubMed Central)
- **Export:** SheetJS (xlsx)

---

## Repository Setup for Maintainers

If you're setting up this repository for collaboration, here's what you need to configure on GitHub.

### If Repository is Public

If your repository is **Public**, others can already:
- ✅ View code
- ✅ Clone the repository
- ✅ Fork the repository
- ✅ Submit Pull Requests

However, to make collaboration smoother, check these settings:

### 1. Enable Issues

**Why:** Allows others to report bugs and suggest features

**How:**
1. Go to your repository → **Settings**
2. Find **Features** in the left menu
3. Make sure **Issues** is ✅ enabled

### 2. Enable Discussions (Optional)

**Why:** Allows community to ask questions and discuss

**How:**
1. Settings → Features
2. Enable **Discussions**

### 3. Add Repository Description and Topics

**Why:** Helps others discover your project

**How:**
1. On repository homepage, click ⚙️ **Settings**
2. Find **About** section at the top
3. Add description: `AI-powered research paper analyzer for UN SDGs`
4. Add Topics: `nextjs`, `typescript`, `ai`, `research`, `sdg`, `open-source`

### 4. Set Branch Protection (Optional, Recommended)

**Why:** Protects main branch, requires PR reviews

**How:**
1. Settings → Branches
2. Click **Add branch protection rule**
3. Branch name: `main` or `master`
4. Recommended:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (optional, set to 1)
   - ✅ Require status checks (optional)

**Note:** If you're the only contributor, you can skip this for now.

### 5. Add LICENSE File (Recommended)

**Why:** Clearly states how others can use your code

**How:**
1. Repository homepage → **Add file** → **Create new file**
2. Filename: `LICENSE`
3. GitHub will suggest license templates
4. Common choices:
   - **MIT License** - Most permissive
   - **Apache 2.0** - Similar to MIT with patent clause
   - **GPL-3.0** - Requires derivative works to be open source

### 6. Update Clone Link in README

Make sure the clone link in `README.md` points to your actual repository:

```bash
git clone https://github.com/YOUR-USERNAME/CoG.git
```

Replace `YOUR-USERNAME` with your GitHub username.

### 7. Add .github Folder (Optional, but Recommended)

Add templates for PRs and Issues:

**PR Template:**
- Create `.github/pull_request_template.md`

**Issue Templates:**
- Create `.github/ISSUE_TEMPLATE/bug_report.md`
- Create `.github/ISSUE_TEMPLATE/feature_request.md`

### Quick Checklist

Check these on GitHub:

- [ ] Repository is Public
- [ ] Issues are enabled
- [ ] Repository description is added
- [ ] Topics are added
- [ ] Clone link in README is updated
- [ ] LICENSE file is added (recommended)
- [ ] Branch protection is set (optional, recommended for team collaboration)

Once these are done, your project is ready to accept contributions! 🎉

---

## Getting Started

### Prerequisites

Before you begin, make sure you have:
- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)
- A **GitHub account** - [Sign up here](https://github.com/)
- A **Google Gemini API key** (for testing) - [Get one here](https://makersuite.google.com/app/apikey)

### Step 1: Fork the Repository

A **fork** is your own copy of the project on GitHub. You can make changes to your fork without affecting the original project.

1. Go to the project's GitHub page
2. Click the **"Fork"** button in the top-right corner
3. Choose where to fork it (usually your personal account)
4. Wait for the fork to complete

**What is forking?**
- Creates a copy of the repository under your GitHub account
- You have full control over your fork
- You can experiment freely without affecting the original project
- You can propose changes back to the original via Pull Requests

### Step 2: Clone Your Fork

**Cloning** downloads the repository to your computer so you can work on it locally.

1. On your fork's GitHub page, click the green **"Code"** button
2. Copy the HTTPS URL (looks like: `https://github.com/YOUR-USERNAME/CoG.git`)
3. Open your terminal/command prompt
4. Navigate to where you want the project folder
5. Run:
   ```bash
   git clone https://github.com/YOUR-USERNAME/CoG.git
   cd CoG
   ```

**What is cloning?**
- Downloads the entire project to your computer
- Creates a connection to your GitHub fork
- Allows you to work offline and commit changes locally

### Step 3: Set Up the Project

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   Create a file named `.env.local` in the project root:
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```
   Replace `your_api_key_here` with your actual Google Gemini API key.

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

You should now see the CoG application running locally!

---

## GitHub Basics

### Understanding Git vs GitHub

- **Git:** A version control system that tracks changes in your code (runs on your computer)
- **GitHub:** A website that hosts Git repositories and enables collaboration

### Key Concepts

#### Repository (Repo)
A project folder that Git tracks. Contains all your code, history, and configuration.

#### Commit
A snapshot of your code at a specific point in time. Like saving a game, but for code.

```bash
git commit -m "Add feature to search papers by SDG"
```

#### Branch
A parallel version of your code. Allows you to work on features without affecting the main code.

```bash
git branch feature/new-ui
git checkout feature/new-ui
```

#### Pull Request (PR)
A request to merge your changes into the main project. Others can review and discuss your code before it's merged.

#### Remote
A connection to a repository on GitHub (or another server).

- **origin:** Your fork on GitHub
- **upstream:** The original project repository

### Essential Git Commands

```bash
# Check status of your files
git status

# See what changed
git diff

# Stage files for commit
git add filename.js
git add .                    # Stage all changes

# Commit your changes
git commit -m "Description of what you changed"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main

# Create a new branch
git checkout -b feature/my-feature

# Switch branches
git checkout main

# See commit history
git log
```

---

## How to Contribute

There are many ways to contribute:

### 1. Report Bugs
- Found a bug? Open an **Issue** on GitHub
- Describe what happened, what you expected, and steps to reproduce

### 2. Suggest Features
- Have an idea? Open an **Issue** with the "enhancement" label
- Describe the feature and why it would be useful

### 3. Fix Bugs or Add Features
- Pick an issue that interests you
- Create a branch, make changes, and submit a Pull Request

### 4. Improve Documentation
- Fix typos, clarify instructions, add examples
- Documentation improvements are always welcome!

### 5. Review Code
- Review Pull Requests from others
- Provide constructive feedback

---

## Development Workflow

### The Standard Workflow

1. **Stay Updated**
   ```bash
   # Add the original repository as "upstream" (only needed once)
   git remote add upstream https://github.com/ORIGINAL-OWNER/CoG.git
   
   # Fetch latest changes from the original project
   git fetch upstream
   
   # Update your main branch
   git checkout main
   git merge upstream/main
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
   **Naming conventions:**
   - `feature/` - New features
   - `fix/` - Bug fixes
   - `docs/` - Documentation changes
   - `refactor/` - Code improvements

3. **Make Your Changes**
   - Edit files in your code editor
   - Test your changes locally
   - Make sure the app still runs (`npm run dev`)

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Clear description of what you changed"
   ```
   **Good commit messages:**
   - ✅ "Add dark mode toggle to settings"
   - ✅ "Fix PDF upload error for files over 20MB"
   - ❌ "Update stuff"
   - ❌ "Fixed bug"

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to your fork on GitHub
   - Click "Compare & pull request"
   - Fill out the PR template
   - Wait for review and feedback

### Keeping Your Fork Updated

Regularly sync your fork with the original project:

```bash
# Fetch latest changes
git fetch upstream

# Update your main branch
git checkout main
git merge upstream/main

# Update your feature branch
git checkout feature/your-feature-name
git merge main
```

---

## Project Structure

```
CoG/
├── app/                    # Next.js app directory
│   ├── api/               # API routes (backend)
│   │   ├── generate/      # PDF/text analysis endpoint
│   │   ├── search-pmc/    # Search PubMed Central
│   │   └── fetch-pmc/     # Fetch full paper text
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page (frontend)
├── lib/                   # Utility functions
│   ├── prompt.ts          # AI prompt builder
│   └── sdg-queries.ts     # SDG search terms
├── package.json           # Dependencies
├── tsconfig.json         # TypeScript config
└── next.config.js        # Next.js config
```

### Key Files

- **`app/page.tsx`** - Main React component (UI)
- **`app/api/generate/route.ts`** - Handles PDF/text analysis
- **`app/api/search-pmc/route.ts`** - Searches PMC database
- **`app/api/fetch-pmc/route.ts`** - Fetches full paper content
- **`lib/prompt.ts`** - Builds prompts for Gemini AI
- **`lib/sdg-queries.ts`** - SDG keyword mappings

---

## Making Changes

### Before You Start

1. **Check existing issues** - Someone might already be working on it
2. **Comment on an issue** - Say you're working on it
3. **Ask questions** - If something is unclear, ask!

### While Coding

1. **Follow existing patterns** - Match the code style you see
2. **Test your changes** - Make sure everything still works
3. **Keep commits focused** - One feature or fix per commit
4. **Write clear code** - Future you (and others) will thank you

### Testing Your Changes

```bash
# Run the development server
npm run dev

# Check for TypeScript errors
npm run build

# Run linter
npm run lint
```

---

## Submitting Your Work

### Before Submitting

- [ ] Code runs without errors
- [ ] No TypeScript errors (`npm run build`)
- [ ] No linting errors (`npm run lint`)
- [ ] Tested the feature/fix manually
- [ ] Commits have clear messages
- [ ] Branch is up to date with main

### Creating a Pull Request

1. **Push your branch:**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **On GitHub:**
   - Go to your fork
   - You'll see a banner suggesting to create a PR
   - Click "Compare & pull request"

3. **Fill out the PR template:**
   - **Title:** Clear, descriptive title
   - **Description:** What you changed and why
   - **Related Issues:** Link to any related issues (e.g., "Fixes #123")
   - **Screenshots:** If UI changes, include before/after

4. **Submit and wait for review:**
   - Maintainers will review your code
   - They may ask for changes
   - Make requested changes and push updates
   - Once approved, your PR will be merged!

### PR Best Practices

- **Keep PRs focused** - One feature or fix per PR
- **Keep PRs small** - Easier to review
- **Write clear descriptions** - Help reviewers understand your changes
- **Respond to feedback** - Be open to suggestions
- **Update your branch** - Keep it synced with main

---

## Code Style & Guidelines

### TypeScript

- Use TypeScript for all new code
- Define types/interfaces for data structures
- Avoid `any` - use proper types

### React/Next.js

- Use functional components with hooks
- Keep components focused and reusable
- Use `"use client"` only when needed (for interactivity)

### Styling

- Use Tailwind CSS utility classes
- Follow existing color and spacing patterns
- Keep responsive design in mind

### File Naming

- Components: `PascalCase.tsx` (e.g., `SdgBadge.tsx`)
- Utilities: `camelCase.ts` (e.g., `prompt.ts`)
- API routes: `route.ts` in folder (e.g., `api/generate/route.ts`)

### Git Commit Messages

Follow this format:
```
Type: Brief description

Optional longer explanation if needed.
```

Types:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting, no code change
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance tasks

Example:
```
feat: Add dark mode toggle

Adds a settings panel with dark mode option. Persists
preference in localStorage.
```

---

## Getting Help

### Resources

- **Project Documentation:** See [05-LEARNING_GUIDE.md](05-LEARNING_GUIDE.md) for technical details
- **Next.js Docs:** https://nextjs.org/docs
- **React Docs:** https://react.dev
- **TypeScript Docs:** https://www.typescriptlang.org/docs
- **Tailwind CSS Docs:** https://tailwindcss.com/docs

### Asking Questions

- **GitHub Issues:** For bugs and feature requests
- **GitHub Discussions:** For questions and discussions
- **Pull Request Comments:** For questions about specific changes

### Common Issues

**"npm install" fails:**
- Make sure you have Node.js 18+ installed
- Try deleting `node_modules` and `package-lock.json`, then run `npm install` again

**"GEMINI_API_KEY is missing":**
- Create `.env.local` file in the project root
- Add your API key: `GEMINI_API_KEY=your_key_here`

**Git push fails:**
- Make sure you've committed your changes (`git commit`)
- Check that you're pushing to the correct remote (`git remote -v`)

**Merge conflicts:**
- Update your branch: `git fetch upstream && git merge upstream/main`
- Resolve conflicts in your editor
- Commit the resolution: `git add . && git commit`

---

## Quick Reference: Common Workflows

### Starting Fresh Work

```bash
# Update your fork
git checkout main
git fetch upstream
git merge upstream/main

# Create new branch
git checkout -b feature/my-new-feature

# Make changes, then commit
git add .
git commit -m "feat: Add my new feature"
git push origin feature/my-new-feature
```

### Updating Existing Work

```bash
# Update from main
git checkout main
git fetch upstream
git merge upstream/main

# Update your feature branch
git checkout feature/my-feature
git merge main

# Continue working or push updates
git push origin feature/my-feature
```

### Fixing a Bug

```bash
git checkout -b fix/bug-description
# Make fixes
git add .
git commit -m "fix: Description of the bug fix"
git push origin fix/bug-description
```

---

## Thank You! 🎉

Contributing to open source is a great way to learn, help others, and build your portfolio. Every contribution, no matter how small, is valuable!

**Questions?** Don't hesitate to ask. We're here to help!

Happy coding! 🚀

