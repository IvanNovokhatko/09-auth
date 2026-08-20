import { cookies } from 'next/headers';
import type { AxiosResponse } from 'axios';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';
import { api } from './api';

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const getCookieHeader = async () => {
  const cookieStore = await cookies();
  return {
    Cookie: cookieStore.toString(),
  };
};

export const fetchNotes = async (params: FetchNotesParams): Promise<FetchNotesResponse> => {
  const { tag, ...rest } = params;
  const requestParams = tag ? { ...rest, tag } : rest;

  const response = await api.get<FetchNotesResponse>('/notes', {
    params: requestParams,
    headers: await getCookieHeader(),
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`, {
    headers: await getCookieHeader(),
  });

  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>('/users/me', {
    headers: await getCookieHeader(),
  });

  return response.data;
};

export const checkSession = async (): Promise<AxiosResponse> => {
  const response = await api.get('/auth/session', {
    headers: await getCookieHeader(),
  });

  return response;
};
