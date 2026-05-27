import { Ionicons } from '@expo/vector-icons';
import { useState, useMemo } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View, TextInput, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BicoAvatar, BicoPill, BicoTopBar, BicoField, BicoButton } from '@/components/bico/ui';
import { useBico } from '@/context/bico-context';

const initialClients = [
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
  const [clientsList, setClientsList] = useState(initialClients);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal form states
  const [isModalVisible, setModalVisible] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientTag, setNewClientTag] = useState<'Pacote' | 'Avulso' | 'Pausado'>('Pacote');
  const [newClientValue, setNewClientValue] = useState('');

  // Calculate dynamic stats
  const activeCount = useMemo(() => clientsList.filter((c) => !c.paused).length, [clientsList]);
  const newCount = useMemo(() => clientsList.filter((c) => c.isNew).length, [clientsList]);
  const totalRecurrentStr = useMemo(() => {
    let sum = 0;
    clientsList.forEach((c) => {
      if (c.value.includes('/mes') && !c.paused) {
        const parsed = parseInt(c.value.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(parsed)) sum += parsed;
      }
    });
    return `R$ ${(sum / 1000).toFixed(1)}k`;
  }, [clientsList]);

  // Filter clients
  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clientsList;
    const query = searchQuery.toLowerCase();
    return clientsList.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.tag.toLowerCase().includes(query)
    );
  }, [clientsList, searchQuery]);

  // Group clients
  const grouped = useMemo(() => {
    return [
      { title: 'Hoje', data: filteredClients.filter((client) => client.recent) },
      { title: 'Esta semana', data: filteredClients.filter((client) => !client.recent && !client.paused) },
      { title: 'Inativos', data: filteredClients.filter((client) => client.paused) },
    ].filter((group) => group.data.length > 0);
  }, [filteredClients]);

  function handleAddClient() {
    if (!newClientName.trim()) return;

    let displayValue = '-';
    if (newClientValue) {
      if (newClientTag === 'Pacote') {
        displayValue = newClientValue.includes('/mes') ? newClientValue : `R$ ${newClientValue}/mes`;
      } else {
        displayValue = newClientValue.toLowerCase().includes('sessao') || newClientValue.toLowerCase().includes('sessoes')
          ? newClientValue
          : `${newClientValue} sessoes`;
      }
    }

    const newClient = {
      name: newClientName,
      tag: newClientTag,
      last: 'hoje',
      value: displayValue,
      recent: true,
      isNew: true,
      paused: newClientTag === 'Pausado',
    };

    setClientsList((prev) => [newClient, ...prev]);
    setModalVisible(false);

    // Reset Form fields
    setNewClientName('');
    setNewClientTag('Pacote');
    setNewClientValue('');
  }

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: tokens.bg }]}>
      <BicoTopBar
        title="Clientes"
        large
        trailing={
          <Pressable
            onPress={() => setModalVisible(true)}
            style={({ pressed }) => [
              styles.addButton,
              { backgroundColor: tokens.green, opacity: pressed ? 0.8 : 1 }
            ]}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </Pressable>
        }
      />

      {/* Real TextInput Searchbar */}
      <View style={[styles.searchBar, { backgroundColor: tokens.bgSoft }]}>
        <Ionicons name="search" size={18} color={tokens.textMuted} />
        <TextInput
          placeholder="Buscar cliente..."
          placeholderTextColor={tokens.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[styles.searchInput, { color: tokens.text }]}
        />
        {searchQuery ? (
          <Pressable onPress={() => setSearchQuery('')} style={styles.clearPressable}>
            <Ionicons name="close-circle" size={18} color={tokens.textMuted} />
          </Pressable>
        ) : (
          <Ionicons name="options-outline" size={16} color={tokens.text} />
        )}
      </View>

      {/* Horizontal Stats Row */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsRow}>
        <StatCard value={String(activeCount)} label="ativos" tint={tokens.green} />
        <StatCard value={String(newCount)} label="novos" tint={tokens.purple} />
        <StatCard value={totalRecurrentStr} label="recorrente" tint={tokens.orange} />
      </ScrollView>

      {/* Client List */}
      <FlatList
        data={grouped}
        keyExtractor={(item) => item.title}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={tokens.textFaint} />
            <Text style={[styles.emptyText, { color: tokens.textMuted }]}>
              Nenhum cliente correspondente encontrado.
            </Text>
          </View>
        }
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
        ListFooterComponent={
          filteredClients.length > 0 ? (
            <Text style={[styles.footerText, { color: tokens.textFaint }]}>
              {filteredClients.length} clientes exibidos ({clientsList.length} no total)
            </Text>
          ) : null
        }
      />

      {/* Modal - Cadastro de Novo Cliente */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: tokens.bg, borderColor: tokens.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: tokens.text }]}>Adicionar Cliente</Text>
              <Pressable onPress={() => setModalVisible(false)} style={styles.closeModalButton}>
                <Ionicons name="close" size={24} color={tokens.text} />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
              <BicoField
                label="Nome completo"
                placeholder="Nome do cliente"
                icon="person-outline"
                value={newClientName}
                onChangeText={setNewClientName}
                style={styles.modalField}
              />

              {/* Tag / Tipo de plano selector */}
              <Text style={[styles.selectorLabel, { color: tokens.text }]}>Tipo de Contrato</Text>
              <View style={styles.segmentedSelector}>
                {(['Pacote', 'Avulso', 'Pausado'] as const).map((tag) => {
                  const active = newClientTag === tag;
                  return (
                    <Pressable
                      key={tag}
                      onPress={() => setNewClientTag(tag)}
                      style={[
                        styles.selectorSegment,
                        {
                          backgroundColor: active ? tokens.green : tokens.bgSoft,
                          borderColor: active ? tokens.green : tokens.border,
                        },
                      ]}>
                      <Text style={[styles.selectorSegmentText, { color: active ? '#FFFFFF' : tokens.text }]}>
                        {tag}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <BicoField
                label={newClientTag === 'Pacote' ? 'Valor Mensal (R$)' : 'Número de Sessões'}
                placeholder={newClientTag === 'Pacote' ? 'Ex: 750' : 'Ex: 8'}
                icon={newClientTag === 'Pacote' ? 'cash-outline' : 'document-text-outline'}
                value={newClientValue}
                onChangeText={setNewClientValue}
                keyboardType="numeric"
                style={styles.modalField}
              />

              <View style={styles.modalActions}>
                <BicoButton
                  label="Cancelar"
                  variant="secondary"
                  onPress={() => setModalVisible(false)}
                  style={styles.modalButton}
                />
                <BicoButton
                  label="Adicionar"
                  variant="primary"
                  onPress={handleAddClient}
                  style={styles.modalButton}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    padding: 0,
  },
  clearPressable: {
    padding: 4,
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1.5,
    paddingBottom: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeModalButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
  },
  modalField: {
    marginBottom: 16,
  },
  selectorLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  segmentedSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  selectorSegment: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorSegmentText: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  modalButton: {
    flex: 1,
  },
});
