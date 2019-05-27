import express from 'express';
const router = express.Router();
import validate from "express-validation";

import * as userController from "../controllers/user/user.controller";
import * as userValidator from "../controllers/user/user.validator";

//================================
// Public routes
//================================

router.post(
  "/login",
  validate(userValidator.login),
  userController.login
);
router.post(
  "/register",
  validate(userValidator.register),
  userController.register
);

module.exports = router;
