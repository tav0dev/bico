import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BicoButton, BicoField, BicoToggle, TucoSlot } from '@/components/bico/ui';
import { useBico } from '@/context/bico-context';

const professions = [
  'Eletricista',
  'Manicure',
  'Personal trainer',
  'Faxineira',
  'Encanador',
  'Cabeleireiro',
  'Fotografo',
  'Confeiteira',
  'Pintor',
  'Designer',
  'Massoterapeuta',
  'Outro',
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { tokens, accent, setAccent, isDark, setDark, signInWithGoogle, isGoogleLoggedIn } = useBico();
  const [step, setStep] = useState(0);
  const total = 4;

  // Step 0 states (Profile)
  const [name, setName] = useState('Marina Silva');
  const [businessName, setBusinessName] = useState('Marina Personal');
  const [phone, setPhone] = useState('(11) 98765-4321');

  // Step 1 states (Profession)
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>(['Personal trainer']);

  function handleToggleProfession(profession: string) {
    setSelectedProfessions((current) => {
      if (current.includes(profession)) {
        return current.filter((p) => p !== profession);
      } else {
        return [...current, profession];
      }
    });
  }

  // Step 3 states (Calendar sync loader)
  const [syncing, setSyncing] = useState(false);

  function goBack() {
    if (step > 0) {
      setStep((value) => value - 1);
      return;
    }
    router.back();
  }

  function continueFlow() {
    if (step < total - 1) {
      setStep((value) => value + 1);
      return;
    }
    router.replace('/');
  }

  async function handleGoogleSync() {
    setSyncing(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      console.log('Google Sign In Cancelled or Failed', e);
    } finally {
      setSyncing(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: tokens.bg }]}>
      {/* Header with back button & progress */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable onPress={goBack} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={22} color={tokens.text} />
          </Pressable>
          <Text style={[styles.stepText, { color: tokens.textMuted }]}>{step + 1} de {total}</Text>
          <Pressable onPress={() => router.replace('/')} style={styles.skipButton}>
            <Text style={[styles.skipText, { color: tokens.textMuted }]}>Pular</Text>
          </Pressable>
        </View>
        <View style={styles.progressRow}>
          {Array.from({ length: total }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressSegment,
                {
                  backgroundColor: index <= step ? tokens.green : tokens.borderSoft,
                  marginLeft: index > 0 ? 5 : 0,
                },
              ]}
            />
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {step === 0 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.title, { color: tokens.text }]}>Vamos começar seu Bico!</Text>
            <Text style={[styles.subtitle, { color: tokens.textMuted }]}>
              Nos conte um pouco sobre você e o seu trabalho.
            </Text>

            <View style={styles.formContainer}>
              <BicoField
                label="Nome completo"
                placeholder="Seu nome"
                icon="person-outline"
                value={name}
                onChangeText={setName}
                style={styles.fieldSpacing}
              />
              <BicoField
                label="Nome do seu negócio (Bico)"
                placeholder="Ex: Marina Personal"
                icon="briefcase-outline"
                value={businessName}
                onChangeText={setBusinessName}
                style={styles.fieldSpacing}
              />
              <BicoField
                label="Telefone comercial"
                placeholder="Ex: (11) 98765-4321"
                icon="call-outline"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                style={styles.fieldSpacing}
              />
            </View>

            <View style={[styles.tucoTip, { backgroundColor: tokens.orangeSoft }]}>
              <TucoSlot size={36} />
              <Text style={[styles.tipText, { color: tokens.text }]}>
                <Text style={styles.tipStrong}>Dica do Tuco: </Text>
                Use um nome profissional para seu bico! Isso passa muito mais credibilidade aos seus clientes logo no primeiro contato.
              </Text>
            </View>
          </View>
        )}

        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.title, { color: tokens.text }]}>O que você faz?</Text>
            <Text style={[styles.subtitle, { color: tokens.textMuted }]}>
              Escolha uma ou mais áreas. Você pode mudar isso depois.
            </Text>

            <View style={styles.chipWrap}>
              {professions.map((profession) => {
                const active = selectedProfessions.includes(profession);
                return (
                  <Pressable
                    key={profession}
                    onPress={() => handleToggleProfession(profession)}
                    style={[
                      styles.professionChip,
                      {
                        backgroundColor: active ? tokens.green : tokens.bgSoft,
                        borderColor: active ? tokens.green : tokens.border,
                      },
                    ]}>
                    {active ? <Ionicons name="checkmark" size={14} color="#FFFFFF" /> : null}
                    <Text style={[styles.professionText, { color: active ? '#FFFFFF' : tokens.text }]}>{profession}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={[styles.tucoTip, { backgroundColor: tokens.orangeSoft }]}>
              <TucoSlot size={36} />
              <Text style={[styles.tipText, { color: tokens.text }]}>
                <Text style={styles.tipStrong}>Dica do Tuco: </Text>
                Você atende em mais de uma área? Sem problema, selecione a principal agora. Nós cadastramos outras no seu menu depois!
              </Text>
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.title, { color: tokens.text }]}>Deixe com a sua cara</Text>
            <Text style={[styles.subtitle, { color: tokens.textMuted }]}>
              Escolha a cor de destaque e o modo visual do seu aplicativo.
            </Text>

            {/* Accent Selection */}
            <Text style={[styles.sectionHeader, { color: tokens.text }]}>COR DE DESTAQUE</Text>
            <View style={styles.themeSelectorContainer}>
              <Pressable
                onPress={() => setAccent('green')}
                style={[
                  styles.themeCard,
                  {
                    backgroundColor: tokens.bgSoft,
                    borderColor: accent === 'green' ? tokens.green : tokens.border,
                  },
                ]}>
                <View style={[styles.colorCircle, { backgroundColor: '#16A34A' }]} />
                <Text style={[styles.themeLabel, { color: tokens.text }]}>Verde Bico</Text>
                {accent === 'green' && (
                  <Ionicons name="checkmark-circle" size={20} color={tokens.green} style={styles.themeCheck} />
                )}
              </Pressable>

              <Pressable
                onPress={() => setAccent('purple')}
                style={[
                  styles.themeCard,
                  {
                    backgroundColor: tokens.bgSoft,
                    borderColor: accent === 'purple' ? tokens.green : tokens.border,
                  },
                ]}>
                <View style={[styles.colorCircle, { backgroundColor: '#818CF8' }]} />
                <Text style={[styles.themeLabel, { color: tokens.text }]}>Roxo Criativo</Text>
                {accent === 'purple' && (
                  <Ionicons name="checkmark-circle" size={20} color={tokens.green} style={styles.themeCheck} />
                )}
              </Pressable>
            </View>

            {/* Mode selection */}
            <View style={[styles.modeRow, { backgroundColor: tokens.bgSoft, borderColor: tokens.border }]}>
              <View style={styles.modeTextContainer}>
                <Text style={[styles.modeTitle, { color: tokens.text }]}>Tema Escuro</Text>
                <Text style={[styles.modeDesc, { color: tokens.textMuted }]}>Mais conforto visual no dia a dia</Text>
              </View>
              <BicoToggle on={isDark} onPress={() => setDark(!isDark)} />
            </View>

            <View style={[styles.tucoTip, { backgroundColor: tokens.orangeSoft }]}>
              <TucoSlot size={36} />
              <Text style={[styles.tipText, { color: tokens.text }]}>
                <Text style={styles.tipStrong}>Dica do Tuco: </Text>
                Você percebeu? As cores mudam instantaneamente à medida que você escolhe! Teste e encontre o seu estilo favorito.
              </Text>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.title, { color: tokens.text }]}>Sincronize sua Agenda</Text>
            <Text style={[styles.subtitle, { color: tokens.textMuted }]}>
              Importe seus compromissos automaticamente e impeça conflitos de horários.
            </Text>

            <View style={[styles.calendarSyncCard, { backgroundColor: tokens.bgSoft, borderColor: tokens.border }]}>
              <View style={[styles.syncIconContainer, { backgroundColor: isGoogleLoggedIn ? tokens.greenSoft : tokens.orangeSoft }]}>
                <Ionicons
                  name={isGoogleLoggedIn ? 'calendar' : 'calendar-outline'}
                  size={42}
                  color={isGoogleLoggedIn ? tokens.green : tokens.orange}
                />
              </View>

              <Text style={[styles.syncTitle, { color: tokens.text }]}>
                {isGoogleLoggedIn ? 'Agenda conectada com sucesso!' : 'Google Calendar'}
              </Text>
              <Text style={[styles.syncDesc, { color: tokens.textMuted }]}>
                {isGoogleLoggedIn
                  ? 'Seus treinos e compromissos já estão sendo sincronizados em tempo real.'
                  : 'Importe sua agenda pessoal e profissional para facilitar agendamentos com clientes.'}
              </Text>

              {syncing ? (
                <ActivityIndicator color={tokens.green} style={{ marginVertical: 12 }} />
              ) : isGoogleLoggedIn ? (
                <View style={styles.successBadge}>
                  <Ionicons name="checkmark-circle-outline" size={16} color={tokens.green} />
                  <Text style={[styles.successText, { color: tokens.green }]}>Conectado</Text>
                </View>
              ) : (
                <BicoButton
                  label="Conectar Google Calendar"
                  iconLeft="logo-google"
                  variant="primary"
                  onPress={handleGoogleSync}
                  style={styles.syncButton}
                />
              )}
            </View>

            <View style={[styles.tucoTip, { backgroundColor: tokens.orangeSoft }]}>
              <TucoSlot size={36} />
              <Text style={[styles.tipText, { color: tokens.text }]}>
                <Text style={styles.tipStrong}>Dica do Tuco: </Text>
                Não quer sincronizar agora? Sem problemas! Você pode simplesmente pular esta etapa e fazer isso mais tarde nas configurações do seu menu.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky Onboarding Footer */}
      <View style={styles.footer}>
        <BicoButton variant="secondary" onPress={goBack} style={styles.backButton} iconLeft="arrow-back" />
        <BicoButton
          label={step < total - 1 ? 'Continuar' : 'Entrar no App'}
          iconRight={step < total - 1 ? 'arrow-forward' : 'checkmark'}
          full
          onPress={continueFlow}
          style={styles.nextButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButton: {
    width: 44,
    height: 36,
    justifyContent: 'center',
  },
  stepText: {
    fontSize: 13,
    fontWeight: '600',
  },
  skipButton: {
    minWidth: 44,
    minHeight: 36,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
  },
  stepContainer: {
    gap: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  formContainer: {
    marginTop: 12,
    gap: 14,
  },
  fieldSpacing: {
    marginBottom: 4,
  },
  chipWrap: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  professionChip: {
    minHeight: 42,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  professionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 18,
    letterSpacing: 0.5,
  },
  themeSelectorContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  themeCard: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    position: 'relative',
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  themeLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  themeCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    marginBottom: 16,
  },
  modeTextContainer: {
    flex: 1,
    gap: 2,
  },
  modeTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  modeDesc: {
    fontSize: 12,
  },
  calendarSyncCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    marginBottom: 16,
  },
  syncIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncTitle: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  syncDesc: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  syncButton: {
    marginTop: 6,
    alignSelf: 'stretch',
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderRadius: 99,
  },
  successText: {
    fontSize: 13,
    fontWeight: '700',
  },
  tucoTip: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
  tipStrong: {
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: 'row',
    gap: 10,
  },
  backButton: {
    width: 52,
  },
  nextButton: {
    flex: 1,
  },
});
