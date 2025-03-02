const express = require("express");
const router = express.Router();


//api routes
router.use("/api/user", require("../routes/user"))
router.use("/api/auth", require("../routes/auth"))
router.use("/api/profile", require("../routes/profile"))



router.get("/health", (req, res) => {
       return res.status(200).json({
            message: "Message is sucessful"
       })
})

router.use("/product", require("../routes/product"));
router.use("/order", require("../routes/order"));




module.exports = router

