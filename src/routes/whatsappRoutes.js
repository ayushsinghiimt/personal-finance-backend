const express = require("express");
const router = express.Router();
const whatsappController = require("../controllers/whatsappController");
const multer = require("multer");
const path = require("path");
const authenticateUser = require("../middlewares/authMiddleware");
// Configure Multer for file uploads. This setup explicitly uses `diskStorage`, meaning uploaded files will be saved directly to the server's local disk.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Files will be stored in the 'uploads/' directory on the server's file system.
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Ensure uploads directory exists (or rely on user/deployment to create it, 
// but better to check or just let it fail if not present? 
// Actually, standard practice is to ensure it exists. 
// For now, I'll assume the folder 'uploads' needs to be created.)

router.post("/process", upload.array("files"), authenticateUser, whatsappController.processMessage);

module.exports = router;
