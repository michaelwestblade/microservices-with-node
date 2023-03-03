import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the properties that
// are required to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties that a User document has
interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
}

// An interface that describes the properties a user model has
interface UserModel extends mongoose.Model<any> {
  build: (attrs: UserAttrs) => UserDocument;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.pre('save', async function ( done ) {
  if (this.isModified('password')) {
    const hashedPassword = await Password.toHash(this.get('password'));
    this.set('password', hashedPassword);
  }
  done();
});
userSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export {User};
