import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AISparkle, BicoAvatar, BicoPill, BicoTopBar } from '@/components/bico/ui';
import { useBico } from '@/context/bico-context';

const filters = ['Tudo (3)', 'Nao lidas', 'WhatsApp', 'Instagram'];
const messages = [
  { name: 'Carla Mendes', preview: 'Posso remarcar pra quinta as 16h?', time: '14:32', unread: 2, channel: 'wpp', online: true, aiSuggest: false, isNew: false, sent: false },
  { name: 'Joao Pedro', preview: 'Confirmado para amanha', time: '11:08', unread: 0, channel: 'wpp', online: false, aiSuggest: false, isNew: false, sent: false },
  { name: 'Lia Faria', preview: 'Voce: enviei o orcamento, qualquer duvida...', time: '10:14', unread: 0, channel: 'instagram', online: false, aiSuggest: false, isNew: false, sent: true },
  { name: 'Pedro Rocha', preview: 'Bom dia! Quanto custa um pacote mensal?', time: 'Ontem', unread: 1, channel: 'wpp', online: false, aiSuggest: true, isNew: false, sent: false },
  { name: 'Beatriz Lima', preview: 'Obrigada pela sessao de hoje!', time: 'Ontem', unread: 0, channel: 'wpp', online: false, aiSuggest: false, isNew: false, sent: false },
  { name: '+55 11 9 8123-4567', preview: 'Ola, vi seu perfil no Instagram...', time: 'seg', unread: 1, channel: 'wpp', online: false, aiSuggest: true, isNew: true, sent: false },
  { name: 'Tomas Andrade', preview: 'Beleza, te aviso semana que vem', time: 'seg', unread: 0, channel: 'instagram', online: false, aiSuggest: false, isNew: false, sent: false },
];

export default function InboxScreen() {
  const router = useRouter();
  const { tokens } = useBico();
  const [activeFilter, setActiveFilter] = useState(0);

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: tokens.bg }]}>
      <BicoTopBar
        title="Mensagens"
        large
        trailing={<Ionicons name="search" size={20} color={tokens.text} style={styles.searchIcon} />}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {filters.map((filter, index) => (
          <Pressable
            key={filter}
            onPress={() => setActiveFilter(index)}
            style={[styles.filterChip, { backgroundColor: index === activeFilter ? tokens.text : tokens.bgSoft }]}>
            <Text style={[styles.filterText, { color: index === activeFilter ? tokens.bg : tokens.textMuted }]}>{filter}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push('/inbox-thread')}
            style={[styles.messageTile, { borderBottomColor: tokens.borderSoft }]}>
            <View>
              <BicoAvatar name={item.name} size={44} />
              {item.online ? <View style={[styles.onlineDot, { backgroundColor: tokens.green, borderColor: tokens.bg }]} /> : null}
              <View
                style={[
                  styles.channelBadge,
                  {
                    backgroundColor: item.channel === 'wpp' ? '#25D366' : '#DD2A7B',
                    borderColor: tokens.bg,
                  },
                ]}>
                <Text style={styles.channelText}>{item.channel === 'wpp' ? 'W' : 'IG'}</Text>
              </View>
            </View>

            <View style={styles.messageBody}>
              <View style={styles.messageTopRow}>
                <View style={styles.nameRow}>
                  <Text numberOfLines={1} style={[styles.messageName, { color: tokens.text, fontWeight: item.unread ? '800' : '700' }]}>
                    {item.name}
                  </Text>
                  {item.isNew ? <BicoPill text="novo" color="purple" size="sm" /> : null}
                </View>
                <Text style={[styles.messageTime, { color: item.unread ? tokens.green : tokens.textFaint }]}>{item.time}</Text>
              </View>
              <View style={styles.previewRow}>
                {item.sent ? <Ionicons name="checkmark" size={12} color={tokens.textMuted} /> : null}
                <Text numberOfLines={1} style={[styles.preview, { color: item.unread ? tokens.text : tokens.textMuted }]}>
                  {item.preview}
                </Text>
                {item.aiSuggest ? <AISparkle size={11} /> : null}
                {item.unread ? (
                  <View style={[styles.unreadBadge, { backgroundColor: tokens.green }]}>
                    <Text style={styles.unreadText}>{item.unread}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  searchIcon: {
    padding: 10,
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 6,
  },
  filterChip: {
    height: 30,
    borderRadius: 999,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  messageTile: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  onlineDot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 2,
  },
  channelBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '800',
  },
  messageBody: {
    flex: 1,
    gap: 3,
  },
  messageTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nameRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  messageName: {
    flexShrink: 1,
    fontSize: 15,
  },
  messageTime: {
    fontSize: 12,
    fontWeight: '600',
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  preview: {
    flex: 1,
    fontSize: 13,
  },
  unreadBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
});
