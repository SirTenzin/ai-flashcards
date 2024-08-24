import { NextResponse } from 'next/server';
import Instructor from '@instructor-ai/instructor';
import { z } from 'zod';
import Groq from 'groq-sdk';

const FlashcardsSchema = z.object({
  flashcards: z.array(z.object({
    front: z.string(),
    back: z.string(),
  })),
});

const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

const client = Instructor({
  client: groqClient,
  mode: "FUNCTIONS",
});

export async function POST(req: Request) {
  try {
    const { deckName, description } = await req.json();

    const prompt = `Generate 5 flashcards for a deck named "${deckName}" with the description "${description}". Each flashcard should have a front and back. The front should be written in a way to test the user. The front should be a question or a prompt and the back should be the answer to what they should be memorising/remembering`;

    const generatedCards = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'mixtral-8x7b-32768',
      response_model: { schema: FlashcardsSchema, name: 'flashcards' },
    });

    return NextResponse.json({ flashcards: generatedCards.flashcards });
  } catch (error) {
    console.error('Error generating cards:', error);
    return NextResponse.json({ error: 'Failed to generate cards' }, { status: 500 });
  }
}