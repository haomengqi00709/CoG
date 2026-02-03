# CoG Research Intelligence — Learning Guide

A complete breakdown of every technology and concept used in this project, organized by learning order. Each section explains **what** the concept is, **where** it appears in the codebase, and **why** it's used.

---

## 1. HTML & CSS Fundamentals

The foundation of everything on the web. HTML structures the page; CSS styles it.

**Where it's used:**
- `app/page.tsx` — all the JSX (which compiles to HTML): `<main>`, `<header>`, `<h1>`, `<p>`, `<form>`, `<button>`, `<input>`, `<select>`, `<textarea>`, `<ul>`, `<li>`, `<a>`, `<svg>`
- `app/globals.css` — base stylesheet that loads Tailwind
- `app/layout.tsx` — the root `<html>` and `<body>` tags that wrap every page

**What to learn:**
- Semantic HTML elements (`header`, `main`, `section`, `form`)
- Form elements (`input`, `select`, `textarea`, `button`, `label`)
- Attributes (`type`, `placeholder`, `disabled`, `href`, `target`, `rel`)
- How CSS classes work (Tailwind replaces writing raw CSS, but you need to understand the properties)

---

## 2. JavaScript (ES6+)

The programming language of the browser and Node.js.

**Where it's used — literally every `.ts` and `.tsx` file. Key patterns:**

| Pattern | Where | Example |
|---------|-------|---------|
| `const` / `let` | everywhere | `const [mode, setMode] = useState(...)` |
| Arrow functions | `app/page.tsx:273` | `const tabClass = (active: boolean) => ...` |
| Template literals | `lib/prompt.ts:8` | `` `You are a research intelligence assistant. ${inputDescription}` `` |
| Destructuring | `app/page.tsx:3` | `import { useState, FormEvent, useRef } from "react"` |
| `async` / `await` | `app/api/generate/route.ts:18` | `formData = await req.formData()` |
| `try` / `catch` | `app/api/generate/route.ts:17–24` | Error handling around API calls |
| `.map()` / `.filter()` | `app/api/search-pmc/route.ts:61–74` | Transforming PMC results into paper objects |
| `.join()` | `app/api/search-pmc/route.ts:68` | `s.authors.map(a => a.name).join(", ")` |
| `.replace()` with regex | `app/api/fetch-pmc/route.ts:14` | `section.replace(/<\/?[^>]+(>|$)/g, " ")` to strip XML tags |
| `.trim()` | `app/api/generate/route.ts:27` | Cleaning whitespace from user input |
| Optional chaining `?.` | `app/api/generate/route.ts:27` | `(formData.get("text") as string | null)?.trim()` |
| Nullish coalescing `??` | `app/page.tsx:77` | `SDG_COLORS[sdg] ?? "bg-gray-500"` |
| Spread operator `...` | `app/page.tsx:114` | `[...prev, { source, result: r, ... }]` to append to array immutably |
| `JSON.parse()` | `app/api/generate/route.ts:85` | Parsing Gemini's JSON string response into an object |
| `encodeURIComponent()` | `app/api/search-pmc/route.ts:43` | Safely encoding the search query for a URL |
| `parseInt()` | `app/api/search-pmc/route.ts:27` | Converting the SDG query param from string to number |
| `new Date().toISOString()` | `app/page.tsx:116` | Recording when a paper was analyzed |

---

## 3. TypeScript

Adds type safety on top of JavaScript. Catches bugs at build time.

**Where it's used — every file (`.ts` and `.tsx`).**

| Pattern | Where | Example |
|---------|-------|---------|
| Type annotations | `app/page.tsx:91` | `const [mode, setMode] = useState<InputMode>("pdf")` |
| `interface` | `app/page.tsx:46–59` | `interface Result { authors: string \| null; ... }` defines the shape of Gemini's response |
| Union types | `app/page.tsx:88` | `type InputMode = "pdf" \| "pmc"` — mode can only be one of two strings |
| `Record<K, V>` | `app/page.tsx:6` | `Record<number, string>` — a dictionary mapping numbers to strings (SDG labels) |
| `as` type assertion | `app/api/generate/route.ts:26` | `formData.get("file") as File \| null` — telling TS what FormData returns |
| Generic types | `app/page.tsx:94` | `useState<File \| null>(null)` — the state can hold a File or null |
| Optional properties | `lib/prompt.ts:1` | `title?: string` — parameter may be undefined |
| `err: unknown` | `app/api/generate/route.ts:87` | Catch blocks use `unknown` (safer than `any`), then narrow with `instanceof` |

