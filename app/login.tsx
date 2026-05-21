import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BicoButton, BicoField, IconButton, SocialIcon, TucoSlot } from '@/components/bico/ui';
import { useBico } from '@/context/bico-context';

export default function LoginScreen() {
  const router = useRouter();
  const { continueWithEmail, errorMessage, signInWithFacebook, signInWithGoogle, tokens } = useBico();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleEmailFlow() {
    continueWithEmail();
    router.replace('/onboarding');
  }

  async function handleSocial(provider: 'google' | 'facebook') {
    if (provider === 'google') {
      await signInWithGoogle();
    } else {
      await signInWithFacebook();
    }

    if (errorMessage) {
      Alert.alert('Login', errorMessage);
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: tokens.bg }]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.brandWrap}>
          <TucoSlot size={84} />
          <Text style={[styles.title, { color: tokens.text }]}>Bem-vindo ao Bico</Text>
          <Text style={[styles.subtitle, { color: tokens.textMuted }]}>O seu corre, mais inteligente</Text>
        </View>

        <View style={[styles.segmented, { backgroundColor: tokens.bgSoft }]}>
          <Pressable
            onPress={() => setIsLogin(true)}
            style={[styles.segment, isLogin && { backgroundColor: tokens.bg }]}>
            <Text style={[styles.segmentText, { color: isLogin ? tokens.text : tokens.textMuted }]}>Entrar</Text>
          </Pressable>
          <Pressable
            onPress={() => setIsLogin(false)}
            style={[styles.segment, !isLogin && { backgroundColor: tokens.bg }]}>
            <Text style={[styles.segmentText, { color: !isLogin ? tokens.text : tokens.textMuted }]}>Criar conta</Text>
          </Pressable>
        </View>

        <BicoField
          label="E-mail"
          placeholder="seu@email.com"
          icon="mail-outline"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <BicoField
          label="Senha"
          placeholder="********"
          icon="lock-closed-outline"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          style={styles.passwordField}
          trailing={
            <IconButton
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={tokens.textMuted}
              onPress={() => setShowPassword((value) => !value)}
              style={styles.inlineIcon}
            />
          }
        />

        {isLogin ? (
          <Pressable style={styles.forgotButton}>
            <Text style={[styles.forgotText, { color: tokens.green }]}>Esqueceu a senha?</Text>
          </Pressable>
        ) : null}

        <BicoButton
          label={isLogin ? 'Entrar' : 'Criar minha conta'}
          variant="primary"
          size="lg"
          full
          onPress={handleEmailFlow}
        />

        <View style={styles.dividerRow}>
          <View style={[styles.divider, { backgroundColor: tokens.borderSoft }]} />
          <Text style={[styles.dividerText, { color: tokens.textFaint }]}>ou continue com</Text>
          <View style={[styles.divider, { backgroundColor: tokens.borderSoft }]} />
        </View>

        <View style={styles.socialRow}>
          <BicoButton variant="secondary" full style={styles.socialButton} onPress={() => handleSocial('google')}>
            <View style={styles.socialContent}>
              <SocialIcon provider="google" />
              <Text style={[styles.socialText, { color: tokens.text }]}>Google</Text>
            </View>
          </BicoButton>
          <BicoButton variant="secondary" full style={styles.socialButton} onPress={() => handleSocial('facebook')}>
            <View style={styles.socialContent}>
              <SocialIcon provider="facebook" />
              <Text style={[styles.socialText, { color: tokens.text }]}>Facebook</Text>
            </View>
          </BicoButton>
        </View>

        <Text style={[styles.terms, { color: tokens.textFaint }]}>
          Ao continuar voce concorda com os <Text style={{ color: tokens.text, fontWeight: '600' }}>Termos</Text> e a{' '}
          <Text style={{ color: tokens.text, fontWeight: '600' }}>Politica de Privacidade</Text>.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
  },
  brandWrap: {
    alignItems: 'center',
    marginBottom: 28,
    gap: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  segmented: {
    borderRadius: 12,
    padding: 4,
    flexDirection: 'row',
    marginBottom: 20,
  },
  segment: {
    flex: 1,
    minHeight: 36,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
  },
  passwordField: {
    marginTop: 14,
  },
  inlineIcon: {
    width: 28,
    height: 28,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '600',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 10,
  },
  socialButton: {
    flex: 1,
  },
  socialContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  socialText: {
    fontSize: 15,
    fontWeight: '600',
  },
  terms: {
    marginTop: 32,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
