import { ChevronRight, LogOut } from 'lucide-react-native';

import { AvatarInitials } from '@/components/shared/AvatarInitials';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { t } from '@/constants/tokens';
import { getCurrentEmployee } from '@/data/mockSelectors';

const profileRows = ['Personal Information', 'Employment Details', 'Change Password', 'Settings'];

export function ProfilePanel() {
  const currentEmployee = getCurrentEmployee();

  return (
    <Card size="md" variant="outline" className={`p-5 ${t.card}`}>
      <VStack className="items-center gap-3">
        <AvatarInitials initials={currentEmployee.initials} size="xl" tone="employee" />
        <Text className={`text-2xl font-bold ${t.text.primary}`}>{currentEmployee.name}</Text>
        <Text className={`text-lg ${t.text.muted}`}>{currentEmployee.title}</Text>
      </VStack>

      <VStack className={`mt-5 overflow-hidden rounded-lg border ${t.border.default}`}>
        {profileRows.map((row) => (
          <HStack key={row} className={`items-center justify-between border-b px-4 py-4 ${t.border.subtle}`}>
            <Text className={`font-semibold ${t.text.secondary}`}>{row}</Text>
            <ChevronRight size={18} color="#475569" />
          </HStack>
        ))}
        <HStack className="items-center gap-3 px-4 py-4">
          <LogOut size={19} color="#dc2626" />
          <Text className="font-bold text-red-600">Logout</Text>
        </HStack>
      </VStack>

      <VStack className={`mt-4 overflow-hidden rounded-lg border ${t.border.default}`}>
        <HStack className="items-center justify-between px-4 py-3">
          <Text className={`font-semibold ${t.text.secondary}`}>Appearance</Text>
          <ThemeToggle size="sm" />
        </HStack>
      </VStack>

      <Box className={`mt-5 rounded-lg p-4 ${t.bg.successSoft}`}>
        <Text className={`font-bold ${t.text.success}`}>Employment Snapshot</Text>
        <HStack className="mt-4 flex-wrap gap-4">
          <Box className="min-w-[180px] flex-1">
            <Text className={`text-sm ${t.text.success}`}>Department</Text>
            <Text className={`mt-1 font-bold ${t.text.success}`}>{currentEmployee.department}</Text>
          </Box>
          <Box className="min-w-[180px] flex-1">
            <Text className={`text-sm ${t.text.success}`}>Location</Text>
            <Text className={`mt-1 font-bold ${t.text.success}`}>{currentEmployee.location}</Text>
          </Box>
        </HStack>
      </Box>
    </Card>
  );
}