**Config:** `tsconfig.json` configures the compiler — path aliases (`@/lib/...`), strict mode, JSX support.

---

## 4. React

UI library for building interactive interfaces with components and state.

**Where it's used: `app/page.tsx` (the entire frontend).**

### Hooks

| Hook | Where | Purpose |
|------|-------|---------|
| `useState` | `app/page.tsx:91–111` | Holds all UI state: current tab, file, search results, loading flags, error messages, history |
| `useRef` | `app/page.tsx:96` | `fileInputRef` — a reference to the hidden `<input type="file">` so we can programmatically click it |
| `useCallback` | `app/page.tsx:239` | `downloadExcel` — memoizes the function so it only re-creates when `history` changes |

### Components

| Pattern | Where | What it does |
|---------|-------|-------------|
| Function component | `app/page.tsx:76` | `SdgBadge({ sdg, primary })` — a reusable colored badge |
| Default export component | `app/page.tsx:90` | `export default function Home()` — the page itself |
| Props | `app/page.tsx:76` | `{ sdg: number; primary?: boolean }` passed to `SdgBadge` |

### Event handling

| Event | Where | What it does |
|-------|-------|-------------|
| `FormEvent` | `app/page.tsx:152` | `handlePdfSubmit(e: FormEvent)` — intercepts form submit, calls `e.preventDefault()` |
| `DragEvent` | `app/page.tsx:135–148` | `handleDrop`, `handleDragOver`, `handleDragLeave` — drag-and-drop file upload |
| `onChange` | `app/page.tsx:100,409` | Text inputs and file input update state on change |
| `onClick` | `app/page.tsx:347` | Click on drop zone triggers `fileInputRef.current?.click()` |
| `onKeyDown` | `app/page.tsx:454` | Pressing Enter in the keyword field triggers search |
| `e.stopPropagation()` | `app/page.tsx:360` | Prevents the remove-file button click from also triggering the drop zone click |

### Conditional rendering

| Pattern | Where |
|---------|-------|
| `{mode === "pdf" && (...)}`| `app/page.tsx:340` — only show the PDF form when on the PDF tab |
| `{file ? (...) : (...)}` | `app/page.tsx:354` — show filename or upload prompt |
| `{history.length > 0 && (...)}` | `app/page.tsx:293` — only show download bar when there's history |
| `{result.authors && (...)}` | `app/page.tsx:487` — only show metadata fields when non-null |

### Rendering lists

| Pattern | Where |
|---------|-------|
| `.map()` with `key` | `app/page.tsx:479,550` — rendering SDG badges, paper cards |

---

## 5. Next.js (App Router)

React framework that handles routing, server-side rendering, and API endpoints.

**File-based routing — the folder structure IS the URL structure:**

| File | URL | Type |
|------|-----|------|
| `app/page.tsx` | `/` | Page (client component) |
| `app/layout.tsx` | wraps all pages | Root layout (fonts, global CSS, `<html>`) |
| `app/api/generate/route.ts` | `POST /api/generate` | API route |
| `app/api/search-pmc/route.ts` | `GET /api/search-pmc` | API route |
| `app/api/fetch-pmc/route.ts` | `GET /api/fetch-pmc` | API route |

**Key concepts used:**

| Concept | Where | Details |
|---------|-------|---------|
| `"use client"` | `app/page.tsx:1` | Marks this as a Client Component (runs in browser, can use hooks/state) |
| `NextRequest` | `app/api/generate/route.ts:3` | Server-side request object — access FormData, query params |
| `NextResponse.json()` | `app/api/generate/route.ts:9` | Return JSON with status codes from API routes |
| `req.formData()` | `app/api/generate/route.ts:18` | Parse multipart form data (file uploads) |
| `req.nextUrl.searchParams` | `app/api/search-pmc/route.ts:26` | Read URL query parameters (`?sdg=3&keywords=...`) |
| `process.env` | `app/api/generate/route.ts:8` | Access environment variables (API keys) |
| Path aliases | `app/api/generate/route.ts:2` | `@/lib/prompt` resolves to `lib/prompt.ts` (configured in `tsconfig.json`) |

