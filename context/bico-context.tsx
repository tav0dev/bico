import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { BicoTokens, resolveBicoTokens } from '@/constants/bico-theme';
import { supabase } from '@/lib/supabase';
import type { Provider, Session } from '@supabase/supabase-js';

WebBrowser.maybeCompleteAuthSession();

export type GoogleCalendarEvent = {
  id?: string;
  summary?: string;
  description?: string;
  start?: {
    date?: string;
    dateTime?: string;
  };
  end?: {
    date?: string;
    dateTime?: string;
  };
};

type BicoContextValue = {
  isReady: boolean;
  isAuthenticated: boolean;
  isGoogleLoggedIn: boolean;
  isDark: boolean;
  accent: 'green' | 'purple';
  density: 'comfortable' | 'compact';
  navStyle: 'icons-labels' | 'icons-only' | 'fab-centered';
  cardStyle: 'soft' | 'flat' | 'outlined';
  tucoMode: 'placeholder' | 'simple' | 'hidden';
  tokens: BicoTokens;
  googleEvents: GoogleCalendarEvent[];
  isLoadingEvents: boolean;
  errorMessage: string | null;
  continueWithEmail: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  fetchGoogleEvents: () => Promise<boolean>;
  logoutGoogle: () => Promise<void>;
  setDark: (value: boolean) => void;
  setAccent: (value: 'green' | 'purple') => void;
};

const BicoContext = createContext<BicoContextValue | null>(null);

const googleCalendarScopes = 'https://www.googleapis.com/auth/calendar.readonly';

async function readJson<T>(url: string, accessToken: string) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  const payload = (await response.json()) as T & { error?: { message?: string } };

  if (!response.ok) {
    throw new Error(payload.error?.message ?? 'Nao foi possivel carregar os dados do Google.');
  }

  return payload;
}

export function BicoProvider({ children }: PropsWithChildren) {
  const [isReady, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [demoAuthenticated, setDemoAuthenticated] = useState(false);
  const [isDark, setDark] = useState(true);
  const [accent, setAccent] = useState<'green' | 'purple'>('green');
  const [density] = useState<'comfortable' | 'compact'>('comfortable');
  const [navStyle] = useState<'icons-labels' | 'icons-only' | 'fab-centered'>('icons-labels');
  const [cardStyle] = useState<'soft' | 'flat' | 'outlined'>('soft');
  const [tucoMode] = useState<'placeholder' | 'simple' | 'hidden'>('placeholder');
  const [googleEvents, setGoogleEvents] = useState<GoogleCalendarEvent[]>([]);
  const [isLoadingEvents, setLoadingEvents] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) {
        return;
      }
      setSession(data.session);
      setReady(true);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) {
        setDemoAuthenticated(true);
      } else {
        setGoogleEvents([]);
      }
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const tokens = useMemo(() => resolveBicoTokens(isDark, accent), [accent, isDark]);

  const continueWithEmail = useCallback(() => {
    setDemoAuthenticated(true);
  }, []);

  const signInWithProvider = useCallback(async (provider: Extract<Provider, 'google' | 'facebook'>) => {
    setErrorMessage(null);

    const redirectTo = Linking.createURL('/login-callback');
    const options: {
      redirectTo: string;
      skipBrowserRedirect: boolean;
      scopes?: string;
    } = {
      redirectTo,
      skipBrowserRedirect: true,
    };

    if (provider === 'google') {
      options.scopes = googleCalendarScopes;
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options,
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (data.url) {
      await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      const { data: sessionData } = await supabase.auth.getSession();
      setSession(sessionData.session);
      setDemoAuthenticated(Boolean(sessionData.session));
    }
  }, []);

  const fetchGoogleEvents = useCallback(async () => {
    const activeSession = session ?? (await supabase.auth.getSession()).data.session;
    const providerToken = activeSession?.provider_token;

    if (!providerToken) {
      setGoogleEvents([]);
      setErrorMessage('Entre com Google para sincronizar a agenda.');
      return false;
    }

    setLoadingEvents(true);
    setErrorMessage(null);

    try {
      const now = new Date();
      const startSearch = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString();
      const calendarList = await readJson<{ items?: { id?: string }[] }>(
        'https://www.googleapis.com/calendar/v3/users/me/calendarList',
        providerToken,
      );

      const calendarIds = calendarList.items?.map((calendar) => calendar.id).filter(Boolean) ?? ['primary'];
      const results = await Promise.all(
        calendarIds.map((id) =>
          readJson<{ items?: GoogleCalendarEvent[] }>(
            `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(id!)}/events?timeMin=${encodeURIComponent(startSearch)}&maxResults=50&singleEvents=true&orderBy=startTime`,
            providerToken,
          ).catch(() => ({ items: [] })),
        ),
      );

      const seen = new Set<string>();
      const events = results
        .flatMap((result) => result.items ?? [])
        .filter((event) => {
          const key = event.id ?? `${event.summary}-${event.start?.dateTime ?? event.start?.date}`;
          if (seen.has(key)) {
            return false;
          }
          seen.add(key);
          return true;
        });

      setGoogleEvents(events);
      return events.length > 0;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar eventos.';
      setErrorMessage(message);
      setGoogleEvents([]);
      return false;
    } finally {
      setLoadingEvents(false);
    }
  }, [session]);

  const logoutGoogle = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setDemoAuthenticated(false);
    setGoogleEvents([]);
  }, []);

  const value = useMemo<BicoContextValue>(() => ({
    isReady,
    isAuthenticated: demoAuthenticated || Boolean(session),
    isGoogleLoggedIn: Boolean(session),
    isDark,
    accent,
    density,
    navStyle,
    cardStyle,
    tucoMode,
    tokens,
    googleEvents,
    isLoadingEvents,
    errorMessage,
    continueWithEmail,
    signInWithGoogle: () => signInWithProvider('google'),
    signInWithFacebook: () => signInWithProvider('facebook'),
    fetchGoogleEvents,
    logoutGoogle,
    setDark,
    setAccent,
  }), [
    accent,
    cardStyle,
    continueWithEmail,
    demoAuthenticated,
    density,
    errorMessage,
    fetchGoogleEvents,
    googleEvents,
    isDark,
    isLoadingEvents,
    isReady,
    logoutGoogle,
    navStyle,
    session,
    signInWithProvider,
    tokens,
    tucoMode,
  ]);

  return <BicoContext.Provider value={value}>{children}</BicoContext.Provider>;
}

export function useBico() {
  const context = useContext(BicoContext);

  if (!context) {
    throw new Error('useBico precisa ser usado dentro de BicoProvider.');
  }

  return context;
}
