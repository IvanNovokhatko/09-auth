import type { Note } from '@/types/note';
import type { User } from '@/types/user';
import { api } from './api';

export interface AuthRequest {
  email: string;
  password: string;
}

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

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: string;
}

export const fetchNotes = async (params: FetchNotesParams): Promise<FetchNotesResponse> => {
  const { tag, ...rest } = params;
  const requestParams = tag ? { ...rest, tag } : rest;

  const response = await api.get<FetchNotesResponse>('/notes', { params: requestParams });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  const response = await api.post<Note>('/notes', payload);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};

export const register = async (payload: AuthRequest): Promise<User> => {
  const response = await api.post<User>('/auth/register', payload);
  return response.data;
};

export const login = async (payload: AuthRequest): Promise<User> => {
  const response = await api.post<User>('/auth/login', payload);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const checkSession = async (): Promise<{ data?: User } | undefined> => {
  try {
    const response = await api.get('/auth/session');
    return response.data ? response : undefined;
  } catch (error: any) {
    if (error?.response?.status === 400 || error?.response?.status === 401) {
      return undefined;
    }
    throw error;
  }
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>('/users/me');
  return response.data;
};

export const updateMe = async (payload: Partial<User>): Promise<User> => {
  const response = await api.patch<User>('/users/me', payload);
  return response.data;
};
