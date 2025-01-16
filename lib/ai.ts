import Anthropic from "@anthropic-ai/sdk";
import Groq from "groq-sdk";
import config from "@/app/config";

const TOKEN_LIMIT = 50000; // ~37,500 words

function createMessageText(content: string) {
  return `Please provide a concise summary of this article:

  ${content}

  Also, provide 3-5 relevant topics/tags that this article would fall under.
  Output the response in JSON format. Follow this schema:

  | Column     | Type     | Description          |
  | ---------- | -------- | -------------------- |
  | summary    | text     | AI-generated summary |
  | tags       | string[] | Article categories   |

  Here is an example of the output:
  {
      "summary": "This article discusses the impact of artificial intelligence on modern healthcare, focusing on recent breakthroughs in diagnostic imaging and personalized medicine. It explores how machine learning algorithms are improving early disease detection and treatment planning while addressing concerns about data privacy and the doctor-patient relationship.",
      "tags": ["artificial intelligence", "healthcare", "medical technology", "machine learning"]
  }
  `;
}

export async function generateSummaryAndTags(
  content: string,
  wordCount: number,
  provider: "anthropic" | "groq" = "anthropic"
) {
  // Rough token estimation (1 token ≈ 0.75 words)
  const estimatedTokens = Math.ceil(wordCount / 0.75);

  if (estimatedTokens > TOKEN_LIMIT) {
    throw new Error(
      `Content is too long (estimated ${estimatedTokens} tokens). Maximum allowed is ${TOKEN_LIMIT} tokens.`
    );
  }

  const messageText = createMessageText(content);

  try {
    let responseText: string = "";

    if (provider === "groq") {
      console.log("GROQ...");
      const groq = new Groq({
        apiKey: config.groqApiKey,
      });

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a professional summarizer. Provide clear, concise summaries while maintaining key information.",
          },
          {
            role: "user",
            content: messageText,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0,
        max_tokens: 500,
        response_format: { type: "json_object" },
      });

      responseText = chatCompletion.choices[0]?.message?.content ?? "";
    } else {
      console.log("CLAUDE HAIKU...");
      const client = new Anthropic({
        apiKey: config.anthropicApiKey,
      });

      const message = await client.messages.create({
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

      responseText =
        message.content[0].type === "text" ? message.content[0].text : "";
    }
    console.log({ responseText, type: typeof responseText });
    const responseData = JSON.parse(responseText);

    return {
      summary: responseData.summary,
      tags: Array.isArray(responseData.tags)
        ? responseData.tags.join(",")
        : responseData.tags,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error generating summary: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating summary");
  }
}
