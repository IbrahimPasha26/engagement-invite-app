import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import RSVP from "@/models/RSVP";

async function ensureDb() {
  if (typeof connectDB === "function") {
    await connectDB();
  } else if (connectDB && typeof connectDB.then === "function") {
    await connectDB;
  }
}

// GET: Retrieve all RSVPs
export async function GET() {
  try {
    await ensureDb();
    const rsvps = await RSVP.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: rsvps }, { status: 200 });
  } catch (error) {
    console.error("Fetch RSVP Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch RSVPs", details: error.message },
      { status: 500 }
    );
  }
}

// POST: Save a new RSVP
export async function POST(request) {
  try {
    await ensureDb();
    const body = await request.json();
    const { name, attendance, guestsCount, message, email } = body;

    // Validate incoming fields matching Mongoose schema requirements
    if (!name || !attendance) {
      return NextResponse.json(
        { error: "Name and attendance status are required fields." },
        { status: 400 }
      );
    }

    // Create and save directly using Mongoose model schema
    const newRsvp = await RSVP.create({
      name: name.trim(),
      attendance,
      guestsCount: Number(guestsCount) || 1,
      message: message ? message.trim() : undefined,
      email: email ? email.trim() : undefined,
    });

    return NextResponse.json(
      { message: "RSVP saved successfully", data: newRsvp },
      { status: 201 }
    );
  } catch (error) {
    console.error("RSVP Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 400 }
    );
  }
}