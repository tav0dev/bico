import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BicoTopBar, IconButton } from '@/components/bico/ui';
import { GoogleCalendarEvent, useBico } from '@/context/bico-context';

const hours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const hourHeight = 64;
const weekDayFormatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' });
const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });
const timeFormatter = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });

function sameDay(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

function buildWeek(date: Date) {
  const current = new Date(date);
  const day = current.getDay();
  const distanceFromMonday = (day + 6) % 7;
  current.setDate(current.getDate() - distanceFromMonday);
  current.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, index) => {
    const next = new Date(current);
    next.setDate(current.getDate() + index);
    return next;
  });
}

function eventDate(value?: string) {
  if (!value) {
    return null;
  }

  if (value.length === 10) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day, 8, 0);
  }

  return new Date(value);
}

function mapEvent(event: GoogleCalendarEvent, selectedDate: Date, color: string) {
  const start = eventDate(event.start?.dateTime ?? event.start?.date);
  if (!start || !sameDay(start, selectedDate)) {
    return null;
  }

  const end = eventDate(event.end?.dateTime ?? event.end?.date) ?? new Date(start.getTime() + 60 * 60 * 1000);
  const duration = Math.max((end.getTime() - start.getTime()) / 3600000, 0.5);

  return {
    id: event.id ?? `${event.summary}-${start.toISOString()}`,
    start,
    duration,
    title: event.summary ?? '(Sem titulo)',
    color,
  };
}

export default function AgendaScreen() {
  const { errorMessage, fetchGoogleEvents, googleEvents, isGoogleLoggedIn, isLoadingEvents, logoutGoogle, tokens } = useBico();
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  useEffect(() => {
    fetchGoogleEvents();
  }, [fetchGoogleEvents]);

  const weekDays = useMemo(() => buildWeek(selectedDate), [selectedDate]);
  const dayEvents = useMemo(
    () => googleEvents.map((event) => mapEvent(event, selectedDate, tokens.green)).filter(Boolean),
    [googleEvents, selectedDate, tokens.green],
  );

  function handleAccountPress() {
    if (!isGoogleLoggedIn) {
      fetchGoogleEvents();
      return;
    }

    Alert.alert('Conta Google', 'Deseja desconectar sua conta do Google Calendar?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logoutGoogle },
    ]);
  }

  const now = new Date();
  const nowTop = (now.getHours() - hours[0]) * hourHeight + (now.getMinutes() / 60) * hourHeight;

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: tokens.bg }]}>
      <BicoTopBar
        title={monthFormatter.format(selectedDate).toUpperCase()}
        leading={
          <IconButton
            name="refresh"
            onPress={fetchGoogleEvents}
            color={tokens.text}
            size={20}
          />
        }
        trailing={
          <IconButton
            name={isGoogleLoggedIn ? 'person-circle' : 'log-in-outline'}
            onPress={handleAccountPress}
            color={isGoogleLoggedIn ? tokens.green : tokens.textFaint}
            size={25}
          />
        }
      />

      <View style={styles.weekRow}>
        {weekDays.map((day) => {
          const selected = sameDay(day, selectedDate);
          return (
            <Pressable
              key={day.toISOString()}
              onPress={() => setSelectedDate(day)}
              style={[styles.dayButton, { backgroundColor: selected ? tokens.green : 'transparent' }]}>
              <Text style={[styles.weekDay, { color: selected ? '#FFFFFF' : tokens.textMuted }]}>
                {weekDayFormatter.format(day).replace('.', '').toUpperCase()}
              </Text>
              <Text style={[styles.dayNumber, { color: selected ? '#FFFFFF' : tokens.text }]}>{day.getDate()}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.timelineWrap}>
        <ScrollView contentContainerStyle={styles.timelineContent}>
          <View style={styles.timeline}>
            {hours.map((hour, index) => (
              <View
                key={hour}
                style={[
                  styles.hourLine,
                  {
                    top: index * hourHeight,
                    borderTopColor: tokens.borderSoft,
                  },
                ]}>
                <Text style={[styles.hourLabel, { color: tokens.textFaint }]}>{hour}:00</Text>
              </View>
            ))}

            {sameDay(selectedDate, now) && nowTop >= 0 && nowTop <= hours.length * hourHeight ? (
              <View style={[styles.nowLine, { top: nowTop, backgroundColor: tokens.red }]} />
            ) : null}

            {dayEvents.map((event) => {
              if (!event) {
                return null;
              }

              const top = (event.start.getHours() - hours[0]) * hourHeight + (event.start.getMinutes() / 60) * hourHeight;
              const height = Math.max(event.duration * hourHeight - 2, 28);

              if (top < 0) {
                return null;
              }

              return (
                <View
                  key={event.id}
                  style={[
                    styles.eventCard,
                    {
                      top,
                      height,
                      backgroundColor: `${event.color}22`,
                      borderLeftColor: event.color,
                    },
                  ]}>
                  <Text numberOfLines={1} style={[styles.eventTitle, { color: tokens.text }]}>{event.title}</Text>
                  <Text style={[styles.eventTime, { color: tokens.textMuted }]}>{timeFormatter.format(event.start)}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>

        {isLoadingEvents ? (
          <View style={styles.emptyOverlay}>
            <ActivityIndicator color={tokens.green} />
          </View>
        ) : dayEvents.length === 0 ? (
          <View style={styles.emptyOverlay}>
            <Ionicons name="calendar-clear-outline" size={48} color={`${tokens.text}44`} />
            <Text style={[styles.emptyText, { color: tokens.textMuted }]}>
              {errorMessage ?? (googleEvents.length === 0 ? 'Nenhum evento carregado do Google.' : 'Nenhum compromisso para este dia.')}
            </Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  weekRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dayButton: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 10,
  },
  weekDay: {
    fontSize: 10,
    fontWeight: '700',
  },
  dayNumber: {
    marginTop: 2,
    fontSize: 18,
    fontWeight: '800',
  },
  timelineWrap: {
    flex: 1,
  },
  timelineContent: {
    paddingLeft: 48,
    paddingRight: 12,
    paddingBottom: 20,
  },
  timeline: {
    height: hours.length * hourHeight,
  },
  hourLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: hourHeight,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  hourLabel: {
    position: 'absolute',
    left: -44,
    top: -8,
    width: 40,
    textAlign: 'right',
    fontSize: 11,
  },
  nowLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
  },
  eventCard: {
    position: 'absolute',
    left: 4,
    right: 4,
    borderLeftWidth: 4,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 7,
  },
  eventTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  eventTime: {
    marginTop: 2,
    fontSize: 11,
  },
  emptyOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
});
