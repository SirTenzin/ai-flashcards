import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { dbConnect } from '@/lib/db/dbConnect';
import DeckModel from '@/lib/db/models/Deck';

export async function POST(req: any, res: NextApiResponse) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const decks = await DeckModel.find({ owner: session.user.email });
    return NextResponse.json({ success: true, decks }, { status: 200 });
  } catch (error) {
    console.error('Error fetching decks:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch decks' }, { status: 500 });
  }
}