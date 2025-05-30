# Helpdesk Web Application (MERN Stack)

A full-stack Helpdesk application for ticket management, featuring three roles: Customer, Agent, and Admin.

## Features
- Customer: Self-register, submit tickets, add notes, view all tickets.
- Agent: View all tickets, add notes, update ticket statuses.
- Admin: Manage users, manage tickets, access dashboard.

## Ticket Details
- Ticket ID, Title, Status (Active, Pending, Closed), Customer Name, Last Updated On
- Notes include author and timestamp, optional attachments.

## Tech Stack
- Frontend: React.js + Vite + CSS3
- Backend: Node.js + Express.js
- Database: MongoDB
- Authentication: JWT
- State Management: Context API

## Setup Instructions
```bash
# Clone the Repository
git clone https://github.com/your-username/helpdesk-app.git
cd helpdesk-app

# Install Dependencies
cd client
npm install
cd ../server
npm install

# Configure Environment Variables

# client (.env)
VITE_API_URL=http://localhost:5000/api

# server (.env)
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key

# Run the Application
# server
cd server
node index.js

# Frontend
cd ../client
npm run dev
```

## Deployment
- Frontend: Vercel
- Backend: Render

## Bonus
- Modern UI, responsive design, full validations
- Creative enhancements encouraged!
