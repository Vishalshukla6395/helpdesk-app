const Ticket = require("../models/Ticket");
const Note = require("../models/Note");
const User = require("../models/User");

exports.getTicketCount = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied" });
  }

  try {
    const total = await Ticket.countDocuments();
    const [active, pending, closed] = await Promise.all([
      Ticket.countDocuments({ status: "Active" }),
      Ticket.countDocuments({ status: "Pending" }),
      Ticket.countDocuments({ status: "Closed" }),
    ]);
    res.json({ total, active, pending, closed });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.createTicket = async (req, res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ msg: "Only customers can create tickets" });
  }

  try {
    const ticket = await Ticket.create({
      title: req.body.title,
      customer: req.user._id,
    });
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.getTickets = async (req, res) => {
  try {
    let tickets;

    if (req.user.role === "customer") {
      tickets = await Ticket.find({ customer: req.user._id })
        .populate("customer", "name email")
        .sort({ updatedAt: -1 });
    } else if (req.user.role === "agent" || req.user.role === "admin") {
      tickets = await Ticket.find()
        .populate("customer", "name email")
        .sort({ updatedAt: -1 });
    } else {
      return res.status(403).json({ msg: "Access denied" });
    }

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("customer", "name email")
      .populate({
        path: "notes",
        populate: { path: "author", select: "name" },
      });

    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });

    if (
      req.user.role === "customer" &&
      ticket.customer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ msg: "Access denied" });
    }

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateTicket = async (req, res) => {
  if (req.user.role === "customer") {
    return res.status(403).json({ msg: "Customers cannot update tickets" });
  }

  try {
    const updated = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) return res.status(404).json({ msg: "Ticket not found" });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.addNote = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });

    if (
      req.user.role === "customer" &&
      ticket.customer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ msg: "Access denied" });
    }

    const note = await Note.create({
      ticket: ticket._id,
      author: req.user._id,
      text: req.body.text,
      attachment: req.body.attachment,
    });

    ticket.notes.push(note._id);
    await ticket.save();

    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};
