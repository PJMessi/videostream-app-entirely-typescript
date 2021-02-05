import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
    defaultScope: {
        attributes: {
            exclude: ['deletedAt']
        }
    },
    paranoid: true,
    tableName: 'videos'
})


export class Video extends Model<Video> {
    @Column({
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataType.INTEGER
    })
    id!: number;

    @Column({
        allowNull: false,
        type: DataType.STRING
    })
    name!: string;

    @Column({
        allowNull: false,
        type: DataType.INTEGER
    })
    size!: number;

    @Column({
        allowNull: false,
        type: DataType.STRING
    })
    price!: number
}