import type { Metadata } from 'next';
import CreateNotePageClient from './CreateNotePage.client';

export const metadata: Metadata = {
  title: 'Create note | NoteHub',
  description: 'Create a new note and organize your ideas in NoteHub.',
  openGraph: {
    title: 'Create note | NoteHub',
    description: 'Create a new note and organize your ideas in NoteHub.',
    url: 'https://notehub.com/notes/action/create',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Create note page preview',
      },
    ],
  },
};

export default function CreateNote() {
  return <CreateNotePageClient />;
}
