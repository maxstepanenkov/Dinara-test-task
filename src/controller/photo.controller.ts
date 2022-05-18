import { IRequest } from "../interface/IRequest.interface";
import { IResponse } from "../interface/IResponse.interface";
import { INext } from "../interface/INext.interface";
import photoService from "../service/photo.service";
import { ApiError } from "../exception/api.error";

class PhotoController {
  async createPhotos(req: IRequest, res: IResponse, next: INext): Promise<IResponse | INext | undefined | void> {
    try {
      const { url }: any = req.query;
      const { user } = req;
      const result = await photoService.createPhotoStore(url, user);
      return res.json();
    } catch(e) {
      next(e);
    }
  };

  async getPhotos(req: IRequest, res: IResponse, next: INext): Promise<IResponse | INext | undefined | void> {
    try {
      const { ownerId, page, maxCount } = req.query;
      console.log(req.query)
      const result = await photoService.getPhoto(ownerId, page, maxCount);
      return res.json(result);
    } catch(e) {
      next(e);
    }
  };

  async renameAlbum(req: IRequest, res: IResponse, next: INext): Promise<IResponse | INext | undefined | void> {
    try {
      const { id, title } = req.query;
      const result = await photoService.updateAlbum(id, title);
      return res.json(result);
    } catch(e) {
      next(e);
    }
  }

  async deletePhoto(req: IRequest, res: IResponse, next: INext): Promise<IResponse | INext | undefined | void> {
    try {
      const { ids }: any = req.query;
      const arrayOfIds: string[] = ids.split(',');
      const result = await photoService.removePhoto(arrayOfIds);
      return res.json(result);
    } catch(e) {
      next(e);
    }
  }

  async deleteAlbum(req: IRequest, res: IResponse, next: INext): Promise<IResponse | INext | undefined | void> {
    try {
      const { ids }: any = req.query;
      const arrayOfIds: string[] = ids.split(',');
      const result = await photoService.removeAlbum(arrayOfIds);
      return res.json(result);
    } catch(e) {
      next(e);
    }
  }
}

export default new PhotoController();