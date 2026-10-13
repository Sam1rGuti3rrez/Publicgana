import { NextResponse } from "next/server";
import {
  getColombianDepartments,
  getColombianMunicipalities,
} from "@/app/lib/colombian-municipalities";

export async function GET() {
  return NextResponse.json(
    {
      departments: getColombianDepartments(),
      municipalities: getColombianMunicipalities(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
