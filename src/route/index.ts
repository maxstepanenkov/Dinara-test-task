import { Router } from 'express';
import userController from '../controller/user.controller';
import { body } from 'express-validator';
import authMiddleware from '../middleware/auth.middleware';
import photoController from '../controller/photo.controller';

const router = Router();

router.post(
  '/registration',
  // body('name').isString().isLength({ min: 2, max: 32 }),
  // body('email').isEmail,
  // body('password').isLength({ min: 2, max: 32 }),
  userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.post(
  '/load-photos',
  authMiddleware,
  photoController.createPhotos  
);
router.get(
  '/get-photos',
  authMiddleware,
  photoController.getPhotos
);
router.patch(
  '/rename-album',
  authMiddleware,
  photoController.renameAlbum
);
router.delete(
  '/delete-photos',
  authMiddleware,
  photoController.deletePhoto
);
router.delete(
  '/delete-albums',
  authMiddleware,
  photoController.deleteAlbum
);

export default router;