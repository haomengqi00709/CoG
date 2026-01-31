import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildPrompt } from "@/lib/prompt";
import { NextRequest, NextResponse } from "next/server";

const EUTILS_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

/** Strip XML tags and collapse whitespace to extract readable text. */
function extractTextFromXml(xml: string): string {
  // Remove everything before <body> and after </body> to focus on the article body
  const bodyMatch = xml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const section = bodyMatch ? bodyMatch[1] : xml;

  return section
    .replace(/<\/?[^>]+(>|$)/g, " ") // strip tags
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ") // collapse whitespace
    .trim();
}

export async function GET(req: NextRequest) {
  const pmcid = req.nextUrl.searchParams.get("pmcid");

  if (!pmcid || !/^PMC\d+$/.test(pmcid)) {
    return NextResponse.json(
      { error: "Provide a valid PMCID (e.g. PMC1234567)." },
      { status: 400 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server misconfiguration: missing GEMINI_API_KEY" },
      { status: 500 }
    );
  }

  try {
    // Fetch full-text XML from PMC
    const numericId = pmcid.replace("PMC", "");
    const fetchUrl = `${EUTILS_BASE}/efetch.fcgi?db=pmc&id=${numericId}&rettype=xml`;
    const xmlRes = await fetch(fetchUrl);

    if (!xmlRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch paper from PMC." },
        { status: 502 }
      );
    }

    const xml = await xmlRes.text();
    const fullText = extractTextFromXml(xml);

    if (fullText.length < 100) {
      return NextResponse.json(
        { error: "Could not extract enough text from this paper. It may not be available as open-access full text." },
        { status: 422 }
      );
    }

    // Truncate if extremely long (Gemini context limit safeguard)
    const trimmedText = fullText.length > 100_000
      ? fullText.slice(0, 100_000) + "\n\n[Text truncated]"
      : fullText;

    // Send to Gemini
    const prompt = buildPrompt("text") + `\n\n${trimmedText}`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const data = JSON.parse(cleaned);
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to analyze paper: ${message}` },
      { status: 502 }
    );
  }
}
