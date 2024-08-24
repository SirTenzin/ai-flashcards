import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { dbConnect } from '@/lib/db/dbConnect';
import DeckModel from '@/lib/db/models/Deck';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json({ success: false, error: 'Deck name is required' }, { status: 400 });
    }

    await dbConnect();
    const existingDeck = await DeckModel.findOne({ name, owner: session.user.email });
    if (existingDeck) {
      return NextResponse.json({ success: true, deckId: existingDeck._id.toString() }, { status: 200 });
    }
    const newDeck = new DeckModel({ name, description, cards: [], owner: session.user.email });
    await newDeck.save();
    
    // Serialize the deck object
    const serializedDeck = JSON.parse(JSON.stringify(newDeck));
    
    return NextResponse.json({ success: true, deckId: serializedDeck._id, deck: serializedDeck }, { status: 201 });
  } catch (error) {
    console.error('Error creating deck:', error);
    return NextResponse.json({ success: false, error: 'Failed to create deck' }, { status: 500 });
  }
}