import { NextResponse } from "next/server";
import { handleLeadPost } from "@/app/lib/lead-registration";

const duplicateEmailMessage =
  "Este correo electrónico ya está registrado. Usa otro correo.";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: Request) {
  return handleLeadPost(request, corsHeaders, duplicateEmailMessage);
}