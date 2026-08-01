import { AuthError } from './errors';
import { AuthRequest } from '../types';

// Protected routes run behind the `authenticate` middleware, which always
// sets req.user before the handler runs. This helper returns that user and
// throws a clean 401 when it is somehow missing, so handlers never need
// non-null assertions (req.user!) or manual `if (!req.user)` checks.
export function requireUser(req: AuthRequest) {
  if (!req.user) {
    throw new AuthError();
  }
  return req.user;
}
