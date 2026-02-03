"use client";

import { useState, FormEvent, useRef, DragEvent, useCallback } from "react";
import * as XLSX from "xlsx";

const SDG_LABELS: Record<number, string> = {
  1: "No Poverty",
  2: "Zero Hunger",
  3: "Good Health & Well-Being",
  4: "Quality Education",
  5: "Gender Equality",
  6: "Clean Water & Sanitation",
  7: "Affordable & Clean Energy",
  8: "Decent Work & Economic Growth",
  9: "Industry, Innovation & Infrastructure",
  10: "Reduced Inequalities",
  11: "Sustainable Cities & Communities",
  12: "Responsible Consumption & Production",
  13: "Climate Action",
  14: "Life Below Water",
  15: "Life on Land",
  16: "Peace, Justice & Strong Institutions",
  17: "Partnerships for the Goals",
};

const SDG_COLORS: Record<number, string> = {
  1: "bg-red-600",
  2: "bg-amber-600",
  3: "bg-green-600",
  4: "bg-red-700",
  5: "bg-orange-500",
  6: "bg-cyan-500",
  7: "bg-yellow-500",
  8: "bg-rose-700",
  9: "bg-orange-600",
  10: "bg-pink-600",
  11: "bg-amber-500",
  12: "bg-yellow-700",
  13: "bg-green-700",
  14: "bg-blue-600",
  15: "bg-emerald-600",
  16: "bg-blue-800",
  17: "bg-indigo-700",
};

interface Lesson {
  title: string;
  main_summary: string;
  why_it_matters: string;
}

interface Challenge {
  title: string;
  description: string;
  location: string;
}

interface Result {
  authors: string | null;
  date_published: string | null;
  journal: string | null;
  location_constraint: string;
  sdg_primary: number;
  sdg_secondary: number[];
  summary: string;
  lesson: Lesson;
  challenges: Challenge[];
}

interface HistoryEntry {
  source: string; // e.g. "PMC1234567" or PDF filename
  result: Result;
  analyzedAt: string; // ISO timestamp
}

interface PmcPaper {
  pmcid: string;
  title: string;
  authors: string;
  journal: string;
  date: string;
}

