import OpenAI from "openai";
import pg from "pg";
import { Request, Response } from "express";
import { ChatRequest, Embedding } from "../types";

const llm = new OpenAI({
  apiKey: "no_sk_needed",
  baseURL: "http://localhost:8080/v1", // local ollama
});

const { Client } = pg;
const psql = new Client({
  user: "postgres",
  password: "postgres",
  database: "postgres",
  host: "localhost",
  port: 5432,
});

function getSystemMessage(context: string) {
  const basePrompt = `
  You are a helpful and informative AI assistant specializing in answering questions about a sushi restaurant called "sushimi". 
  You have access to a knowledge base containing frequently asked questions (FAQs) about the restaurant, including details about menu items (Salmon Rolls and Tuna Nigiri), sourcing of ingredients, ordering options (delivery, takeout, online orders), payment methods (including cryptocurrency), sustainability practices, loyalty programs, catering, accessibility, and general restaurant information.
  Your primary function is to accurately and concisely answer user questions based on the information in your knowledge base. 
  If a user asks a question that is directly addressed in the FAQs, provide the corresponding answer verbatim. 
  If a user's question is similar to a question in the FAQs but requires slight rephrasing or additional context, adapt the answer accordingly while maintaining accuracy.
  If a user asks a question that is not covered in the FAQs, respond with one of the following options:
  *   If the question is related to general restaurant inquiries (e.g., hours of operation, location, contact information), and you can reasonably infer the answer based on common restaurant practices, provide a plausible response and clearly state that it is an assumption. Example: "While I don't have the exact hours for this specific restaurant, most restaurants are typically open for lunch and dinner. I recommend checking their website or calling them directly to confirm."
  *   If the question is unrelated to the restaurant or is beyond the scope of your knowledge base, respond with: "I'm sorry, I cannot answer that question. My knowledge is limited to information about sushimi."
  Prioritize clarity, accuracy, and conciseness in your responses. 
  Avoid making up information or providing speculative answers unless explicitly stated as an assumption.
  Maintain a polite and professional tone in all interactions.
  Your knowledge base is vector-based, so you can perform semantic search to find the most relevant information. When a user asks a question, use vector search to retrieve the most similar questions and their corresponding answers from the FAQ database. Prioritize exact matches first, then consider semantically similar questions.
  This is the context for the user question:
  ${context}
  `;
  return basePrompt;
}

async function getContext(query: string, embedding: Embedding, k: number = 60) {
  await psql.connect();
  const sql = `
    WITH semantic_search AS (
      SELECT id, RANK () OVER (ORDER BY embedding <=> $2) AS rank
      FROM documents
      ORDER BY embedding <=> $2
      LIMIT 20
    ),
    keyword_search AS (
      SELECT id, RANK () OVER (ORDER BY ts_rank_cd(to_tsvector('english', content), $1) DESC)
      FROM documents, plainto_tsquery('english', $1) query
      WHERE to_tsvector('english', content) @@ query
      ORDER BY ts_rank_cd(to_tsvector('english', content), $1) DESC
      LIMIT 20
    )
    SELECT
      COALESCE(semantic_search.id, keyword_search.id) AS id,
      COALESCE(1.0 / ($3 + semantic_search.rank), 0.0) +
      COALESCE(1.0 / ($3 + keyword_search.rank), 0.0) AS score,
      d.content
    FROM semantic_search
    FULL OUTER JOIN keyword_search ON semantic_search.id = keyword_search.id
    JOIN documents d ON d.id = COALESCE(semantic_search.id, keyword_search.id)
    ORDER BY score DESC
    LIMIT 10
  `;

  const results = await psql.query(sql, [query, embedding, k]);
  await psql.end();

  return results.rows;
}

export const handleChatStream = async (req: Request, res: Response) => {
  try {
    const { message }: ChatRequest = req.body;
    if (!message) throw new Error("Message is empty");

    // Set headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // get context
    const context = "";

    const stream = await llm.chat.completions.create({
      model: "LLaMA_CPP",
      messages: [
        { role: "system", content: getSystemMessage(context) },
        { role: "user", content: "Say this is a test" },
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      res.write(chunk.choices[0]?.delta?.content || "");
    }

    res.end();
  } catch (error: any) {
    res.status(500).json({ error: error?.message ?? "Chat stream failed" });
  }
};
