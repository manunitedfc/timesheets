import type { Href } from 'expo-router';
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href={'/dashboard' as Href} />;
}