function SdgBadge({ sdg, primary }: { sdg: number; primary?: boolean }) {
  const color = SDG_COLORS[sdg] ?? "bg-gray-500";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium text-white ${color} ${primary ? "ring-2 ring-offset-2 ring-gray-400" : ""}`}
    >
      SDG {sdg}
      <span className="hidden sm:inline">— {SDG_LABELS[sdg]}</span>
    </span>
  );
}

type InputMode = "pdf" | "pmc";

export default function Home() {
  const [mode, setMode] = useState<InputMode>("pdf");

  // PDF mode state
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // PMC search mode state
  const [selectedSdg, setSelectedSdg] = useState<number>(3);
  const [keywords, setKeywords] = useState("");
  const [papers, setPapers] = useState<PmcPaper[]>([]);
  const [searching, setSearching] = useState(false);
  const [analyzingPmcid, setAnalyzingPmcid] = useState<string | null>(null);

  // Shared state
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // History for Excel export
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  function addToHistory(source: string, r: Result) {
    setHistory((prev) => [
      ...prev,
      { source, result: r, analyzedAt: new Date().toISOString() },
    ]);
  }

  // ─── PDF helpers ───
  function handleFile(f: File | undefined) {
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError("PDF must be under 20 MB.");
      return;
    }
    setError("");
    setFile(f);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
  }

  // ─── PDF submit ───
  async function handlePdfSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/generate", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setResult(data);
      addToHistory(file.name, data);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ─── PMC search ───
  async function handleSearch() {
    setError("");
    setResult(null);
    setPapers([]);
    setSearching(true);

    try {
      const params = new URLSearchParams({ sdg: String(selectedSdg) });
      if (keywords.trim()) params.set("keywords", keywords.trim());
      const res = await fetch(`/api/search-pmc?${params}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Search failed.");
        return;
      }
      if (data.papers.length === 0) {
        setError("No open-access papers found for this SDG. Try another.");
        return;
      }
      setPapers(data.papers);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSearching(false);
    }
  }

  // ─── PMC analyze a single paper ───
  async function handleAnalyze(pmcid: string) {
    setError("");
    setResult(null);
    setAnalyzingPmcid(pmcid);
    setLoading(true);

    try {
      const res = await fetch(`/api/fetch-pmc?pmcid=${pmcid}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Analysis failed.");
        return;
      }
      setResult(data);
      addToHistory(pmcid, data);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
      setAnalyzingPmcid(null);
    }
  }

  // ─── Excel download ───
  const downloadExcel = useCallback(() => {
    const rows = history.map((h) => ({
      Source: h.source,
      "Analyzed At": h.analyzedAt,
      Authors: h.result.authors ?? "",
      Journal: h.result.journal ?? "",
      "Date Published": h.result.date_published ?? "",
      Location: h.result.location_constraint ?? "",
      "Primary SDG": `SDG ${h.result.sdg_primary} — ${SDG_LABELS[h.result.sdg_primary] ?? ""}`,
      "Secondary SDGs": h.result.sdg_secondary
        .map((s) => `SDG ${s}`)
        .join(", "),
      Summary: h.result.summary,
      "Lesson Title": h.result.lesson.title,
      "Main Finding": h.result.lesson.main_summary,
      "Why It Matters": h.result.lesson.why_it_matters,
      "Challenge 1": h.result.challenges?.[0]
        ? `${h.result.challenges[0].title}: ${h.result.challenges[0].description}`
        : "",
      "Challenge 1 Location": h.result.challenges?.[0]?.location ?? "",
      "Challenge 2": h.result.challenges?.[1]
        ? `${h.result.challenges[1].title}: ${h.result.challenges[1].description}`
        : "",
      "Challenge 2 Location": h.result.challenges?.[1]?.location ?? "",
      "Challenge 3": h.result.challenges?.[2]
        ? `${h.result.challenges[2].title}: ${h.result.challenges[2].description}`
        : "",
      "Challenge 3 Location": h.result.challenges?.[2]?.location ?? "",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);

    // Auto-size columns based on header + content width
    const colWidths = Object.keys(rows[0] || {}).map((key) => {
      const maxLen = Math.max(
        key.length,
        ...rows.map((r) => String((r as Record<string, string>)[key]).length)
      );
      return { wch: Math.min(maxLen + 2, 60) };
    });
    ws["!cols"] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Paper Insights");
    XLSX.writeFile(wb, "cog-research-insights.xlsx");
  }, [history]);

  const tabClass = (active: boolean) =>
    `flex-1 py-2 text-sm font-medium text-center rounded-lg transition-colors ${
      active
        ? "bg-indigo-600 text-white"
        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          CoG Research Intelligence
        </h1>
        <p className="mt-2 text-gray-500">
          Upload a research paper or discover the latest open-access science by
          SDG.
        </p>
      </header>

      {/* ─── Download Excel (sticky) ─── */}
      {history.length > 0 && (
        <div className="sticky top-0 z-10 mb-4 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 shadow-sm">
          <p className="text-sm text-gray-600">
            {history.length} paper{history.length !== 1 && "s"} analyzed
          </p>
          <button
            type="button"
            onClick={downloadExcel}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3"
              />
            </svg>
            Download Excel
          </button>
        </div>
      )}

      {/* Mode Tabs */}
      <div className="mb-4 flex gap-1 rounded-lg bg-gray-100 p-1">
        <button
          type="button"
          className={tabClass(mode === "pdf")}
          onClick={() => setMode("pdf")}
        >
          Upload PDF
        </button>
        <button
          type="button"
          className={tabClass(mode === "pmc")}
          onClick={() => setMode("pmc")}
        >
          Search by SDG
        </button>
      </div>

      {/* ─── PDF Tab ─── */}
      {mode === "pdf" && (
        <form onSubmit={handlePdfSubmit} className="space-y-4">
          <div>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-10 text-center cursor-pointer transition-colors ${
                dragging
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {file ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <svg
                    className="mb-2 h-8 w-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                    />
                  </svg>
                  <p className="text-sm text-gray-500">
                    Drag &amp; drop a PDF here, or{" "}
                    <span className="text-indigo-600 font-medium">browse</span>
                  </p>
                  <p className="mt-1 text-xs text-gray-400">PDF up to 20 MB</p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Generating…" : "Generate Insights"}
          </button>
        </form>
      )}

      {/* ─── PMC Search Tab ─── */}
      {mode === "pmc" && (
        <div className="space-y-4">
          {/* SDG Picker */}
          <div className="flex gap-2">
            <select
              value={selectedSdg}
              onChange={(e) => setSelectedSdg(Number(e.target.value))}
              className="w-48 shrink-0 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
            >
              {Object.entries(SDG_LABELS).map(([num, label]) => (
                <option key={num} value={num}>
                  SDG {num} — {label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleSearch}
              disabled={searching}
              className="shrink-0 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {searching ? "Searching…" : "Search PMC"}
            </button>
          </div>

          {/* Custom keywords */}
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            placeholder="Add keywords to refine, e.g. &quot;CRISPR&quot; or &quot;sub-Saharan Africa&quot;"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
          />
        </div>
      )}

      {/* ─── Error ─── */}
      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ─── Results ─── */}
      {result && (
        <section className="mt-8 space-y-6">
          {/* SDG Badges */}
          <div className="flex flex-wrap gap-2">
            <SdgBadge sdg={result.sdg_primary} primary />
            {result.sdg_secondary.map((sdg) => (
              <SdgBadge key={sdg} sdg={sdg} />
            ))}
          </div>

          {/* Paper Metadata */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm text-sm text-gray-700 space-y-1">
            {result.authors && (
              <p>
                <span className="font-semibold text-gray-500">Authors:</span>{" "}
                {result.authors}
              </p>
            )}
            {result.journal && (
              <p>
                <span className="font-semibold text-gray-500">Journal:</span>{" "}
                {result.journal}
              </p>
            )}
            {result.date_published && (
              <p>
                <span className="font-semibold text-gray-500">Published:</span>{" "}
                {result.date_published}
              </p>
            )}
            <p>
              <span className="font-semibold text-gray-500">Location:</span>{" "}
              {result.location_constraint}
            </p>
          </div>

          {/* Summary */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{result.summary}</p>
          </div>

          {/* Lesson Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Lesson
            </h2>
            <h3 className="mb-3 text-lg font-bold text-gray-900">
              {result.lesson.title}
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold text-gray-500 uppercase tracking-wide text-xs mb-1">
                  What this paper says
                </h4>
                <p className="leading-relaxed">{result.lesson.main_summary}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-500 uppercase tracking-wide text-xs mb-1">
                  Why it matters
                </h4>
                <p className="leading-relaxed">
                  {result.lesson.why_it_matters}
                </p>
              </div>
            </div>
          </div>

          {/* Challenges */}
          {result.challenges && result.challenges.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
                Challenges
              </h2>
              <div className="space-y-4">
                {result.challenges.map((c, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                      {i + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {c.title}
                      </h4>
                      <p className="mt-0.5 text-sm text-gray-600 leading-relaxed">
                        {c.description}
                      </p>
                      <span
                        className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          c.location === "Anywhere"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {c.location === "Anywhere"
                          ? "Anywhere"
                          : c.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ─── PMC Paper List (below results) ─── */}
      {mode === "pmc" && papers.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Search Results
          </h2>
          <ul className="space-y-3">
            {papers.map((p) => (
              <li
                key={p.pmcid}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <h3 className="text-sm font-semibold text-gray-900 leading-snug">
                  {p.title}
                </h3>
                <p className="mt-1 text-xs text-gray-500">{p.authors}</p>
                <p className="text-xs text-gray-400">
                  {p.journal} · {p.date} ·{" "}
                  <a
                    href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${p.pmcid}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-500 hover:underline"
                  >
                    {p.pmcid}
                  </a>
                </p>
                <button
                  type="button"
                  onClick={() => handleAnalyze(p.pmcid)}
                  disabled={loading}
                  className="mt-2 rounded-md bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {analyzingPmcid === p.pmcid
                    ? "Analyzing…"
                    : "Analyze Full Text"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

    </main>
  );
}
