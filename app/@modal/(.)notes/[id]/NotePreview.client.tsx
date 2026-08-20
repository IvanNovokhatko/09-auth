'use client';

import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
import Modal from '@/components/Modal/Modal';
import css from './NotePreview.module.css';

export default function NotePreviewClient() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const noteId = params?.id;

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId as string),
    enabled: Boolean(noteId),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  if (!noteId) {
    return null;
  }

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        <div className={css.header}>
          <h2>{note?.title ?? 'Note preview'}</h2>
          <button className={css.backBtn} onClick={handleClose}>
            Close
          </button>
        </div>

        {isLoading && <p>Loading note preview...</p>}
        {isError && !note && <p>Failed to load note.</p>}

        {note && (
          <div className={css.item}>
            <p className={css.tag}>{note.tag}</p>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>{new Date(note.createdAt).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
