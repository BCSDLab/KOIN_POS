import { app, safeStorage } from 'electron';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';

interface Tokens {
  token: string;
  refreshToken: string;
}

const tokenFilePath = (): string => join(app.getPath('userData'), 'auth.dat');

export const readTokens = (): Tokens | null => {
  const filePath = tokenFilePath();
  if (!existsSync(filePath)) return null;
  try {
    const decrypted = safeStorage.decryptString(readFileSync(filePath));
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
};

export const writeTokens = (token: string, refreshToken: string): void => {
  const data: Tokens = { token, refreshToken };
  const encrypted = safeStorage.encryptString(JSON.stringify(data));
  writeFileSync(tokenFilePath(), encrypted);
};

export const deleteTokens = (): void => {
  const filePath = tokenFilePath();
  if (existsSync(filePath)) unlinkSync(filePath);
};
