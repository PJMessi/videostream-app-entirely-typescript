import "module-alias/register";
import { assert } from 'chai';
import request from 'supertest';
import server from '@root/app';
import { createUser } from '@root/database/factories/user.factory';

const app = request.agent(server);

describe('Authentication', () => {

	describe('POST /auth/register', () => {

        it ('creates new user when valid data are provided.', async () => {
			/** Calling API to register new user. */
			const userData = {
				email: 'user1@test.com',
				name: 'Test User',
				password: 'password',
				password_confirmation: 'password',
			};
			const response = await app.post('/auth/register').send(userData);

			// checking response.
			assert.equal(response.status, 201);

			const responseUser = response.body.data.user;
			assert.hasAllKeys(responseUser, ['id', 'email', 'name', 'createdAt', 'updatedAt']);
			assert.doesNotHaveAllKeys(responseUser, ['password']);
			assert.equal(responseUser.email, userData.email);
			assert.equal(responseUser.name, userData.name);
		});

		it ('returns validation errors if invalid data are provided.', async () => {
                /** Calling API to register new user with invalid data. */
                let userData: object = {
                    email: '',
                    name: '',
                    password: 'passwordzxc',
                    password_confirmation: 'password',
                };
                let response = await app.post('/auth/register').send(userData);

                // checking response.
                assert.equal(response.status, 422);
                assert.hasAllKeys(response.body.errors, ['email', 'name', 'password']);

                /** Calling API to register new user without any data. */
                userData = {};
                response = await app.post('/auth/register').send(userData);

                // checking response.
                assert.equal(response.status, 422);
                assert.hasAllKeys(response.body.errors, ['email', 'name', 'password']);
		});

		it ('returns validation error if the email is already taken.', async () => {
			/** Creating test user. */
			const user = await createUser();

			// console.log(user);

			/** Calling API to register new user. */
			const userData = {
				email: user.email,
				name: 'New User',
				password: 'password',
				password_confirmation: 'password',
			};
			const response = await app.post('/auth/register').send(userData);

			// checking response.
			assert.equal(response.status, 422);
			assert.hasAllKeys(response.body.errors, ['email']);
		});

	});

	describe('GET /auth/profile', async () => {

		it ('returns profile of the user that the bearer token belongs to.', async () => {
			/** Creating test user. */
			const user = await createUser();
			const authToken = await user.generateToken();

			/** Calling API fetch profile. */
			const profileResponse = await app.get('/auth/profile').set('Authorization', `Bearer ${authToken}`);
			assert.equal(profileResponse.status, 200);

			// checking response.
			const responseUser = profileResponse.body.data.user;
			assert.hasAllKeys(responseUser, ['id', 'email', 'name', 'createdAt', 'updatedAt']);
			assert.doesNotHaveAllKeys(responseUser, ['password']);
			assert.equal(responseUser.email, user.email);
			assert.equal(responseUser.name, user.name);
		});

		it ('returns authentication error if bearer token is not provided or is invalid.', async () => {
			/** Calling API fetch profile without token. */
			const profileResponseWithoutToken = await app.get('/auth/profile');
			assert.equal(profileResponseWithoutToken.status, 401);

			/** Calling API fetch profile without token. */
			const profileResponseWithInvalidToken = await app.get('/auth/profile').set('Authorization', 'Bearer invalid token');
			assert.equal(profileResponseWithInvalidToken.status, 401);
		});

	});

	describe('GET /auth/login', async () => {

		it ('returns user profile along with bearer token if correct credentials is provided.', async () => {
			/** Creating test user. */
			const user = await createUser();

			/** Calling API to get bearer token. */
			const userData = {
				email: user.email,
				password: 'password'
			};
			const loginResponse = await app.post('/auth/login').send(userData);
			
			// checking response.
			assert.equal(loginResponse.status, 200);
			
			// testing auth token
			const authToken = loginResponse.body.data.token;
			const profileResponse = await app.get('/auth/profile').set('Authorization', `Bearer ${authToken}`);
			assert.equal(profileResponse.status, 200);

			// checking response user.
			const responseUser = loginResponse.body.data.user;
			assert.hasAllKeys(responseUser, ['id', 'email', 'name', 'createdAt', 'updatedAt']);
			assert.doesNotHaveAllKeys(responseUser, ['password']);
			assert.equal(responseUser.email, user.email);
			assert.equal(responseUser.name, user.name);
		});

		it ('returns valiation error if invalid data are provided.', async () => {
			/** Calling API to get bearer token with invalid data. */
			const userData = {
				email: 'aa',
				password: ''
			};
			const loginResponseWithInvalidData = await app.post('/auth/login').send(userData);
			assert.equal(loginResponseWithInvalidData.status, 422);
	
			// checking response.
			assert.equal(loginResponseWithInvalidData.status, 422);
			assert.hasAllKeys(loginResponseWithInvalidData.body.errors, ['email', 'password']);
			
			/** Calling API to get bearer token without any data. */
			const userData2 = {};
			const loginResponseWithoutData = await app.post('/auth/login').send(userData2);
			assert.equal(loginResponseWithoutData.status, 422);
	
			// checking response.
			assert.equal(loginResponseWithoutData.status, 422);
			assert.hasAllKeys(loginResponseWithoutData.body.errors, ['email', 'password']);
		});

		it ('returns authentication error if invalid credentials are provided.', async () => {
			/** Calling API to get bearer token with invalid data. */
			const userData = {
				email: 'test@gmail.com',
				password: 'password'
			};
			const loginResponseWithInvalidData = await app.post('/auth/login').send(userData);
			assert.equal(loginResponseWithInvalidData.status, 401);
		});

	});

});
