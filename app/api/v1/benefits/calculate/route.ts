import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, category, totalBillPaise } = body;

    if (!planId || !category || typeof totalBillPaise !== 'number' || totalBillPaise < 0) {
      return NextResponse.json(
        { error: 'Missing mandatory fields: planId, category, and totalBillPaise (>= 0) are required' },
        { status: 400 }
      );
    }

    const validCategories = ['CONSULTATION', 'DIAGNOSTICS', 'PHARMACY', 'EMERGENCY'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      );
    }

    const calculation = db.calculateBenefit(planId, category, totalBillPaise);

    return NextResponse.json({
      success: true,
      planId,
      category,
      totalBillPaise,
      calculation,
      disclaimer: 'Calculated using AHCS database-defined benefit rules. AHCS does not guarantee unverified free treatment.',
    });
  } catch (error: any) {
    console.error('Error calculating benefits:', error);
    return NextResponse.json({ error: 'Failed to calculate benefit' }, { status: 500 });
  }
}
