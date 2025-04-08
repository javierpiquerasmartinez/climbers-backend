import { MessageModel } from "../models/messageModel";
import { GetConversationInput, SendMessageInput } from "../validators/messageSchema";

export class MessageService {
  static async sendMessage(input: SendMessageInput) {
    return await MessageModel.sendMessage(input);
  }

  static async getConversation(input: any) {
    return await MessageModel.getConversation(input.user1, input.user2);
  }
}