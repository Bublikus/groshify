// Hardcoded expense categories
export const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Utilities",
  "Housing",
  "Education",
  "Travel",
  "Insurance",
  "Investments",
  "Salary",
  "Freelance",
  "Other Income",
  "Other Expenses",
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

// Function to guess category based on description
export const guessCategory = (description: string): ExpenseCategory => {
  if (!description) return "Other Expenses";
  
  const desc = description.toLowerCase();
  
  // Food & Dining
  if (desc.includes("restaurant") || desc.includes("cafe") || desc.includes("food") || 
      desc.includes("grocery") || desc.includes("supermarket") || desc.includes("meal")) {
    return "Food & Dining";
  }
  
  // Transportation
  if (desc.includes("uber") || desc.includes("taxi") || desc.includes("bus") || 
      desc.includes("train") || desc.includes("gas") || desc.includes("fuel") ||
      desc.includes("parking") || desc.includes("metro")) {
    return "Transportation";
  }
  
  // Shopping
  if (desc.includes("amazon") || desc.includes("shop") || desc.includes("store") ||
      desc.includes("mall") || desc.includes("clothing") || desc.includes("shoes")) {
    return "Shopping";
  }
  
  // Entertainment
  if (desc.includes("movie") || desc.includes("cinema") || desc.includes("netflix") ||
      desc.includes("spotify") || desc.includes("game") || desc.includes("concert")) {
    return "Entertainment";
  }
  
  // Healthcare
  if (desc.includes("pharmacy") || desc.includes("doctor") || desc.includes("hospital") ||
      desc.includes("medical") || desc.includes("dental")) {
    return "Healthcare";
  }
  
  // Utilities
  if (desc.includes("electricity") || desc.includes("water") || desc.includes("internet") ||
      desc.includes("phone") || desc.includes("utility")) {
    return "Utilities";
  }
  
  // Housing
  if (desc.includes("rent") || desc.includes("mortgage") || desc.includes("home") ||
      desc.includes("apartment")) {
    return "Housing";
  }
  
  // Education
  if (desc.includes("school") || desc.includes("university") || desc.includes("course") ||
      desc.includes("book") || desc.includes("education")) {
    return "Education";
  }
  
  // Travel
  if (desc.includes("hotel") || desc.includes("flight") || desc.includes("airbnb") ||
      desc.includes("vacation") || desc.includes("trip")) {
    return "Travel";
  }
  
  // Insurance
  if (desc.includes("insurance") || desc.includes("premium")) {
    return "Insurance";
  }
  
  // Investments
  if (desc.includes("investment") || desc.includes("stock") || desc.includes("crypto") ||
      desc.includes("fund")) {
    return "Investments";
  }
  
  // Income categories
  if (desc.includes("salary") || desc.includes("payroll") || desc.includes("income")) {
    return "Salary";
  }
  
  if (desc.includes("freelance") || desc.includes("contract") || desc.includes("consulting")) {
    return "Freelance";
  }
  
  return "Other Expenses";
}; 