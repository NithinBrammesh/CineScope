import { Router } from 'express'
import {
  addWishlistController,
  getWishlistController,
  removeWishlistController,
} from '../controllers/wishlistController.js'

const router = Router()

router.get('/wishlist', getWishlistController)
router.post('/wishlist', addWishlistController)
router.delete('/wishlist/:movieId', removeWishlistController)

export default router
