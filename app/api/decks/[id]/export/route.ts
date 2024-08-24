import { NextRequest } from 'next/server';
import { exportDeckToAnki } from '@/app/actions/deckActions';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const deckId = params.id;
  return exportDeckToAnki(deckId);
}