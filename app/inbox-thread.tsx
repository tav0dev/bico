import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AISparkle, BicoAvatar, IconButton } from '@/components/bico/ui';
import { useBico } from '@/context/bico-context';

const initialMessages = [
  { from: 'them', text: 'Oi Marina! Vi seu trabalho no Instagram', time: '14:20' },
  { from: 'them', text: 'Voce atende perto da Vila Madalena? Quanto custa um pacote mensal?', time: '14:20' },
  { from: 'me', text: 'Oi Carla! Atendo sim. Tenho dois pacotes:\n\n8 sessoes/mes - R$ 750\n12 sessoes/mes - R$ 1.080', time: '14:25' },
  { from: 'them', text: 'Perfeito! Posso comecar quinta-feira?', time: '14:30' },
  { from: 'them', text: 'Posso remarcar pra quinta as 16h?', time: '14:32' },
];

const initialSuggestions = [
  'Posso sim! Quinta as 16h esta confirmado.',
  'Quinta tenho 16h ou 18h. Qual prefere?',
  'Hoje nao consigo as 16h. E as 17h30?',
];

export default function InboxThreadScreen() {
  const router = useRouter();
  const { tokens } = useBico();
  const [chatMessages, setChatMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [suggestions, setSuggestions] = useState(initialSuggestions);

  function handleSend(text: string) {
    if (!text.trim()) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Add user message
    setChatMessages((prev) => [...prev, { from: 'me', text, time: timeStr }]);
    setInputText('');

    // Hide suggestions or update them after sending
    setShowSuggestions(false);

    // Simulate a reply after 1.5 seconds
    setTimeout(() => {
      const replyTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setChatMessages((prev) => [
        ...prev,
        {
          from: 'them',
          text: 'Perfeito! Obrigado pelo retorno rápido Marina. Nos vemos lá!',
          time: replyTime,
        },
      ]);
    }, 1500);
  }

  function handleSuggestionPress(suggestion: string) {
    handleSend(suggestion);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: tokens.bg }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: tokens.borderSoft }]}>
        <IconButton name="chevron-back" onPress={() => router.back()} />
        <BicoAvatar name="Carla Mendes" size={36} />
        <View style={styles.headerText}>
          <Text style={[styles.contactName, { color: tokens.text }]}>Carla Mendes</Text>
          <View style={styles.inlineRow}>
            <View style={[styles.statusDot, { backgroundColor: tokens.green }]} />
            <Text style={[styles.statusText, { color: tokens.green }]}>online - WhatsApp</Text>
          </View>
        </View>
        <IconButton name="ellipsis-vertical" />
      </View>

      {/* Context strip showing client info */}
      <View style={[styles.contextStrip, { backgroundColor: tokens.purpleSoft, borderBottomColor: tokens.borderSoft }]}>
        <AISparkle size={13} />
        <Text style={[styles.contextText, { color: tokens.text }]}>
          <Text style={styles.bold}>Cliente desde mar/2026 - </Text>
          <Text style={{ color: tokens.textMuted }}>Pacote 8 sessoes - proximo: hoje 14:00</Text>
        </Text>
      </View>

      {/* Message List */}
      <FlatList
        data={chatMessages}
        keyExtractor={(item, index) => `${item.time}-${index}`}
        contentContainerStyle={styles.messageList}
        ref={(ref) => {
          // Scroll to end automatically when messages load or change
          setTimeout(() => ref?.scrollToEnd({ animated: true }), 100);
        }}
        renderItem={({ item }) => {
          const isMe = item.from === 'me';
          return (
            <View style={[styles.bubbleWrap, { alignItems: isMe ? 'flex-end' : 'flex-start' }]}>
              <View
                style={[
                  styles.bubble,
                  {
                    backgroundColor: isMe ? tokens.green : tokens.bgSoft,
                    borderBottomLeftRadius: isMe ? 16 : 4,
                    borderBottomRightRadius: isMe ? 4 : 16,
                  },
                ]}>
                <Text style={[styles.bubbleText, { color: isMe ? '#FFFFFF' : tokens.text }]}>{item.text}</Text>
                <Text style={[styles.bubbleTime, { color: isMe ? '#FFFFFFAA' : tokens.textMuted }]}>{item.time}</Text>
              </View>
            </View>
          );
        }}
      />

      {/* Tuco Smart suggestions */}
      {showSuggestions ? (
        <View style={[styles.suggestions, { backgroundColor: tokens.bgSoft, borderTopColor: tokens.borderSoft }]}>
          <View style={styles.suggestionsHeader}>
            <AISparkle size={11} />
            <Text style={[styles.suggestionTitle, { color: tokens.orange }]}>SUGESTOES DO TUCO</Text>
            <Pressable onPress={() => setShowSuggestions(false)} style={styles.closeSuggestion}>
              <Ionicons name="close" size={16} color={tokens.textMuted} />
            </Pressable>
          </View>
          {suggestions.map((suggestion) => (
            <Pressable
              key={suggestion}
              onPress={() => handleSuggestionPress(suggestion)}
              style={({ pressed }) => [
                styles.suggestionItem,
                {
                  backgroundColor: tokens.bg,
                  borderColor: tokens.border,
                  opacity: pressed ? 0.72 : 1,
                },
              ]}>
              <Text style={[styles.suggestionText, { color: tokens.text }]}>{suggestion}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {/* Chat Input Bar */}
      <View style={[styles.inputRow, { backgroundColor: tokens.bg, borderTopColor: tokens.borderSoft }]}>
        <Ionicons name="attach-outline" size={21} color={tokens.textMuted} />
        <TextInput
          placeholder="Mensagem..."
          placeholderTextColor={tokens.textMuted}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => handleSend(inputText)}
          style={[styles.input, { backgroundColor: tokens.bgSoft, color: tokens.text }]}
        />
        <Pressable
          onPress={() => handleSend(inputText)}
          style={({ pressed }) => [
            styles.sendButton,
            {
              backgroundColor: tokens.green,
              opacity: pressed ? 0.8 : 1,
            },
          ]}>
          <Ionicons name="send" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    minHeight: 56,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerText: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '700',
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  contextStrip: {
    minHeight: 46,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contextText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
  bold: {
    fontWeight: '700',
  },
  messageList: {
    padding: 12,
    paddingBottom: 24,
  },
  bubbleWrap: {
    marginBottom: 8,
  },
  bubble: {
    maxWidth: '78%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTime: {
    alignSelf: 'flex-end',
    marginTop: 3,
    fontSize: 10,
  },
  suggestions: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
    gap: 6,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  suggestionTitle: {
    flex: 1,
    fontSize: 11,
    fontWeight: '800',
  },
  closeSuggestion: {
    padding: 4,
  },
  suggestionItem: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  suggestionText: {
    fontSize: 13,
    lineHeight: 18,
  },
  inputRow: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 38,
    borderRadius: 19,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
