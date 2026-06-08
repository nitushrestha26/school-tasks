const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Anthropic = require("@anthropic-ai/sdk").default;

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

app.get("/", (req, res) => {
    res.send("Server is working!");
});

app.post("/extract-tasks", async (req, res) => {
    try {
        const { email } = req.body;

        const response = await client.messages.create({
            model: "claude-sonnet-4-6",
            max_tokens: 1024,
            messages: [
                {
                    role: "user",
                    content: `
Extract parent tasks and calendar events from this school email.

Return ONLY JSON:
{
  "tasks": [],
  "calendar": []
}

Email:
${email}
`
                }
            ]
        });

        res.json({
            result: response.content[0].text
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});