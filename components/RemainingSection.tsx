interface RemainingSectionProps {
  monthRemaining: number
  monthRemainingWithPlanned: number
  weekRemaining: number
  todayTotal: number
}

export default function RemainingSection({
  monthRemaining,
  monthRemainingWithPlanned,
  weekRemaining,
  todayTotal,
}: RemainingSectionProps) {
  const getStatusColor = (remaining: number) => {
    if (remaining < 0) return {
      text: 'text-status-error',
      bg: 'bg-status-error/10',
      border: 'border-status-error/20'
    }
    if (remaining < 10000) return {
      text: 'text-status-warning',
      bg: 'bg-status-warning/10',
      border: 'border-status-warning/20'
    }
    return {
      text: 'text-status-success',
      bg: 'bg-status-success/10',
      border: 'border-status-success/20'
    }
  }

  const mainStatus = getStatusColor(monthRemaining)
  const plannedStatus = getStatusColor(monthRemainingWithPlanned)

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background-elevated to-background rounded-2xl border border-border p-8 animate-fade-in">
      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />

      {/* Main remaining amount */}
      <div className="text-center mb-8">
        <h2 className="text-sm font-medium text-foreground-muted mb-3 uppercase tracking-wider">
          今月の残り
        </h2>
        <div className={`inline-flex items-baseline gap-2 ${mainStatus.text} animate-fade-in-scale`}>
          <span className="text-base font-mono opacity-70">¥</span>
          <span className="text-6xl font-display font-semibold tracking-tight financial-number">
            {monthRemaining.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Planned remaining - featured */}
      <div className={`mb-6 p-5 rounded-xl border ${plannedStatus.border} ${plannedStatus.bg} transition-smooth hover:scale-[1.01]`}>
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-foreground-muted">予定込みの残り</span>
          </div>
          <div className={`flex items-baseline gap-1 ${plannedStatus.text}`}>
            <span className="text-xs font-mono opacity-70">¥</span>
            <span className="text-3xl font-display font-semibold financial-number">
              {monthRemainingWithPlanned.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Week and Today grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface/60 backdrop-blur-sm rounded-xl border border-border-subtle p-5 hover:bg-surface transition-smooth group">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary-subtle flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-smooth">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-foreground-muted uppercase tracking-wider">今週</span>
          </div>
          <div className={`flex items-baseline gap-1 ${weekRemaining < 0 ? 'text-status-error' : 'text-foreground'}`}>
            <span className="text-xs font-mono opacity-70">¥</span>
            <span className="text-2xl font-display font-semibold financial-number">
              {weekRemaining.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-surface/60 backdrop-blur-sm rounded-xl border border-border-subtle p-5 hover:bg-surface transition-smooth group">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-accent-muted flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-smooth">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-foreground-muted uppercase tracking-wider">今日</span>
          </div>
          <div className="flex items-baseline gap-1 text-foreground">
            <span className="text-xs font-mono opacity-70">¥</span>
            <span className="text-2xl font-display font-semibold financial-number">
              {todayTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
