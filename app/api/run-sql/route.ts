import { NextRequest, NextResponse } from "next/server"
import { getSqlResult } from "@/lib/playground-data"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        if (!body || typeof body.projectId !== "string" || !Number.isInteger(body.queryIdx)) {
            return NextResponse.json(
                { success: false, error: "Invalid payload. Expected projectId and queryIdx." },
                { status: 400 }
            )
        }

        const result = getSqlResult(body.projectId, body.queryIdx)

        return NextResponse.json({ success: true, result })
    } catch (error) {
        console.error("run-sql route error", error)
        return NextResponse.json(
            { success: false, error: "Unable to execute SQL query right now." },
            { status: 500 }
        )
    }
}
