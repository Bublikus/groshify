import { NextRequest, NextResponse } from 'next/server';
import { categorizeTransactions } from '@/lib/services/categorization-service';

export async function POST(request: NextRequest) {
  try {
    const { transactions, categories } = await request.json();

    if (!transactions || !Array.isArray(transactions)) {
      return NextResponse.json(
        { error: 'Transactions array is required' },
        { status: 400 }
      );
    }

    if (!categories || !Array.isArray(categories)) {
      return NextResponse.json(
        { error: 'Categories array is required' },
        { status: 400 }
      );
    }

    const categorizedTransactions = await categorizeTransactions(transactions, categories);

    return NextResponse.json({ categorizedTransactions });
  } catch (error) {
    console.error('Error categorizing transactions:', error);
    return NextResponse.json(
      { error: 'Failed to categorize transactions' },
      { status: 500 }
    );
  }
} 