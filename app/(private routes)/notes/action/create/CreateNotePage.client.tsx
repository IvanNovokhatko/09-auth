'use client';

import { useRouter } from 'next/navigation';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from './CreateNote.module.css';

export default function CreateNotePageClient() {
  const router = useRouter();

  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm onCancel={() => router.back()} />
      </div>
    </main>
  );
}
