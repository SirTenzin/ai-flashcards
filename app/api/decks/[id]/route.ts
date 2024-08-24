import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { dbConnect } from '@/lib/db/dbConnect';
import DeckModel from '@/lib/db/models/Deck';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    await dbConnect();
    const result = await DeckModel.deleteOne({ _id: id, owner: session.user.email });

    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, error: 'Deck not found or user not authorized' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting deck:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete deck' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const { name, description } = await req.json();

  try {
    await dbConnect();
    const updatedDeck = await DeckModel.findOneAndUpdate(
      { _id: id, owner: session.user.email },
      { name, description },
      { new: true }
    );

    if (updatedDeck) {
      return NextResponse.json({ success: true, deck: updatedDeck }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, error: 'Deck not found or user not authorized' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating deck:', error);
    return NextResponse.json({ success: false, error: 'Failed to update deck' }, { status: 500 });
  }
}