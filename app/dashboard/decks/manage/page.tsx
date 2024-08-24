'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface Deck {
  _id: string;
  name: string;
  description: string;
}

export default function ManageDecks() {
  const { data: session } = useSession();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    const response = await fetch('/api/decks/list');
    const data = await response.json();
    if (data.success) {
      setDecks(data.decks);
    }
  };

  const deleteDeck = async (id: string) => {
    const response = await fetch(`/api/decks/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (data.success) {
      fetchDecks();
      toast({
        title: 'Deck deleted',
        description: 'The deck has been successfully deleted.',
      });
    }
  };

  const openEditModal = (deck: Deck) => {
    setEditingDeck(deck);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingDeck(null);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingDeck) return;

    const response = await fetch(`/api/decks/${editingDeck._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editingDeck.name, description: editingDeck.description }),
    });

    const data = await response.json();
    if (data.success) {
      fetchDecks();
      closeEditModal();
      toast({
        title: 'Deck updated',
        description: 'The deck has been successfully updated.',
      });
    }
  };

  if (!session) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Access Denied</h2>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">Please sign in to manage your decks.</p>
        <Button variant="default" size="lg" onClick={() => router.push('/auth/signin')}>
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Manage Decks</h1>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {decks.map((deck) => (
            <TableRow key={deck._id}>
              <TableCell className="font-medium">{deck.name}</TableCell>
              <TableCell>{deck.description}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/decks/${deck._id}`)}>
                    View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openEditModal(deck)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteDeck(deck._id)}>
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Deck</DialogTitle>
            <DialogDescription>Make changes to your deck here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editingDeck?.name || ''}
                  onChange={(e) => setEditingDeck(prev => prev ? {...prev, name: e.target.value} : null)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={editingDeck?.description || ''}
                  onChange={(e) => setEditingDeck(prev => prev ? {...prev, description: e.target.value} : null)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}