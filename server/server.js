// 📄 server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

// Load environment variables
dotenv.config();

// Create Express app and server
const app = express();
const server = http.createServer(app);

// Allowed origins
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002"
];

// Setup Socket.IO
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    },
});

// Attach IO to app
app.set("io", io);

io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("🔴 Socket disconnected:", socket.id);
    });
});

// Middlewares
app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ROUTES IMPORTS
const userRoutes = require("./routes/userRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const feedbackRoutes = require("./routes/feedback");
const blogRoutes = require("./routes/blogRoutes");
const deliveryAuthRoutes = require("./routes/deliveryAuthRoutes");
const restaurantAuthRoutes = require("./routes/restaurantAuthRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// API ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/food", require("./routes/foodRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/partner", require("./routes/partnerRoutes"));
app.use("/api/customer", require("./routes/customerRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/order", require("./routes/orderRoutes"));
app.use("/api/user", userRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/delivery-auth", deliveryAuthRoutes);
app.use("/api/restaurant-auth", restaurantAuthRoutes);
app.use("/api/address", require("./routes/addressRoutes"));
app.use("/api/payment", paymentRoutes);

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection failed:", err.message));

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});