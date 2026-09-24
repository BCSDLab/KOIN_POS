import Button from './ui/Button';

interface FooterNote {
  label: string;
  icon: string;
  tone: 'success' | 'muted';
}

interface FooterBarProps {
  secondary?: string;
  primary?: string;
  note?: FooterNote;
  onSecondary?: () => void;
  onPrimary?: () => void;
}

export default function FooterBar({
  secondary,
  primary,
  note,
  onSecondary,
  onPrimary
}: FooterBarProps) {
  return (
    <div className="h-28 border-t border-border flex items-center justify-center gap-3.5 px-8.5 flex-none">
      {secondary && (
        <Button variant="outline" size="lg" className="w-62.5 flex-none" onClick={onSecondary}>
          {secondary}
        </Button>
      )}
      {primary && (
        <div className="flex-1">
          <Button variant="primary" size="lg" fullWidth onClick={onPrimary}>
            {primary}
          </Button>
        </div>
      )}
      {note && (
        <div
          className={`h-17 flex-1 rounded-[13px] flex items-center justify-center gap-3.25 border-[1.5px] ${
            note.tone === 'success'
              ? 'bg-surface border-[#E8CFF7]'
              : 'bg-[#F4F1F6] border-[#DDD6E3]'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-extrabold flex-none ${
              note.tone === 'success' ? 'bg-primary-ink' : 'bg-text'
            }`}
          >
            {note.icon}
          </div>
          <div
            className={`text-[22px] font-extrabold ${
              note.tone === 'success' ? 'text-primary-ink' : 'text-text'
            }`}
          >
            {note.label}
          </div>
        </div>
      )}
    </div>
  );
}
