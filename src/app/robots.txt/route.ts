import { NextResponse } from "next/server";

const ROBOTS_TXT = `User-agent: *
Allow: /
`;

export function GET() {
  if (process.env.NODE_ENV !== "production") {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(ROBOTS_TXT, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
