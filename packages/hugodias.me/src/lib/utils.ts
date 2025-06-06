export function formatDate(date: Date) {
  return Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function dateRange(startDate: Date, endDate?: Date | string): string {
  const startMonth = startDate.toLocaleString('default', { month: 'short' })
  const startYear = startDate.getFullYear().toString()
  let endMonth
  let endYear

  if (endDate) {
    if (typeof endDate === 'string') {
      endMonth = ''
      endYear = endDate
    } else {
      endMonth = endDate.toLocaleString('default', { month: 'short' })
      endYear = endDate.getFullYear().toString()
    }
  }

  return `${startMonth} ${startYear} - ${endMonth} ${endYear}`
}
