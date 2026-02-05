import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const { accessToken, refreshToken } = body;

    if (!accessToken || !refreshToken) {
        return NextResponse.json(
            { message: "Thiếu token để làm mới session" },
            { status: 400 }
        );
    }

    const response = NextResponse.json({
        message: "Refresh token thành công",
    });

    response.cookies.set("accessToken", accessToken, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60,  // 15p
    });


    response.cookies.set("refreshToken", refreshToken, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 2 * 24 * 60 * 60,
    });
    return response;
}