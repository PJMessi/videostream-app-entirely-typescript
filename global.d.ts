import { User } from '@models/user.model';

// Declaring custom value types.
declare global {
  namespace NodeJS {
    interface Global {
      appRoot: string;
    }
  }

  namespace Express {
    interface Request {
      file: Express.Multer.File;
    }
  }

  namespace Express {
    interface Request {
      auth: { user?: User };
    }
  }
}
