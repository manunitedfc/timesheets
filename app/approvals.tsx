import { CheckCircle2, Clock3, FileText } from 'lucide-react-native';

import { ApprovalList } from '@/components/dashboard/ApprovalList';
import { StatCard } from '@/components/dashboard/StatCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { ScreenContainer } from '@/components/shared/ScreenContainer';
import { Box } from '@/components/ui/box';

export default function ApprovalsScreen() {
  return (
    <ScreenContainer>
      <PageHeader title="Approvals" subtitle="Review submitted timesheets and time off requests" />
      <Box className="mb-4 flex-col lg:flex-row gap-4">
        <StatCard title="Pending" value="12" detail="awaiting action" tone="orange" icon={Clock3} />
        <StatCard title="Timesheets" value="3" detail="pending review" tone="blue" icon={FileText} />
        <StatCard title="Time Off" value="9" detail="pending review" tone="purple" icon={CheckCircle2} />
      </Box>
      <ApprovalList />
    </ScreenContainer>
  );
}
