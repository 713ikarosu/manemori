'use server'

import { createClient } from '@/lib/supabase/server'

export interface DailyExpense {
  expense_date: string
  total_amount: number
}

export async function getMonthlyExpensesByDay(year: number, month: number) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const daysInMonth = new Date(year, month, 0).getDate()
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`

  const { data, error } = await supabase
    .from('expenses')
    .select('expense_date, amount')
    .eq('user_id', user.id)
    .gte('expense_date', startDate)
    .lte('expense_date', endDate)

  if (error) throw error

  // 日付ごとに集計
  const dailyTotals: { [key: string]: number } = {}

  data?.forEach((expense) => {
    const date = expense.expense_date
    dailyTotals[date] = (dailyTotals[date] || 0) + expense.amount
  })

  return dailyTotals
}

export async function getDayExpenses(date: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { data, error } = await supabase
    .from('expenses')
    .select('id, amount, category_id, memo, categories!inner(name)')
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

  return expenses
}
