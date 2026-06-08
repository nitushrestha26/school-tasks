const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Anthropic = require("@anthropic-ai/sdk").default;
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

app.get("/", (req, res) => {
    res.sendFil(path.join(__dirname, "index.html"));
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
Extract tasks and calendar events from this school email.

Return ONLY valid JSON. No markdown. No explanation.

Format:
{
  "tasks": ["task text"],
  "calendar": ["date: event text"]
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

const PORT =process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

});