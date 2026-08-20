import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';

type NotesPageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

export async function generateMetadata({ params }: NotesPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug?.[0] ?? 'all';
  const filterLabel = slug === 'all' ? 'All notes' : slug;
  const description = slug === 'all'
    ? 'Browse all notes from NoteHub.'
    : `Browse ${filterLabel} notes in NoteHub.`;

  return {
    title: `${filterLabel} | NoteHub`,
    description,
    openGraph: {
      title: `${filterLabel} | NoteHub`,
      description,
      url: `https://notehub.com/notes/filter/${slug}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `${filterLabel} notes preview`,
        },
      ],
    },
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug?.[0] ?? '';
  const tag = slug === 'all' ? undefined : slug;

  const queryClient = new QueryClient();
  const perPage = 12;

  await queryClient.prefetchQuery({
    queryKey: ['notes', 0, '', tag],
    queryFn: () => fetchNotes({ page: 1, perPage, search: '', tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
