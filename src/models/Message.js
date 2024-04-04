const mongoose = require("mongoose");

const Message = mongoose.model(
  "Message",
  new mongoose.Schema({
    id: {
      type: mongoose.ObjectId,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Tham chiếu tới model User
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Tham chiếu tới model User
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"], // Trạng thái của tin nhắn
      default: "sent",
    },
  })
);

module.exports = Message;
