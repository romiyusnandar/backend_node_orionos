const express = require("express");
const userController = require("../controllers/UserController");

const router = express.Router();

// user routes
router.get("/users", userController.getAllUser);
router.post("/users", userController.createUser);
router.get("/users/:id", userController.getUserById);
router.patch("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

module.exports = router;