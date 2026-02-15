# CoG Code Structure

**Repository:** [https://github.com/haomengqi00709/CoG](https://github.com/haomengqi00709/CoG)

## Architecture

```
Browser (React) → Next.js API Routes → External APIs (Gemini, NCBI)
```

- **Frontend:** `app/page.tsx` (React UI with state management)
- **Backend:** `app/api/*` (API routes)
- **Utilities:** `lib/*` (shared functions)

## Directory Structure

```
CoG/
├── app/
│   ├── api/
│   │   ├── generate/route.ts      # POST /api/generate - PDF/text analysis
│   │   ├── search-pmc/route.ts    # GET /api/search-pmc - Search PMC by SDG
│   │   └── fetch-pmc/route.ts     # GET /api/fetch-pmc - Fetch & analyze PMC paper
│   ├── page.tsx                    # Main UI component
│   ├── layout.tsx                  # Root HTML layout
│   └── globals.css                 # Tailwind CSS imports
│
├── lib/
│   ├── prompt.ts                   # Builds AI prompts for Gemini
│   └── sdg-queries.ts              # SDG 1-17 keyword mappings
│
└── [config files: package.json, tsconfig.json, etc.]
```

## Key Files

### Frontend

**`app/page.tsx`** - Main UI component
- Two modes: PDF upload & PMC search
- State management (useState, useRef, useCallback)
- API calls to `/api/generate`, `/api/search-pmc`, `/api/fetch-pmc`
- Excel export (SheetJS)
- Displays results: SDG badges, summary, lesson, challenges

**`app/layout.tsx`** - Root layout (HTML structure, metadata)

**`app/globals.css`** - Tailwind CSS imports

### Backend API Routes

**`app/api/generate/route.ts`** - `POST /api/generate`
- Accepts: PDF file or text content
- Validates: PDF type, max 20MB
- Converts PDF → base64
- Calls Gemini API with prompt from `lib/prompt.ts`
- Returns: `{ authors, journal, sdg_primary, sdg_secondary, summary, lesson, challenges }`

**`app/api/search-pmc/route.ts`** - `GET /api/search-pmc?sdg=3&keywords=...`
- Uses `lib/sdg-queries.ts` to build search query
- Calls NCBI E-utilities (esearch, esummary)
- Returns: `{ papers: [{ pmcid, title, authors, journal, date }] }`

**`app/api/fetch-pmc/route.ts`** - `GET /api/fetch-pmc?pmcid=PMC1234567`
- Fetches full-text XML from NCBI
- Extracts readable text (strips XML tags)
- Sends to Gemini API (same output as `/api/generate`)

### Utilities

**`lib/prompt.ts`** - Builds structured prompts for Gemini
- Extracts metadata, maps to SDGs, generates summaries & challenges
- Returns JSON schema specification

**`lib/sdg-queries.ts`** - Maps SDG numbers (1-17) to search keywords
- Example: `SDG_QUERIES[13] = '("climate change" OR "global warming" ...)'`

## Data Flow

**PDF Upload:**
```
User uploads PDF → handlePdfSubmit() → POST /api/generate 
→ Validate & convert to base64 → Gemini API → Parse JSON → Display results
```

**PMC Search:**
```
Select SDG → handleSearch() → GET /api/search-pmc 
→ NCBI esearch/esummary → Display papers → Click "Analyze" 
→ GET /api/fetch-pmc → Extract text → Gemini API → Display results
```

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16 | Framework (routing, API routes) |
| React 19 | UI library |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Google Gemini 2.0 | AI analysis |
| NCBI E-utilities | Paper search/fetch |
| SheetJS (xlsx) | Excel export |

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/haomengqi00709/CoG.git
cd CoG
npm install
```

### 2. Environment Setup
Create `.env.local`:
```env
GEMINI_API_KEY=your_api_key_here
```
Get key: https://makersuite.google.com/app/apikey

### 3. Run
```bash
npm run dev
```
Open http://localhost:3000

### 4. Test
- Upload a PDF → Click "Generate Insights"
- Search by SDG → Select SDG → Click "Search PMC" → Click "Analyze Full Text"

## Common Issues

- **Missing API key:** Create `.env.local` with `GEMINI_API_KEY`
- **npm install fails:** Ensure Node.js 18+, delete `node_modules` and retry
- **Port 3000 in use:** Use `PORT=3001 npm run dev`

## Development

**Scripts:**
- `npm run dev` - Development server
- `npm run build` - Build & type check
- `npm run lint` - Linter

**Where to edit:**
- UI: `app/page.tsx`
- API: `app/api/*/route.ts`
- Prompts: `lib/prompt.ts`
- SDG keywords: `lib/sdg-queries.ts`

## Next Steps

1. Read [04-CONTRIBUTING.md](04-CONTRIBUTING.md) for contribution workflow
2. Check [05-LEARNING_GUIDE.md](05-LEARNING_GUIDE.md) for technical details
3. Open issues on GitHub for questions or bugs

---

**Questions?** Open an issue: https://github.com/haomengqi00709/CoG

