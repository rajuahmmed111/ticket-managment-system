import express from "express"

const router = express.Router()

router.get('/', (req, res) => {
    res.send('Ticket API is running')
})

export const ticketRoute = router