import Anthropic from "@anthropic-ai/sdk";
import config from "@/app/config";
import { GoogleGenAI } from "@google/genai";

const TOKEN_LIMIT = 50000; // ~37,500 words
const TOKEN_LIMIT_GEMINI = 1000000; // ~750,000 words

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