**Config:** `next.config.js` — Next.js configuration (minimal in this project).

---

## 6. Tailwind CSS

Utility-first CSS framework — you style by composing small classes instead of writing CSS.

**Where it's used: every element in `app/page.tsx`.**

| Category | Classes Used | What They Do |
|----------|-------------|-------------|
| Layout | `mx-auto max-w-2xl px-4 py-12` | Center content, max width, padding |
| Flexbox | `flex items-center justify-between gap-2` | Horizontal layout with spacing |
| Typography | `text-3xl font-bold tracking-tight text-sm text-gray-500` | Font size, weight, letter spacing, color |
| Borders | `rounded-lg border border-gray-200 border-2 border-dashed` | Rounded corners, border styles |
| Colors | `bg-indigo-600 text-white bg-green-50 border-green-200` | Background and text colors |
| Spacing | `mt-2 mb-4 p-5 px-3 py-1.5 gap-2 space-y-4` | Margin, padding, gap between children |
| States | `hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2` | Styles on hover, disabled, focus |
| Responsive | `hidden sm:inline` | Hidden on mobile, shown on small screens and up (SDG label text) |
| Positioning | `sticky top-0 z-10` | Download bar sticks to viewport top on scroll |
| Transitions | `transition-colors` | Smooth color changes on hover/state change |
| Shadows | `shadow-sm` | Subtle drop shadow on cards |

**Config:** `postcss.config.mjs` loads the Tailwind PostCSS plugin. `app/globals.css` imports Tailwind's base styles.

---

## 7. Working with APIs (fetch)

How the browser talks to the server, and how the server talks to external services.

### Browser → Our API (client-side fetch)

| Call | Where | How |
|------|-------|-----|
| Upload PDF | `app/page.tsx:167` | `fetch("/api/generate", { method: "POST", body: fd })` — sends FormData with file |
| Search PMC | `app/page.tsx:196` | `fetch("/api/search-pmc?sdg=3&keywords=..."))` — GET with query params |
| Analyze paper | `app/page.tsx:222` | `fetch("/api/fetch-pmc?pmcid=PMC1234567")` — GET with PMCID |

**Pattern used everywhere:** `fetch()` → check `res.ok` → `res.json()` → update state or show error.

### Our API → External APIs (server-side fetch)

| Call | Where | External Service |
|------|-------|-----------------|
| `esearch.fcgi` | `app/api/search-pmc/route.ts:43` | NCBI E-utilities — search PMC for paper IDs matching a query |
| `esummary.fcgi` | `app/api/search-pmc/route.ts:55` | NCBI E-utilities — get title, authors, journal for those IDs |
| `efetch.fcgi` | `app/api/fetch-pmc/route.ts:45` | NCBI E-utilities — get full-text XML of a paper |
| `model.generateContent()` | `app/api/generate/route.ts:63,74` | Google Gemini — send prompt (+ optional PDF) and get AI analysis |

### FormData

| Where | What |
|-------|------|
| `app/page.tsx:164–165` | Client builds `FormData`, appends the PDF `File` object |
| `app/api/generate/route.ts:18,26–28` | Server reads FormData: `formData.get("file")`, `formData.get("text")`, `formData.get("title")` |

### URL Query Parameters

| Where | What |
|-------|------|
| `app/page.tsx:194–195` | Client builds `URLSearchParams({ sdg: "3" })` and appends `keywords` |
| `app/api/search-pmc/route.ts:26–28` | Server reads `req.nextUrl.searchParams.get("sdg")` and `"keywords"` |

### HTTP Status Codes Used

| Code | Meaning | Where |
|------|---------|-------|
| 200 | Success | Default for `NextResponse.json(data)` |
| 400 | Bad Request | Missing/invalid input (e.g. no file, wrong SDG number) |
| 422 | Unprocessable Entity | Paper text too short to analyze (`fetch-pmc/route.ts:60`) |
| 500 | Server Error | Missing API key |
| 502 | Bad Gateway | External API (Gemini, PMC) failed |

---

## 8. Google Gemini API

The AI model that analyzes papers and returns structured insights.

**Where it's used: `app/api/generate/route.ts` and `app/api/fetch-pmc/route.ts`**

