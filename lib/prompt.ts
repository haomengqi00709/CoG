export function buildPrompt(inputType: "pdf" | "text", title?: string) {
  const paperRef = title ? `Title: ${title}\n` : "";
  const inputDescription =
    inputType === "pdf"
      ? "The research paper PDF is attached. Analyze the full paper."
      : "Analyze the following research paper text.";

  return `You are a research intelligence assistant. ${inputDescription}

${paperRef}Your tasks:
1. Extract the author(s), publication date, and journal name (if available).
2. Identify what problem the paper studies.
3. What it finds or concludes.
4. Why it matters in the real world.
5. Which UN Sustainable Development Goal(s) it most closely relates to (use SDG numbers 1–17).
6. Determine if the paper's findings are constrained to a specific geographic location or region. If yes, state the location. If the findings are general or not location-specific, return "No location constraint".
7. Write a lesson: a plain-language, human-readable explanation of the research finding, describing what the study is about, what it finds, and why it matters.
8. Generate exactly 3 challenges: concrete, actionable tasks derived from the lesson, designed for individuals or communities to participate in or observe. Each challenge should be practical and inspired by the paper's findings. For each challenge, indicate whether the challenge is location-specific (only makes sense in a certain place) or can be done anywhere. If location-specific, state where.

Return ONLY valid JSON matching this exact schema — no markdown, no code fences, no extra text:

{
  "authors": "<comma-separated list of author names, or null if not found>",
  "date_published": "<publication date as found in the paper, e.g. '2023', 'March 2024', '2024-01-15', or null if not found>",
  "journal": "<journal or conference name, or null if not found>",
  "location_constraint": "<specific location/region, or 'No location constraint'>",
  "sdg_primary": <number 1-17>,
  "sdg_secondary": [<number>, ...],
  "summary": "<plain-language summary of the paper in 2-3 sentences>",
  "lesson": {
    "title": "<a readable, engaging title for the key lesson>",
    "main_summary": "<what the paper is saying, explained simply>",
    "why_it_matters": "<why this matters in the real world>"
  },
  "challenges": [
    { "title": "<short challenge name>", "description": "<what to do and how to participate>", "location": "<specific location if this challenge is location-specific, or 'Anywhere'>" },
    { "title": "<short challenge name>", "description": "<what to do and how to participate>", "location": "<specific location or 'Anywhere'>" },
    { "title": "<short challenge name>", "description": "<what to do and how to participate>", "location": "<specific location or 'Anywhere'>" }
  ]
}`;
}
