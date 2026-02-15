# CoG Research Intelligence

A web application that analyzes research papers using AI to identify connections to UN Sustainable Development Goals (SDGs), generate plain-language summaries, and create actionable challenges.

**Repository:** [https://github.com/haomengqi00709/CoG](https://github.com/haomengqi00709/CoG)

## Quick Start

```bash
git clone https://github.com/haomengqi00709/CoG.git
cd CoG
npm install
# Create .env.local with GEMINI_API_KEY=your_key
npm run dev
```

## Documentation

All documentation is numbered for easy navigation:

1. **[01 - README](01-README.md)** - Complete project overview and quick start guide
2. **[02 - Code Structure](02-CODE_STRUCTURE.md)** - **Start here!** Complete overview of project architecture and file structure
3. **[03 - Deployment Guide](03-DEPLOYMENT.md)** - Deploy to your own website - What you need and how to deploy
4. **[04 - Contributing Guide](04-CONTRIBUTING.md)** - How to participate in the project (includes GitHub setup)
5. **[05 - Learning Guide](05-LEARNING_GUIDE.md)** - Technical deep-dive into all technologies used
6. **[06 - Project Plan](06-CoG_Plan_Re.md)** - Original project specification

## Features

- 📄 **PDF Analysis** - Upload research papers and get AI-powered insights
- 🔍 **PMC Search** - Search PubMed Central for open-access papers by SDG
- 🎯 **SDG Mapping** - Automatically identifies primary and secondary SDGs
- 📝 **Plain-Language Summaries** - Converts complex research into accessible insights
- 💡 **Actionable Challenges** - Generates practical tasks based on research findings
- 📊 **Excel Export** - Download all analyzed papers as a spreadsheet

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI:** React 19, Tailwind CSS
- **AI:** Google Gemini 2.0 Flash
- **Data Source:** NCBI PMC (PubMed Central)
- **Export:** SheetJS (xlsx)

---

**Questions or issues?** Open an issue on GitHub or check out the [Contributing Guide](04-CONTRIBUTING.md) for help.

