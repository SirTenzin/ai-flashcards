import mongoose from 'mongoose';

// Define the Card interface
interface Card {
  front: string;
  back: string;
}

// Define the Deck interface
interface Deck {
  _id: string;
  name: string;
  description?: string;
  cards: Card[];
  owner: string;
}

const DeckSchema = new mongoose.Schema<Deck>({
  name: { type: String, required: true },
  description: { type: String },
  cards: [
    {
      front: { type: String, required: true },
      back: { type: String, required: true },
    },
  ],
  owner: { type: String, required: true },
});

const DeckModel = mongoose.models.Deck || mongoose.model('Deck', DeckSchema);

export default DeckModel;
export type { Deck, Card };