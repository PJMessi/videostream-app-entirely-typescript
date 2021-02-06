import { Column, DataType, Model, Table } from "sequelize-typescript";
import jwt from 'jsonwebtoken'; 

@Table({
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

  toJSON = () => {
    return {...super.toJSON(), password: undefined, deletedAt: undefined};
  }

  generateToken = () => {
    const secret = process.env.JWT_SECRET || 'jsonwebtoken';
    const token = jwt.sign(this.toJSON(), secret);
    return token;
  }

}