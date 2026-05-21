import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AISparkle, BicoTopBar, IconButton } from '@/components/bico/ui';
import { useBico } from '@/context/bico-context';

const fullCaption =
  'Quer comecar a treinar mas nao sabe por onde?\n\nMonte sua avaliacao fisica comigo: a gente analisa postura, condicionamento e seus objetivos. Depois eu monto um plano feito para sua rotina.\n\nVila Madalena - Online tambem\nReserva pelo link na bio';

const hashtags = ['#personaltrainer', '#vilamadalena', '#treinofuncional', '#saude'];
const channels = ['Instagram', 'WhatsApp Status', 'Facebook'];

export default function CreatePostScreen() {
  const router = useRouter();
  const { tokens } = useBico();
  const [typed, setTyped] = useState(fullCaption);
  const [generating, setGenerating] = useState(false);
  const [activeChannels, setActiveChannels] = useState([true, true, false]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timer.current) {
      clearInterval(timer.current);
    }
  }, []);

  function startGenerate() {
    if (timer.current) {
      clearInterval(timer.current);
    }

    setTyped('');
    setGenerating(true);
    let cursor = 0;

    timer.current = setInterval(() => {
      cursor = Math.min(cursor + 3, fullCaption.length);
      setTyped(fullCaption.slice(0, cursor));

      if (cursor >= fullCaption.length && timer.current) {
        clearInterval(timer.current);
        timer.current = null;
        setGenerating(false);
      }
    }, 20);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: tokens.bg }]}>
      <BicoTopBar
        title="Criar post"
        leading={<IconButton name="close" onPress={() => router.back()} />}
        trailing={
          <Pressable style={[styles.publishButton, { backgroundColor: tokens.green }]}>
            <Text style={styles.publishText}>Publicar</Text>
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.photoBox, { backgroundColor: tokens.bgSoft, borderColor: tokens.border }]}>
          <View style={styles.photoCenter}>
            <Ionicons name="image-outline" size={36} color={tokens.textFaint} />
            <Text style={[styles.photoFile, { color: tokens.textMuted }]}>foto do treino.jpg</Text>
          </View>
          <View style={styles.swapButton}>
            <Ionicons name="create-outline" size={14} color="#FFFFFF" />
            <Text style={styles.swapText}>Trocar</Text>
          </View>
        </View>

        <View style={[styles.aiRow, { backgroundColor: tokens.orangeSoft }]}>
          <AISparkle size={14} />
          <Text style={[styles.aiCopy, { color: tokens.text }]}>Tuco escreveu uma legenda baseada na sua foto e perfil</Text>
          <Pressable onPress={startGenerate} style={[styles.generateButton, { backgroundColor: tokens.orange }]}>
            <Ionicons name="refresh" size={13} color="#FFFFFF" />
            <Text style={styles.generateText}>Gerar</Text>
          </Pressable>
        </View>

        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: tokens.text }]}>Legenda</Text>
          <Text style={[styles.counter, { color: tokens.textFaint }]}>{typed.length}/2200</Text>
        </View>
        <View style={[styles.captionBox, { backgroundColor: tokens.bgSoft, borderColor: tokens.border }]}>
          <Text style={[styles.caption, { color: tokens.text }]}>{typed}</Text>
          {generating ? <View style={[styles.cursor, { backgroundColor: tokens.orange }]} /> : null}
        </View>

        <View style={styles.hashtagHeader}>
          <Text style={[styles.label, { color: tokens.text }]}>Hashtags</Text>
          <AISparkle size={11} />
        </View>
        <View style={styles.hashtags}>
          {hashtags.map((hashtag) => (
            <View key={hashtag} style={[styles.hashtag, { backgroundColor: tokens.purpleSoft }]}>
              <Text style={[styles.hashtagText, { color: tokens.purple }]}>{hashtag}</Text>
            </View>
          ))}
          <View style={[styles.hashtagAdd, { borderColor: tokens.border }]}>
            <Text style={[styles.hashtagAddText, { color: tokens.textMuted }]}>+ adicionar</Text>
          </View>
        </View>

        <Text style={[styles.label, { color: tokens.text }]}>Publicar em</Text>
        <View style={styles.channelRow}>
          {channels.map((channel, index) => {
            const active = activeChannels[index];
            return (
              <Pressable
                key={channel}
                onPress={() => setActiveChannels((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value))}
                style={[
                  styles.channel,
                  {
                    backgroundColor: active ? tokens.greenSoft : tokens.bgSoft,
                    borderColor: active ? tokens.green : tokens.border,
                  },
                ]}>
                {active ? <Ionicons name="checkmark" size={13} color={tokens.green} /> : null}
                <Text style={[styles.channelText, { color: active ? tokens.green : tokens.textMuted }]}>{channel}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  publishButton: {
    minHeight: 34,
    borderRadius: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  publishText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 16,
    gap: 14,
  },
  photoBox: {
    aspectRatio: 4 / 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    overflow: 'hidden',
  },
  photoCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  photoFile: {
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: '600',
  },
  swapButton: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#0F172ADD',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  swapText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  aiRow: {
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiCopy: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  generateButton: {
    minHeight: 30,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  generateText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
  },
  counter: {
    fontSize: 12,
  },
  captionBox: {
    minHeight: 120,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  caption: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
  },
  cursor: {
    width: 2,
    height: 16,
    marginLeft: 1,
    marginTop: 2,
  },
  hashtagHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hashtags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  hashtag: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  hashtagText: {
    fontSize: 13,
    fontWeight: '600',
  },
  hashtagAdd: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  hashtagAddText: {
    fontSize: 13,
    fontWeight: '600',
  },
  channelRow: {
    flexDirection: 'row',
    gap: 8,
  },
  channel: {
    flex: 1,
    minHeight: 42,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 6,
  },
  channelText: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
});


