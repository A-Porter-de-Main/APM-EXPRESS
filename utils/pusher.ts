import Pusher from "pusher";
import {UrlWithStringQuery} from "url";

export const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID || "",
    key: process.env.NEXT_PUBLIC_PUSHER_KEY || "",
    secret: process.env.PUSHER_SECRET || "",
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "",
});

/**
 *
 * @param chatId
 * @param message
 * @param senderId
 * @param receiverId
 * @param createdAt
 */

export const PusherChat = (chatId: string, message: string, senderId: string, receiverId: string, createdAt: Date) => {
    try {
        pusher.trigger(`chat_${chatId}`, "new-message", {
            senderId: senderId,
            receiverId: receiverId,
            content: message,
            createdAt: createdAt
        })
    } catch (e) {
        throw e;
    }
}