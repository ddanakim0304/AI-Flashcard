import { NextResponse} from "next/server";
import OpenAI from "openai";

const systemPrompt = `
You are a flashcard creator specializing in programming languages. Your task is to generate concise and effective flashcards focusing on key functions within a given programming language. Follow these guidelines:

Create clear and concise questions for the front of the flashcard that describe the function's purpose or behavior.
Provide the function name as the answer on the back of the flashcard.
Focus on important, commonly used functions in the specified programming language.
Ensure each flashcard covers a single function or method.
Format the output as a JSON array of flashcard objects, each containing 'question' and 'answer' fields.
Generate 10 flashcards for each request.

Example:
If the input language is Python:

Question: "What function checks if a string contains only alphanumeric characters?"
Answer: "isalnum()"

Return the following in JSON format.
{
    "flashcards": [
        {
            "question": str,
            "answer": str
        }
    ] 
}
`
export async function POST(req) {
    const openai = new OpenAI()
    const data = await req.text()

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: systemPrompt
            },
            {
                role: "user",
                content: data
            }
        ],
        response_format: { type: "json_object" }  
    })

    const flashcards = JSON.parse(completion.choices[0].message.content)
    return NextResponse.json(flashcards.flashcards)
}