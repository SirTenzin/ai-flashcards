import { NavItem } from '@/types';

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: 'Decks',
    href: '/dashboard/decks',
    icon: 'dashboard',
    label: 'Flashcard Decks'
  },
  {
    title: 'Create Deck',
    href: '/dashboard/decks/new',
    icon: 'dashboard',
    label: 'Create New Deck'
  },
  {
    title: 'Manage Decks',
    href: '/dashboard/decks/manage',
    icon: 'dashboard',
    label: 'Manage Decks'
  }
];

export const flashcardCategories = [
  'General Knowledge',
  'Science',
  'History',
  'Languages',
  'Mathematics',
  'Literature',
  'Geography',
  'Arts',
  'Technology',
  'Custom'
];