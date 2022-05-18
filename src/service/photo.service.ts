import AlbumModel from '../model/album.model';
import PhotoModel from '../model/photo.model';
import { ApiError } from '../exception/api.error';
import axios, { AxiosResponse } from 'axios';

class PhotoService {
  async createPhotoStore(url: string | undefined = process.env.IMAGE_URL, user: any): Promise<AxiosResponse[]> {
    const response = await axios.get(url as string);
    const albums = response.data.reduce((acc: [], item: any) => {
      if (!acc.some((i: any) => i.title === item.albumId)) return [ ...acc, { title: item.albumId } ]
      else return acc;
    }, []);
    await AlbumModel.insertMany(albums);
    const result = await PhotoModel.insertMany(response.data);
    if (!result) {
      
    }
    return result;
  }

  async getPhoto(ownerId: any, page: any = 1, maxCount: any = 20): Promise<any[]> {
    // return await PhotoModel.find()
    //   .skip((+page-1)*maxCount)
    //   .limit(maxCount)
    //   .where({ user: ownerId });
    return await PhotoModel.aggregate([
      {
        $skip: (+page-1)*+maxCount,
      },
      {
        $limit: +maxCount,
      },
      {
        $match: {
          userId: ownerId,
        }
      }
    ]);
  }

  async removePhoto(ids: string[]): Promise<any> {
    return await PhotoModel.deleteMany({ _id: { $in: ids } });
  }

  async updateAlbum(id: any, title: any): Promise<any> {
    return await AlbumModel.findByIdAndUpdate(id, { title });
  }

  async removeAlbum(ids: string[]): Promise<any> {
    const result = await AlbumModel.deleteMany({ title: { $in: ids } });
    if (result) {
      await PhotoModel.deleteMany({ albumId: { $in: ids } });
    }
  }
}

export default new PhotoService();