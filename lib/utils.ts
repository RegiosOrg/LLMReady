import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-500'
  if (score >= 60) return 'text-yellow-500'
  if (score >= 40) return 'text-orange-500'
  return 'text-red-500'
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500'
  if (score >= 60) return 'bg-yellow-500'
  if (score >= 40) return 'bg-orange-500'
  return 'bg-red-500'
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  return 'Poor'
}

export function absoluteUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${path}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function formatSwissPhone(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '')

  // Format as Swiss phone number
  if (digits.startsWith('41') && digits.length === 11) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`
  }

  if (digits.startsWith('0') && digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`
  }

  return phone
}

export function isValidSwissUID(uid: string): boolean {
  // Swiss UID format: CHE-xxx.xxx.xxx
  const pattern = /^CHE-\d{3}\.\d{3}\.\d{3}$/
  return pattern.test(uid)
}

export function formatSwissUID(uid: string): string {
  // Remove all non-alphanumeric
  const clean = uid.replace(/[^A-Z0-9]/gi, '').toUpperCase()

  if (clean.length !== 12 || !clean.startsWith('CHE')) {
    return uid
  }

  return `CHE-${clean.slice(3, 6)}.${clean.slice(6, 9)}.${clean.slice(9)}`
}
