import { Video } from '#root/database/models/video.model';
import { User } from '#root/database/models/user.model';
import fs from 'fs';
import { exec } from 'child_process';

export const resetDatabase = async () => {
    await User.destroy({ where: {} });
    await Video.destroy({ where: {}, force: true });
}

export const createTestDatabase = async () => {
    // fs.createWriteStream('database.sqlite');
    const file = await fs.promises.open('database.sqlite', 'w');
    await file.close();
}

export const deleteTestDatabase = async () => {
    await fs.promises.unlink('database.sqlite');
}

export const migrateTables = async () => {
    await new Promise((resolve, reject) => {

        const migrate = exec(
            'sequelize db:migrate',
            { env: process.env },
            err => (err ? reject(err): resolve(true))
        );

        // Forward stdout+stderr to this process
        migrate && migrate.stdout && migrate.stdout.pipe(process.stdout);
        migrate && migrate.stderr && migrate.stderr.pipe(process.stderr);
    });
}