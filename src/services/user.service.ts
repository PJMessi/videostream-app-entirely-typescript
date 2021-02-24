import bcrypt from 'bcrypt';
import createError from 'http-errors';
import { User, UserAttributes } from '../database/models/user.model';

type AuthenticationData = {
  userData: User;
  authToken: string;
};

/**
 * Registers new user with given data and generates auth token.
 * @param userAttributes
 */
export const registerUser = async (
  userAttributes: Omit<
    UserAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
  >
): Promise<AuthenticationData> => {
  const user = await User.create({
    ...userAttributes,
    password: await bcrypt.hash(userAttributes.password, 10),
  });

  const authToken = user.generateToken();

  return {
    userData: user,
    authToken,
  };
};

/**
 * Fetches user with given credentials and generates auth token.
 * @param userCredential
 */
export const loginUser = async (userCredential: {
  email: string;
  password: string;
}): Promise<AuthenticationData> => {
  const user = await User.findOne({
    where: { email: userCredential.email },
  });
  if (!user) throw new createError.Unauthorized('Invalid credentials.');

  const doesPasswordMatch = await bcrypt.compare(
    userCredential.password,
    user.password
  );
  if (!doesPasswordMatch)
    throw new createError.Unauthorized('Invalid credentials.');

  const authToken = user.generateToken();

  return {
    userData: user,
    authToken,
  };
};

/**
 * Fetches user with given id.
 * @param id
 */
export const getUserWithGivenId = async (id: number): Promise<User | null> => {
  const user = await User.findByPk(id);
  return user;
};

/**
 * Fetchs user with given email.
 * @param email
 */
export const getUserWithGivenEmail = async (
  email: string
): Promise<User | null> => {
  const user = await User.findOne({ where: { email } });
  return user;
};
