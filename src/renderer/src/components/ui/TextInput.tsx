import { InputHTMLAttributes } from 'react'

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  rightSlot?: React.ReactNode
}

export default function TextInput({ rightSlot, ...rest }: TextInputProps) {
  return (
    <div className="h-14 bg-white border border-outline rounded-xl flex items-center justify-between px-4 focus-within:border-[1.5px] focus-within:border-primary">
      <input className="flex-1 min-w-0 text-base text-ink outline-none bg-transparent" {...rest} />
      {rightSlot}
    </div>
  )
}
