'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import css from './NoteForm.module.css';
import { createNote, type CreateNotePayload } from '@/lib/api/clientApi';
import { useNoteStore } from '@/lib/store/noteStore';

interface NoteFormProps {
  onCancel?: () => void;
}

const FORM_OPTIONS = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'] as const;

export default function NoteForm({ onCancel }: NoteFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);

  const { mutate, isPending } = useMutation({
    mutationFn: (newNote: CreateNotePayload) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      router.push('/notes/filter/all');
      onCancel?.();
    },
    onError: (error) => {
      console.error('Failed to create note:', error);
    },
  });

  const handleDraftChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setDraft({ [name]: value } as Partial<CreateNotePayload>);
  };

  const handleSubmit = async (formData: FormData) => {
    const payload: CreateNotePayload = {
      title: String(formData.get('title') ?? '').trim(),
      content: String(formData.get('content') ?? '').trim(),
      tag: String(formData.get('tag') ?? 'Todo'),
    };

    if (!payload.title) {
      return;
    }

    mutate(payload);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
      return;
    }

    router.back();
  };

  return (
    <form action={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor='title'>Title</label>
        <input
          id='title'
          type='text'
          name='title'
          defaultValue={draft.title}
          onChange={handleDraftChange}
          className={css.input}
          required
          minLength={3}
          maxLength={50}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor='content'>Content</label>
        <textarea
          id='content'
          name='content'
          rows={8}
          defaultValue={draft.content}
          onChange={handleDraftChange}
          className={css.textarea}
          maxLength={500}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor='tag'>Tag</label>
        <select
          id='tag'
          name='tag'
          defaultValue={draft.tag}
          onChange={handleDraftChange}
          className={css.select}
        >
          {FORM_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button type='button' className={css.cancelButton} onClick={handleCancel} disabled={isPending}>
          Cancel
        </button>
        <button type='submit' className={css.submitButton} disabled={isPending}>
          {isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
}
