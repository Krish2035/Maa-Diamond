import { NextResponse } from "next/server";
import { FALLBACK_DIAMONDS } from "@/lib/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shape = searchParams.get("shape");
  const color = searchParams.get("color");
  const clarity = searchParams.get("clarity");
  const search = searchParams.get("search");
  const minCarat = searchParams.get("minCarat");
  const maxCarat = searchParams.get("maxCarat");

  let list = [...FALLBACK_DIAMONDS];

  if (shape && shape !== "All") {
    list = list.filter((d) => d.shape.toLowerCase() === shape.toLowerCase());
  }
  if (color && color !== "All") {
    list = list.filter((d) => d.color.toUpperCase() === color.toUpperCase());
  }
  if (clarity && clarity !== "All") {
    list = list.filter((d) => d.clarity.toUpperCase() === clarity.toUpperCase());
  }
  if (minCarat) {
    list = list.filter((d) => d.carat >= parseFloat(minCarat));
  }
  if (maxCarat) {
    list = list.filter((d) => d.carat <= parseFloat(maxCarat));
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (d) =>
        d.stockNumber.toLowerCase().includes(q) ||
        d.shape.toLowerCase().includes(q) ||
        d.certificateNo.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    total: list.length,
    diamonds: list,
  });
}
