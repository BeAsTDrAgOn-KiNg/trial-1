import crypto from 'crypto';

export interface AuthTokenPayload {
  userId: string;
  role: string;
  exp: number;
}

const TOKEN_ALGORITHM = 'sha256';
const TOKEN_TTL_SECONDS = 60 * 60 * 8;

const getTokenSecret = () => {
  const secret = process.env.AUTH_TOKEN_SECRET;

  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_TOKEN_SECRET must be configured in production');
  }

  return 'development-only-auth-token-secret-change-me';
};

const encode = (value: string) => Buffer.from(value).toString('base64url');
const decode = (value: string) => Buffer.from(value, 'base64url').toString('utf8');

const sign = (signedContent: string) =>
  crypto
    .createHmac(TOKEN_ALGORITHM, getTokenSecret())
    .update(signedContent)
    .digest('base64url');

export const issueAuthToken = (userId: string, role: string) => {
  const payload: AuthTokenPayload = {
    userId,
    role,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  };
  const encodedHeader = encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const encodedPayload = encode(JSON.stringify(payload));
  const signedContent = `${encodedHeader}.${encodedPayload}`;

  return `${signedContent}.${sign(signedContent)}`;
};

export const verifyAuthToken = (token: string): AuthTokenPayload | null => {
  const [encodedHeader, encodedPayload, providedSignature, ...extraParts] = token.split('.');
  if (!encodedHeader || !encodedPayload || !providedSignature || extraParts.length > 0) return null;

  const signedContent = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = sign(signedContent);
  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const header = JSON.parse(decode(encodedHeader)) as { alg?: string; typ?: string };
    if (header.alg !== 'HS256' || header.typ !== 'JWT') return null;

    const payload = JSON.parse(decode(encodedPayload)) as AuthTokenPayload;
    if (
      !payload.userId ||
      !payload.role ||
      !Number.isFinite(payload.exp) ||
      payload.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
};
