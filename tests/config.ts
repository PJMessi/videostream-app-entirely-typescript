import "module-alias/register";
import { resetDatabase, createTestDatabase, deleteTestDatabase, migrateTables } from '@helpers/test.helper';

/**
 * Runs before the start of tests.
 * Creates a test database and migrates all the tables to the database.
 */
before(async () => {  
    await createTestDatabase();

    await migrateTables();
})

/**
 * Runs after the end of tests.
 * Deletes the test database.
 */
after(async () => {  
    await deleteTestDatabase();
})

/**
 * Runs before the start of every tests.
 */
beforeEach(async () => {
    await resetDatabase();
});