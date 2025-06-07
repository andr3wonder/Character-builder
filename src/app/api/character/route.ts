import OpenAI from "openai";
import { NextResponse } from "next/server";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge"; // Use edge runtime for potentially faster responses and KV access

// Define the expected request body structure
interface CharacterRequestBody {
  description: string;
  tone: string;
  gender: string;
  style: string;
}

export async function POST(req: Request) {
  try {
    const body: CharacterRequestBody = await req.json();
    const { description, tone, gender, style } = body;

    // Basic validation
    if (!description || !tone || !gender || !style) {
      return NextResponse.json(
        { error: "Missing required fields in request body" },
        { status: 400 }
      );
    }

    // --- 1. Enhance Description, Generate/Extract Name, AND Generate Greeting ---
    const combinedPrompt = `Based on the following user input, generate:
1. A suitable first name for the character. IMPORTANT: If the user's description clearly specifies a character's name (e.g., "Scarlett Johansson, the actress...", "My character, Bob the Builder...", "This is Clark Kent..."), use THAT name directly. Otherwise, generate a fitting first name based on the overall description.
2. A more detailed and engaging character description suitable for storytelling and image generation. CRITICAL: Start with the user's original description details (personality, background, quirks) and weave them naturally into an expanded description. Enhance these core traits with vivid details, sensory language, and integrate the visual style and tone. Ensure the final description reflects the user's core ideas about the character's personality and backstory, balanced with appealing visual elements.
3. A short (1-2 sentences), engaging, in-character greeting message that this character would say when first meeting someone in a chat context. This greeting should reflect the character's generated name, personality, tone, and description.

User Input:
Description: "${description}"
Tone: ${tone}
Gender Presentation: ${gender}
Style: ${style}

Respond ONLY with a JSON object containing three keys: "name" (string), "enhancedDescription" (string), and "greeting" (string). Example: {"name": "Eleanor", "enhancedDescription": "...detailed description incorporating user input...", "greeting": "Well hello there. Care for a spot of tea?"}
`;

    const combinedResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a creative assistant skilled at enhancing character descriptions, generating/extracting suitable names, and creating in-character greetings. Prioritize incorporating the user's original personality/background details into the enhanced description. Respond only with the requested JSON object.",
        },
        { role: "user", content: combinedPrompt },
      ],
      max_tokens: 450,
      temperature: 0.8,
      response_format: { type: "json_object" },
    });

    const combinedResponseJson = JSON.parse(
      combinedResponse.choices[0]?.message?.content?.trim() || "{}"
    );

    // Destructure with defaults and check for valid types
    const name =
      typeof combinedResponseJson.name === "string" &&
      combinedResponseJson.name.trim()
        ? combinedResponseJson.name.trim()
        : "Character";

    const enhancedDescription =
      typeof combinedResponseJson.enhancedDescription === "string" &&
      combinedResponseJson.enhancedDescription.trim()
        ? combinedResponseJson.enhancedDescription.trim()
        : null;

    // Ensure greeting is always a non-empty string
    let greeting =
      typeof combinedResponseJson.greeting === "string" &&
      combinedResponseJson.greeting.trim()
        ? combinedResponseJson.greeting.trim()
        : `Hello! I'm ${name}. Ready to chat.`; // Default if missing, empty, or invalid type

    // If the resulting greeting is somehow still empty (e.g., AI returned only whitespace), use a hardcoded default.
    if (!greeting) {
      console.warn(
        "API Warning: Greeting became empty after processing, using hardcoded default."
      );
      greeting = "Hello there! Let's chat.";
    }

    // Throw error if essential description is missing
    if (!enhancedDescription) {
      console.error(
        "API Error: Failed to extract valid enhancedDescription from AI response:",
        combinedResponseJson
      );
      throw new Error("Failed to generate valid character description");
    }

    // --- 2. Generate Image using DALL-E --- (Using openai package directly)
    // Construct a prompt for DALL-E, incorporating the style
    const imagePrompt = `Create an image of a character based on this description: "${enhancedDescription}". The visual style should be: ${style}. Focus on the character's appearance and setting implied by the description.`;

    // Note: Ensure your OpenAI plan supports the desired DALL-E model (e.g., dall-e-3)
    const imageResponse = await openai.images.generate({
      model: "dall-e-3", // Or "dall-e-2" if needed
      prompt: imagePrompt,
      n: 1, // Generate one image
      size: "1024x1024", // Or other supported sizes like "1024x1792", "1792x1024"
      quality: "standard", // or "hd"
      // style: style === 'Realistic' ? 'natural' : 'vivid', // DALL-E 3 specific style guidance
    });

    const imageUrl = imageResponse.data[0]?.url;

    if (!imageUrl) {
      throw new Error("Failed to generate image");
    }

    // --- 3. Construct Persona Prompt for Chat --- (Similar to the therapy one, but dynamic)
    const personaPrompt = `You are the character described below. Respond to the user, embodying this persona consistently in your tone, style, and decisions. Refer to the details of your background, appearance, and personality when relevant.

Character Description:
${enhancedDescription}

Key Instructions:
- Maintain a ${tone} tone.
- Your gender presentation is ${gender}.
- Respond naturally based on the character traits described above.
- Do not break character.
- Keep responses relatively concise unless the situation calls for more detail.`;

    // --- 4. Return Response --- (Includes greeting now)
    return NextResponse.json({
      name,
      enhancedDescription,
      imageUrl,
      personaPrompt,
      greeting,
    });
  } catch (error) {
    console.error("Error in /api/character:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Failed to generate character.", details: errorMessage },
      { status: 500 }
    );
  }
}
