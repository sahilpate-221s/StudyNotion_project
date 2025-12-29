# StudyNotion – Scalable Ed-Tech Platform (MERN + Redis)

🔗 **Live Demo:** https://studynotionapp21.netlify.app  
🔗 **GitHub Repository:** https://github.com/sahilpate-221s/StudyNotion_project  

StudyNotion is a full-stack ed-tech platform where students can enroll in courses and instructors can create and manage learning content.  
The project focuses on **backend scalability, performance optimization, and real-world system design**, not just UI.

---

## 🔐 Test Credentials

### Student
- Email: `h@gmail.com`
- Password: `123456`

- Email: `s.sahil007patel@gmail.com`
- Password: `123456`

### Instructor
- Email: `KaranRai@gmail.com`
- Password: `123456`

---

## 💳 Razorpay Test Credentials
- Card Number: `2305 3242 5784 8228`
- CVV: `123`
- Expiry: `12/29`

---

## 🧠 Core Features

### Students
- Browse & enroll in courses
- Secure Razorpay checkout
- Track enrolled courses & progress
- Submit ratings and reviews

### Instructors
- Create, edit, and delete courses
- Upload media using Cloudinary
- View enrolled students and revenue
- Manage course content & structure

---

## 🏗️ System Architecture

StudyNotion follows a **clean client–server architecture** with stateless APIs and optimized data access.

### Frontend
- React + Redux Toolkit
- Tailwind CSS
- Netlify deployment

### Backend
- Node.js + Express
- MongoDB with Mongoose
- Redis for caching
- JWT authentication
- Cloudinary for media
- Razorpay for payments

---

## 🚀 Performance & Scalability Optimizations

### 🔥 Redis Caching Layer
Implemented Redis to reduce repeated database queries and improve API performance.

Cached APIs include:
- Course listings  
- Categories  
- Course details  
- Reviews  
- User profile data  
- Instructor dashboards  

Each cache entry:
- Uses **TTL-based expiration**
- Supports **pattern-based invalidation**
- Automatically refreshes on updates (create/edit/delete)

✅ Result: **~35–40% faster response times** and significantly reduced MongoDB load.

---

## ⚙️ Backend Architecture Highlights

- Modular folder structure (controllers, services, cache, utils)
- Centralized reusable `CacheService`
- Graceful fallback if Redis is unavailable
- Aggregated APIs to reduce frontend API chaining
- JWT-based stateless authentication
- Role-based access control (Student / Instructor)
- Optimized MongoDB queries with selective population

---

## 🧠 Caching Strategy Overview

| Data Type | Cache Key Pattern | TTL |
|----------|------------------|-----|
| Categories | `category:all` | 1 hour |
| Course list | `course:all` | 15 min |
| Course details | `course:details:<id>` | 30 min |
| Reviews | `review:all` | 30 min |
| User profile | `user:profile:<id>` | 10 min |
| Instructor dashboard | `instructor:dashboard:<id>` | 10 min |
| Enrolled courses | `user:enrolled:<id>` | 5 min |

Cache is invalidated automatically on:
- Course create / update / delete  
- Category updates  
- Enrollment changes  
- Profile updates  
- Review creation  

---

## 🐳 Docker & Deployment

- Backend and Redis containerized using Docker
- Redis connected via environment-based configuration
- Ensures consistent development and production behavior
- Deployed on cloud infrastructure with Redis support

---

## ⏱️ Cold Start Note

Since the backend runs on a free-tier hosting service, the first request after inactivity may take longer due to cold start.  
Subsequent requests are fast due to Redis caching and warm services.

---

## 📸 Application Preview

### Student Dashboard
![Student Dashboard](https://res.cloudinary.com/dvpulu3cc/image/upload/v1702489710/Screenshot_2023-12-13_231558_dwyhv3.png)

### Payment Flow
![Payment Success](https://res.cloudinary.com/dvpulu3cc/image/upload/v1702489800/payment_success_example.png)

---

## 📡 Key API Endpoints

### Authentication
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`

### Courses
- `GET /api/v1/course/getAllCourses`
- `POST /api/v1/course/getCourseDetails`
- `POST /api/v1/course/createCourse`

### Payments
- `POST /api/v1/payment/capturePayment`
- `POST /api/v1/payment/verifyPayment`

---

## 🗄️ Database Design

Collections:
- User
- Profile
- Course
- Category
- Section
- SubSection
- Rating & Review
- Course Progress

Designed for:
- Fast reads
- Minimal duplication
- Scalable relationships
- Efficient aggregation

---

## 🛠️ Tech Stack

**Frontend:** React, Redux Toolkit, Tailwind CSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**Caching:** Redis  
**Auth:** JWT  
**Media:** Cloudinary  
**Payments:** Razorpay  
**Containerization:** Docker  

---

## 🚀 Future Improvements

- Background job queues (BullMQ)
- Admin moderation dashboard
- Advanced analytics for instructors
- Redis-based rate limiting
- WebSocket-based notifications

---

## 👤 Maintainer

**Sahil Patel**  
📧 s.sahil007patel@gmail.com  

---

StudyNotion focuses on **real-world backend engineering, performance optimization, and scalable architecture**, making it suitable for production-grade learning platforms.
