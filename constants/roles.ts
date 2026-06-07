import { Platform } from 'react-native';

export type UserRole = 'employee' | 'manager' | 'admin';

export const ACTIVE_ROLE: UserRole = Platform.OS === 'web' ? 'admin' : 'employee';

export function hasAdminAccess(role: UserRole) {
  return role === 'manager' || role === 'admin';
}
