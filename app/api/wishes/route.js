import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Wish from "@/models/Wish";

// Helper to ensure MongoDB connection regardless of export type (connectDB or clientPromise)
async function ensureDb() {
  if (typeof connectDB === "function") {
    await connectDB();
  } else if (connectDB && typeof connectDB.then === "function") {
    await connectDB;
  }
}

// GET: Fetch all wishes for the Wall of Blessings
export async function GET() {
  try {
    await ensureDb();
    const wishes = await Wish.find({}).sort({ createdAt: -1 }).limit(50);
    return NextResponse.json({ success: true, data: wishes }, { status: 200 });
  } catch (error) {
    console.error("Fetch Wishes Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch wishes", details: error.message },
      { status: 500 }
    );
  }
}

// POST: Save a new Dua / Wish
export async function POST(request) {
  try {
    await ensureDb();
    const body = await request.json();
    const { name, message } = body;

    // Validation
    if (!name || !message) {
      return NextResponse.json(
        { success: false, error: "Name and message are required." },
        { status: 400 }
      );
    }

    // Save to Database
    const newWish = await Wish.create({
      name: name.trim(),
      message: message.trim(),
    });

    return NextResponse.json(
      { success: true, data: newWish },
      { status: 201 }
    );
  } catch (error) {
    console.error("Wish Submission Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}