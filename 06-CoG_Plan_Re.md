# CoGs Research Intelligence Engine — Manual MVP

## 1. Goal

Build a **manual, human-triggered pipeline** that translates a research paper
into structured, plain-language content using an LLM.

This system is intentionally **not automated**.
All processing is manually initiated by a human user.

---

## 2. Core Flow (Manual)

Human selects a paper  
→ pastes abstract or uploads PDF  
→ clicks "Generate"  
→ LLM produces structured JSON  
→ result is reviewed and saved  

---

## 3. Scope (Strict)

### Included
- Manual input (copy/paste abstract)
- Manual LLM trigger
- Strict JSON output
- Human review and editing
- Local or lightweight storage

### Not Included
- Auto-harvesting
- Scheduling / cron jobs
- Multilingual support
- Search / RAG
- Automatic publishing
- Impact metrics

---

## 4. Input

The system accepts:

- Paper title (optional)
- Abstract (required)

The abstract is treated as the **single source of truth**.

---

## 5. LLM Task

The LLM is prompted to output **strict JSON only**, answering:

1. What problem does the paper study?
2. What does it find or conclude?
3. Why does it matter?
4. Which SDG(s) does it relate to?

### Example Output

```json
{
  "sdg_primary": 13,
  "sdg_secondary": [11, 15],
  "summary": "Plain-language summary.",
  "lesson": {
    "title": "Readable title",
    "main_summary": "What the paper is saying, in simple terms.",
    "why_it_matters": "Why this matters in the real world."
  }
}
```

