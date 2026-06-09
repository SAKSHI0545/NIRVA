export function formatDate(value) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export function toChartRows(distribution = {}) {
  return Object.entries(distribution).map(([name, value]) => ({ name, value }));
}
