import { receiptStyles } from '../lib/receiptStyles';
import { formatDateTime } from '../lib/format';

interface TestReceiptProps {
  printerName: string;
}

export default function TestReceipt({ printerName }: TestReceiptProps) {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <style>{receiptStyles}</style>
      </head>
      <body>
        <div className="center">
          <div className="brand">KOIN</div>
          <div className="subtitle">테스트 출력입니다</div>
        </div>
        <div className="divider" />
        <div className="row">
          <span>프린터</span>
          <span>{printerName}</span>
        </div>
        <div className="row">
          <span>출력 시각</span>
          <span>{formatDateTime(new Date().toISOString())}</span>
        </div>
        <div className="divider" />
        <div className="plain-text center">정상적으로 연결되었습니다</div>
      </body>
    </html>
  );
}
