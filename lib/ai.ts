import Anthropic from "@anthropic-ai/sdk";
import config from "@/app/config";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import { Groq } from "groq-sdk";

const TOKEN_LIMIT = 50000; // ~37,500 words
const TOKEN_LIMIT_GEMINI = 1000000; // ~750,000 words
const TOKEN_LIMIT_GPT = 300000;
const TOKEN_LIMIT_GROQ = 100000;

export async function generateSummary(content: string, wordCount: number) {
  // Rough token estimation (1 token ≈ 0.75 words)
  const estimatedTokens = Math.ceil(wordCount / 0.75);

  if (estimatedTokens > TOKEN_LIMIT) {
    throw new Error(
      `Content is too long (estimated ${estimatedTokens} tokens). Maximum allowed is ${TOKEN_LIMIT} tokens.`
    );
  }

  const client = new Anthropic({
    apiKey: config.anthropicApiKey,
  });

  const messageText = `Please provide a concise summary of this article:

  ${content}

  Output the response in JSON format. Follow this schema:

  | Column     | Type     | Description          |
  | ---------- | -------- | -------------------- |
  | summary    | text     | AI-generated summary |

  Here is an example of the output:
  {
      "summary": "This article discusses the impact of artificial intelligence on modern healthcare, focusing on recent breakthroughs in diagnostic imaging and personalized medicine. It explores how machine learning algorithms are improving early disease detection and treatment planning while addressing concerns about data privacy and the doctor-patient relationship.",
  }
  `;

  try {
    const message = await client.messages.create({
      // model: "claude-3-5-sonnet-20241022",
      model: "claude-3-5-haiku-20241022",
      max_tokens: 500,
      temperature: 0,
      system:
        "You are a professional summarizer. Provide clear, concise summaries while maintaining key information.",
      messages: [
        {
          role: "user",
          content: messageText,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";
    const responseData = JSON.parse(responseText);

    // Create and return summary object
    const result = {
      summary: responseData.summary,
    };

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error generating summary: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating summary");
  }
}

export async function generateSummaryGemini(
  content: string,
  wordCount: number
) {
  // Rough token estimation (1 token ≈ 0.75 words)
  const estimatedTokens = Math.ceil(wordCount / 0.75);

  if (estimatedTokens > TOKEN_LIMIT_GEMINI) {
    throw new Error(
      `Content is too long (estimated ${estimatedTokens} tokens). Maximum allowed is ${TOKEN_LIMIT} tokens.`
    );
  }

  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const messageText = `Please provide a concise summary of this article: ${content}`;

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: messageText,
      config: {
        systemInstruction:
          "You are a professional summarizer. Provide clear, concise summaries while maintaining key information.",
        maxOutputTokens: 500,
        temperature: 0,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response text received from Gemini");
    }
    console.log(responseText);

    // Create and return summary object
    const result = {
      summary: responseText,
    };

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error generating summary: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating summary");
  }
}

export async function generateSummaryGpt(content: string, wordCount: number) {
  // Rough token estimation (1 token ≈ 0.75 words)
  const estimatedTokens = Math.ceil(wordCount / 0.75);

  if (estimatedTokens > TOKEN_LIMIT_GPT) {
    throw new Error(
      `Content is too long (estimated ${estimatedTokens} tokens). Maximum allowed is ${TOKEN_LIMIT_GPT} tokens.`
    );
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const messageText = `Please provide a concise summary of this article: ${content}. Limit the summary to one paragraph with 3-4 sentences.`;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "system",
          content:
            "You are a professional summarizer. Provide clear, concise summaries while maintaining key information. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: messageText,
        },
      ],
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error("No response text received from OpenAI");
    }

    const responseData = JSON.parse(responseText);

    const result = {
      summary: responseData.summary,
    };

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error generating summary: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating summary");
  }
}

export async function generateSummaryGroq(content: string, wordCount: number) {
  // Rough token estimation (1 token ≈ 0.75 words)
  const estimatedTokens = Math.ceil(wordCount / 0.75);

  if (estimatedTokens > TOKEN_LIMIT_GROQ) {
    throw new Error(
      `Content is too long (estimated ${estimatedTokens} tokens). Maximum allowed is ${TOKEN_LIMIT_GROQ} tokens.`
    );
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const messageText = `Please provide a concise summary of this article: ${content}. 
  
    Output the response in JSON format. Follow this schema:

  | Column     | Type     | Description          |
  | ---------- | -------- | -------------------- |
  | summary    | text     | AI-generated summary |

  Here is an example of the output:
  {
      "summary": "This article discusses the impact of artificial intelligence on modern healthcare, focusing on recent breakthroughs in diagnostic imaging and personalized medicine. It explores how machine learning algorithms are improving early disease detection and treatment planning while addressing concerns about data privacy and the doctor-patient relationship.",
  }

  Limit the summary to one paragraph with 3-4 sentences or shorter if appropriate. 
  Extract the most important information from the article.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a professional summarizer. Provide clear, concise summaries while maintaining key information. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: messageText,
        },
      ],
      model: "openai/gpt-oss-20b",
    });

    const responseText = chatCompletion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error("No response text received from Groq");
    }

    console.log(responseText);

    const responseData = JSON.parse(responseText);

    console.log(responseData);

    const result = {
      summary: responseData.summary,
    };

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error generating summary: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating summary");
  }
}

export interface ModelBenchmarkResult {
  model: string;
  duration: number; // in milliseconds
  success: boolean;
  error?: string;
  summary?: string;
}

export async function benchmarkAllModels(
  content: string,
  wordCount: number
): Promise<ModelBenchmarkResult[]> {
  const results: ModelBenchmarkResult[] = [];
  const models = [
    { name: "Claude (Haiku)", fn: generateSummary },
    { name: "Gemini", fn: generateSummaryGemini },
    { name: "GPT", fn: generateSummaryGpt },
    { name: "Groq", fn: generateSummaryGroq },
  ];

  for (const { name, fn } of models) {
    const startTime = performance.now();
    try {
      const result = await fn(content, wordCount);
      const endTime = performance.now();
      const duration = endTime - startTime;

      results.push({
        model: name,
        duration,
        success: true,
        summary: result.summary,
      });
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;

      results.push({
        model: name,
        duration,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return results;
}
