import "dotenv/config";

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
export const QDRANT_URL = process.env.QDRANT_URL ?? "https://2c38f42f-b8d7-48ec-8ab7-bf9dd3b084ee.sa-east-1-0.aws.cloud.qdrant.io";
export const QDRANT_API_KEY = process.env.QDRANT_API_KEY;