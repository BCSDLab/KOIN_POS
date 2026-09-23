import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RadioRow from '../components/ui/RadioRow'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { stores } from '../mock/stores'

export default function StoreSelectPage() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState(stores[0].id)

  const handleStart = (): void => {
    navigate('/dashboard')
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#FBFAFC] relative">
      <button
        type="button"
        onClick={() => navigate('/login')}
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
          {stores.map((store) => {
            const selected = store.id === selectedId
            return (
              <RadioRow key={store.id} selected={selected} onClick={() => setSelectedId(store.id)}>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="text-[17px] font-bold text-ink">{store.name}</div>
                    <Badge size="chip" variant={store.open ? 'subtle' : 'neutral'}>
                      {store.open ? '영업중' : '영업종료'}
                    </Badge>
                  </div>
                  <div className="text-[13px] text-text-tertiary">{store.address}</div>
                </div>
                <div
                  className={`w-5.5 h-5.5 rounded-full flex-none flex items-center justify-center text-[13px] font-extrabold text-white ${
                    selected ? 'bg-primary' : 'border-[1.5px] border-outline'
                  }`}
                >
                  {selected && '✓'}
                </div>
              </RadioRow>
            )
          })}
        </div>
        <Button variant="primary" size="md" fullWidth onClick={handleStart}>
          매장 선택
        </Button>
      </div>
    </div>
  )
}
