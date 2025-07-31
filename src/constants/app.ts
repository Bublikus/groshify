export const APP_CONFIG = {
  name: "Groshify",
  description: "Personal Finance Management",
  version: "1.0.0",
} as const;

export const CURRENCIES = {
  USD: { symbol: "$", name: "US Dollar" },
  EUR: { symbol: "€", name: "Euro" },
  UAH: { symbol: "₴", name: "Ukrainian Hryvnia" },
  GBP: { symbol: "£", name: "British Pound" },
} as const;

export const DATE_FORMATS = {
  "MM/DD/YYYY": "MM/DD/YYYY",
  "DD/MM/YYYY": "DD/MM/YYYY",
  "YYYY-MM-DD": "YYYY-MM-DD",
} as const;

export const LANGUAGES = {
  en: { name: "English", flag: "🇺🇸" },
  uk: { name: "Українська", flag: "🇺🇦" },
} as const;

export const TRANSACTION_STATUSES = {
  PENDING: "pending",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const TRANSACTION_TYPES = {
  INCOME: "income",
  EXPENSE: "expense",
  TRANSFER: "transfer",
} as const;

export const MONTH_ORDER = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

