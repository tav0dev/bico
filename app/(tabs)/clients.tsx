import { Ionicons } from '@expo/vector-icons';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BicoAvatar, BicoPill, BicoTopBar } from '@/components/bico/ui';
import { useBico } from '@/context/bico-context';

const clients = [
  { name: 'Carla Mendes', tag: 'Pacote', last: 'hoje', value: 'R$ 750/mes', recent: true, isNew: false, paused: false },
  { name: 'Joao Pedro', tag: 'Avulso', last: 'amanha', value: '8 sessoes', recent: false, isNew: false, paused: false },
  { name: 'Lia Faria', tag: 'Pacote', last: 'ontem', value: 'R$ 1.080/mes', recent: false, isNew: false, paused: false },
  { name: 'Pedro Rocha', tag: 'Novo', last: 'ha 3 dias', value: '-', recent: false, isNew: true, paused: false },
  { name: 'Beatriz Lima', tag: 'Pacote', last: 'ha 5 dias', value: 'R$ 750/mes', recent: false, isNew: false, paused: false },
  { name: 'Tomas Andrade', tag: 'Pausado', last: 'ha 2 sem', value: '-', recent: false, isNew: false, paused: true },
  { name: 'Renata Costa', tag: 'Avulso', last: 'ha 1 mes', value: '3 sessoes', recent: false, isNew: false, paused: false },
];

export default function ClientsScreen() {
  const { tokens } = useBico();
  const grouped = [
    { title: 'Hoje', data: clients.filter((client) => client.recent) },
    { title: 'Esta semana', data: clients.filter((client) => !client.recent && !client.paused).slice(0, 4) },
    { title: 'Inativos', data: clients.filter((client) => client.paused) },
  ];

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: tokens.bg }]}>
      <BicoTopBar
        title="Clientes"
        large
        trailing={
          <View style={[styles.addButton, { backgroundColor: tokens.green }]}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </View>
        }
      />

      <View style={[styles.searchBar, { backgroundColor: tokens.bgSoft }]}>
        <Ionicons name="search" size={18} color={tokens.textMuted} />
        <Text style={[styles.searchText, { color: tokens.textMuted }]}>Buscar cliente...</Text>
        <Ionicons name="options-outline" size={16} color={tokens.text} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsRow}>
        <StatCard value="24" label="ativos" tint={tokens.green} />
        <StatCard value="3" label="novos" tint={tokens.purple} />
        <StatCard value="R$ 6.4k" label="recorrente" tint={tokens.orange} />
      </ScrollView>

      <FlatList
        data={grouped}
        keyExtractor={(item) => item.title}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View>
            <Text style={[styles.groupTitle, { color: tokens.textMuted }]}>{item.title.toUpperCase()}</Text>
            {item.data.map((client, index) => (
              <View
                key={client.name}
                style={[
                  styles.clientTile,
                  {
                    borderColor: tokens.borderSoft,
                    opacity: client.paused ? 0.6 : 1,
                    borderTopWidth: index === 0 ? StyleSheet.hairlineWidth : 0,
                  },
                ]}>
                <BicoAvatar name={client.name} size={42} />
                <View style={styles.clientBody}>
                  <View style={styles.clientNameRow}>
                    <Text style={[styles.clientName, { color: tokens.text }]}>{client.name}</Text>
                    {client.isNew ? <BicoPill text="novo" color="purple" size="sm" /> : null}
                  </View>
                  <Text style={[styles.clientMeta, { color: tokens.textMuted }]}>
                    {client.tag} - ultimo contato {client.last}
                  </Text>
                </View>
                <Text style={[styles.clientValue, { color: tokens.text }]}>{client.value}</Text>
              </View>
            ))}
          </View>
        )}
        ListFooterComponent={<Text style={[styles.footerText, { color: tokens.textFaint }]}>24 clientes no total</Text>}
      />
    </SafeAreaView>
  );
}

function StatCard({ value, label, tint }: { value: string; label: string; tint: string }) {
  const { tokens } = useBico();

  return (
    <View style={[styles.statCard, { backgroundColor: tokens.bgSoft, borderColor: tokens.borderSoft }]}>
      <Text style={[styles.statValue, { color: tint }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: tokens.textMuted }]}>{label}</Text>
    </View>
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
  searchBar: {
    height: 42,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchText: {
    flex: 1,
    fontSize: 14,
  },
  statsRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 10,
  },
  statCard: {
    minWidth: 90,
    height: 50,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
  },
  statLabel: {
    marginTop: 1,
    fontSize: 11,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 12,
  },
  groupTitle: {
    marginTop: 14,
    marginBottom: 6,
    marginHorizontal: 20,
    fontSize: 11,
    fontWeight: '800',
  },
  clientTile: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clientBody: {
    flex: 1,
  },
  clientNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clientName: {
    fontSize: 15,
    fontWeight: '700',
  },
  clientMeta: {
    marginTop: 2,
    fontSize: 12,
  },
  clientValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  footerText: {
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 13,
  },
});
