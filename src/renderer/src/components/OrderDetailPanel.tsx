import QueryStateGate from './QueryStateGate';
import OrderDetail from './OrderDetail';
import type { OrderDetailFooterNote } from './OrderDetail';
import type { OrderDetail as OrderDetailEntity } from '@renderer/apis/order/entity';

interface OrderDetailPanelProps {
  selectedId: number | null;
  isPending: boolean;
  isError: boolean;
  isOffline: boolean;
  errorMessage?: string;
  onRetry: () => void;
  order?: OrderDetailEntity;
  footerSecondary?: string;
  footerPrimary?: string;
  footerNote?: OrderDetailFooterNote;
  onFooterSecondary: () => void;
  onFooterPrimary: () => void;
  shopName: string;
}

export default function OrderDetailPanel({
  selectedId,
  isPending,
  isError,
  isOffline,
  errorMessage,
  onRetry,
  order,
  footerSecondary,
  footerPrimary,
  footerNote,
  onFooterSecondary,
  onFooterPrimary,
  shopName
}: OrderDetailPanelProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      {selectedId !== null && (
        <QueryStateGate
          isPending={isPending}
          isError={isError}
          isOffline={isOffline}
          length={order ? 1 : 0}
          errorMessage={errorMessage}
          onRetry={onRetry}
        >
          {order && (
            <OrderDetail
              order={order}
              footerSecondary={footerSecondary}
              footerPrimary={footerPrimary}
              footerNote={footerNote}
              onFooterSecondary={onFooterSecondary}
              onFooterPrimary={onFooterPrimary}
              shopName={shopName}
            />
          )}
        </QueryStateGate>
      )}
    </div>
  );
}
