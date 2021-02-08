import "module-alias/register";
import { resetDatabase, migrateTables } from '@helpers/test.helper';

// Creates a test database and migrates all the tables to the database.
before(async () => {  
    await migrateTables();
})

beforeEach(async () => {
    await resetDatabase();
});