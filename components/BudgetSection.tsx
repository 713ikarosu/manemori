'use client'

import { useState } from 'react'
import { setMonthlyBudget } from '@/lib/actions/budgets'
import { useRouter } from 'next/navigation'

interface BudgetSectionProps {
  year: number
  month: number
  budgetAmount: number
}

export default function BudgetSection({
  year,
  month,
  budgetAmount,
}: BudgetSectionProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [newBudget, setNewBudget] = useState(budgetAmount.toString())
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await setMonthlyBudget(year, month, parseInt(newBudget))
      setIsEditing(false)
      router.refresh()
    } catch (error) {
      console.error('Error saving budget:', error)
      alert('予算の保存に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">
        {month}月の予算
      </h2>
      <div className="flex items-center justify-between">
        <div className="text-3xl font-bold text-gray-800">
          ¥{budgetAmount.toLocaleString()}
        </div>
        <button
          onClick={() => {
            setNewBudget(budgetAmount.toString())
            setIsEditing(true)
          }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="予算を編集"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
      </div>

      {/* 編集モーダル */}
      {isEditing && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {month}月の予算を設定
            </h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                予算金額
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900"
                  placeholder="50000"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  円
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                disabled={isLoading}
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
