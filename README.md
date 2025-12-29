# StudyNotion – Scalable Ed-Tech Platform (MERN)

🔗 **Live Demo:** https://studynotionapp21.netlify.app  
🔗 **GitHub Repository:** https://github.com/sahilpate-221s/StudyNotion_project  

StudyNotion is a full-stack ed-tech platform that enables students to enroll in courses and instructors to create and manage content.  
The project is built with a strong focus on **backend architecture, performance optimization, and real-world system behavior** rather than just UI features.

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
- Browse and enroll in courses
- Secure checkout using Razorpay
- Track course progress
- Rate and review courses

### Instructors
- Create and manage courses
- Upload media using Cloudinary
- Track enrollments and revenue
- View basic engagement insights

---

## 🏗️ System Architecture

StudyNotion follows a **client–server architecture** with clear separation of concerns and stateless backend services.

![Architecture Diagram](https://res.cloudinary.com/dvpulu3cc/image/upload/v1699036870/Screenshot_2023-11-04_000952_argzj8.jpg)

### Frontend
- React.js with Redux for state management
- Tailwind CSS for responsive UI
- Deployed on Netlify

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT-based authentication
- Redis for caching frequently accessed data
- Deployed on cloud hosting (Node.js compatible)

---

## ⚙️ Key Engineering Decisions

- **Stateless Authentication (JWT)**  
  JWT was chosen to keep authentication stateless, allowing horizontal scalability of backend services.

- **Cloudinary for Media Storage**  
  Media uploads are offloaded to Cloudinary to reduce backend load and avoid handling large files directly.

- **Redis Caching for Public APIs**  
  Public endpoints such as course lists and categories are cached to minimize repeated database reads and improve response time.

- **Aggregated API Design**  
  Introduced aggregated endpoints for homepage data to reduce multiple frontend API calls and lower initial load latency.

---

## 🚀 Performance Optimizations

- Cached frequently accessed public data (courses, categories, reviews)
- Reduced API chaining by aggregating homepage data into a single endpoint
- Implemented cursor-based pagination to avoid performance issues caused by large offset queries
- Achieved approximately **35–40% improvement in API response time**, measured using Postman and browser network analysis

---

## ⏱️ Cold Start Consideration

The backend is deployed on a free-tier cloud service and may experience **cold starts** after periods of inactivity.  
The first request can take longer due to server spin-up, while subsequent requests perform normally.

A lightweight **health-check endpoint** is used to monitor backend availability and warm up the service when required.

---

## 📸 Application Preview

### Student Dashboard / Course View
![Student Dashboard](https://res.cloudinary.com/dvpulu3cc/image/upload/v1702489710/Screenshot_2023-12-13_231558_dwyhv3.png)

### Payment & Enrollment Flow
![Payment Success](https://res.cloudinary.com/dvpulu3cc/image/upload/v1702489800/payment_success_example.png)

---

## 📡 API Overview (Selected)

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

The database schema is designed for efficient reads and clear relationships:

- User (Student / Instructor)
- Course
- Category
- Section & SubSection
- Rating & Review
- Course Progress

This structure supports scalable content organization and fast access to learning data.

---

## 🛠️ Tech Stack

**Frontend:** React, Redux, Tailwind CSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**Caching:** Redis  
**Authentication:** JWT, Bcrypt  
**Media Storage:** Cloudinary  
**Payments:** Razorpay  

---

## 🚀 Deployment

- **Frontend:** Netlify
- **Backend:** Cloud hosting (Node.js compatible environment)

---

## 📌 Future Improvements

- Admin moderation and reporting dashboard
- Advanced analytics for instructors
- Background jobs for async tasks (emails, cleanup, etc.)

---

## 👤 Maintainer

**Sahil Patel**  
📧 s.sahil007patel@gmail.com  

---

StudyNotion emphasizes **engineering fundamentals, performance awareness, and real-world backend considerations**, making it suitable for technical interviews and scalable application design.
