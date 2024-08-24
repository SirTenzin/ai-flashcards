'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { fetchDeck } from '@/app/actions/deckActions';
import { Deck, Card } from '@/lib/db/models/Deck';
import { motion } from 'framer-motion';
import { exportDeckToAnki } from '@/app/actions/deckActions';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

export default function DeckPage({ params }: { params: { id: string } }) {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const { toast } = useToast();
  const id = params.id;
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    async function loadDeck() {
      if (id && session?.user?.email) {
        const result = await fetchDeck(id, session.user.email);
        if (result.success && result.deck) {
          setDeck(result.deck);
        } else {
          setError(result.error || 'Failed to load deck');
        }
      }
    }
    loadDeck();
  }, [id, session]);

  const handleAddCard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (session?.user?.email) {
      const response = await fetch(`/api/decks/${id}/addCard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ front: newCardFront, back: newCardBack })
      });

      const result = await response.json();

      if (result.success && result.card) {
        setDeck((prevDeck) =>
          prevDeck
            ? { ...prevDeck, cards: [...prevDeck.cards, result.card] }
            : null
        );
        setNewCardFront('');
        setNewCardBack('');
        fetchDeck(id, session.user.email);
        toast({
          title: 'Card added',
          description: 'Card added successfully',
        });
      } else {
        setError(result.error || 'Failed to add card');
      }
    }
  };

  const exportToAnki = async () => {
    if (!deck) return;

    try {
      const response = await exportDeckToAnki(deck._id);

      if (response.success) {
        const blob = response.buffer;
        let a;
        let url;
        if (blob) {
          // Check if blob is defined
          url = URL.createObjectURL(blob);
          a = document.createElement('a');
          a.href = url;
          a.download = `${deck.name}.apkg`;
          document.body.appendChild(a);
        }
        if (a) {
          a.click();
          document.body.removeChild(a);
          if (url) {
            URL.revokeObjectURL(url);
          }
        }
      } else {
        toast({
          title: 'Export failed',
          description: 'Failed to export deck',
        });
      }
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'An error occurred while exporting the deck',
      });
    }
  };

  const generateMoreCards = async () => {
    if (!deck || !session?.user?.email) return;
    setIsGenerating(true);

    try {
      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          deckName: deck.name,
          description: deck.description
        })
      });

      const result = await response.json();

      if (result.flashcards) {
        const addCardsResponse = await fetch(`/api/decks/${id}/addCards`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ cards: result.flashcards })
        });

        const addCardsResult = await addCardsResponse.json();

        if (addCardsResult.success) {
          setDeck((prevDeck) =>
            prevDeck
              ? {
                  ...prevDeck,
                  cards: [...prevDeck.cards, ...result.flashcards]
                }
              : null
          );
          setIsGenerating(false);
          toast({
            title: 'Cards generated',
            description: 'Cards generated successfully',
          });
        } else {
          toast({
            title: 'Failed to add generated cards',
            description: addCardsResult.error || 'Failed to add generated cards',
          });
          setIsGenerating(false);
        }
      } else {
        toast({
          title: 'Failed to generate cards',
          description: 'Failed to generate cards',
        });
        setIsGenerating(false);
      }
    } catch (error) {
      toast({
        title: 'Failed to generate cards',
        description: 'An error occurred while generating cards',
      });
      setIsGenerating(false);
    }
  };

  const FlipCard = ({ card }: { card: Card }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
      <motion.div
        className="relative h-48 w-full cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        <motion.div
          className="backface-hidden absolute h-full w-full rounded-lg bg-white p-6 shadow-md dark:bg-gray-800"
          initial={false}
          animate={{ opacity: isFlipped ? 0 : 1 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
            Front
          </h3>
          <p className="text-gray-700 dark:text-gray-300">{card.front}</p>
        </motion.div>
        <motion.div
          className="backface-hidden absolute h-full w-full rounded-lg bg-blue-100 p-6 shadow-md dark:bg-blue-900"
          initial={false}
          animate={{ opacity: isFlipped ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ transform: 'rotateY(180deg)' }}
        >
          <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
            Back
          </h3>
          <p className="text-gray-700 dark:text-gray-300">{card.back}</p>
        </motion.div>
      </motion.div>
    );
  };

  const DeckSkeleton = () => (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="mb-6 h-12 w-3/4" />
      <Skeleton className="mb-4 h-6 w-1/2" />
      <Skeleton className="mb-8 h-10 w-40" />
      <Skeleton className="mb-4 h-8 w-1/4" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} className="h-48 w-full" />
        ))}
      </div>
    </div>
  );

  if (!session) {
    return <div>Please sign in to view this deck.</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!deck) return <DeckSkeleton />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-4xl font-extrabold text-black dark:text-white">
        {deck.name}
      </h1>
      <p className="mb-4 text-lg text-gray-800 dark:text-gray-300">
        {deck.description}
      </p>
      <div className="mb-8 flex">
        <button
          onClick={exportToAnki}
          className="mr-4 rounded-lg bg-gray-800 px-6 py-3 text-white transition-colors hover:bg-gray-700"
        >
          Export to Anki
        </button>
        <button
          onClick={generateMoreCards}
          disabled={isGenerating}
          className="rounded-lg bg-gray-800 px-6 py-3 text-white transition-colors hover:bg-gray-700"
        >
          {isGenerating ? 'Generating...' : 'Generate more cards'}
        </button>
      </div>
      <h2 className="mb-4 text-3xl font-semibold text-black dark:text-white">
        Cards
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isGenerating ? (
            [...Array(6)].map((_, index) => (
              <Skeleton key={index} className="h-48 w-full" />
            ))
        ) : (
          deck.cards.map((card, index) => <FlipCard key={index} card={card} />)
        )}
      </div>
      <form onSubmit={handleAddCard} className="mt-8 max-w-md">
        <h2 className="mb-4 text-3xl font-semibold text-black dark:text-white">
          Add New Card
        </h2>
        <div className="mb-4">
          <label
            htmlFor="front"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Front
          </label>
          <input
            type="text"
            id="front"
            value={newCardFront}
            onChange={(e) => setNewCardFront(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-gray-600"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="back"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Back
          </label>
          <input
            type="text"
            id="back"
            value={newCardBack}
            onChange={(e) => setNewCardBack(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-gray-600"
            required
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-gray-800 px-6 py-3 text-white transition-colors hover:bg-gray-700"
        >
          Add Card
        </button>
      </form>
    </div>
  );
}
