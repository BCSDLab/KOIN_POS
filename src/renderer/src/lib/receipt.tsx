import { renderToStaticMarkup } from 'react-dom/server';
import type { OrderDetail } from '@renderer/apis/order/entity';
import Receipt from '../components/Receipt';
import TestReceipt from '../components/TestReceipt';

export function buildReceiptHtml(order: OrderDetail, storeName: string): string {
  return `<!DOCTYPE html>${renderToStaticMarkup(<Receipt order={order} storeName={storeName} />)}`;
}

export function buildTestReceiptHtml(printerName: string): string {
  return `<!DOCTYPE html>${renderToStaticMarkup(<TestReceipt printerName={printerName} />)}`;
}
