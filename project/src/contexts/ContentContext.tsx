import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface ContentContextValue {
  getText: (key: string, fallback: string) => string;
  updateText: (key: string, value: string) => void;
  isEditMode: boolean;
  setEditMode: (v: boolean) => void;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [contentMap, setContentMap] = useState<Record<string, string>>({});
  const [isEditMode, setEditModeState] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (!s) setEditModeState(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    supabase
      .from('site_content')
      .select('key, value')
      .then(({ data, error }) => {
        if (!error && data) {
          const map: Record<string, string> = {};
          data.forEach(({ key, value }: { key: string; value: string }) => {
            map[key] = value;
          });
          setContentMap(map);
        }
      });
  }, []);

  const getText = useCallback(
    (key: string, fallback: string): string => contentMap[key] ?? fallback,
    [contentMap]
  );

  const updateText = useCallback((key: string, value: string) => {
    setContentMap(prev => ({ ...prev, [key]: value }));
    supabase
      .from('site_content')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
      .then(({ error }) => {
        if (error) console.error('Failed to save content:', error);
      });
  }, []);

  const setEditMode = useCallback((v: boolean) => {
    if (!session) return;
    if (!v) {
      (document.activeElement as HTMLElement)?.blur();
    }
    setEditModeState(v);
  }, [session]);

  const signIn = useCallback(async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const isAdmin = session !== null;

  return (
    <ContentContext.Provider value={{ getText, updateText, isEditMode, setEditMode, isAdmin, signIn, signOut }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}
