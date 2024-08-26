import Pusher from "pusher";


export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || "",
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || "",
  secret: process.env.PUSHER_SECRET || "",
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "",
});

export const PusherChat = async (chatId: string, message: string, senderId: string, receiverId: string, createdAt: Date, messageId: string) => {
  try {
    await pusher.trigger(`chat_${chatId}`, "new-message", { chatId: chatId, senderId: senderId, receiverId: receiverId, content: message, createdAt: createdAt, messageId: messageId })
  } catch (e) {
    console.log(e)
  }
}