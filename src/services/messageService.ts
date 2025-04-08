import { MessageModel } from "../models/messageModel.js";
import { SendMessageInput } from "../validators/messageSchema.js";

export class MessageService {
  static async sendMessage(input: SendMessageInput) {
    return await MessageModel.sendMessage(input);
  }

  static async getConversation(input: any) {
    return await MessageModel.getConversation(input.user1, input.user2);
  }
}