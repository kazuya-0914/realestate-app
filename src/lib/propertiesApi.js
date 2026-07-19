import { supabase } from "./supabaseClient";

// 自分が登録した物件の一覧を取得する（RLSにより自動的に自分のuser_idの行のみ返る）
export async function fetchProperties() {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createProperty({ name, rent, area, layout, userId }) {
  const { data, error } = await supabase
    .from("properties")
    .insert([{ name, rent, area, layout, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProperty(id, { name, rent, area, layout }) {
  const { data, error } = await supabase
    .from("properties")
    .update({ name, rent, area, layout })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProperty(id) {
  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) throw error;
}
