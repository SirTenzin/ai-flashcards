'use server'

import { dbConnect } from '@/lib/db/dbConnect';
import DeckModel from '@/lib/db/models/Deck';
import { AnkiExport } from 'anki-apkg-export';
import { NextResponse } from 'next/server';

export async function createDeck({ name, description, email }: { name: string; description: string; email: string }) {
  try {
    await dbConnect();
    if (!email) {
      return { success: false, error: 'User email is required' };
    }
    const existingDeck = await DeckModel.findOne({ name, owner: email });
    if (existingDeck) {
      return { success: true, deckId: existingDeck._id.toString() };
    }
    const newDeck = new DeckModel({ name, description, cards: [], owner: email });
    await newDeck.save();
    return { success: true, deckId: newDeck._id.toString() }; // Convert deckId to string
  } catch (error) {
    console.error('Error creating deck:', error);
    return { success: false, error: 'Failed to create deck' };
  }
}

export async function fetchDecks(email: string) {
  try {
    await dbConnect();
    if (!email) {
      return { success: false, error: 'User email is required' };
    }
    const decks = await DeckModel.find({ owner: email });
    return { success: true, decks };
  } catch (error) {
    console.error('Error fetching decks:', error);
    return { success: false, error: 'Failed to fetch decks' };
  }
}

export async function fetchDeck(id: string, email: string) {
  try {
    await dbConnect();
    if (!email) {
      return { success: false, error: 'User email is required' };
    }
    const deck = await DeckModel.findOne({ _id: id, owner: email });
    if (!deck) {
      return { success: false, error: 'Deck not found' };
    }
    return { success: true, deck: JSON.parse(JSON.stringify(deck)) };
  } catch (error) {
    console.error('Error fetching deck:', error);
    return { success: false, error: 'Failed to fetch deck' };
  }
}

export async function addCard(id: string, front: string, back: string, email: string) {
  try {
    await dbConnect();
    if (!email) {
      return { success: false, error: 'User email is required' };
    }
    const updatedDeck = await DeckModel.findOneAndUpdate(
      { _id: id, owner: email },
      { $push: { cards: { front, back } } },
      { new: true }
    );
    if (!updatedDeck) {
      return { success: false, error: 'Deck not found or user not authorized' };
    }
    const newCard = updatedDeck.cards[updatedDeck.cards.length - 1];
    return { success: true, card: newCard };
  } catch (error) {
    console.error('Error adding card:', error);
    return { success: false, error: 'Failed to add card' };
  }
}

export async function addCards(deckId: string, cards: { front: string; back: string }[], userEmail: string) {
  try {
    await dbConnect();
    if (!userEmail) {
      return { success: false, error: 'User email is required' };
    }
    const deck = await DeckModel.findOneAndUpdate(
      { _id: deckId, owner: userEmail },
      { $push: { cards: { $each: cards } } },
      { new: true }
    );

    if (!deck) {
      return { success: false, error: 'Deck not found or user not authorized' };
    }

    return { success: true, cards: deck.cards };
  } catch (error) {
    console.error('Error adding cards:', error);
    return { success: false, error: 'Failed to add cards' };
  }
}

export async function generateCards(deckName: string, description: string) {
  try {
    const response = await fetch('/api/groq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deckName, description }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate cards');
    }

    const data = await response.json();
    return { success: true, cards: data.flashcards };
  } catch (error) {
    console.error('Error generating cards:', error);
    return { success: false, error: 'Failed to generate cards' };
  }
}

export async function exportDeckToAnki(deckId: string): Promise<{
  success: boolean;
  buffer?: Blob;
  headers?: {
    'Content-Type': string;
    'Content-Disposition': string;
  };
  error?: string;
}> {
  const deck = await DeckModel.findOne({ _id: deckId, include: { cards: true } });

  if (!deck) {
    return { success: false, error: 'Deck not found' };
  }

  const ankiDeck = new AnkiExport(deck.name, deck.description);

  deck.cards.forEach((card: { front: string; back: string }) => {
    ankiDeck.addNote(card.front, card.back);
  });

  const buffer = await ankiDeck.save();

  return {
    success: true,
    buffer,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${deck.name}.apkg"`,
    },
  };
}