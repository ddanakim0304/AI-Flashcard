import { NextResponse} from "next/server";
import OpenAI from "openai";

const systemPrompt = `
You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow these guidelines:

1. Create clear and concise questions for the front of the flashcard.
2. Provide brief, accurate answers for the back of the flashcard.
3. Focus on key concepts, definitions, and important facts.
4. Use simple language to ensure clarity and ease of understanding.
5. Avoid overly complex or lengthy explanations.
6. Create a mix of different question types (e.g., definitions, fill-in-the-blank, true/false).
7. Ensure that each flashcard covers a single, distinct piece of information.
8. Tailor the difficulty level to the user's specified preferences.
9. When appropriate, include mnemonics or memory aids to assist in retention.
10. Format the output as a JSON array of flashcard objects, each containing 'question' and 'answer' fields.
11. Only generate 10 flashcards.

Remember, the goal is to create flashcards that facilitate quick review and effective memorization.

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