import { Column, DataType, Model, Table } from 'sequelize-typescript';
import jwt from 'jsonwebtoken';

@Table({
  tableName: 'users',
})
export class User extends Model {
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  name!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  email!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  password!: string;

  toJSON = (): {
    id: number;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  } => {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  };

  generateToken = (): string => {
    const secret = process.env.JWT_SECRET || 'jsonwebtoken';
    const token = jwt.sign(this.id, secret);
    return token;
  };
}

export type UserAttributes = {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};
