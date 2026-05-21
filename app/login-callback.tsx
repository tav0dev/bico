import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useBico } from '@/context/bico-context';

export default function LoginCallbackScreen() {
  const router = useRouter();
  const { tokens } = useBico();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: tokens.bg }}>
      <ActivityIndicator color={tokens.green} />
    </View>
  );
}
