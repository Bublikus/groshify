export interface Subcategory {
  id: number;
  name: string;
  transactionCount: number;
  totalAmount: number;
  isActive: boolean;
}

export interface Category extends Record<string, unknown> {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  transactionCount: number;
  totalAmount: number;
  isActive: boolean;
  subcategories: Subcategory[];
}
