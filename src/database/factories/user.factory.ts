import faker from 'faker';
import bcrypt from 'bcrypt';
import { User, UserAttributes, UserAttributesForUpdate } from '../models/user.model';

// creates multiple users.
export const createUsers = async (amount: number, customAttributes?: UserAttributesForUpdate): Promise<User[]> => {
    let users: User[] = [];

    for (let i = 0; i < amount; i++) {
        const user = await createUser(customAttributes);
        users.push(user)
    }

    return users;
}

// create single user.
export const createUser = async (customAttributes?: UserAttributesForUpdate): Promise<User> => {
    const randomAttributes = generateRandomAttributes();

    customAttributes = customAttributes || {};

    const finalAttributes = generateFinalAttributes(randomAttributes, customAttributes);

    const user = await User.create(finalAttributes);
    return user;
}

const generateRandomAttributes = (): UserAttributes => {
    return {
        name: faker.name.findName(),
        email: faker.internet.email().toLocaleLowerCase(),
        password: bcrypt.hashSync('password', 10)
    };
}

const generateFinalAttributes = (
    randomAttributes: UserAttributes,
    customAttributes: UserAttributesForUpdate

): UserAttributes => {

    return { ...randomAttributes, ...customAttributes }
}
