import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId } from "../lib/socket.js";
import Message from "../model/message.js";
import User from "../model/User.js";
import { io } from "../lib/socket.js";

export const getAllContatcts = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const fillteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(fillteredUsers);
  } catch (error) {
    console.log("error in getAllContatcts", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user.id;
    const { id: userToChatId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("error in getMessagesByUserId controoller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.id;
    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();
    
    // Real-time message emission via Redis Adapter across all backend replicas
    io.to(receiverId).emit("newMessage", newMessage);
    //send mesage in real time if user is online using socket io
    res.status(200).json(newMessage);
  } catch (error) {
    console.log("error in sendMessage controoller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChatpartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id.toString();
    //find all messages where logged in user is either sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });
    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId
            ? msg.receiverId.toString()
            : msg.senderId.toString(),
        ),
      ),
    ];

    const chatPartners = await User.find({_id:{ $in :chatPartnerIds}}).select("-password");
    res.status(200).json(chatPartners);
  } catch (error) {
    console.log("error in getChatpartners controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
