import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export async function generateCards(deckName: string, description: string) {
  const response = await fetch('/api/groq', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deckName, description }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate cards');
  }

  const deck = await response.json();
  console.log(deck);
  return deck;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}