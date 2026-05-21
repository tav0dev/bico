import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BicoCard, BicoPill, BicoToggle, BicoTopBar, IconButton } from '@/components/bico/ui';
import { useBico } from '@/context/bico-context';

const services = [
  { name: 'Treino personalizado', dur: '1h', price: 120, active: true, tag: 'Mais vendido' },
  { name: 'Avaliacao fisica', dur: '45min', price: 90, active: true, tag: '' },
  { name: 'Plano mensal (8 sessoes)', dur: '8 sessoes', price: 750, active: true, tag: 'Pacote' },
  { name: 'Treino dupla', dur: '1h', price: 180, active: true, tag: '' },
  { name: 'Consultoria online', dur: '30min', price: 60, active: false, tag: '' },
];

export default function ServicesScreen() {
  const router = useRouter();
  const { tokens } = useBico();
  const activeCount = services.filter((service) => service.active).length;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: tokens.bg }]}>
      <BicoTopBar
        title="Servicos"
        large
        leading={<IconButton name="chevron-back" onPress={() => router.back()} />}
        trailing={
          <View style={[styles.addButton, { backgroundColor: tokens.green }]}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </View>
        }
      />
      <Text style={[styles.counter, { color: tokens.textMuted }]}>{activeCount} servicos ativos</Text>

      <ScrollView contentContainerStyle={styles.content}>
        {services.map((service) => (
          <BicoCard key={service.name}>
            <View style={styles.serviceRow}>
              <View style={[styles.serviceIcon, { backgroundColor: service.active ? tokens.greenSoft : tokens.borderSoft }]}>
                <Ionicons
                  name={service.tag === 'Pacote' ? 'document-text-outline' : 'time-outline'}
                  size={20}
                  color={service.active ? tokens.green : tokens.textMuted}
                />
              </View>
              <View style={styles.serviceBody}>
                <View style={styles.serviceTitleRow}>
                  <Text style={[styles.serviceName, { color: tokens.text }]}>{service.name}</Text>
                  {service.tag ? <BicoPill text={service.tag} color={service.tag === 'Pacote' ? 'purple' : 'orange'} size="sm" /> : null}
                </View>
                <View style={styles.serviceMetaRow}>
                  <Ionicons name="time-outline" size={12} color={tokens.textMuted} />
                  <Text style={[styles.serviceMeta, { color: tokens.textMuted }]}>{service.dur}</Text>
                  <Text style={[styles.servicePrice, { color: tokens.text }]}>R$ {service.price}</Text>
                </View>
              </View>
              <BicoToggle on={service.active} />
            </View>
          </BicoCard>
        ))}

        <View style={[styles.addService, { borderColor: tokens.border }]}>
          <Ionicons name="add" size={16} color={tokens.textMuted} />
          <Text style={[styles.addServiceText, { color: tokens.textMuted }]}>Cadastrar novo servico</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counter: {
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 12,
    fontSize: 14,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
  serviceRow: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceBody: {
    flex: 1,
    gap: 4,
  },
  serviceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '700',
  },
  serviceMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  serviceMeta: {
    fontSize: 13,
    marginRight: 8,
  },
  servicePrice: {
    fontSize: 13,
    fontWeight: '700',
  },
  addService: {
    minHeight: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addServiceText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
