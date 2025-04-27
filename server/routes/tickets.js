const router = require("express").Router();
const multer = require("multer");
const { protect, authorize } = require("../middleware/auth");
const {
  getTicketCount,
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  addNote,
} = require("../controllers/ticketController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.use(protect);
router.get("/count", getTicketCount);

router.route("/").post(authorize("customer"), createTicket).get(getTickets);

router
  .route("/:id")
  .get(getTicket)
  .put(authorize("agent", "admin"), updateTicket);
router.route("/:id/notes").post(upload.single("attachment"), addNote);

module.exports = router;
