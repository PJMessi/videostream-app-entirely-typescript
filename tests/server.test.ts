
import { assert } from 'chai';
import request from 'supertest';
import server from '#root/app';

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
		
	});

});
