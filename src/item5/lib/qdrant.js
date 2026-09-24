import { QdrantClient } from "@qdrant/js-client-rest";
import { QDRANT_URL, QDRANT_API_KEY } from "../config.js";
import { client } from "./openai.js";

export const qdrant = new QdrantClient({
  url: QDRANT_URL,
  ...(QDRANT_API_KEY && { apiKey: QDRANT_API_KEY }),
  checkCompatibility: false,
});

export const NETFLIX_COLLECTION = "netflix";
export const PYTHON_BOOK_COLLECTION = "python-book";
export const EMBEDDING_DIM = 1536;
export const EMBEDDING_MODEL = "text-embedding-3-small";

async function embedText(text) {
  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: String(text),
  });
  return response.data[0].embedding;
}

async function searchCollection(collectionName, query, limit = 5) {
  const vector = await embedText(query);
  const hits = await qdrant.search(collectionName, {
    vector,
    limit,
    with_payload: true,
    with_vector: false,
  });

  return hits.map((hit) => ({
    score: hit.score,
    ...hit.payload,
  }));
}

export async function searchNetflix(query, limit = 5) {
  return searchCollection(NETFLIX_COLLECTION, query, limit);
}

export async function searchPythonBook(query, limit = 5) {
  return searchCollection(PYTHON_BOOK_COLLECTION, query, limit);
}