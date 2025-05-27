import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  blogTitle?: string;
  blogDescription?: string;
  blogBanner?: string;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    blogTitle: { type: String, default: '' },
    blogDescription: { type: String, default: '' },
    blogBanner: { type: String, default: '' }, // store image URL
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
