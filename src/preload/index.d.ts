import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      getPrinters: () => Promise<Electron.PrinterInfo[]>;
      printReceipt: (html: string, printerName?: string) => Promise<boolean>;
    };
  }
}
