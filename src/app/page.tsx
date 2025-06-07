"use client";

import { useState } from "react";
import TherapyChat from "@/app/components/TherapyChat";
import CharacterCreator from "@/components/CharacterCreator";
import CharacterDisplay from "@/components/CharacterDisplay";

// Updated interface to include name, greeting
interface CharacterProfile {
  name: string;
  enhancedDescription: string;
  imageUrl: string;
  personaPrompt: string;
  greeting: string;
}

export default function Home() {
  // State to hold the created character profile
  const [characterProfile, setCharacterProfile] =
    useState<CharacterProfile | null>(null);
  // Add state for loading and errors, managed here
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handler function to receive data from CharacterCreator
  const handleCharacterCreated = (profile: CharacterProfile) => {
    console.log("Character created in page:", profile);
    setCharacterProfile(profile);
    // Error should be cleared on success via handleGenerateEnd
  };

  // Handler to go back to the creator view (used by both Display and Chat)
  const handleCloseDisplayOrGoBack = () => {
    setCharacterProfile(null);
    setError(null);
    setIsGenerating(false);
  };

  // Handlers for CharacterCreator callbacks
  const handleGenerateStart = () => {
    setIsGenerating(true);
    setError(null); // Clear previous errors on new attempt
  };

  const handleGenerateEnd = (apiError?: string) => {
    setIsGenerating(false);
    if (apiError) {
      setError(apiError); // Set error state if API returned one
    }
  };

  return (
    // Change min-h-screen to h-screen and add overflow-hidden
    <main className="h-screen p-6 md:p-10 bg-gradient-to-br from-indigo-50 via-purple-50 to-cyan-50 flex flex-col overflow-hidden">
      {/* Grid should still grow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 max-w-7xl mx-auto w-full flex-grow min-h-0">
        {/* Left Panel Column - Add min-h-0 for flex context */}
        <div className="lg:col-span-1 h-full min-h-0">
          {" "}
          {/* Ensure left panel can take full height */}
          {characterProfile ? (
            <CharacterDisplay profile={characterProfile} />
          ) : (
            <CharacterCreator
              isGenerating={isGenerating} // Pass state down
              error={error} // Pass state down
              onCharacterCreated={handleCharacterCreated}
              onGenerateStart={handleGenerateStart} // Pass handlers down
              onGenerateEnd={handleGenerateEnd} // Pass handlers down
            />
          )}
        </div>
        {/* Right Panel Column - Add min-h-0 for flex context */}
        <div className="lg:col-span-2 h-full min-h-0">
          {" "}
          {/* Ensure right panel can take full height */}
          <TherapyChat
            characterProfile={characterProfile}
            isGenerating={isGenerating && !characterProfile} // Pass generating state only when no profile exists yet
            onGoBack={handleCloseDisplayOrGoBack} // Pass the handler
          />
        </div>
      </div>
    </main>
  );
}
