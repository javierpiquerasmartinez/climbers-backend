import axios from 'axios';
import cloudinary from '../lib/cloudinary.js';
import { UserService } from './userService.js';

export class AvatarService {

  static async downloadAndUploadAvatar(url: string, userId: string): Promise<string> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'climbers/avatars',
          public_id: `user-${userId}`,
          overwrite: true
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Error al subir imagen'));
          } else {
            resolve(result.secure_url);
          }
        }
      );

      stream.end(response.data);
    });
  }

  static async uploadAvatar(requester: any, { userId, file }: any): Promise<string> {
    await UserService.requesterIsOwner(requester, { id: userId });
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'climbers/avatars',
          public_id: `user-${userId}`,
          overwrite: true
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Error al subir imagen'));
          } else {
            resolve(result.secure_url);
          }
        }
      );
      stream.end(file.buffer);
    });
  }

}