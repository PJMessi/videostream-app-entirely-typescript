import "module-alias/register";
import { assert } from 'chai';
import request from 'supertest';
import server from '@root/app';
import userFactory from '@factories/user.factory';
import { User } from "@root/src/database/models/user.model";
import bcrypt from 'bcrypt';

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
			const registerResponse = await app.post('/auth/register').send(userData);
			assert.equal(registerResponse.status, 201);
			const registerResponseData = registerResponse.body.data;

			// checking for user data in database.
			const user = await User.findOne({where: {email: userData.email}});
			assert.equal(userData.email, user?.email);
			assert.equal(userData.name, user?.name);
			const passwordMatches = await bcrypt.compare(userData.password, user!.password);
			assert.isTrue(passwordMatches)

			// checking for user data in response.
			assert.exists(registerResponseData.user.id);
			assert.exists(registerResponseData.user.createdAt);
			assert.exists(registerResponseData.user.updatedAt);
			assert.equal(registerResponseData.user.email, userData.email);
			assert.equal(registerResponseData.user.name, userData.name);

			// checking for token in response.
			assert.exists(registerResponseData.token);

			// checking tokens validity. Sending request to fetch profile.
			const fetchProfileResponse = await app.get('/auth/profile')
			.set('Authorization', `Bearer ${registerResponseData.token}`);
			assert.equal(fetchProfileResponse.status, 200);
		});

		it ('returns validation errors if required fields are not provided.', async () => {
			/** Calling API to register new user with invalid data. */
			let response = await app.post('/auth/register').send({});

			// checking response.
			assert.equal(response.status, 422);
			assert.hasAllKeys(response.body.errors, ['email', 'name', 'password']);
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
			assert.equal(response.status, 422);

			// checking response.
			assert.hasAllKeys(response.body.errors, ['email', 'name', 'password']);
		});

		it ('returns validation error if the email is already taken.', async () => {
			/** Creating test user. */
			const user = await userFactory.createSingle();

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
			const user = await userFactory.createSingle();
			const authToken = user.generateToken();

			/** Calling API fetch profile. */
			const profileResponse = await app.get('/auth/profile').set('Authorization', `Bearer ${authToken}`);
			assert.equal(profileResponse.status, 200);

			// checking response.
			const profileResponseData = profileResponse.body.data;
			assert.equal(profileResponseData.user.id, user.id);
			assert.equal(profileResponseData.user.email, user.email);
			assert.equal(profileResponseData.user.name, user.name);
			assert.isUndefined(profileResponseData.user.password);
			assert.equal(profileResponseData.user.createdAt, user.createdAt.toISOString());
			assert.equal(profileResponseData.user.updatedAt, user.updatedAt.toISOString());
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
			const user = await userFactory.createSingle();

			/** Calling API to get bearer token. */
			const userData = {
				email: user.email,
				password: 'password'
			};
			const loginResponse = await app.post('/auth/login').send(userData);
			assert.equal(loginResponse.status, 200);
			const loginResponseData = loginResponse.body.data;
			
			// checking for token in response.
			assert.exists(loginResponseData.token);

			// checking tokens validity. Sending request to fetch profile.
			const profileResponse = await app.get('/auth/profile')
			.set('Authorization', `Bearer ${loginResponseData.token}`);
			assert.equal(profileResponse.status, 200);

			// checking response user.
			assert.equal(loginResponseData.user.id, user.id);
			assert.equal(loginResponseData.user.email, user.email);
			assert.equal(loginResponseData.user.name, user.name);
			assert.isUndefined(loginResponseData.user.password);
			assert.equal(loginResponseData.user.createdAt, user.createdAt.toISOString());
			assert.equal(loginResponseData.user.updatedAt, user.updatedAt.toISOString());
		});

		it ('returns valiation error if required fields are not provided.', async () => {
			/** Calling API to get bearer token without any data. */
			const loginResponse = await app.post('/auth/login');
			assert.equal(loginResponse.status, 422);
	
			// checking response.
			assert.hasAllKeys(loginResponse.body.errors, ['email', 'password']);
		});

		it ('returns valiation error if invalid data are provided.', async () => {
			/** Calling API to get bearer token with invalid data. */
			const userData = {
				email: 'aa',
				password: ''
			};
			const loginResponse = await app.post('/auth/login').send(userData);
			assert.equal(loginResponse.status, 422);
	
			// checking response.
			assert.hasAllKeys(loginResponse.body.errors, ['email', 'password']);
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
