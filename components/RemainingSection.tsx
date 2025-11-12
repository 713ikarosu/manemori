interface RemainingSectionProps {
  monthRemaining: number
  weekRemaining: number
  todayTotal: number
}

export default function RemainingSection({
  monthRemaining,
  weekRemaining,
  todayTotal,
}: RemainingSectionProps) {
  const getMonthRemainingColor = (remaining: number) => {
    if (remaining < 0) return 'text-red-600'
    if (remaining < 10000) return 'text-orange-600'
    return 'text-green-600'
  }

  return (
    <section className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-sm p-6">
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">残り</h2>
        <div
          className={`text-5xl font-bold ${getMonthRemainingColor(monthRemaining)}`}
        >
          ¥{monthRemaining.toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">今週の残り</div>
          <div
            className={`text-2xl font-bold ${
              weekRemaining < 0 ? 'text-red-600' : 'text-gray-800'
            }`}
          >
            ¥{weekRemaining.toLocaleString()}
          </div>
        </div>
        <div className="bg-white rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">今日の出費</div>
          <div className="text-2xl font-bold text-gray-800">
            ¥{todayTotal.toLocaleString()}
          </div>
        </div>
      </div>
    </section>
  )
}
