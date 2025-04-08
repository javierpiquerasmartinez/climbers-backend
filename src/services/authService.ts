import { OAuth2Client } from "google-auth-library";
import { UserModel } from "../models/userModel.js";
import { UserService } from "./userService.js";
import { AvatarService } from "./avatarService.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthService {

  static async loginWithGoogle(token: any) {

    if (!token) {
      throw new Error('Token no proporcionado');
    }
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Usuario inválido');
    }

    const { email, name, picture } = payload;

    if (!email || !name) {
      throw new Error('Datos de usuario incompletos');
    }

    let user = await UserModel.findByEmail({ email });

    if (!user) {
      user = await UserService.createUser({ name, email, avatarUrl: picture, role: 'viajero' });

      if (picture) {
        const avatarUrl = await AvatarService.downloadAndUploadAvatar(picture, user.id);
        user = await UserModel.updateUserAvatarUrl({ id: user.id, avatarUrl });
      }

    }
    return user;

  }

}
