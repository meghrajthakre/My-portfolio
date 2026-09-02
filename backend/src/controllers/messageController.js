import { Message } from "../models/Message.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createMessage = asyncHandler(async (req, res) => {
  const { name, phone = "", email, message } = req.body;

  const savedMessage = await Message.create({ name, phone, email, message });

  res.status(201).json({
    success: true,
    message: "Thanks! Your message has been received successfully.",
    data: {
      id: savedMessage._id,
      createdAt: savedMessage.createdAt,
    },
  });
});
