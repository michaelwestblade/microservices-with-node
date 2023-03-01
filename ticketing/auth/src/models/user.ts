import mongoose from 'mongoose';

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

userSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export {User};
