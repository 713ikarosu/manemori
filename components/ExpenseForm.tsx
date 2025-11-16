'use client'

import { useState } from 'react'
import { addExpense } from '@/lib/actions/expenses'
import { Category } from '@/lib/actions/categories'
import { getTodayLocal } from '@/lib/utils/date'
import { useRouter } from 'next/navigation'

interface ExpenseFormProps {
  categories: Category[]
  initialDate?: string // オプショナルな初期日付（履歴画面から使う場合）
}

export default function ExpenseForm({ categories, initialDate }: ExpenseFormProps) {
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '')
  const [expenseDate, setExpenseDate] = useState(initialDate || getTodayLocal())
  const [memo, setMemo] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !categoryId) {
      alert('金額とカテゴリを入力してください')
      return
    }

    setIsLoading(true)
    try {
      await addExpense({
        amount: parseInt(amount),
        category_id: categoryId,
        memo,
        expense_date: expenseDate,
      })

      // フォームをリセット
      setAmount('')
      setMemo('')
      setExpenseDate(getTodayLocal()) // 日付もリセット（今日に戻す）
      router.refresh()
    } catch (error) {
      console.error('Error adding expense:', error)
      alert('出費の追加に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">出費を記録</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            金額
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900"
              placeholder="1000"
              disabled={isLoading}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              円
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            カテゴリ
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
            disabled={isLoading}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            日付
          </label>
          <input
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            メモ（任意）
          </label>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900"
            placeholder="昼食"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? '追加中...' : '追加'}
        </button>
      </form>
    </section>
  )
}
