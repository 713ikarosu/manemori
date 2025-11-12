'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Calendar from './Calendar'
import DayDetailModal from './DayDetailModal'
import { Category } from '@/lib/actions/categories'
import Link from 'next/link'

interface HistoryClientProps {
  initialYear: number
  initialMonth: number
  monthlyBudget: number
  dailyTotals: { [key: string]: number }
  totalExpenses: number
  categories: Category[]
}

export default function HistoryClient({
  initialYear,
  initialMonth,
  monthlyBudget,
  dailyTotals,
  totalExpenses,
  categories,
}: HistoryClientProps) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const handlePrevMonth = () => {
    const newMonth = initialMonth === 1 ? 12 : initialMonth - 1
    const newYear = initialMonth === 1 ? initialYear - 1 : initialYear
    router.push(`/history?year=${newYear}&month=${newMonth}`)
  }

  const handleNextMonth = () => {
    const newMonth = initialMonth === 12 ? 1 : initialMonth + 1
    const newYear = initialMonth === 12 ? initialYear + 1 : initialYear
    router.push(`/history?year=${newYear}&month=${newMonth}`)
  }

  const handleDateClick = (date: string) => {
    setSelectedDate(date)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-gray-800">履歴</h1>
            <div className="w-10" /> {/* スペーサー */}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="前月"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {initialMonth}月 {initialYear}
              </h2>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="次月"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">月の出費</div>
            <div className="text-2xl font-bold text-gray-800">
              ¥{totalExpenses.toLocaleString()}
            </div>
            {monthlyBudget > 0 && (
              <div className="text-sm text-gray-600 mt-1">
                予算: ¥{monthlyBudget.toLocaleString()} / 残り: ¥
                {(monthlyBudget - totalExpenses).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* カレンダー */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <Calendar
          year={initialYear}
          month={initialMonth}
          dailyTotals={dailyTotals}
          monthlyBudget={monthlyBudget}
          onDateClick={handleDateClick}
        />
      </main>

      {/* 日付詳細モーダル */}
      {selectedDate && (
        <DayDetailModal
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
          categories={categories}
        />
      )}
    </div>
  )
}
