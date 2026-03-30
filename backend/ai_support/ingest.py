from __future__ import annotations

from pathlib import Path

from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

BASE_DIR = Path(__file__).resolve().parent

POLICIES_DIR = BASE_DIR / "data" / "policies"
FAISS_DIR = BASE_DIR / "faiss_index"

CHUNK_SIZE = 500
CHUNK_OVERLAP = 100
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

def load_markdown_documents(policies_dir: Path) -> list[Document]:
    documents: list[Document] = []

    if not policies_dir.exists():
        raise FileNotFoundError(f"Policies directory not found: {policies_dir}")

    for path in sorted(policies_dir.glob("*.md")):
        text = path.read_text(encoding="utf-8")

        documents.append(
            Document(
                page_content=text,
                metadata={"source": path.name},
            )
        )

    return documents

def main() -> None:
    print(f" Loading policies from: {POLICIES_DIR}")

    documents = load_markdown_documents(POLICIES_DIR)
    print(f" Documents loaded: {len(documents)}")

    if not documents:
        print(" No .md files found. Add files under data/policies/")
        return

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
    )

    chunks = splitter.split_documents(documents)
    print(f" Chunks created: {len(chunks)}")

    print(f" Embedding model: {EMBEDDING_MODEL}")
    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)

    print(" Building FAISS index...")
    vectorstore = FAISS.from_documents(chunks, embeddings)

    FAISS_DIR.mkdir(parents=True, exist_ok=True)
    vectorstore.save_local(str(FAISS_DIR))

    print(f" FAISS index saved to: {FAISS_DIR}")


if __name__ == "__main__":
    main()