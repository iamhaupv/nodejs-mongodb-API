const express = require("express");
const router = express.Router();
const {body} = require("express-validator")
const { userController } = require("../controllers/index");
router.post("/login", userController.login)
// url register
router.post("/register", userController.register);
// url sendResetLinkEmail
router.post("/sendResetLinkEmail", userController.sendResetLinkEmail);
// url reset
router.post("/reset", userController.reset);
// getInfor
router.get("/getInfor", userController.getInfor)
// update userInfor
router.patch("/update", userController.updateUserInfo)
module.exports = router;
