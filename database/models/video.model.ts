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


export class Video extends Model {

    @Column({
        allowNull: false,
        type: DataType.STRING
    })
    name!: string;

    @Column({
        allowNull: false,
        type: DataType.STRING
    })
    path!: string;

    @Column({
        allowNull: false,
        type: DataType.INTEGER
    })
    size!: number;

    @Column({
        allowNull: false,
        type: DataType.INTEGER
    })
    price!: number

    isSysModel = () => {
        console.log('hello')
    }
}