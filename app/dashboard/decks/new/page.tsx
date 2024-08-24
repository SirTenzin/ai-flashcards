'use client'

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function NewDeckPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session?.user?.email) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/decks/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      const result = await response.json();

      if (result.success && result.deckId) {
        const generatedCards = await fetch('/api/groq', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deckName: name, description }),
        }).then(res => res.json());

        if (generatedCards.flashcards) {
          await fetch(`/api/decks/${result.deckId}/addCards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cards: generatedCards.flashcards }),
          });
        }

        router.push(`/dashboard/decks/${result.deckId}`);
      } else {
        console.error(result);
      }
    } catch (error) {
      console.error('Error creating deck:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Deck</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deck Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            rows={3}
          ></textarea>
        </div>
        <button 
          type="submit" 
          className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Deck'}
        </button>
      </form>
    </div>
  );
}