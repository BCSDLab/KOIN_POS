import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RadioRow from '../components/ui/RadioRow';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useGetOwnerShops } from '@renderer/apis/store/queries';
import { usePatchStoreStatus } from '@renderer/apis/order/mutation';

export default function StoreSelectPage() {
  const res = useGetOwnerShops();
  const shopList = res.data?.shops || [];
  const navigate = useNavigate();
  const [manualSelectedId, setManualSelectedId] = useState<number | undefined>(undefined);
  const selectedId = manualSelectedId ?? shopList[0]?.orderable_shop_id;
  const storeStatus = usePatchStoreStatus(selectedId);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#FBFAFC] relative">
      <button
        type="button"
        onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('refresh-token');
          navigate('/');
        }}
        className="absolute top-5 right-5 h-11 px-4 border border-outline rounded-[10px] bg-white text-text text-base font-bold"
      >
        로그아웃
      </button>
      <div className="w-115 flex flex-col gap-4.5">
        <div className="flex flex-col gap-1.5 items-center text-center">
          <div className="text-[22px] font-extrabold text-ink">매장 선택</div>
          <div className="text-sm text-text-secondary">영업을 시작할 매장을 선택하세요.</div>
        </div>
        <div className="flex flex-col gap-2.5">
          {shopList.map((shop) => {
            const selected = shop?.orderable_shop_id === selectedId;
            return (
              <RadioRow
                key={shop.shop_id}
                selected={selected}
                onClick={() => {
                  setManualSelectedId(shop?.orderable_shop_id);
                }}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="text-[17px] font-bold text-ink">{shop.name}</div>
                    <Badge size="chip" variant={shop.is_open ? 'subtle' : 'neutral'}>
                      {shop.is_open ? '영업중' : '영업종료'}
                    </Badge>
                  </div>
                  <div className="text-[13px] text-text-tertiary">{shop.address}</div>
                </div>
                <div
                  className={`w-5.5 h-5.5 rounded-full flex-none flex items-center justify-center text-[13px] font-extrabold text-white ${
                    selected ? 'bg-primary' : 'border-[1.5px] border-outline'
                  }`}
                >
                  {selected && '✓'}
                </div>
              </RadioRow>
            );
          })}
        </div>
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={() => {
            storeStatus.mutate({
              is_open: true
            });
            navigate(`/dashboard?shopId=${selectedId}`);
          }}
        >
          매장 선택
        </Button>
      </div>
    </div>
  );
}
