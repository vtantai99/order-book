export const roundToNearest = (value: number, interval: number) => Math.floor(value / interval) * interval
export const formatNumberWithLocale = (arg: number): string => new Intl.NumberFormat('en-US').format(arg)
export const formatPriceWithLocale = (arg: number): string => arg.toLocaleString('en', { useGrouping: true, minimumFractionDigits: 2 })
