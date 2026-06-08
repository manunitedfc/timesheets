import { CalendarDays, Clock3, MapPin } from 'lucide-react-native';
import { Platform } from 'react-native';

import { StatCard } from '@/components/dashboard/StatCard';
import { ProfilePanel } from '@/components/profile/ProfilePanel';
import { PageHeader } from '@/components/shared/PageHeader';
import { ScreenContainer } from '@/components/shared/ScreenContainer';
import { Box } from '@/components/ui/box';
import { getCurrentEmployee } from '@/data/mockSelectors';

export default function ProfileScreen() {
  const currentEmployee = getCurrentEmployee();

  return (
    <ScreenContainer>
      <PageHeader title="Profile" subtitle={Platform.OS === 'web' ? currentEmployee.email : undefined} />
      <Box className="flex-col lg:flex-row gap-4">
        <Box className="flex-[1.2]">
          <ProfilePanel />
        </Box>
        {Platform.OS === 'web' ? (
          <Box className="flex-1" style={{ gap: 16 }}>
            <StatCard title="Weekly Hours" value="38h 45m" detail="of 40h" tone="green" icon={Clock3} progress={96} />
            <StatCard title="Time Off Balance" value="15 days" detail="available" tone="green" icon={CalendarDays} />
            <StatCard title="Location" value="Toronto" detail="Ontario, Canada" tone="blue" icon={MapPin} />
          </Box>
        ) : null}
      </Box>
    </ScreenContainer>
  );
}
