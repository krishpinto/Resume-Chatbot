'use client';

import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import resumeData from './data/resume.json'; // Adjust the path as necessary

export default function Page() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    // Combine the user's question with the resume data to provide context
    const contextualPrompt = `
      Based on the following resume details, please answer the question:
      ${JSON.stringify(resumeData)}

      Question: ${prompt}
    `;

    const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
    try {
      const result = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: contextualPrompt,
      });
      setResponse(result.text ?? 'No response received');
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setResponse('Error getting response from AI');
    }
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Resume Q&A</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          className="border p-2 w-full"
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask a question about the resume..."
        />
        <button type="submit" className="mt-2 p-2 bg-blue-500 text-white">
          Submit
        </button>
      </form>
      <div className="whitespace-pre-wrap">
        {response || 'Awaiting response...'}
      </div>
    </main>
  );
}
