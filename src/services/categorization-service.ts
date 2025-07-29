import { env } from "@/config/env";

export interface Transaction {
  id: string;
  description: string;
}

export interface CategorizedTransaction {
  id: string;
  description: string;
  category: string;
  confidence: number;
}

export interface CategoryPrediction {
  category: string;
  confidence: number;
}

const OPENAI_API_KEY = env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY is not set. Category determination will not work.");
}

export async function categorizeTransactions(
  transactions: Transaction[],
  categories: string[]
): Promise<CategorizedTransaction[]> {
  if (!OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY is not set. Using fallback categorization.");
    // Fallback to "Інше" category if API key is not available
    return transactions.map((transaction) => ({
      id: transaction.id,
      description: transaction.description,
      category: "Інше",
      confidence: 0,
    }));
  }

  if (transactions.length === 0) {
    return [];
  }

  try {
    // Process all transactions at once (limited to 10 by client)
    return await categorizeBatch(transactions, categories);
  } catch (error) {
    console.error("Error categorizing transactions:", error);
    // Fallback to "Інше" category on error
    return transactions.map((transaction) => ({
      id: transaction.id,
      description: transaction.description,
      category: "Інше",
      confidence: 0,
    }));
  }
}

async function categorizeBatch(
  transactions: Transaction[],
  categories: string[]
): Promise<CategorizedTransaction[]> {
  const descriptions = transactions.map((t) => t.description);

  const prompt = createCategorizationPrompt(descriptions, categories);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a financial categorization expert. Analyze transaction descriptions and assign them to the most appropriate category with confidence scores.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 2000,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No response content from OpenAI API");
    }

    return parseCategorizationResponse(transactions, content);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout - categorization took too long");
    }
    throw error;
  }
}

function createCategorizationPrompt(descriptions: string[], categories: string[]): string {
  const categoryList = categories.map((cat) => `- ${cat}`).join("\n");

  return `Please categorize the following transaction descriptions into the most appropriate category from the list below.

Available categories:
${categoryList}

For each transaction, provide:
1. The most appropriate category name (exactly as listed above)
2. A confidence score between 0 and 1 (where 1 is 100% confident)

If a transaction doesn't clearly fit any category or confidence is below 0.8, use "Інше" category.

Transaction descriptions:
${descriptions.map((desc, index) => `${index + 1}. ${desc}`).join("\n")}

Please respond in the following JSON format:
[
  {
    "index": 1,
    "category": "Category Name",
    "confidence": 0.95
  },
  ...
]

Only return valid JSON, no additional text.`;
}

function parseCategorizationResponse(
  transactions: Transaction[],
  response: string
): CategorizedTransaction[] {
  try {
    // Clean the response to extract JSON
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No JSON array found in response");
    }

    const predictions = JSON.parse(jsonMatch[0]) as Array<{
      index: number;
      category: string;
      confidence: number;
    }>;

    return transactions.map((transaction, index) => {
      const prediction = predictions.find((p) => p.index === index + 1);

      if (!prediction || prediction.confidence < 0.8) {
        return {
          id: transaction.id,
          description: transaction.description,
          category: "Інше",
          confidence: 0,
        };
      }

      return {
        id: transaction.id,
        description: transaction.description,
        category: prediction.category,
        confidence: prediction.confidence,
      };
    });
  } catch (error) {
    console.error("Error parsing categorization response:", error);
    // Fallback to "Інше" category
    return transactions.map((transaction) => ({
      id: transaction.id,
      description: transaction.description,
      category: "Інше",
      confidence: 0,
    }));
  }
}
