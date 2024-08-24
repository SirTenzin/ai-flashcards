import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  isPro: boolean;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  image: { type: String },
  isPro: { type: Boolean, default: false },
}, { timestamps: true });

let User: mongoose.Model<IUser>;
try {
  User = mongoose.model<IUser>('User');
} catch {
  User = mongoose.model<IUser>('User', UserSchema);
}

export { User };