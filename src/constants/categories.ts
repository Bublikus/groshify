export type TransactionCategory = {
  name: string;
  description: string;
  icon: string;
  color: string;
  subcategories: string[];
};

export const TRANSACTION_CATEGORIES: TransactionCategory[] = [
  {
    name: "Житло",
    description:
      "Оренда або іпотека, комунальні послуги, інтернет, мобільний зв'язок, ремонт і обслуговування",
    icon: "🏠",
    color: "#FF6B6B", // Warm red for housing
    subcategories: [
      "Оренда або іпотека",
      "Комунальні послуги (газ, вода, світло)",
      "Інтернет, мобільний зв'язок",
      "Ремонт і обслуговування",
    ],
  },
  {
    name: "Продукти та побут",
    description: "Продукти харчування, засоби гігієни, побутова хімія, посуд, дрібна техніка",
    icon: "🛒",
    color: "#4ECDC4", // Teal for groceries
    subcategories: [
      "Продукти харчування",
      "Засоби гігієни",
      "Побутова хімія",
      "Посуд, дрібна техніка",
    ],
  },
  {
    name: "Заклади харчування",
    description: "Кафе, ресторани, фастфуд, доставка їжі",
    icon: "🍽",
    color: "#45B7D1", // Blue for dining
    subcategories: ["Кафе, ресторани", "Фастфуд", "Доставка їжі"],
  },
  {
    name: "Транспорт",
    description:
      "Громадський транспорт, таксі, авто (паливо, ремонт, паркування, страхування), проїздні / абонементи",
    icon: "🚗",
    color: "#96CEB4", // Green for transport
    subcategories: [
      "Громадський транспорт",
      "Таксі",
      "Авто (паливо, ремонт, паркування, страхування)",
      "Проїздні / абонементи",
    ],
  },
  {
    name: "Покупки",
    description: "Одяг, взуття, аксесуари, електроніка, меблі та побутова техніка",
    icon: "🛍",
    color: "#FFEAA7", // Yellow for shopping
    subcategories: [
      "Одяг, взуття",
      "Аксесуари",
      "Електроніка",
      "Мобільний зв'язок",
      "Меблі та побутова техніка",
      "Інше",
    ],
  },
  {
    name: "Здоров'я",
    description: "Ліки та аптека, візити до лікаря, медичне страхування",
    icon: "💊",
    color: "#DDA0DD", // Purple for health
    subcategories: ["Ліки та аптека", "Візити до лікаря", "Медичне страхування"],
  },
  {
    name: "Спорт і краса",
    description: "Фітнес / спортзал, масаж, спа, косметика, догляд, перукар, салон краси",
    icon: "🧘‍♂️",
    color: "#98D8C8", // Mint green for fitness/beauty
    subcategories: ["Фітнес / спортзал", "Масаж, спа", "Косметика, догляд", "Перукар, салон краси"],
  },
  {
    name: "Освіта та розвиток",
    description: "Курси, навчання, книги, підписки, онлайн-платформи",
    icon: "📚",
    color: "#F7DC6F", // Gold for education
    subcategories: ["Курси, навчання", "Книги, підписки", "Онлайн-платформи"],
  },
  {
    name: "Розваги та дозвілля",
    description: "Кіно, театри, концерти, подорожі, туризм, хобі, ігри, подарунки",
    icon: "🎉",
    color: "#BB8FCE", // Lavender for entertainment
    subcategories: ["Кіно, театри, концерти", "Подорожі, туризм", "Хобі, ігри", "Подарунки"],
  },
  {
    name: "Діти",
    description: "Одяг та іграшки, харчування, садочок, школа, гуртки",
    icon: "👶",
    color: "#85C1E9", // Light blue for children
    subcategories: ["Одяг та іграшки", "Харчування", "Садочок, школа, гуртки"],
  },
  {
    name: "Домашні улюбленці",
    description: "Їжа, ветеринар, засоби догляду",
    icon: "🐶",
    color: "#82E0AA", // Light green for pets
    subcategories: ["Їжа", "Ветеринар", "Засоби догляду"],
  },
  {
    name: "Фінансові операції",
    description: "Банківські комісії, кредити, відсотки, перекази / грошові збори, інвестиції",
    icon: "🧾",
    color: "#F8C471", // Orange for financial operations
    subcategories: [
      "Банківські комісії",
      "Кредити, відсотки",
      "Перекази / грошові збори",
      "Інвестиції",
    ],
  },
  {
    name: "Непередбачені витрати",
    description: "Аварійні ремонти, штрафи, випадкові великі витрати",
    icon: "🆘",
    color: "#F1948A", // Coral for emergency expenses
    subcategories: ["Аварійні ремонти", "Штрафи", "Випадкові великі витрати"],
  },
  {
    name: "Інше",
    description: "Інші витрати",
    icon: "💰",
    color: "#85C1E9", // Blue-gray for miscellaneous
    subcategories: ["Інші витрати"],
  },
] as const;
