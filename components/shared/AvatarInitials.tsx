import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';

type AvatarInitialsProps = {
  initials: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  tone?: 'admin' | 'employee';
};

const toneClass = {
  admin: 'bg-blue-700',
  employee: 'bg-emerald-700',
};

export function AvatarInitials({ initials, size = 'md', tone = 'admin' }: AvatarInitialsProps) {
  return (
    <Avatar size={size} className={toneClass[tone]}>
      <AvatarFallbackText>{initials}</AvatarFallbackText>
    </Avatar>
  );
}
