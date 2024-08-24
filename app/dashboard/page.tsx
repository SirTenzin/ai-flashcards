'use client';

import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { useSession } from 'next-auth/react';
import { HoverEffect } from '@/components/ui/card-hover-effect';
import { Skeleton } from '@/components/ui/skeleton';
export default function Page() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ totalDecks: 0, totalFlashcards: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/decks/list');
        if (response.ok) {
          const data = await response.json();
          setStats({
            totalDecks: data.decks.length,
            totalFlashcards: data.decks.reduce((sum: number, deck: any) => sum + deck.cards.length, 0)
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user?.email) {
      fetchStats();
    }
  }, [session, loading]);

  const items = [
    {
      title: "Create a Deck",
      description: "Start by creating your first flashcard deck.",
      link: "dashboard/decks/new"
    }
  ];

  function DashboardSkeleton() {
    return (
        <div className="space-y-6">
          <div className="flex items-center justify-between space-y-2">
            <Skeleton className="h-8 w-64" />
          </div>
          <Skeleton className="h-5 w-full max-w-md" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <div className="mt-6">
            <Skeleton className="h-7 w-32 mb-4" />
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="rounded-lg border p-4">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
    );
  }

  return (
    <PageContainer scrollable={true}>
      {loading ? <DashboardSkeleton /> : (
      <div className="space-y-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Hi, {session?.user?.name || 'Let\'s get started'} 👋
          </h2>
        </div>
        <p className="text-muted-foreground">
          Welcome to your flashcard app! Here's how you can get started:
        </p>
        <HoverEffect items={items} />
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium">Total Decks</p>
              <p className="text-2xl font-bold">{stats.totalDecks}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium">Total Flashcards</p>
              <p className="text-2xl font-bold">{stats.totalFlashcards}</p>
            </div>
          </div>
        </div>
      </div>
    )}
    </PageContainer>
  );
}