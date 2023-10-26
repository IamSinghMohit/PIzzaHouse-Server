import  {Router} from 'express'
import AuthRoute from "./auth"
import { CategoryAttrRoute,CategoryRoute } from './category'
import { ProductRoutes } from './products'
import TopingRoutes from './topings'

const router = Router()
router.use('/auth',AuthRoute)
router.use('/category',CategoryRoute)
router.use('/category-attr',CategoryAttrRoute)
router.use('/product',ProductRoutes)
router.use('/topings',TopingRoutes)

export default router