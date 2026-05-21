import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AISparkle, BicoAvatar, BicoButton, BicoCard, BicoTopBar, SectionTitle, softTint } from '@/components/bico/ui';
import { useBico } from '@/context/bico-context';

type QuickAction = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  tint: string;
  ai?: boolean;
  route?: string;
};

export default function DashboardScreen() {
  const router = useRouter();
  const { tokens } = useBico();
  const actions: QuickAction[] = [
    { icon: 'cash-outline', label: 'Novo orcamento', tint: tokens.green, route: '/services' },
    { icon: 'people-outline', label: 'Adicionar cliente', tint: tokens.purple, route: '/clients' },
    { icon: 'image-outline', label: 'Criar post', tint: tokens.orange, ai: true, route: '/create-post' },
    { icon: 'calendar-outline', label: 'Bloquear horario', tint: tokens.textMuted, route: '/agenda' },
  ];

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: tokens.bg }]}>
      <BicoTopBar
        title="Ola, Marina"
        subtitle="Quarta, 6 de maio"
        leading={<BicoAvatar name="Marina Silva" size={40} />}
        trailing={
          <View>
            <Ionicons name="notifications-outline" size={22} color={tokens.text} style={styles.notificationIcon} />
            <View style={[styles.notificationDot, { backgroundColor: tokens.orange, borderColor: tokens.bg }]} />
          </View>
        }
      />

      <ScrollView contentContainerStyle={styles.content}>
        <BicoCard>
          <View style={styles.todayHeader}>
            <View>
              <Text style={[styles.eyebrow, { color: tokens.textMuted }]}>HOJE</Text>
              <Text style={[styles.todayTitle, { color: tokens.text }]}>3 atendimentos</Text>
            </View>
            <View style={styles.forecast}>
              <Text style={[styles.forecastLabel, { color: tokens.textMuted }]}>previsao</Text>
              <Text style={[styles.forecastValue, { color: tokens.green }]}>R$ 380</Text>
            </View>
          </View>
          <View style={[styles.cardDivider, { backgroundColor: tokens.borderSoft }]} />
          <View style={styles.statsRow}>
            <Stat label="Concluidos" value="1" color={tokens.green} />
            <Stat label="Em andamento" value="1" color={tokens.orange} />
            <Stat label="Pendente" value="1" color={tokens.textMuted} />
          </View>
        </BicoCard>

        <View style={styles.sectionHeader}>
          <SectionTitle>Proximo</SectionTitle>
          <Pressable onPress={() => router.push('/agenda')}>
            <Text style={[styles.linkText, { color: tokens.green }]}>Ver agenda</Text>
          </Pressable>
        </View>

        <BicoCard>
          <View style={styles.appointmentRow}>
            <View style={[styles.timeBox, { backgroundColor: tokens.greenSoft }]}>
              <Text style={[styles.timeText, { color: tokens.green }]}>14:00</Text>
              <Text style={[styles.durationText, { color: tokens.green }]}>1h30</Text>
            </View>
            <View style={styles.appointmentBody}>
              <Text style={[styles.appointmentTitle, { color: tokens.text }]}>Treino funcional - Carla M.</Text>
              <View style={styles.inlineRow}>
                <Ionicons name="location-outline" size={13} color={tokens.textMuted} />
                <Text style={[styles.appointmentLocation, { color: tokens.textMuted }]}>Studio Vila Madalena</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={tokens.textMuted} />
          </View>
        </BicoCard>

        <View style={[styles.aiCard, { borderColor: tokens.orangeSoft, backgroundColor: tokens.orangeSoft }]}>
          <View style={styles.inlineRow}>
            <AISparkle size={14} />
            <Text style={[styles.aiLabel, { color: tokens.orange }]}>TUCO SUGERE</Text>
          </View>
          <Text style={[styles.aiText, { color: tokens.text }]}>
            Joao Pedro nao confirmou o treino de amanha. Quer que eu envie um lembrete?
          </Text>
          <View style={styles.aiActions}>
            <BicoButton label="Enviar lembrete" variant="ai" size="sm" />
            <BicoButton label="Agora nao" variant="ghost" size="sm" />
          </View>
        </View>

        <SectionTitle>Atalhos</SectionTitle>
        <View style={styles.quickGrid}>
          {actions.map((action) => (
            <Pressable
              key={action.label}
              onPress={() => action.route && router.push(action.route as never)}
              style={[styles.quickAction, { borderColor: tokens.borderSoft, backgroundColor: tokens.bg }]}>
              <View style={[styles.quickIcon, { backgroundColor: softTint(action.tint) }]}>
                <Ionicons name={action.icon} size={18} color={action.tint} />
              </View>
              <Text style={[styles.quickLabel, { color: tokens.text }]}>{action.label}</Text>
              {action.ai ? <View style={styles.quickSparkle}><AISparkle size={12} /></View> : null}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  const { tokens } = useBico();

  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: tokens.textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  notificationIcon: {
    padding: 9,
  },
  notificationDot: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 18,
    gap: 16,
  },
  todayHeader: {
    padding: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
  },
  todayTitle: {
    marginTop: 2,
    fontSize: 22,
    fontWeight: '700',
  },
  forecast: {
    alignItems: 'flex-end',
  },
  forecastLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  forecastValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardDivider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
  },
  statsRow: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 12,
  },
  stat: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    marginTop: 1,
    fontSize: 12,
  },
  sectionHeader: {
    marginHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linkText: {
    fontSize: 13,
    fontWeight: '700',
  },
  appointmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  timeBox: {
    width: 56,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  durationText: {
    fontSize: 10,
  },
  appointmentBody: {
    flex: 1,
    gap: 3,
  },
  appointmentTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appointmentLocation: {
    fontSize: 13,
  },
  aiCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  aiLabel: {
    fontSize: 12,
    fontWeight: '800',
  },
  aiText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  aiActions: {
    flexDirection: 'row',
    gap: 8,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickAction: {
    width: '48.5%',
    minHeight: 96,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  quickIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  quickSparkle: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
