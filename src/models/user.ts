import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import UserType from './user-type';

const UserSchema = new mongoose.Schema({
  local: {
    name:  { type: String, required: true },
    email: { type: String, index: true, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String },
    createdAt: { type: Date, default: Date.now }
  }
});

const UserModel = mongoose.model('User', UserSchema) as mongoose.Model<UserType>;

const generateHash = function(password: string) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

const generateJWT = function(email: string, id: string): string {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 90);

  return jwt.sign(
    {
      email: email,
      id: id,
      exp: parseInt((expirationDate.getTime() / 1000).toString(), 10),
    }, 
    process.env.SECRET!
  );
};

const validate = function(attributes: any): mongoose.Error.ValidationError | undefined {
  const tempUser = new UserModel(attributes);
  const errors = tempUser.validateSync();

  return errors;
}

const validateEmail = function(email: string): boolean {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}

const currentUser = function(token: string, callback: (_: mongoose.Model<UserType>) => void) {
  UserModel.findOne({ 'local.token': token }, callback);
}

const verifyPassword = function(user: UserType, password: string) {
  return bcrypt.compareSync(password, user.local.password as string);
};

UserSchema.plugin(uniqueValidator);

export default {
  Model: UserModel,
  Util: {
    currentUser,
    generateHash,
    generateJWT,
    validate,
    validateEmail,
    verifyPassword,
  }
}
