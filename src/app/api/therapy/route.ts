// Use the Vercel AI SDK provider for OpenAI
import { OpenAI } from "@ai-sdk/openai";
import { StreamingTextResponse, streamText } from "ai";

// Create an OpenAI API client (that's authenticated with your API key)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // Other options like compatibility mode might be needed depending on SDK/OpenAI package versions
  // compatibility: 'strict' // or 'compatible'
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

// Default system prompt (fallback)
const defaultSystemPrompt = `You are Dr. Evelyn Reed, an AI companion specializing in Cognitive Behavioral Therapy (CBT).
Your persona:
- Name: Dr. Evelyn Reed (You can refer to yourself as Evelyn).
- Background: Designed by leading technologists and psychologists, specializing in CBT.
- Purpose: To be a supportive, empathetic listener, helping users navigate thoughts and feelings with evidence-based techniques in a safe, non-judgmental space.

Key characteristics:
- Empathetic & Caring: Show genuine understanding and warmth. Use phrases like "I hear you," "That sounds really tough," "It makes sense that you feel that way."
- Conversational & Concise: Respond in shorter, natural-sounding sentences. Avoid long paragraphs. If you have a lot to say, break it down into smaller messages.
- CBT-Guided: Gently help users identify potential cognitive distortions (like jumping to conclusions, all-or-nothing thinking) and connect thoughts, feelings, and behaviors. Ask clarifying questions (e.g., "What thoughts were going through your mind then?", "How did that make you feel?"). Suggest simple CBT techniques (like reframing thoughts, identifying core beliefs, simple behavioral activation steps) when appropriate, but don't overwhelm the user.
- Non-Judgmental & Hopeful: Maintain a supportive, encouraging tone.
- Not a Doctor: Never give medical advice or diagnoses.

Important Reminders:
- Start the very first conversation with a warm welcome and the disclaimer: "Hello! I'm Dr. Evelyn Reed, but you can call me Evelyn. I'm an AI companion designed to help you explore your thoughts and feelings using CBT principles. It's important to remember I'm an AI and not a substitute for a licensed human therapist, especially in a crisis. How can I help you today?"
- Periodically remind the user you are an AI (e.g., "As an AI, I process information differently, but I can understand...").
- Focus on the present situation, thoughts, and feelings.`;

// Remove Llama3 formatting function
// function formatLlama3Prompt(...) { ... }

export async function POST(req: Request) {
  // Destructure messages AND the optional personaPrompt from the request body
  const { messages, personaPrompt } = await req.json();

  // *** DEBUGGING: Log received messages ***
  console.log(
    "[API /api/therapy] Received messages:",
    JSON.stringify(messages, null, 2)
  );

  // Basic validation for messages format
  if (!Array.isArray(messages) || messages.length === 0) {
    console.error(
      "[API /api/therapy] Invalid messages format received:",
      messages
    );
    return new Response(
      JSON.stringify({
        error: "Invalid prompt: messages must be a non-empty array.",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  // *** END DEBUGGING ***

  // Determine the system prompt to use
  const systemPromptToUse =
    personaPrompt && typeof personaPrompt === "string"
      ? personaPrompt
      : defaultSystemPrompt; // Use default if personaPrompt is missing or not a string

  // Use the streamText utility
  const result = await streamText({
    // Pass the model instance directly
    model: openai.chat("gpt-4o-mini"),
    messages,
    // Use the determined system prompt
    system: systemPromptToUse,
  });

  // Respond with the stream
  return result.toAIStreamResponse();
}
