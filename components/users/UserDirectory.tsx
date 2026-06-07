import { Search } from 'lucide-react-native';

import { AvatarInitials } from '@/components/shared/AvatarInitials';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { t } from '@/constants/tokens';
import { employees } from '@/data/employees';

export function UserDirectory() {
  return (
    <Card size="md" variant="outline" className={`p-4 lg:p-3 ${t.card}`}>
      <HStack className={`mb-3 h-9 items-center gap-3 rounded-lg border px-3 ${t.border.default} ${t.bg.elevated}`}>
        <Search size={20} color="#475569" />
        <Text className={t.text.muted}>Search team members</Text>
      </HStack>
      <VStack className="gap-4">
        {employees.map((employee) => (
          <HStack key={employee.id} className={`items-center gap-3 rounded-lg border p-3 ${t.border.subtle}`}>
            <AvatarInitials initials={employee.initials} />
            <Box className="min-w-0 flex-1">
              <Text className={`text-base font-bold ${t.text.primary}`}>{employee.name}</Text>
              <Text className={`mt-1 ${t.text.secondary}`}>{employee.title}</Text>
              <Text className={`mt-1 text-sm ${t.text.muted}`}>{employee.email}</Text>
            </Box>
            <Box className="items-end gap-2">
              <Text className={`font-semibold ${t.text.primary}`}>{employee.weeklyHours}</Text>
              <StatusBadge
                label={employee.status}
                tone={employee.status === 'active' ? 'green' : employee.status === 'away' ? 'orange' : 'slate'}
              />
            </Box>
          </HStack>
        ))}
      </VStack>
    </Card>
  );
}
