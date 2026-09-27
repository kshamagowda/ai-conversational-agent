const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: "You are authenticated",
        user: req.user
    });
});

module.exports = router;