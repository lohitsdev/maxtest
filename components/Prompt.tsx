"use client";

import React, { useState } from 'react';
import { Button } from './ui/button';
import { useVoice } from "@humeai/voice-react";
import { toast } from "sonner";

interface PromptProps {
  onSubmit: (prompt: string) => void;
}

export default function Prompt({ onSubmit }: PromptProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { status, sendUserInput } = useVoice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      // Submit to parent component for state management
      onSubmit(prompt);
      
      // If connected to voice, send the prompt to Hume AI
      if (status.value === "connected") {
        await sendUserInput(prompt);
      } else {
        // If not connected, just log the prompt
        console.log("Not connected to Hume voice. Prompt:", prompt);
        toast.info("Voice not connected. Your prompt was saved but not sent to Hume AI.");
      }
      
      // Clear the input field
      setPrompt('');
    } catch (error) {
      console.error("Error sending prompt:", error);
      toast.error("Failed to send prompt");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 mb-4">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt for Hume AI..."
        className="flex-grow p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading || !prompt.trim()}>
        {isLoading ? "Sending..." : "Submit"}
      </Button>
    </form>
  );
}
