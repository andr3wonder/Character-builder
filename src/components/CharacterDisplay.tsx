"use client";

import React from "react";
import Image from "next/image";

interface CharacterProfile {
  name: string;
  enhancedDescription: string;
  imageUrl: string;
  personaPrompt: string; // Keep this, might be useful later
  greeting: string; // Added greeting
}

interface CharacterDisplayProps {
  profile: CharacterProfile;
}

export default function CharacterDisplay({ profile }: CharacterDisplayProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full flex flex-col relative">
      {/* Character Image */}
      <div className="mb-4 relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md flex-shrink-0">
        {" "}
        {/* Aspect ratio for rectangle */}
        <Image
          src={profile.imageUrl}
          alt="Generated Character Image"
          fill // Use fill layout
          style={{ objectFit: "cover" }} // Cover ensures the image fills the container
          sizes="(max-width: 1024px) 100vw, 33vw" // Provide sizes hint for optimization
          priority // Prioritize loading this image as it's key content
          unoptimized // Keep if using placeholder URLs or external OpenAI URLs without loader config
        />
      </div>

      {/* Character Description - Re-added max-h */}
      <div className="flex-grow overflow-y-auto pr-2 min-h-0 max-h-64">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {profile.name}
        </h3>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">
          {/* pre-wrap preserves whitespace and newlines */}
          {profile.enhancedDescription}
        </p>
      </div>
    </div>
  );
}
