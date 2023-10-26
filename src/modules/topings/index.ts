import { Validate, asyncHandler } from "@/middlewares"
import {Router} from "express"
import TopingsController from "./topings.controller"

const router = Router()

router.post('/create',
    Validate.topings,
    asyncHandler(TopingsController.createTopings)
)

export default router