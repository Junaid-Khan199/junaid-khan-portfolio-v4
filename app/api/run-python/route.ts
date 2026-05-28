import { NextRequest, NextResponse } from "next/server"
import { getPythonOutput } from "@/lib/playground-data"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        if (!body || typeof body.projectId !== "string" || !Number.isInteger(body.snippetIdx)) {
            return NextResponse.json(
                { success: false, error: "Invalid payload. Expected projectId and snippetIdx." },
                { status: 400 }
            )
        }

        const output = getPythonOutput(body.projectId, body.snippetIdx)

        return NextResponse.json({ success: true, output })
    } catch (error) {
        console.error("run-python route error", error)
        return NextResponse.json(
            { success: false, error: "Unable to execute Python code right now." },
            { status: 500 }
        )
    }
}
