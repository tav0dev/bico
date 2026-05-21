import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BicoButton, TucoSlot } from '@/components/bico/ui';
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
  const { tokens } = useBico();
  const [step, setStep] = useState(2);
  const [selected, setSelected] = useState('Personal trainer');
  const total = 4;

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

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: tokens.bg }]}>
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

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: tokens.text }]}>O que voce faz?</Text>
        <Text style={[styles.subtitle, { color: tokens.textMuted }]}>
          Escolha uma ou mais areas. Voce pode mudar isso depois.
        </Text>

        <View style={styles.chipWrap}>
          {professions.map((profession) => {
            const active = profession === selected;
            return (
              <Pressable
                key={profession}
                onPress={() => setSelected(profession)}
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
            Voce atende mais de uma area? Sem problema, selecione todas que fizerem sentido.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <BicoButton variant="secondary" onPress={goBack} style={styles.backButton} iconLeft="arrow-back" />
        <BicoButton
          label={step < total - 1 ? 'Continuar' : 'Comecar'}
          iconRight="arrow-forward"
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
  title: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 32,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
  },
  chipWrap: {
    marginTop: 24,
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
  tucoTip: {
    marginTop: 28,
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
    paddingBottom: 8,
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
