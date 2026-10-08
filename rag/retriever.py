"""
========================================================================================
RAG RETRIEVER & DISASTER COPILOT QUERY ENGINE
Semantically grounds user inquiries with official statutory NDMA/TSDMP documents.
========================================================================================
"""

from typing import List, Dict, Any
from rag.knowledge_base import STATUTORY_DOCUMENTS

class DisasterRagRetriever:
    def __init__(self):
        self.documents = STATUTORY_DOCUMENTS

    STOPWORDS = {"what", "is", "the", "of", "for", "in", "to", "a", "an", "and", "or", "how", "why"}

    def query(self, user_prompt: str, top_k: int = 2) -> Dict[str, Any]:
        """
        Retrieves top relevant statutory guidelines and synthesizes grounded response.
        """
        raw_tokens = user_prompt.lower().replace("?", "").replace(".", "").replace(",", "").split()
        tokens = {t for t in raw_tokens if t not in self.STOPWORDS and len(t) > 2}

        scored_docs = []
        for doc in self.documents:
            score = 0
            # Keyword matching score with whole words
            for kw in doc["keywords"]:
                if kw in tokens:
                    score += 4
            for token in tokens:
                if token in doc["text"].lower().split():
                    score += 1
            if score >= 3: # Minimum relevance threshold
                scored_docs.append((score, doc))

        scored_docs.sort(key=lambda x: x[0], reverse=True)

        if not scored_docs:
            return {
                "answer": "Information not found in the indexed statutory knowledge base. Please consult the State Disaster Management Commissioner directly.",
                "citations": [],
                "grounded": False
            }

        top_docs = [doc for _, doc in scored_docs[:top_k]]
        citations = [d["citation"] for d in top_docs]

        # Synthesize executive answer
        lead_doc = top_docs[0]
        answer_text = (
            f"According to statutory guidelines ({lead_doc['citation']}):\n\n"
            f"{lead_doc['text']}\n\n"
            f"Authorized emergency response personnel are instructed to execute these directives immediately."
        )

        return {
            "answer": answer_text,
            "citations": citations,
            "grounded": True,
            "retrieved_documents": top_docs
        }
