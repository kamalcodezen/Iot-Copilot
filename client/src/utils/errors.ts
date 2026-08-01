// Reads the shape better-auth returns on failures ({ code, message, status })
// so pages can show friendly messages without inspecting arbitrary values.
export function getAuthError(error: unknown): { code: string; message: string } {
  if (error && typeof error === 'object') {
    const candidate = error as { code?: unknown; message?: unknown };
    return {
      code: typeof candidate.code === 'string' ? candidate.code : '',
      message: typeof candidate.message === 'string' ? candidate.message : '',
    };
  }
  return { code: '', message: typeof error === 'string' ? error : '' };
}

// Turns anything thrown (Error, string, better-auth error) into one readable
// message, with a fallback when no message can be found.
export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (error instanceof Error) return error.message || fallback;
  return getAuthError(error).message || fallback;
}
