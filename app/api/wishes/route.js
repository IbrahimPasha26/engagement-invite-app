import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Wish from '@/models/Wish';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const { name, message } = body;

    // Validation
    if (!name || !message) {
      return NextResponse.json(
        { success: false, error: 'Name and message are required.' },
        { status: 400 }
      );
    }

    // Save to Database
    const newWish = await Wish.create({
      name,
      message,
    });

    return NextResponse.json(
      { success: true, data: newWish },
      { status: 201 }
    );
  } catch (error) {
    console.error('Wish Submission Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}