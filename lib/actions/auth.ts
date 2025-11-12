'use server'

import { createClient } from '@/lib/supabase/server'

const INITIAL_CATEGORIES = [
  { name: '食費', sort_order: 1 },
  { name: '交通費', sort_order: 2 },
  { name: '日用品', sort_order: 3 },
  { name: '娯楽', sort_order: 4 },
  { name: '医療費', sort_order: 5 },
  { name: 'その他', sort_order: 6 },
]

export async function initializeUserCategories(userId: string) {
  const supabase = await createClient()

  // すでにカテゴリが存在するか確認
  const { data: existingCategories } = await supabase
    .from('categories')
    .select('id')
    .eq('user_id', userId)
    .limit(1)

  // カテゴリが存在しない場合のみ作成
  if (!existingCategories || existingCategories.length === 0) {
    const categoriesToInsert = INITIAL_CATEGORIES.map((category) => ({
      ...category,
      user_id: userId,
    }))

    const { error } = await supabase
      .from('categories')
      .insert(categoriesToInsert)

    if (error) {
      console.error('Error creating initial categories:', error)
      throw error
    }
  }
}
