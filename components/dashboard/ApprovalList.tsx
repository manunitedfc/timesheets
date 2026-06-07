import type { Href } from 'expo-router';
import { router } from 'expo-router';

import { StatusBadge } from '@/components/shared/StatusBadge';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { t } from '@/constants/tokens';
import { approvals } from '@/data/approvals';
import { employees } from '@/data/employees';

type ApprovalListProps = {
  compact?: boolean;
};

export function ApprovalList({ compact = false }: ApprovalListProps) {
  const visibleApprovals = compact ? approvals.slice(0, 3) : approvals;

  return (
    <Card size="md" variant="outline" className={`flex-1 p-4 lg:p-3 ${t.card}`}>
      <HStack className="mb-3 items-center justify-between">
        <Text className={`text-base font-bold ${t.text.primary}`}>Pending Approvals</Text>
        <Text className="font-semibold text-blue-700" onPress={() => router.push('/approvals' as Href)}>
          View all
        </Text>
      </HStack>
      <VStack className="gap-3">
        {visibleApprovals.map((approval) => {
          const employee = employees.find((item) => item.id === approval.employeeId);

          return (
            <HStack key={approval.id} className="items-center gap-3">
              <Avatar size="md" className="bg-blue-700">
                <AvatarFallbackText>{employee?.initials ?? approval.employeeName.slice(0, 2)}</AvatarFallbackText>
              </Avatar>
              <Box className="min-w-0 flex-1">
                <Text className={`font-bold ${t.text.primary}`}>{approval.employeeName}</Text>
                <Text className={`mt-1 text-sm ${t.text.muted}`}>
                  {approval.type} - {approval.period}
                </Text>
              </Box>
              <Text className={`font-bold ${t.text.primary}`}>{approval.amount}</Text>
              {compact ? (
                <StatusBadge label={approval.type} tone={approval.type === 'Timesheet' ? 'blue' : 'green'} />
              ) : (
                <HStack className="gap-3">
                  <Button action="positive" variant="solid" size="sm" className="bg-emerald-50">
                    <ButtonText className="text-emerald-700">Approve</ButtonText>
                  </Button>
                  <Button action="negative" variant="solid" size="sm" className="bg-red-50">
                    <ButtonText className="text-red-700">Reject</ButtonText>
                  </Button>
                </HStack>
              )}
            </HStack>
          );
        })}
      </VStack>
    </Card>
  );
}
