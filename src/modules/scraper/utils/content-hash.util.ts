import * as crypto from 'crypto';

export function generateContentHash(title: string, sourceUrl: string): string {
  const data = `${title}|${sourceUrl}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}
