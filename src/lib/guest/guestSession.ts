import { cookies } from 'next/headers';
import crypto from 'crypto';

export const GUEST_COOKIE_NAME = 'stellify_guest_token';

export async function getOrCreateGuestToken(): Promise<string> {
  const cookieStore = await cookies();
  const existingToken = cookieStore.get(GUEST_COOKIE_NAME)?.value;

  if (existingToken) {
    return existingToken;
  }

  const newToken = `gst_${crypto.randomBytes(16).toString('hex')}`;
  return newToken;
}
