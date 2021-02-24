import bcrypt from 'bcrypt';
import createError from 'http-errors';
import { User, UserAttributes } from '../database/models/user.model';

type AuthenticationData = {
  userData: Omit<UserAttributes, 'password' | 'deletedAt'>;
  authToken: string;
};

export const registerUser = async (
  userAttributes: UserAttributes
): Promise<AuthenticationData> => {
  const user = await User.create({
    ...userAttributes,
    password: await bcrypt.hash(userAttributes.password, 10),
  });

  const authToken = user.generateToken();

  return {
    userData: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    authToken,
  };
};

export const loginUser = async (userCredential: {
  email: string;
  password: string;
}): Promise<AuthenticationData> => {
  const user = await User.findOne({ where: { email: userCredential.email } });
  if (!user) throw new createError.Unauthorized('Invalid credentials.');

  const doesPasswordMatch = await bcrypt.compare(
    userCredential.password,
    user.password
  );
  if (!doesPasswordMatch)
    throw new createError.Unauthorized('Invalid credentials.');

  const authToken = user.generateToken();

  return {
    userData: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    authToken,
  };
};

export const getUserWithGivenId = async (id: number): Promise<User | null> => {
  const user = await User.findByPk(id);
  return user;
};

export const getUserWithGivenEmail = async (
  email: string
): Promise<User | null> => {
  const user = await User.findOne({ where: { email } });
  return user;
};
