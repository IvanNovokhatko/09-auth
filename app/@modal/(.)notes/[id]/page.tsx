import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/serverApi';
import NotePreviewClient from './NotePreview.client';

type NotePreviewPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NotePreviewPage({ params }: NotePreviewPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient />
    </HydrationBoundary>
  );
}
