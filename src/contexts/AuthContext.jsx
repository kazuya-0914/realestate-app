import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { AuthContext } from "./authContextObject";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 初回マウント時に現在のセッションを取得する
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // ログイン・ログアウト・トークン更新などのセッション変化を監視する
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    // メール確認が有効な場合はsessionがnullで返る（会員登録直後は未ログイン状態）
    return { needsEmailConfirmation: data.session === null };
  }

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  const value = { user, isLoading, signUp, signIn, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
