interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white border border-border rounded-[14px] py-4 px-5.5 shadow-[0_1px_2px_rgba(70,20,100,0.04)] flex flex-col gap-2.75 ${className}`}
    >
      {children}
    </div>
  );
}
