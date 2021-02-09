import { User, UserAttributes } from "../database/models/user.model";
import bcrypt from 'bcrypt';
import createError from 'http-errors';

/**
 * Registers new user. Returns user data and auth token.
 * @param userAttributes
 */
export const registerUser = async (userAttributes: UserAttributes): 
Promise<{ userData: object, authToken: string }> => {

    userAttributes.password = await bcrypt.hash(userAttributes.password, 10);

    const user = await User.create(userAttributes);

    const authToken = user.generateToken();

    return {
        userData: user.toJSON(),
        authToken
    }
}

/**
 * Checks if user with credentials exists. If it does, returns user data and auth token.
 * @param userCredential 
 */
export const loginUser = async (userCredential: { email: string, password: string }): 
Promise<{ userData: object, authToken: string }> => {

    const user = await User.findOne({ where: { email: userCredential.email } });
    if (!user) throw new createError.Unauthorized('Invalid credentials.');

    const doesPasswordMatch = await bcrypt.compare(userCredential.password, user.password); 
    if (!doesPasswordMatch)
        throw new createError.Unauthorized('Invalid credentials.');
    
    const authToken = user.generateToken();

    return {
        userData: user.toJSON(),
        authToken
    }
}

/**
 * Checks if user with given id exists. If it does, returns user, else returns null.
 * @param id 
 */
export const getUserWithGivenId = async (id: number): Promise<User|null> => {
    const user = await User.findByPk(id);
    return user;
}

/**
 * Checks if user with given email exists. If it does, returns user, else returns null.
 * @param email 
 */
export const getUserWithGivenEmail = async (email: string): Promise<User|null> => {
    const user = await User.findOne({ where: { email } });
    return user;
}