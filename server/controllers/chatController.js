import { chatWithGemini } from "../services/geminiService.js";

export const chat = async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await chatWithGemini(prompt);

    res.status(200).json({
      success: true,
      response,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};