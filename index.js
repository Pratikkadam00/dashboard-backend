const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const openaiApiKey = process.env.OPENAI_API_KEY;


app.get("/home", (req, res) => {
  res.send("Healthy");
});

app.post("/api/chat", async (req, res) => {
  const prompt = req.body.prompt;
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
      }
    );

    const message = response.data.choices[0].message.content.trim();
    res.json({ message });
  } catch (error) {
    console.error("Error:", error.response);
    res.status(500).json({ message: "Error generating response" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
