import { CalendarDays, ChevronRight, LogOut, Stethoscope } from 'lucide-react-native';

import { AvatarInitials } from '@/components/shared/AvatarInitials';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { t } from '@/constants/tokens';
import { getCurrentEmployee } from '@/data/mockSelectors';

const profileRows = ['Settings'];

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

      <HStack className="mt-4 gap-3">
        <Card size="md" variant="outline" className={`flex-1 p-4 ${t.card}`}>
          <HStack className="items-center justify-between">
            <Text className={`text-sm font-medium ${t.text.muted}`}>Time Off Balance</Text>
            <Box className={`items-center justify-center rounded-xl p-2 ${t.bg.successSoft}`}>
              <CalendarDays size={18} color="#16a34a" />
            </Box>
          </HStack>
          <Text className={`mt-2 text-3xl font-bold ${t.text.primary}`}>15</Text>
          <Text className={`text-sm ${t.text.muted}`}>days available</Text>
        </Card>

        <Card size="md" variant="outline" className={`flex-1 p-4 ${t.card}`}>
          <HStack className="items-center justify-between">
            <Text className={`text-sm font-medium ${t.text.muted}`}>Sick Days</Text>
            <Box className={`items-center justify-center rounded-xl p-2 bg-blue-50 dark:bg-blue-950`}>
              <Stethoscope size={18} color="#2563eb" />
            </Box>
          </HStack>
          <Text className={`mt-2 text-3xl font-bold ${t.text.primary}`}>8</Text>
          <Text className={`text-sm ${t.text.muted}`}>days available</Text>
        </Card>
      </HStack>
    </Card>
  );
}
