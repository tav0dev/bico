import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BicoCard, BicoPill, BicoToggle, BicoTopBar, IconButton, BicoField, BicoButton } from '@/components/bico/ui';
import { useBico } from '@/context/bico-context';

const initialServices = [
  { name: 'Treino personalizado', dur: '1h', price: 120, active: true, tag: 'Mais vendido' },
  { name: 'Avaliacao fisica', dur: '45min', price: 90, active: true, tag: '' },
  { name: 'Plano mensal (8 sessoes)', dur: '8 sessoes', price: 750, active: true, tag: 'Pacote' },
  { name: 'Treino dupla', dur: '1h', price: 180, active: true, tag: '' },
  { name: 'Consultoria online', dur: '30min', price: 60, active: false, tag: '' },
];

export default function ServicesScreen() {
  const router = useRouter();
  const { tokens } = useBico();
  const [servicesList, setServicesList] = useState(initialServices);

  // Modal control states
  const [isModalVisible, setModalVisible] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDur, setNewServiceDur] = useState('1h');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceTag, setNewServiceTag] = useState('');

  const activeCount = useMemo(() => servicesList.filter((service) => service.active).length, [servicesList]);

  function handleToggle(name: string) {
    setServicesList((current) =>
      current.map((service) => (service.name === name ? { ...service, active: !service.active } : service))
    );
  }

  function handleAddService() {
    if (!newServiceName.trim()) return;

    const newService = {
      name: newServiceName,
      dur: newServiceDur || '1h',
      price: parseInt(newServicePrice, 10) || 0,
      active: true,
      tag: newServiceTag,
    };

    setServicesList((current) => [...current, newService]);
    setModalVisible(false);

    // Reset Form Fields
    setNewServiceName('');
    setNewServiceDur('1h');
    setNewServicePrice('');
    setNewServiceTag('');
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: tokens.bg }]}>
      <BicoTopBar
        title="Servicos"
        large
        leading={<IconButton name="chevron-back" onPress={() => router.back()} />}
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
      <Text style={[styles.counter, { color: tokens.textMuted }]}>{activeCount} servicos ativos</Text>

      <ScrollView contentContainerStyle={styles.content}>
        {servicesList.map((service) => (
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
              <BicoToggle on={service.active} onPress={() => handleToggle(service.name)} />
            </View>
          </BicoCard>
        ))}

        <Pressable
          onPress={() => setModalVisible(true)}
          style={({ pressed }) => [
            styles.addService,
            { borderColor: tokens.border, opacity: pressed ? 0.72 : 1 }
          ]}>
          <Ionicons name="add" size={16} color={tokens.textMuted} />
          <Text style={[styles.addServiceText, { color: tokens.textMuted }]}>Cadastrar novo servico</Text>
        </Pressable>
      </ScrollView>

      {/* Modal - Cadastro de Novo Serviço */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: tokens.bg, borderColor: tokens.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: tokens.text }]}>Novo Serviço</Text>
              <Pressable onPress={() => setModalVisible(false)} style={styles.closeModalButton}>
                <Ionicons name="close" size={24} color={tokens.text} />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
              <BicoField
                label="Nome do Serviço"
                placeholder="Ex: Treino Personalizado"
                icon="briefcase-outline"
                value={newServiceName}
                onChangeText={setNewServiceName}
                style={styles.modalField}
              />

              <View style={styles.rowFields}>
                <BicoField
                  label="Duração"
                  placeholder="Ex: 1h ou 45min"
                  icon="time-outline"
                  value={newServiceDur}
                  onChangeText={setNewServiceDur}
                  style={[styles.modalField, { flex: 1 }]}
                />
                <BicoField
                  label="Preço (R$)"
                  placeholder="Ex: 120"
                  icon="cash-outline"
                  value={newServicePrice}
                  onChangeText={setNewServicePrice}
                  keyboardType="numeric"
                  style={[styles.modalField, { flex: 1 }]}
                />
              </View>

              <BicoField
                label="Etiqueta / Destaque (opcional)"
                placeholder="Ex: Mais vendido ou Pacote"
                icon="pricetag-outline"
                value={newServiceTag}
                onChangeText={setNewServiceTag}
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
                  label="Cadastrar"
                  variant="primary"
                  onPress={handleAddService}
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
    marginTop: 6,
  },
  addServiceText: {
    fontSize: 14,
    fontWeight: '600',
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
  rowFields: {
    flexDirection: 'row',
    gap: 12,
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
