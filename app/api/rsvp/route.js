import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RSVP from '@/models/RSVP';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const { name, email, attendance, guestsCount, message } = body;

    if (!name || !attendance) {
      return NextResponse.json(
        { success: false, error: 'Name and attendance status are required.' },
        { status: 400 }
      );
    }

    const newRsvp = await RSVP.create({
      name,
      email,
      attendance,
      guestsCount: guestsCount || 1,
      message,
    });

    return NextResponse.json(
      { success: true, data: newRsvp },
      { status: 201 }
    );
  } catch (error) {
    console.error('RSVP Submission Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}