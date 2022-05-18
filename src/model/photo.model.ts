import { Schema, model } from 'mongoose';

const PhotoSchema = new Schema({
  title: { type: String },
  url: { type: String },
  thumbnailUrl: { type: String },
  albumId: { type: Number },
});

export default model('Photo', PhotoSchema);