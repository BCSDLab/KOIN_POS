import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      getPrinters: () => Promise<Electron.PrinterInfo[]>;
      printReceipt: (html: string, printerName?: string) => Promise<boolean>;
      getTokens: () => Promise<{ token: string; refreshToken: string } | null>;
      setTokens: (token: string, refreshToken: string) => Promise<void>;
      clearTokens: () => Promise<void>;
    };
  }
}
