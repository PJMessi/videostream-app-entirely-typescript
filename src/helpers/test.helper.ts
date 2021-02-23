import { Video } from '@models/video.model';
import { User } from '@models/user.model';
import fs from 'fs';
import sequelize from '@root/database/connection';
//import { exec } from 'child_process';


// Resets database by deleting rows from every model.
export const resetDatabase = async () => {
    await User.destroy({ where: {} });
    await Video.destroy({ where: {}, force: true });
}

// Makes the database tables up to date.
export const migrateTables = async () => {
    await sequelize.sync();

    // console.log('Migrating data to test database.');
    // await new Promise((resolve, reject) => {

    //     const migrate = exec(
    //         'sequelize db:migrate',
    //         { env: process.env },
    //         err => (err ? reject(err): resolve(true))
    //     );

    //     // Forward stdout+stderr to this process
    //     migrate && migrate.stdout && migrate.stdout.pipe(process.stdout);
    //     migrate && migrate.stderr && migrate.stderr.pipe(process.stderr);
    // });
}