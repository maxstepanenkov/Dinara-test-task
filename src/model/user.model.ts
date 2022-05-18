import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, unique: true },
  name: { type: String },
  password: { type: String }
}, { timestamps: true });

export default model('User', UserSchema);
