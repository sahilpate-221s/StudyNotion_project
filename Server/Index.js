const express = require("express");
const app = express();
const userRoutes = require("./Route/User");
const profileRoutes = require("./Route/Profile");
const courseRoutes = require("./Route/Course");
const paymentRoutes = require("./Route/Payment");
const contactUsRoute = require("./Route/Contact");
const homeRoutes = require("./Route/Home");

const database = require("./Configuration/Database");
const { connectRedis } = require("./Configuration/Redis");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./Configuration/Cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

const PORT = process.env.PORT || 4000;

dotenv.config();

// Initialize database and Redis connections
async function initializeApp() {
  try {
    await database.connect();
    await connectRedis(); // Initialize Redis connection
  } catch (error) {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
}

app.use(cors({
  origin: "https://studynotionapp21.netlify.app", // allow only Netlify deployed frontend
	// origin: "http://localhost:3000",
  credentials: true, // allow cookies/auth headers if used
}));


app.use(express.json());
app.use(cookieParser());


app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);


cloudinaryConnect();


app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/home", homeRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);


const { getRedisClient } = require("./Configuration/Redis");
app.get("/redis-test", async (req, res) => {
  const redis = getRedisClient();

  await redis.set("test-key", "hello-redis", {
    EX: 60,
  });

  const value = await redis.get("test-key");

  res.json({
    success: true,
    value,
  });
});


app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Welcome To StudyNotion",
	});
});


// Start server after initialization
async function startServer() {
  await initializeApp();

  app.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
  });
}

startServer();


