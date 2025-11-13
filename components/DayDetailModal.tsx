'use client'

import { useState, useEffect } from 'react'
import { deleteExpense, updateExpense } from '@/lib/actions/expenses'
import {
  deletePlannedExpense,
  updatePlannedExpense,
} from '@/lib/actions/plannedExpenses'
import { getDayExpenses, getDayPlannedExpenses } from '@/lib/actions/calendar'
import { Category } from '@/lib/actions/categories'
import { useRouter } from 'next/navigation'

interface Expense {
  id: string
  amount: number
  category_id: string
  memo: string | null
  categories: {
    name: string
  } | null
}

interface PlannedExpense {
  id: string
  amount: number
  category_id: string
  memo: string | null
  categories: {
    name: string
  } | null
}

interface DayDetailModalProps {
  date: string
  onClose: () => void
  categories: Category[]
}

export default function DayDetailModal({
  date,
  onClose,
  categories,
}: DayDetailModalProps) {
  const router = useRouter()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [plannedExpenses, setPlannedExpenses] = useState<PlannedExpense[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingType, setEditingType] = useState<'actual' | 'planned' | null>(
    null
  )
  const [editAmount, setEditAmount] = useState('')
  const [editCategoryId, setEditCategoryId] = useState('')
  const [editMemo, setEditMemo] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    loadData()
  }, [date])

  const loadData = async () => {
    try {
      setLoading(true)
      const [expensesData, plannedData] = await Promise.all([
        getDayExpenses(date),
        getDayPlannedExpenses(date),
      ])
      setExpenses(expensesData)
      setPlannedExpenses(plannedData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (
    item: Expense | PlannedExpense,
    type: 'actual' | 'planned'
  ) => {
    setEditingId(item.id)
    setEditingType(type)
    setEditAmount(item.amount.toString())
    setEditCategoryId(item.category_id)
    setEditMemo(item.memo || '')
  }

  const handleSaveEdit = async (itemId: string) => {
    setIsProcessing(true)
    try {
      if (editingType === 'actual') {
        await updateExpense(itemId, {
          amount: parseInt(editAmount),
          category_id: editCategoryId,
          memo: editMemo,
          expense_date: date,
        })
      } else {
        await updatePlannedExpense(itemId, {
          amount: parseInt(editAmount),
          category_id: editCategoryId,
          memo: editMemo,
          planned_date: date,
        })
      }
      setEditingId(null)
      setEditingType(null)
      await loadData()
      router.refresh()
    } catch (error) {
      console.error('Error updating:', error)
      alert('更新に失敗しました')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDelete = async (itemId: string, type: 'actual' | 'planned') => {
    const message =
      type === 'actual'
        ? 'この出費を削除しますか？'
        : 'この出費予定を削除しますか？'
    if (!confirm(message)) return

    setIsProcessing(true)
    try {
      if (type === 'actual') {
        await deleteExpense(itemId)
      } else {
        await deletePlannedExpense(itemId)
      }
      await loadData()
      router.refresh()
    } catch (error) {
      console.error('Error deleting:', error)
      alert('削除に失敗しました')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    const weekdays = ['日', '月', '火', '水', '木', '金', '土']
    return `${d.getMonth() + 1}月${d.getDate()}日（${weekdays[d.getDay()]}）`
  }

  const actualTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const plannedTotal = plannedExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  )

  return (
    <div
      className="fixed inset-0 bg-gray-200 bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-lg font-bold text-gray-800">
            {formatDate(date)}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">読み込み中...</div>
          ) : expenses.length === 0 && plannedExpenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              この日の記録はありません
            </div>
          ) : (
            <>
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">実際の出費</div>
                <div className="text-2xl font-bold text-gray-800">
                  ¥{actualTotal.toLocaleString()}
                </div>
                {plannedTotal > 0 && (
                  <div className="text-sm text-gray-500 mt-1">
                    予定: ¥{plannedTotal.toLocaleString()}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    {editingId === expense.id ? (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900"
                            disabled={isProcessing}
                          />
                          <select
                            value={editCategoryId}
                            onChange={(e) => setEditCategoryId(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                            disabled={isProcessing}
                          >
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <input
                          type="text"
                          value={editMemo}
                          onChange={(e) => setEditMemo(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900"
                          placeholder="メモ"
                          disabled={isProcessing}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingId(null)
                              setEditingType(null)
                            }}
                            className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                            disabled={isProcessing}
                          >
                            キャンセル
                          </button>
                          <button
                            onClick={() => handleSaveEdit(expense.id)}
                            className="flex-1 px-3 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                            disabled={isProcessing}
                          >
                            {isProcessing ? '保存中...' : '保存'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-800">
                              {expense.categories?.name || 'カテゴリなし'}
                            </span>
                            <span className="text-lg font-bold text-gray-800">
                              ¥{expense.amount.toLocaleString()}
                            </span>
                          </div>
                          {expense.memo && (
                            <p className="text-sm text-gray-600">
                              {expense.memo}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(expense, 'actual')}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            aria-label="編集"
                            disabled={isProcessing}
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
                            onClick={() => handleDelete(expense.id, 'actual')}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                            aria-label="削除"
                            disabled={isProcessing}
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
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 予定セクション */}
              {plannedExpenses.length > 0 && (
                <>
                  <div className="mt-6 mb-3">
                    <h3 className="text-md font-semibold text-gray-600">出費予定</h3>
                  </div>
                  <div className="space-y-3">
                    {plannedExpenses.map((planned) => (
                      <div
                        key={planned.id}
                        className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                      >
                        {editingId === planned.id &&
                        editingType === 'planned' ? (
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <input
                                type="number"
                                value={editAmount}
                                onChange={(e) => setEditAmount(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900"
                                disabled={isProcessing}
                              />
                              <select
                                value={editCategoryId}
                                onChange={(e) =>
                                  setEditCategoryId(e.target.value)
                                }
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                                disabled={isProcessing}
                              >
                                {categories.map((category) => (
                                  <option key={category.id} value={category.id}>
                                    {category.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <input
                              type="text"
                              value={editMemo}
                              onChange={(e) => setEditMemo(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900"
                              placeholder="メモ"
                              disabled={isProcessing}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingId(null)
                                  setEditingType(null)
                                }}
                                className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                                disabled={isProcessing}
                              >
                                キャンセル
                              </button>
                              <button
                                onClick={() => handleSaveEdit(planned.id)}
                                className="flex-1 px-3 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                                disabled={isProcessing}
                              >
                                {isProcessing ? '保存中...' : '保存'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-gray-500">
                                  予定
                                </span>
                                <span className="font-semibold text-gray-700">
                                  {planned.categories?.name || 'カテゴリなし'}
                                </span>
                                <span className="text-lg font-bold text-gray-700">
                                  ¥{planned.amount.toLocaleString()}
                                </span>
                              </div>
                              {planned.memo && (
                                <p className="text-sm text-gray-600">
                                  {planned.memo}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(planned, 'planned')}
                                className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                                aria-label="編集"
                                disabled={isProcessing}
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
                                onClick={() =>
                                  handleDelete(planned.id, 'planned')
                                }
                                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                aria-label="削除"
                                disabled={isProcessing}
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
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
