import express from "express"
import auth from "../../middleware/auth"
import { Role } from "@prisma/client"

const router = express.Router()

router.get('/', auth(Role.CUSTOMER))

export const ticketRoute = router