import { format } from 'date-fns'

export default async function dateFormat(resolve, _, args) {
  const value = await resolve()

  if (value instanceof Date) {
    return format(value, args.format)
  }

  if (typeof value === 'number') {
    return format(new Date(value), args.format)
  }

  return format(new Date(value), args.format)
}
