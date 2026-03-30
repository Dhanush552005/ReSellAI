from __future__ import annotations

import os
import re
import requests
from dotenv import load_dotenv

from pathlib import Path

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

def call_groq(prompt: str) -> str:
    api_key = os.getenv("GROQ_API_KEY")

    url = "https://api.groq.com/openai/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {
                "role": "system",
                "content": "You are a strict mobile phone marketplace support assistant. Only answer based on given policies."
            },
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.2
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        result = response.json()

        if "choices" not in result:
            print(" Groq API Error:", result)
            return ""

        return result["choices"][0]["message"]["content"]

    except Exception as e:
        print(" Groq Exception:", e)
        return ""

def format_retrieved_for_prompt(retrieved_docs):
    docs = retrieved_docs[:2]

    parts = []
    for doc in docs:
        source = doc["metadata"].get("source", "unknown")
        content = doc["content"][:300]
        parts.append(f"Source: {source}\n{content}")

    return "\n\n".join(parts)

def is_valid_response(text: str) -> bool:
    required_sections = [
        "Classification:",
        "Clarifying Questions:",
        "Decision:",
        "Rationale:",
        "Citations:",
        "Customer Response:",
        "Next Steps:"
    ]
    return all(section in text for section in required_sections)

def estimate_confidence(ticket: str) -> float:
    t = ticket.lower()

    if any(k in t for k in ["damaged", "broken", "screen"]):
        return 0.92
    elif any(k in t for k in ["late", "delay"]):
        return 0.85
    elif any(k in t for k in ["refund", "return"]):
        return 0.88
    else:
        return 0.75

def generate_support_response(ticket: str, retrieved_docs: list, order_context: dict):

    context = format_retrieved_for_prompt(retrieved_docs)
    confidence = estimate_confidence(ticket)

    prompt = f"""
You are a STRICT AI customer support assistant for a mobile phone resale marketplace.

Your job is to resolve customer issues ONLY using the provided policy context.

-------------------------------------
 HARD CONSTRAINTS (MUST FOLLOW)
-------------------------------------
- ONLY handle mobile phone related queries (damage, delivery, refund, device issues)
- If the query is NOT related to phones, respond with:
  Decision: reject
  Customer Response: "We only handle mobile phone-related queries."
- DO NOT wrap Customer Response in quotes
- Clarifying Questions must use "-" bullet format (not numbers)
- DO NOT mention internal policy codes
- If damage occurs on delivery, prioritize approval unless policy denies
- DO NOT assume missing information
- DO NOT make up policies
- ONLY use the provided policy context
- If information is insufficient → choose: needs escalation

-------------------------------------
 DECISION RULES
-------------------------------------
- approve → clear policy support
- deny → clearly violates policy
- partial → conditional approval
- needs escalation → missing info / unclear case

-------------------------------------
 OUTPUT FORMAT (STRICT – NO DEVIATION)
-------------------------------------
You MUST return EXACTLY these sections:

Classification:
Clarifying Questions:
Decision:
Rationale:
Citations:
Customer Response:
Next Steps:

-------------------------------------
 SECTION RULES
-------------------------------------

Classification:
- Short label (e.g., "Damaged Phone", "Delivery Issue")

Clarifying Questions:
- Max 2–3 questions
- If none → write "None"

Decision:
- MUST be exactly one of:
  approve / deny / partial / needs escalation

Rationale:
- MUST reference policy reasoning
- Keep concise and factual

Citations:
- MUST include ONLY file names from provided context
- Format as bullet points:
  - file1.md
  - file2.md

Customer Response:
- MUST be written as a SUPPORT AGENT speaking to the customer
- Be polite, clear, and professional
- DO NOT speak as the customer

Next Steps:
- Actionable steps for support team
- Use bullet points

-------------------------------------
 INPUT
-------------------------------------

Ticket:
{ticket}

Order Context:
{order_context}

Policies:
{context}
"""

    result = call_groq(prompt)
    result = (result or "").strip()

    if not is_valid_response(result):
        sources = list(set([doc["metadata"].get("source", "unknown") for doc in retrieved_docs]))

        result = f"""
Classification: General Issue (confidence: {confidence})

Clarifying Questions:
None

Decision: needs escalation

Rationale:
The system could not confidently generate a policy-grounded response.

Citations:
- {sources[0] if sources else "unknown"}

Customer Response:
We’re sorry for the inconvenience. Your request is being reviewed by our support team.

Next Steps:
- Escalate to human support
"""

    else:
        result = re.sub(
            r"Classification:\s*(.*)",
            f"Classification: \\1 (confidence: {confidence})",
            result
        )

    return parse_to_json(result)

def parse_to_json(text: str) -> dict:
    pattern = r"(?m)^(Classification|Clarifying Questions|Decision|Rationale|Citations|Customer Response|Next Steps):"
    matches = list(re.finditer(pattern, text))

    sections = {}
    for i, match in enumerate(matches):
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        key = match.group(1).lower().replace(" ", "_")
        sections[key] = text[start:end].strip()

    return sections