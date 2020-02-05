import { Document } from 'mongoose';

export default interface User extends Document {
  local: {
    name:  String
    email: String
    password: String
    token: String
    createdAt: Date
  }
}