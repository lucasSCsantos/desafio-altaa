import jwt from 'jsonwebtoken';

const JWT_KEY = process.env.JWT_KEY || 'default_jwt_key';

export interface SessionPayload {
  userId: string;
  companyId?: string;
  email?: string;
}

export function signJWT(payload: SessionPayload, expiresIn = '7d') {
  return jwt.sign(payload, JWT_KEY, { expiresIn } as jwt.SignOptions);
}

export function verifyJWT(token?: string): SessionPayload | null {
  try {
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_KEY) as SessionPayload;

    return decoded;
  } catch (err) {
    console.error('JWT verification failed:', err);
    throw new Error('Invalid or expired token: ' + (err as Error).message);
  }
}
