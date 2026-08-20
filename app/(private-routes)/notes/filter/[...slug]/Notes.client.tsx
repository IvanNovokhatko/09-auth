'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import css from "./NotesPage.module.css";
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import { fetchNotes } from '@/lib/api/clientApi';

type NotesClientProps = {
  tag?: string;
};

const Pagination = dynamic(() => import('@/components/Pagination/Pagination'), {
  ssr: false,
});

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const perPage = 12;

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  const { data } = useQuery({
    queryKey: ['notes', page, search, tag],
    queryFn: () => fetchNotes({ page, perPage, search, tag }),
    placeholderData: keepPreviousData,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={(e) => debouncedSearch(e.target.value)} />

        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            forcePage={page - 1}
            onPageChange={(targetPage) => setPage(targetPage + 1)}
          />
        )}

        <Link href='/notes/action/create' className={css.button}>
          Create note +
        </Link>
      </header>

      {data && data.notes?.length > 0 && <NoteList notes={data.notes} />}
    </div>
  );
}
