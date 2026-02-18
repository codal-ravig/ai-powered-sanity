import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

const client = createClient({
  projectId: "22t68kfp",
  dataset: "production",
  apiVersion: "2024-02-18",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!process.env.SANITY_API_TOKEN) {
    console.error("Missing SANITY_API_TOKEN in environment variables");
    return NextResponse.json({ error: "API Token not configured" }, { status: 500 });
  }

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    const result = await client
      .patch(id)
      .setIfMissing({ views: 0 })
      .inc({ views: 1 })
      .commit({ autoGenerateArrayKeys: true });

    return NextResponse.json({ views: result.views });
  } catch (error: any) {
    console.error("Error updating views in Sanity:", {
      message: error.message,
      statusCode: error.statusCode,
      details: error.responseBody,
    });
    return NextResponse.json({ 
      error: "Failed to update views", 
      details: error.message 
    }, { status: 500 });
  }
}
