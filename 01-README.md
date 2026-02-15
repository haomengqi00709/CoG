# CoG Research Intelligence

A web application that analyzes research papers using AI to identify connections to UN Sustainable Development Goals (SDGs), generate plain-language summaries, and create actionable challenges.

**Repository:** [https://github.com/haomengqi00709/CoG](https://github.com/haomengqi00709/CoG)

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

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/haomengqi00709/CoG.git
   cd CoG
   ```
   > **Note:** To contribute, first fork the repository, then clone your fork.

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Upload a PDF

1. Click the "Upload PDF" tab
2. Drag and drop a PDF file or click to browse
3. Click "Generate Insights"
4. View the AI-generated analysis with SDG mappings, summary, and challenges

### Search by SDG

1. Click the "Search by SDG" tab
2. Select a Sustainable Development Goal
3. Optionally add keywords to refine your search
4. Click "Search PMC" to find open-access papers
5. Click "Analyze Full Text" on any paper to get insights

### Export Results

After analyzing papers, use the "Download Excel" button to export all insights to a spreadsheet.

## Project Structure

```
CoG/
├── app/
│   ├── api/              # API routes
│   │   ├── generate/     # PDF/text analysis
│   │   ├── search-pmc/   # PMC search
│   │   └── fetch-pmc/    # Fetch paper content
│   ├── page.tsx          # Main UI component
│   └── layout.tsx        # Root layout
├── lib/
│   ├── prompt.ts         # AI prompt builder
│   └── sdg-queries.ts    # SDG keyword mappings
└── ...
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

We welcome contributions! Please read our [Contributing Guide](04-CONTRIBUTING.md) for details on:

- How to fork and clone the repository
- GitHub basics for collaboration
- Development workflow
- How to submit pull requests
- Code style guidelines

**New to GitHub?** The contributing guide includes a comprehensive GitHub basics section to help you get started.

## Documentation

- **[01 - README](01-README.md)** - Project overview and quick start (you are here)
- **[02 - Code Structure](02-CODE_STRUCTURE.md)** - **Start here!** Complete overview of project architecture and file structure
- **[03 - Deployment Guide](03-DEPLOYMENT.md)** - **Deploy to your own website** - What you need and how to deploy
- **[04 - Contributing Guide](04-CONTRIBUTING.md)** - How to participate in the project (includes GitHub setup)
- **[05 - Learning Guide](05-LEARNING_GUIDE.md)** - Technical deep-dive into all technologies used
- **[06 - Project Plan](06-CoG_Plan_Re.md)** - Original project specification

## License

[Add your license here]

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- AI powered by [Google Gemini](https://deepmind.google/technologies/gemini/)
- Paper data from [PubMed Central](https://www.ncbi.nlm.nih.gov/pmc/)

---

**Questions or issues?** Open an issue on GitHub or check out the [Contributing Guide](04-CONTRIBUTING.md) for help.

