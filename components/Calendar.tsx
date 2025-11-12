'use client'

interface CalendarProps {
  year: number
  month: number
  dailyTotals: { [key: string]: number }
  monthlyBudget: number
  onDateClick: (date: string) => void
}

export default function Calendar({
  year,
  month,
  dailyTotals,
  monthlyBudget,
  onDateClick,
}: CalendarProps) {
  // カレンダーのグリッド配列を生成
  const generateCalendar = () => {
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)
    const daysInMonth = lastDay.getDate()
    const startDayOfWeek = firstDay.getDay() // 0=日曜

    const calendar = []

    // 前月の空白セル
    for (let i = 0; i < startDayOfWeek; i++) {
      calendar.push({ date: null, day: null, amount: 0 })
    }

    // 当月の日付セル
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      calendar.push({ date, day, amount: dailyTotals[date] || 0 })
    }

    return calendar
  }

  // 色分けロジック
  const getDailyBudgetColor = (dayTotal: number) => {
    if (dayTotal === 0) return 'text-gray-400'

    const daysInMonth = new Date(year, month, 0).getDate()
    const dailyAverage = monthlyBudget / daysInMonth

    if (dayTotal <= dailyAverage) return 'text-green-600'
    if (dayTotal <= dailyAverage * 1.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const calendar = generateCalendar()
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
          <div
            key={day}
            className={`text-center text-sm font-semibold py-2 ${
              index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-1">
        {calendar.map((cell, index) => {
          if (!cell.date) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          const isToday = cell.date === today
          const colorClass = getDailyBudgetColor(cell.amount)

          return (
            <button
              key={cell.date}
              onClick={() => onDateClick(cell.date!)}
              className={`aspect-square p-1 rounded-lg hover:bg-gray-100 transition-colors ${
                isToday ? 'bg-indigo-50 ring-2 ring-indigo-500' : ''
              }`}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <div
                  className={`text-sm ${
                    isToday ? 'font-bold text-indigo-600' : 'text-gray-700'
                  }`}
                >
                  {cell.day}
                </div>
                {cell.amount > 0 && (
                  <div className={`text-xs font-semibold ${colorClass}`}>
                    {cell.amount >= 10000
                      ? `${(cell.amount / 1000).toFixed(1)}k`
                      : cell.amount.toLocaleString()}
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
