import { Schema, model } from 'mongoose';

const AlbumSchema = new Schema({
  title: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' }
});

export default model('Album', AlbumSchema);