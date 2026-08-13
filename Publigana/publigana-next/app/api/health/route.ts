import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    await prisma.rol.findFirst();

    return NextResponse.json({
      ok: true,
      database: "connected",
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    return NextResponse.json(
      {
        ok: false,
        database: "disconnected",
      },
      { status: 500 },
    );
  }
}