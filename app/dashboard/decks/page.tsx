'use client'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { fetchDecks } from '@/app/actions/deckActions';
import { Deck } from '@/lib/db/models/Deck';
import { Skeleton } from "@/components/ui/skeleton";
import { HoverEffect } from "@/components/ui/card-hover-effect";

export default function DecksPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    async function loadDecks() {
      setIsLoading(true);
      if (session?.user?.email) {
        const response = await fetch('/api/decks/list');
        const result = await response.json();
        if (result.success && result.decks) {
          setDecks(result.decks);
        } else {
          console.error(result.error);
        }
      }
      setIsLoading(false);
    }
    loadDecks();
  }, [session]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (decks.length === 0) {
    return <div className="container mx-auto px-4 py-8">No decks found.</div>;
  }

  const deckItems = decks.map(deck => ({
    title: deck.name,
    description: deck.description || 'No description',
    link: `/dashboard/decks/${deck._id}`
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Decks</h1>
      <HoverEffect items={deckItems} />
    </div>
  );
}