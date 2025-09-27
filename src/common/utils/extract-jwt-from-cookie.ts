import { Request } from 'express';

export function extractJwtFromCookie(
  key: string,
): (req: Request) => string | null {
  return function (req: Request): string | null {
    const cookieString = req.headers.cookie;

    if (!cookieString) {
      return null;
    }

    const jwtToken = cookieString
      .split('; ')
      .find((cookie) => cookie.startsWith(key))
      ?.split('=')[1];
    
    return jwtToken;
  };
}