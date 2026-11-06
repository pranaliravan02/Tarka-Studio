
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDb } from "@/lib/db";

export async function GET() {
  try {
    await connectDb();

    return NextResponse.json({
      success: true,
      message: "Tarka backend and MongoDB are connected successfully.",
      database: mongoose.connection.name,
      status: mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "MongoDB connection failed.",
      },
      { status: 503 }
    );
  }
}
