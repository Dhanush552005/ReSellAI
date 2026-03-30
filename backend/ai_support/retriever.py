from __future__ import annotations

from pathlib import Path
from typing import Any, List, Dict

from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

BASE_DIR = Path(__file__).resolve().parent
FAISS_DIR = BASE_DIR / "faiss_index"

EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
TOP_K = 3

_embeddings: HuggingFaceEmbeddings | None = None
_retriever = None


def _get_retriever():
    global _embeddings, _retriever

    if _retriever is not None:
        return _retriever

    if not FAISS_DIR.exists():
        raise FileNotFoundError(
            f"FAISS index not found at {FAISS_DIR}. Please build it first."
        )

    _embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)

    vectorstore = FAISS.load_local(
        str(FAISS_DIR),
        _embeddings,
        allow_dangerous_deserialization=True,
    )

    _retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": TOP_K},
    )

    return _retriever


def get_relevant_docs(query: str) -> List[Dict[str, Any]]:

    retriever = _get_retriever()
    docs = retriever.invoke(query)

    results = []
    for d in docs:
        results.append({
            "content": d.page_content,
            "metadata": dict(d.metadata)
        })

    return results