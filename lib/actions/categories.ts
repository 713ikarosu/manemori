'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Category {
  id: string
  name: string
  sort_order: number
}

export async function getCategories() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, sort_order')
    .eq('user_id', user.id)
    .order('sort_order', { ascending: true })

  if (error) throw error

  return data as Category[]
}

export async function addCategory(name: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // 既存の最大sort_orderを取得
  const { data: categories } = await supabase
    .from('categories')
    .select('sort_order')
    .eq('user_id', user.id)
    .order('sort_order', { ascending: false })
    .limit(1)

  const maxSortOrder = categories?.[0]?.sort_order ?? 0
  const newSortOrder = maxSortOrder + 1

  const { error } = await supabase.from('categories').insert({
    user_id: user.id,
    name,
    sort_order: newSortOrder,
  })

  if (error) throw error

  revalidatePath('/')
  revalidatePath('/settings/categories')
}

export async function updateCategory(id: string, name: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error } = await supabase
    .from('categories')
    .update({ name, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error

  revalidatePath('/')
  revalidatePath('/settings/categories')
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // カテゴリが使用されているかチェック
  const [{ count: expenseCount }, { count: plannedCount }] = await Promise.all([
    supabase
      .from('expenses')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', id)
      .eq('user_id', user.id),
    supabase
      .from('planned_expenses')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', id)
      .eq('user_id', user.id),
  ])

  if ((expenseCount ?? 0) > 0 || (plannedCount ?? 0) > 0) {
    throw new Error('このカテゴリは出費または出費予定で使用されているため削除できません')
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error

  revalidatePath('/')
  revalidatePath('/settings/categories')
}
