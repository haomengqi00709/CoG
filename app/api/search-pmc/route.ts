import { NextRequest, NextResponse } from "next/server";
import { SDG_QUERIES } from "@/lib/sdg-queries";

const EUTILS_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

interface ESearchResult {
  esearchresult: { idlist: string[] };
}

interface ESummaryResult {
  result: Record<
    string,
    {
      uid: string;
      title: string;
      sortfirstauthor: string;
      authors: { name: string }[];
      fulljournalname: string;
      pubdate: string;
      pmcid?: string;
    }
  >;
}

export async function GET(req: NextRequest) {
  const sdgParam = req.nextUrl.searchParams.get("sdg");
  const sdg = sdgParam ? parseInt(sdgParam, 10) : NaN;
  const keywords = req.nextUrl.searchParams.get("keywords")?.trim() || "";

  if (isNaN(sdg) || sdg < 1 || sdg > 17) {
    return NextResponse.json(
      { error: "Provide a valid SDG number (1–17)." },
      { status: 400 }
    );
  }

  const baseQuery = SDG_QUERIES[sdg];
  const keywordClause = keywords ? ` AND (${keywords})` : "";
  const searchTerm = `${baseQuery}${keywordClause} AND open+access[filter]`;

  try {
    // 1. Search PMC for matching IDs
    const searchUrl = `${EUTILS_BASE}/esearch.fcgi?db=pmc&term=${encodeURIComponent(searchTerm)}&retmax=10&retmode=json&sort=date`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) throw new Error("PMC search request failed");

    const searchData: ESearchResult = await searchRes.json();
    const ids = searchData.esearchresult.idlist;

    if (ids.length === 0) {
      return NextResponse.json({ papers: [] });
    }

    // 2. Get summaries for those IDs
    const summaryUrl = `${EUTILS_BASE}/esummary.fcgi?db=pmc&id=${ids.join(",")}&retmode=json`;
    const summaryRes = await fetch(summaryUrl);
    if (!summaryRes.ok) throw new Error("PMC summary request failed");

    const summaryData: ESummaryResult = await summaryRes.json();

    const papers = ids.map((id) => {
      const s = summaryData.result[id];
      if (!s) return null;
      return {
        pmcid: `PMC${id}`,
        title: s.title,
        authors:
          s.authors?.map((a) => a.name).join(", ") ||
          s.sortfirstauthor ||
          "Unknown",
        journal: s.fulljournalname || "Unknown",
        date: s.pubdate || "Unknown",
      };
    }).filter(Boolean);

    return NextResponse.json({ papers });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error searching PMC";
    return NextResponse.json(
      { error: `PMC search failed: ${message}` },
      { status: 502 }
    );
  }
}
