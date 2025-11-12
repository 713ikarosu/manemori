'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Expense {
  id: string
  amount: number
  category_id: string
  expense_date: string
  memo: string | null
  categories: {
    name: string
  } | null
}

export async function getExpenses(date: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { data, error } = await supabase
    .from('expenses')
    .select('id, amount, category_id, expense_date, memo, categories!inner(name)')
    .eq('user_id', user.id)
    .eq('expense_date', date)
    .order('created_at', { ascending: false })

  if (error) throw error

  // データを適切な型に変換
  const expenses = (data || []).map((item: any) => ({
    ...item,
    categories: Array.isArray(item.categories)
      ? item.categories[0]
      : item.categories
  }))

  return expenses as Expense[]
}

export async function getMonthlyExpenses(year: number, month: number) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate = new Date(year, month, 0)
  const endDateStr = `${year}-${String(month).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`

  const { data, error } = await supabase
    .from('expenses')
    .select('amount')
    .eq('user_id', user.id)
    .gte('expense_date', startDate)
    .lte('expense_date', endDateStr)

  if (error) throw error

  return data.reduce((sum, expense) => sum + expense.amount, 0)
}

export async function getWeeklyExpenses() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // 今週の月曜日を取得
  const today = new Date()
  const dayOfWeek = today.getDay()
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(today)
  monday.setDate(today.getDate() + diff)

  const startDate = monday.toISOString().split('T')[0]
  const endDate = today.toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('expenses')
    .select('amount')
    .eq('user_id', user.id)
    .gte('expense_date', startDate)
    .lte('expense_date', endDate)

  if (error) throw error

  return data.reduce((sum, expense) => sum + expense.amount, 0)
}

export async function addExpense(formData: {
  amount: number
  category_id: string
  memo: string
  expense_date: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error } = await supabase.from('expenses').insert({
    user_id: user.id,
    amount: formData.amount,
    category_id: formData.category_id,
    memo: formData.memo || null,
    expense_date: formData.expense_date,
  })

  if (error) throw error

  revalidatePath('/')
}

export async function deleteExpense(expenseId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', expenseId)
    .eq('user_id', user.id)

  if (error) throw error

  revalidatePath('/')
}

export async function updateExpense(
  expenseId: string,
  formData: {
    amount: number
    category_id: string
    memo: string
    expense_date: string
  }
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error } = await supabase
    .from('expenses')
    .update({
      amount: formData.amount,
      category_id: formData.category_id,
      memo: formData.memo || null,
      expense_date: formData.expense_date,
      updated_at: new Date().toISOString(),
    })
    .eq('id', expenseId)
    .eq('user_id', user.id)

  if (error) throw error

  revalidatePath('/')
}
