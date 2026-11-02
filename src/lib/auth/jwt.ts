import { SignJWT, jwtVerify } from 'jose';

const getSecretKey = () => {
  const secret = process.env.AUTH_SECRET || 'stellify_fallback_secret_key_needs_32_bytes_at_least';
  return new TextEncoder().encode(secret);
};

export interface AdminPayload {
  email: string;
  role: 'admin';
  [key: string]: unknown;
}

export async function signAdminToken(payload: AdminPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getSecretKey());
}

export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as AdminPayload;
  } catch {
    return null;
  }
}
