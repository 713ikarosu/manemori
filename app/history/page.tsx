import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getMonthlyBudget } from '@/lib/actions/budgets'
import { getMonthlyDataByDay } from '@/lib/actions/calendar'
import { getCategories } from '@/lib/actions/categories'
import { getTodayLocal } from '@/lib/utils/date'
import HistoryClient from '@/components/HistoryClient'

interface HistoryPageProps {
  searchParams: Promise<{ year?: string; month?: string }>
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const params = await searchParams

  // 日本時間の今日の日付を取得
  const todayStr = getTodayLocal() // "2025-11-13"
  const [defaultYear, defaultMonth] = todayStr.split('-').map(Number)

  const year = params.year ? parseInt(params.year) : defaultYear
  const month = params.month ? parseInt(params.month) : defaultMonth

  // 並列でデータ取得
  const [monthlyBudget, dailyData, categories] = await Promise.all([
    getMonthlyBudget(year, month),
    getMonthlyDataByDay(year, month),
    getCategories(),
  ])

  const totalExpenses = Object.values(dailyData).reduce(
    (sum, data) => sum + data.actualAmount,
    0
  )

  return (
    <HistoryClient
      initialYear={year}
      initialMonth={month}
      monthlyBudget={monthlyBudget}
      dailyData={dailyData}
      totalExpenses={totalExpenses}
      categories={categories}
    />
  )
}
