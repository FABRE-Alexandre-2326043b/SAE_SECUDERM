import { AxiosError } from 'axios';

export function handleAxiosError(err: unknown, rejectWithValue: (value: string) => any) {
  const error = err as AxiosError;
  if (error.response && error.response.data) {
    const errorMessage = (error.response.data as { message: string }).message;
    return rejectWithValue(errorMessage);
  }
  return rejectWithValue('An unknown error occurred');
}
