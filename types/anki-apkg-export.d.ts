declare module 'anki-apkg-export' {
  export class AnkiExport {
    constructor(deckName: string, deckDescription?: string);
    addNote(front: string, back: string, tags?: string[]): void;
    save(): Blob;
  }
}
