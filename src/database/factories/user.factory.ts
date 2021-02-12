import { User } from "../models/user.model";
import faker from 'faker';
import bcrypt from 'bcrypt';
import Factory from "./factory";

class UserFactory extends Factory<User> {

    model = User;

    attributes = {
        name: faker.name.findName(),
        email: faker.internet.email().toLocaleLowerCase(),
        password: bcrypt.hashSync('password', 10)
    }
}

export default new UserFactory;