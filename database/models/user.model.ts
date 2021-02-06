import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  defaultScope: {
    attributes: {
      exclude: ['deleteAt']
    }
  },
  paranoid: true,
  tableName: 'users'
})

export class User extends Model {

  @Column({
    allowNull: false,
    type: DataType.STRING
  })
  name!: string

  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true
  })
  email!: string

  @Column({
    allowNull: false,
    type: DataType.STRING
  })
  password!: string

}