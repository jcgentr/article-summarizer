import Anthropic from "@anthropic-ai/sdk";
import config from "@/app/config";

const TOKEN_LIMIT = 50000; // ~37,500 words

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
