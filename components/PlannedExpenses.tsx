'use client'

import { useState } from 'react'
import {
  createPlannedExpense,
  updatePlannedExpense,
  deletePlannedExpense,
  PlannedExpense,
} from '@/lib/actions/plannedExpenses'
import { Category } from '@/lib/actions/categories'
import { useRouter } from 'next/navigation'

interface PlannedExpensesProps {
  plannedExpenses: PlannedExpense[]
  categories: Category[]
  year: number
  month: number
}

export default function PlannedExpenses({
  plannedExpenses,
  categories,
  year,
  month,
}: PlannedExpensesProps) {
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form states for adding
  const [addAmount, setAddAmount] = useState('')
  const [addCategoryId, setAddCategoryId] = useState('')
  const [addPlannedDate, setAddPlannedDate] = useState('')
  const [addMemo, setAddMemo] = useState('')

  // Form states for editing
  const [editAmount, setEditAmount] = useState('')
  const [editCategoryId, setEditCategoryId] = useState('')
  const [editPlannedDate, setEditPlannedDate] = useState('')
  const [editMemo, setEditMemo] = useState('')

  const handleAdd = async () => {
    if (!addAmount || !addCategoryId || !addPlannedDate) {
      alert('金額、カテゴリ、予定日を入力してください')
      return
    }

    setIsLoading(true)
    try {
      await createPlannedExpense({
        amount: parseInt(addAmount),
        category_id: addCategoryId,
        planned_date: addPlannedDate,
        memo: addMemo,
      })
      setAddAmount('')
      setAddCategoryId('')
      setAddPlannedDate('')
      setAddMemo('')
      setIsAdding(false)
      router.refresh()
    } catch (error) {
      console.error('Error adding planned expense:', error)
      alert('出費予定の追加に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (expense: PlannedExpense) => {
    setEditingId(expense.id)
    setEditAmount(expense.amount.toString())
    setEditCategoryId(expense.category_id)
    setEditPlannedDate(expense.planned_date)
    setEditMemo(expense.memo || '')
  }

  const handleSaveEdit = async (expenseId: string) => {
    setIsLoading(true)
    try {
      await updatePlannedExpense(expenseId, {
        amount: parseInt(editAmount),
        category_id: editCategoryId,
        planned_date: editPlannedDate,
        memo: editMemo,
      })
      setEditingId(null)
      router.refresh()
    } catch (error) {
      console.error('Error updating planned expense:', error)
      alert('出費予定の更新に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (expenseId: string) => {
    if (!confirm('この出費予定を削除しますか？')) return

    setIsLoading(true)
    try {
      await deletePlannedExpense(expenseId)
      router.refresh()
    } catch (error) {
      console.error('Error deleting planned expense:', error)
      alert('出費予定の削除に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00')
    return `${d.getMonth() + 1}/${d.getDate()}`
  }

  const total = plannedExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <section className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          {month}月の出費予定
        </h2>
        <button
          onClick={() => {
            setAddCategoryId(categories[0]?.id || '')
            setIsAdding(true)
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm"
        >
          + 予定を追加
        </button>
      </div>

      {plannedExpenses.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">予定合計</div>
          <div className="text-2xl font-bold text-gray-800">
            ¥{total.toLocaleString()}
          </div>
        </div>
      )}

      {/* Add form */}
      {isAdding && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            新しい出費予定
          </h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="金額"
                disabled={isLoading}
              />
              <select
                value={addCategoryId}
                onChange={(e) => setAddCategoryId(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                disabled={isLoading}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="date"
              value={addPlannedDate}
              onChange={(e) => setAddPlannedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              disabled={isLoading}
            />
            <input
              type="text"
              value={addMemo}
              onChange={(e) => setAddMemo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              placeholder="メモ"
              disabled={isLoading}
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsAdding(false)
                  setAddAmount('')
                  setAddCategoryId('')
                  setAddPlannedDate('')
                  setAddMemo('')
                }}
                className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                disabled={isLoading}
              >
                キャンセル
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? '追加中...' : '追加'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List of planned expenses */}
      {plannedExpenses.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          まだ出費予定がありません
        </p>
      ) : (
        <div className="space-y-3">
          {plannedExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              {editingId === expense.id ? (
                <div className="flex-1 space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                      disabled={isLoading}
                    />
                    <select
                      value={editCategoryId}
                      onChange={(e) => setEditCategoryId(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                      disabled={isLoading}
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="date"
                    value={editPlannedDate}
                    onChange={(e) => setEditPlannedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                    disabled={isLoading}
                  />
                  <input
                    type="text"
                    value={editMemo}
                    onChange={(e) => setEditMemo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                    placeholder="メモ"
                    disabled={isLoading}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      disabled={isLoading}
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={() => handleSaveEdit(expense.id)}
                      className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {isLoading ? '保存中...' : '保存'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-500">
                        {formatDate(expense.planned_date)}
                      </span>
                      <span className="font-semibold text-gray-800">
                        {expense.categories?.name || 'カテゴリなし'}
                      </span>
                      <span className="text-lg font-bold text-gray-800">
                        ¥{expense.amount.toLocaleString()}
                      </span>
                    </div>
                    {expense.memo && (
                      <p className="text-sm text-gray-600">{expense.memo}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      aria-label="編集"
                      disabled={isLoading}
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
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      aria-label="削除"
                      disabled={isLoading}
                    >
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
