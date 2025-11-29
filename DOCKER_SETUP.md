# Docker Setup for StudyNotion

This guide provides complete Docker containerization for the StudyNotion application with MongoDB, Redis, and both frontend and backend services.

## 🐳 Docker Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │    │   (Node.js)     │    │   (MongoDB)     │
│   Port: 3000    │    │   Port: 4000    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │     Redis        │
                    │   (Cache)        │
                    │   Port: 6379     │
                    └─────────────────┘
```

## 📋 Prerequisites

- Docker Desktop installed
- Docker Compose v3.8+
- At least 4GB RAM available
- Ports 3000, 4000, 27017, 6379 available

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone <your-repo>
cd StudyNotion-V1-main_firstone
```

### 2. Environment Configuration
Create `.env` file in the root directory:
```env
# Database
MONGODB_URL=mongodb://admin:password123@mongodb:27017/studynotion?authSource=admin

# Redis
REDIS_URL=redis://:redis123@redis:6379

# JWT
JWT_SECRET=your_jwt_secret_key_here_change_in_production

# Cloudinary (Required for image uploads)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FOLDER_NAME=studynotion

# Razorpay (Required for payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret

# Email (Required for notifications)
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_email_password
```

### 3. Start All Services
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379

## 🛠️ Service Management

### Start Services
```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d mongodb redis

# Start with build
docker-compose up --build
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Stop specific service
docker-compose stop server
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f server
docker-compose logs -f client
docker-compose logs -f mongodb
docker-compose logs -f redis
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart server
```

## 🔧 Development Commands

### Rebuild Services
```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build server
docker-compose build client
```

### Execute Commands in Containers
```bash
# Access server container
docker-compose exec server sh

# Access MongoDB
docker-compose exec mongodb mongosh

# Access Redis
docker-compose exec redis redis-cli

# Run npm commands in server
docker-compose exec server npm install
```

### Database Operations
```bash
# Backup MongoDB
docker-compose exec mongodb mongodump --out /backup

# Restore MongoDB
docker-compose exec mongodb mongorestore /backup

# Access MongoDB shell
docker-compose exec mongodb mongosh studynotion
```

## 📊 Monitoring and Health Checks

### Service Health Status
```bash
# Check all services
docker-compose ps

# Check specific service health
docker inspect studynotion-server --format='{{.State.Health.Status}}'
```

### Resource Usage
```bash
# View resource usage
docker stats

# View specific container stats
docker stats studynotion-server studynotion-client
```

### Log Monitoring
```bash
# Real-time logs
docker-compose logs -f --tail=100

# Filter logs by service
docker-compose logs -f server | grep ERROR
```

## 🔒 Security Considerations

### Production Environment Variables
```env
# Change default passwords
MONGODB_ROOT_PASSWORD=strong_password_here
REDIS_PASSWORD=strong_redis_password

# Use strong JWT secret
JWT_SECRET=very_long_and_random_jwt_secret_key

# Enable SSL/TLS
SSL_CERT_PATH=/path/to/cert.pem
SSL_KEY_PATH=/path/to/key.pem
```

### Network Security
```bash
# Remove port exposure for production
# Comment out ports in docker-compose.yml for internal communication only
```

## 🚀 Production Deployment

### 1. Production Docker Compose
```bash
# Use production profile
docker-compose --profile production up -d
```

### 2. SSL/TLS Setup
```bash
# Place SSL certificates in nginx/ssl/
mkdir nginx/ssl
cp your-cert.pem nginx/ssl/
cp your-key.pem nginx/ssl/
```

### 3. Environment Variables
```bash
# Set production environment
export NODE_ENV=production
export MONGODB_URL=mongodb://admin:strong_password@mongodb:27017/studynotion?authSource=admin
```

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using the port
netstat -tulpn | grep :3000
# Kill the process or change port in docker-compose.yml
```

#### Container Won't Start
```bash
# Check logs
docker-compose logs service-name

# Check container status
docker-compose ps

# Restart specific service
docker-compose restart service-name
```

#### Database Connection Issues
```bash
# Check MongoDB logs
docker-compose logs mongodb

# Test MongoDB connection
docker-compose exec server node -e "console.log(process.env.MONGODB_URL)"
```

#### Redis Connection Issues
```bash
# Check Redis logs
docker-compose logs redis

# Test Redis connection
docker-compose exec redis redis-cli ping
```

### Performance Optimization

#### Resource Limits
```yaml
# Add to docker-compose.yml
services:
  server:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

#### Volume Optimization
```bash
# Use named volumes for better performance
docker volume create studynotion_mongodb_data
docker volume create studynotion_redis_data
```

## 📁 File Structure

```
StudyNotion-V1-main_firstone/
├── docker-compose.yml          # Main orchestration file
├── mongodb-init.js            # MongoDB initialization script
├── nginx/
│   └── nginx.conf             # Production nginx config
├── Server/
│   ├── Dockerfile             # Server container config
│   └── .dockerignore          # Server ignore file
└── Client/
    ├── Dockerfile             # Client container config
    ├── nginx.conf             # Client nginx config
    └── .dockerignore          # Client ignore file
```

## 🔄 Backup and Restore

### Backup Data
```bash
# Backup MongoDB
docker-compose exec mongodb mongodump --out /data/backup

# Backup Redis
docker-compose exec redis redis-cli BGSAVE
```

### Restore Data
```bash
# Restore MongoDB
docker-compose exec mongodb mongorestore /data/backup

# Restore Redis (if needed)
docker-compose exec redis redis-cli --rdb /data/dump.rdb
```

## 📈 Scaling

### Horizontal Scaling
```bash
# Scale server instances
docker-compose up -d --scale server=3

# Scale with load balancer
docker-compose up -d nginx
```

### Vertical Scaling
```yaml
# Increase resources in docker-compose.yml
services:
  server:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
```

## 🎯 Best Practices

1. **Always use environment variables** for sensitive data
2. **Regular backups** of MongoDB data
3. **Monitor resource usage** with `docker stats`
4. **Use health checks** for service monitoring
5. **Keep images updated** regularly
6. **Use multi-stage builds** for smaller images
7. **Implement proper logging** for debugging
8. **Use secrets management** for production

## 📞 Support

For issues with Docker setup:
1. Check service logs: `docker-compose logs -f`
2. Verify environment variables
3. Ensure all ports are available
4. Check Docker Desktop is running
5. Review this documentation

## 🔄 Updates

To update the application:
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up --build -d
```
