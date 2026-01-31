import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildPrompt } from "@/lib/prompt";
import { NextRequest, NextResponse } from "next/server";

const MAX_PDF_SIZE = 20 * 1024 * 1024; // 20 MB

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server misconfiguration: missing GEMINI_API_KEY" },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body — expected FormData." },
      { status: 400 }
    );
  }

  const file = formData.get("file") as File | null;
  const text = (formData.get("text") as string | null)?.trim() || "";
  const title = (formData.get("title") as string | null)?.trim() || undefined;

  if (!file && !text) {
    return NextResponse.json(
      { error: "Please provide a PDF file or paste paper text." },
      { status: 400 }
    );
  }

  if (file) {
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are accepted." },
        { status: 400 }
      );
    }
    if (file.size > MAX_PDF_SIZE) {
      return NextResponse.json(
        { error: "PDF must be under 20 MB." },
        { status: 400 }
      );
    }
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let result;

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString("base64");
      const prompt = buildPrompt("pdf", title);

      result = await model.generateContent([
        {
          inlineData: {
            mimeType: "application/pdf",
            data: base64,
          },
        },
        { text: prompt },
      ]);
    } else {
      const prompt = buildPrompt("text", title) + `\n\n${text}`;
      result = await model.generateContent(prompt);
    }

    const raw = result.response.text();

    // Strip possible markdown code fences the model might add despite instructions
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const data = JSON.parse(cleaned);
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error calling Gemini";
    return NextResponse.json(
      { error: `Failed to generate insights: ${message}` },
      { status: 502 }
    );
  }
}
