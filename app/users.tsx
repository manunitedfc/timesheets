import { useWindowDimensions } from 'react-native';
import { Building2, UserCheck, UsersRound } from 'lucide-react-native';

import { StatCard } from '@/components/dashboard/StatCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { ScreenContainer } from '@/components/shared/ScreenContainer';
import { Box } from '@/components/ui/box';
import { UserDirectory } from '@/components/users/UserDirectory';

export default function UsersScreen() {
  const { width } = useWindowDimensions();
  const wide = width >= 1040;

  return (
    <ScreenContainer>
      <PageHeader title="Users" subtitle="Manage the team directory and workforce visibility" />
      <Box className="mb-4" style={{ flexDirection: wide ? 'row' : 'column', gap: 16 }}>
        <StatCard title="Active Users" value="56" trend="+4 from last week" tone="green" icon={UsersRound} />
        <StatCard title="Departments" value="6" detail="across Canada" tone="blue" icon={Building2} />
        <StatCard title="On Leave" value="3" detail="this week" tone="orange" icon={UserCheck} />
      </Box>
      <UserDirectory />
    </ScreenContainer>
  );
}
