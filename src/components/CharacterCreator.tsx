"use client";

import React, { useState } from "react";

// Updated interface to include name, greeting
interface CharacterProfile {
  name: string;
  enhancedDescription: string;
  imageUrl: string;
  personaPrompt: string;
  greeting: string;
}

// Add new props for state lifting
interface CharacterCreatorProps {
  isGenerating: boolean;
  error: string | null;
  onCharacterCreated: (characterProfile: CharacterProfile) => void;
  onGenerateStart: () => void;
  onGenerateEnd: (error?: string) => void;
}

// Define SVG arrow icon for select background
const selectArrowSvg = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`;

export default function CharacterCreator({
  isGenerating, // Use prop
  error, // Use prop
  onCharacterCreated,
  onGenerateStart, // Use prop
  onGenerateEnd, // Use prop
}: CharacterCreatorProps) {
  // Local state only for form inputs
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState(""); // Initialize as empty
  const [gender, setGender] = useState(""); // Initialize as empty
  const [style, setStyle] = useState(""); // Initialize as empty

  const handleGenerateCharacter = async () => {
    onGenerateStart(); // Signal start
    let apiError: string | undefined = undefined;

    console.log("Initiating character generation with:", {
      description,
      tone,
      gender,
      style,
    });

    // --- API Call to Backend ---
    try {
      const response = await fetch("/api/character", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description, tone, gender, style }),
      });

      const result = await response.json();

      if (!response.ok) {
        apiError = result.error || `HTTP error! status: ${response.status}`;
        console.error("API Error:", apiError, result.details);
        // Don't set error state directly, pass it up via onGenerateEnd
      } else {
        // Type assertion includes name now
        const characterProfile = result as CharacterProfile;
        console.log("API Response Received:", characterProfile);
        onCharacterCreated(characterProfile); // Pass the generated character data up
      }
    } catch (err) {
      console.error("Network or other error generating character:", err);
      apiError =
        err instanceof Error
          ? err.message
          : "An unknown network error occurred.";
      // Don't set error state directly
    } finally {
      onGenerateEnd(apiError); // Signal end, pass error if any
    }
    // --- End API Call ---
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg space-y-6 border border-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">
        Create Your Character
      </h2>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-800 mb-1.5"
        >
          Describe your character:
        </label>
        <textarea
          id="description"
          rows={5}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out shadow-sm hover:border-gray-400"
          placeholder="E.g., A grumpy old wizard living in a tower, obsessed with finding a lost sock..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isGenerating}
        />
        <p className="text-xs text-gray-500 mt-1.5">
          Include details like background, appearance, personality quirks, etc.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label
            htmlFor="tone"
            className="block text-sm font-medium text-gray-800 mb-1.5"
          >
            Tone
          </label>
          <select
            id="tone"
            className={`w-full pl-3 pr-10 py-2 text-sm leading-tight border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out shadow-sm hover:border-gray-400 appearance-none bg-white bg-no-repeat bg-right px-3 ${
              !tone ? "text-gray-400" : "text-gray-900"
            }`}
            style={{
              backgroundImage: selectArrowSvg,
              backgroundPosition: "right 0.75rem center",
              backgroundSize: "1.5em 1.5em",
            }}
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            disabled={isGenerating}
            required
          >
            <option value="" disabled hidden>
              Select
            </option>
            <option>Neutral</option>
            <option>Friendly</option>
            <option>Formal</option>
            <option>Sarcastic</option>
            <option>Mysterious</option>
            <option>Grumpy</option>
            <option>Whimsical</option>
            <option>Stoic</option>
            <option>Enthusiastic</option>
            <option>Playful</option>
            <option>Melancholic</option>
            <option>Cynical</option>
            <option>Optimistic</option>
            <option>Aloof</option>
            <option>Dramatic</option>
            <option>World-weary</option>
            <option>Wise</option>
            <option>Haughty</option>
            <option>Timid</option>
            <option>Flirty</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-800 mb-1.5"
          >
            Gender
          </label>
          <select
            id="gender"
            className={`w-full pl-3 pr-10 py-2 text-sm leading-tight border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out shadow-sm hover:border-gray-400 appearance-none bg-white bg-no-repeat bg-right px-3 ${
              !gender ? "text-gray-400" : "text-gray-900"
            }`}
            style={{
              backgroundImage: selectArrowSvg,
              backgroundPosition: "right 0.75rem center",
              backgroundSize: "1.5em 1.5em",
            }}
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            disabled={isGenerating}
            required
          >
            <option value="" disabled hidden>
              Select
            </option>
            <option>Non-binary</option>
            <option>Female</option>
            <option>Male</option>
            <option>Agender</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="style"
            className="block text-sm font-medium text-gray-800 mb-1.5"
          >
            Visual Style
          </label>
          <select
            id="style"
            className={`w-full pl-3 pr-10 py-2 text-sm leading-tight border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out shadow-sm hover:border-gray-400 appearance-none bg-white bg-no-repeat bg-right px-3 ${
              !style ? "text-gray-400" : "text-gray-900"
            }`}
            style={{
              backgroundImage: selectArrowSvg,
              backgroundPosition: "right 0.75rem center",
              backgroundSize: "1.5em 1.5em",
            }}
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            disabled={isGenerating}
            required
          >
            <option value="" disabled hidden>
              Select
            </option>
            <option>Realistic</option>
            <option>Anime</option>
            <option>Cartoonish</option>
            <option>Fantasy Art</option>
            <option>Cyberpunk</option>
            <option>Steampunk</option>
            <option>Pixel Art</option>
            <option>Impressionistic</option>
            <option>Photorealistic</option>
            <option>Watercolor</option>
            <option>Oil Painting</option>
            <option>Pencil Sketch</option>
            <option>Comic Book</option>
            <option>Art Nouveau</option>
            <option>Gothic</option>
            <option>Cel Shaded</option>
            <option>Low Poly</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleGenerateCharacter}
        disabled={
          isGenerating || !description.trim() || !tone || !gender || !style
        }
        className="w-full px-5 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-in-out shadow-md disabled:shadow-none"
      >
        {isGenerating ? "Generating..." : "Generate Character"}
      </button>

      {error && <p className="text-sm text-red-600 pt-2">{error}</p>}
    </div>
  );
}
