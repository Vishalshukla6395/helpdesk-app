const Ticket = require("../models/Ticket");

exports.addNote = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });
  if (req.user.role === "customer" && !ticket.customer.equals(req.user._id))
    return res.status(403).json({ message: "Forbidden" });

  ticket.notes.push({
    author: req.user._id,
    text: req.body.text,
    attachments: req.body.attachments || [],
  });
  await ticket.save();
  res.status(201).json(ticket);
};
