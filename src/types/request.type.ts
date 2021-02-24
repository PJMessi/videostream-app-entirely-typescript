import { User } from '@root/database/models/user.model';
import { Request } from 'express';

export interface CustomRequest extends Request {
  file: Express.Multer.File;
  auth: { user?: User };
}
