import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { dbConnect } from '@/lib/db/dbConnect';
import DeckModel from '@/lib/db/models/Deck';

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method !== 'POST') {
    return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
  }

  const id = req.nextUrl.pathname.split('/')[3];
  const { front, back } = await req.json();
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const updatedDeck = await DeckModel.findOneAndUpdate(
      { _id: id, owner: session.user.email },
      { $push: { cards: { front, back } } },
      { new: true }
    );
    if (!updatedDeck) {
      return NextResponse.json({ success: false, error: 'Deck not found or user not authorized' }, { status: 404 });
    }
    const newCard = updatedDeck.cards[updatedDeck.cards.length - 1];
    return NextResponse.json({ success: true, card: newCard }, { status: 200 });
  } catch (error) {
    console.error('Error adding card:', error);
    return NextResponse.json({ success: false, error: 'Failed to add card' }, { status: 500 });
  }
}