from __future__ import annotations

from typing import Any, Dict

from .retriever import get_relevant_docs
from .generator import generate_support_response

def is_phone_related(query: str) -> bool:
    phone_keywords = [
        "phone", "mobile", "screen", "battery", "charger",
        "display", "device", "smartphone", "iphone", "android"
    ]

    query = query.lower()
    return any(word in query for word in phone_keywords)

_TRIAGE_RULES = (
    (("damaged", "broken", "cracked", "defective"), "damage"),
    (("refund", "return", "money back"), "refund"),
    (("cancel", "cancellation"), "cancellation"),
    (("late", "delay", "delivery", "not arrived"), "shipping"),
    (("payment", "charged", "billing"), "payment"),
)


def triage_agent(ticket: str) -> str:
    t = ticket.lower()
    for keywords, label in _TRIAGE_RULES:
        if any(k in t for k in keywords):
            return label
    return "other"

def retriever_agent(query: str) -> list[Dict[str, Any]]:
    return get_relevant_docs(query)

def resolution_agent(
    ticket: str,
    retrieved_docs: list[Dict[str, Any]],
    order_context: dict
) -> dict:
    return generate_support_response(ticket, retrieved_docs, order_context)

def compliance_agent(response: dict) -> dict:
    if not response:
        return {
            "decision": "needs escalation",
            "customer_response": "System error occurred. Please contact support.",
            "next_steps": ["Escalate to human agent"]
        }

    required_keys = [
        "classification",
        "decision",
        "customer_response"
    ]

    missing = [k for k in required_keys if k not in response]

    if missing:
        return {
            "decision": "needs escalation",
            "customer_response": "Incomplete response generated. Escalating to support.",
            "next_steps": ["Manual review required"]
        }

    return response

def run_support_pipeline(ticket: str, order_context: dict) -> dict:

    if not is_phone_related(ticket):
        return {
            "classification": "invalid_query",
            "decision": "reject",
            "customer_response": "Sorry, we only handle queries related to mobile phones listed on our platform.",
            "next_steps": []
        }

    issue_type = triage_agent(ticket)

    retrieved_docs = retriever_agent(ticket)

    response = resolution_agent(ticket, retrieved_docs, order_context)

    final_response = compliance_agent(response)

    final_response["issue_type"] = issue_type

    return final_response