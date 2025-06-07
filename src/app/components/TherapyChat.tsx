"use client";

import React, { useEffect, useRef } from "react";
import { useChat, type Message } from "ai/react";
import { SendHorizonal, Loader2, ChevronLeft } from "lucide-react";
import Image from "next/image";

interface CharacterProfile {
  name: string;
  enhancedDescription: string;
  imageUrl: string;
  personaPrompt: string;
  greeting: string;
}

interface TherapyChatProps {
  characterProfile: CharacterProfile | null;
  isGenerating: boolean;
  onGoBack: () => void;
}

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-full w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
    <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
    <p className="text-lg font-medium text-gray-700">Generating Character...</p>
    <p className="text-sm text-gray-500">
      Enhancing details and creating image...
    </p>
  </div>
);

export default function TherapyChat({
  characterProfile,
  isGenerating,
  onGoBack,
}: TherapyChatProps) {
  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat({
      api: "/api/therapy",
      body: {
        personaPrompt: characterProfile?.personaPrompt,
      },
      onError(error) {
        console.error("Chat API error:", error);
        alert("An error occurred while talking to the AI.");
      },
    });

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Effect to clear messages and add unique greeting
  useEffect(() => {
    if (characterProfile) {
      if (characterProfile.greeting && characterProfile.greeting.trim()) {
        const initialMessage: Message = {
          id: "character-greeting",
          role: "assistant",
          content: characterProfile.greeting,
        };
        setMessages([initialMessage]);
      } else {
        setMessages([]);
        console.warn(
          "Character profile missing valid greeting, starting with empty chat."
        );
      }
    }
  }, [characterProfile, setMessages]);

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (isGenerating) {
    return <LoadingSpinner />;
  }

  if (!characterProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <div className="mb-6 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="72"
            height="72"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="10" r="3" />
            <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Ready to Create?
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Design your unique character using the creator panel. Once you're
          happy, generate them and start your conversation!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center space-x-3">
        <button
          onClick={onGoBack}
          className="p-1.5 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-200 transition-colors"
          aria-label="Back to character creator"
        >
          <ChevronLeft size={22} />
        </button>
        <Image
          src={characterProfile.imageUrl}
          alt={`${characterProfile.name} Avatar`}
          width={40}
          height={40}
          className="rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
          unoptimized
        />
        <div className="flex-grow overflow-hidden">
          <p className="text-base font-semibold text-gray-900 truncate">
            Chatting with {characterProfile.name}
          </p>
          <p
            className="text-xs text-gray-500 truncate"
            title={characterProfile.enhancedDescription}
          >
            {characterProfile.enhancedDescription}
          </p>
        </div>
      </div>

      {/* Message List */}
      <div
        ref={messagesContainerRef}
        className="flex-grow space-y-4 overflow-y-auto p-6 bg-gradient-to-br from-white via-indigo-50/20 to-cyan-50/20 min-h-0"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                m.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-md"
                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {m.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <input
            className="flex-grow px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out shadow-sm hover:border-gray-400 text-sm"
            value={input}
            placeholder="Type your message..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out shadow-sm flex items-center justify-center"
            disabled={!input.trim()}
          >
            <SendHorizonal size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