| Step | Code | What happens |
|------|------|-------------|
| Init client | `new GoogleGenerativeAI(apiKey)` | Creates SDK instance with your API key |
| Get model | `genAI.getGenerativeModel({ model: "gemini-2.0-flash" })` | Selects the Gemini 2.0 Flash model |
| Send PDF | `model.generateContent([{ inlineData: { mimeType: "application/pdf", data: base64 } }, { text: prompt }])` | Multimodal: sends PDF as base64 + text prompt together (`generate/route.ts:63–71`) |
| Send text | `model.generateContent(prompt)` | Text-only: the paper content is embedded in the prompt string (`generate/route.ts:74`, `fetch-pmc/route.ts:75`) |
| Read response | `result.response.text()` | Get the raw text output from Gemini |
| Clean + parse | `.replace(...)` then `JSON.parse()` | Strip markdown fences and parse JSON (`generate/route.ts:80–85`) |

**PDF as base64** (`generate/route.ts:59–60`):
```
File → ArrayBuffer → Buffer → base64 string
```
This is how you send binary data (a PDF) inline to Gemini's API.

---

## 9. NCBI PMC Open Access API (E-utilities)

The public API for searching and fetching biomedical research papers.

**Where it's used: `app/api/search-pmc/route.ts` and `app/api/fetch-pmc/route.ts`**

| Endpoint | Purpose | Where |
|----------|---------|-------|
| `esearch.fcgi?db=pmc&term=...&retmax=10&retmode=json&sort=date` | Search PMC, returns list of numeric IDs | `search-pmc/route.ts:43` |
| `esummary.fcgi?db=pmc&id=123,456&retmode=json` | Get metadata (title, authors, journal, date) for those IDs | `search-pmc/route.ts:55` |
| `efetch.fcgi?db=pmc&id=123&rettype=xml` | Get full-text article as JATS XML | `fetch-pmc/route.ts:45` |

**Search query construction** (`search-pmc/route.ts:37–39`):
```
SDG keywords + optional user keywords + "open+access[filter]"
```
The `open+access[filter]` ensures only freely available papers are returned.

**SDG keyword mapping** (`lib/sdg-queries.ts`):
Each SDG number maps to an OR'd set of search terms, e.g.:
```
SDG 13 → ("climate change" OR "global warming" OR "carbon emissions" OR "climate adaptation")
```

**XML text extraction** (`fetch-pmc/route.ts:8–22`):
The full-text XML from `efetch` is JATS format. We extract readable text by:
1. Isolating the `<body>` section
2. Stripping all XML tags with regex
3. Decoding HTML entities (`&amp;` → `&`, etc.)
4. Collapsing whitespace

---

## 10. Prompt Engineering

How we instruct Gemini to return exactly the data we need.

**Where it's used: `lib/prompt.ts`**

| Technique | Line | What it does |
|-----------|------|-------------|
| Role assignment | `line 8` | `"You are a research intelligence assistant"` — sets the model's persona |
| Input framing | `lines 3–6` | Different instructions for PDF (`"The research paper PDF is attached"`) vs text (`"Analyze the following research paper text"`) |
| Numbered task list | `lines 10–15` | Explicit numbered steps: extract authors, identify problem, conclusions, SDGs |
| Strict output format | `lines 17–31` | `"Return ONLY valid JSON matching this exact schema"` with the full JSON template |
| Negative instructions | `line 17` | `"no markdown, no code fences, no extra text"` — prevents common LLM output issues |
| Nullable fields | `lines 20–22` | `"or null if not found"` — handles cases where metadata isn't available |

