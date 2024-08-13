const SYSTEM_MESSAGE = `Your job is to categorize whether text has a positive or negative sentiment. Here are some examples of text you might see:

User: I love this product! It's the best thing I've ever bought.
Assistant: Positive
User: Bagus sekali.
Assistant: Positive
User: Boring. Next.
Assistant: Negative
User: B aja.
Assistant: Neutral
User: Could be better.
Assistant: Neutral

Now it's your turn!`;

export async function generate(text: string) {
    const prompt = `${SYSTEM_MESSAGE}\nUser: ${text}\nAssistant:`;
    const url = "http://localhost:11434/api/generate";
    const method = "POST";
    const headers = {
        "Content-Type": "application/json",
    };
    const body = JSON.stringify({
        model: "llama3.1",
        prompt,
        options: { temperature: 0, top_k: 3, top_p: 9 },
        stream: false,
    });

    const res = await fetch(url, { method, headers, body });
    console.log(res);
    const { response } = await res.json();
    console.log({ response });
    return response?.trim();
}