**Post-processing** (needed because models don't always follow instructions perfectly):
- `generate/route.ts:80–83` — regex strips `` ```json `` fences the model might add
- `generate/route.ts:85` — `JSON.parse()` converts the cleaned string to a real object

---

## 11. File Handling

### Browser-side (uploads)

| Concept | Where | What it does |
|---------|-------|-------------|
| `<input type="file">` | `app/page.tsx:404–410` | Hidden file input, `.pdf` only |
| `useRef` + `.click()` | `app/page.tsx:96,347` | Programmatically opens the file picker when drop zone is clicked |
| Drag and drop | `app/page.tsx:135–148` | `onDrop`, `onDragOver`, `onDragLeave` events on the drop zone div |
| `File` object | `app/page.tsx:121–133` | Browser's File API — check `.type`, `.size`, `.name` |
| `FormData.append("file", file)` | `app/page.tsx:165` | Attach the file to the request body |

### Server-side (PDF processing)

| Step | Where | What it does |
|------|-------|-------------|
| `formData.get("file") as File` | `generate/route.ts:26` | Extract file from FormData |
| `file.arrayBuffer()` | `generate/route.ts:59` | Read file contents as raw bytes |
| `Buffer.from(...).toString("base64")` | `generate/route.ts:60` | Convert to base64 string for Gemini API |
| Validation | `generate/route.ts:37–50` | Check MIME type is `application/pdf` and size is under 20MB |

---

## 12. Excel Generation (SheetJS / xlsx)

Client-side spreadsheet creation and download — no server needed.

**Where it's used: `app/page.tsx:239–271`**

| Step | Code | What it does |
|------|------|-------------|
| Build row data | `history.map(h => ({...}))` | Transform history entries into flat objects with named columns |
| Create worksheet | `XLSX.utils.json_to_sheet(rows)` | Converts array of objects into an Excel worksheet |
| Auto-size columns | `ws["!cols"] = colWidths` | Calculates optimal column widths based on content |
| Create workbook | `XLSX.utils.book_new()` | Creates an empty workbook container |
| Add sheet | `XLSX.utils.book_append_sheet(wb, ws, "Paper Insights")` | Adds the worksheet with a tab name |
| Download | `XLSX.writeFile(wb, "cog-research-insights.xlsx")` | Triggers browser file download |

**Excel columns:** Source, Analyzed At, Authors, Journal, Date Published, Primary SDG, Secondary SDGs, Summary, Lesson Title, Main Finding, Why It Matters.

---

## 13. State Management Pattern

How data flows through the app (no external state library — just React `useState`).

**The history accumulation pattern** (`app/page.tsx:110–118`):

```
User analyzes paper → Gemini returns Result → setResult(data) displays it
                                             → addToHistory(source, data) saves it
```

`addToHistory` uses the functional updater `setHistory(prev => [...prev, newEntry])` to safely append without losing previous entries.

**When history has entries**, the sticky download bar appears at the top showing the count and the export button.

---

## 14. Environment & Tooling

| Tool | Config File | Purpose |
|------|------------|---------|
| Node.js / npm | `package.json` | Runtime + package manager. Lists all dependencies and scripts (`dev`, `build`, `start`) |
| TypeScript | `tsconfig.json` | Compiler config: path aliases (`@/*`), strict mode, JSX, target ES version |
| Tailwind CSS | `postcss.config.mjs` | PostCSS plugin that compiles Tailwind utility classes |
| Next.js | `next.config.js` | Framework config (minimal — defaults are sufficient) |
| Environment vars | `.env.local` (not in repo) | Stores `GEMINI_API_KEY` — loaded via `process.env` |
| `.gitignore` | `.gitignore` | Excludes `node_modules`, `.next`, `.env.local`, build artifacts from git |

---

## 15. Git & GitHub

| Command | What it does |
|---------|-------------|
| `git init` | Initialize a new repository |
| `git branch -m main` | Rename default branch to `main` |
| `git add <files>` | Stage specific files for commit |
| `git commit -m "..."` | Save a snapshot with a message |
| `gh repo create CoG --public --source=. --push` | Create a GitHub repo and push in one command |

**`.gitignore`** prevents committing: `node_modules/` (huge), `.next/` (build output), `.env.local` (secrets), `.DS_Store` (macOS junk).

---

## Suggested Learning Order

1. **HTML + CSS** → understand what gets rendered
2. **JavaScript ES6+** → the language everything runs on
3. **TypeScript** → adds safety on top of JS
4. **React** → how the UI is built from components and state
5. **Next.js** → routing, API routes, server vs client
6. **Tailwind** → styling without writing CSS files
7. **fetch + REST APIs** → how client talks to server, how server talks to external services
8. **Gemini API** → sending prompts, multimodal input, parsing structured output
9. **NCBI E-utilities** → domain-specific API for scientific papers
10. **Prompt engineering** → getting reliable structured output from LLMs
11. **File handling** — uploads, drag-and-drop, base64 encoding
12. **SheetJS** — client-side Excel generation
13. **Git + GitHub** — version control and collaboration
