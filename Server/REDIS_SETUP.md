# Redis Caching Implementation

This project now includes Redis caching to improve performance and reduce database load.

## Features Added

### 1. Redis Configuration
- **File**: `Server/Configuration/Redis.js`
- Handles Redis connection with automatic retry logic
- Graceful fallback if Redis is unavailable
- Connection status logging

### 2. Cache Service
- **File**: `Server/Util/CacheService.js`
- Comprehensive caching utility with TTL support
- Pattern-based cache invalidation
- Course, category, and user-specific caching methods

### 3. Cached Endpoints

#### Course Endpoints
- `getAllCourses` - Cached for 15 minutes
- `getCourseDetails` - Cached for 30 minutes
- `getInstructorCourses` - Cached for 10 minutes
- `createCourse` - Invalidates relevant caches
- `editCourse` - Invalidates course-specific cache
- `deleteCourse` - Invalidates all course-related caches

#### Category Endpoints
- `showAllCategories` - Cached for 1 hour
- `categoryPageDetails` - Cached for 30 minutes
- `createCategory` - Invalidates category caches

#### Profile Endpoints
- `getAllUserDetails` - Cached for 10 minutes
- `getEnrolledCourses` - Cached for 5 minutes (shorter due to progress updates)
- `instructorDashboard` - Cached for 10 minutes
- `updateProfile` - Invalidates user cache
- `updateDisplayPicture` - Invalidates user cache

## Setup Instructions

### 1. Install Redis
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install redis-server

# macOS
brew install redis

# Windows
# Download from https://redis.io/download
```

### 2. Start Redis Server
```bash
# Start Redis server
redis-server

# Or start as service
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### 3. Install Dependencies
```bash
cd Server
npm install
```

### 4. Environment Configuration
Add to your `.env` file:
```env
# Redis Configuration (Optional - defaults to localhost:6379)
REDIS_URL=redis://localhost:6379
```

### 5. Test Redis Connection
```bash
# Test Redis connection
redis-cli ping
# Should return: PONG
```

## Cache Strategy

### TTL (Time To Live) Settings
- **Course Lists**: 15 minutes
- **Course Details**: 30 minutes
- **Categories**: 1 hour
- **User Profiles**: 10 minutes
- **Enrolled Courses**: 5 minutes
- **Instructor Dashboard**: 10 minutes

### Cache Invalidation
- **Write Operations**: Automatically invalidate related caches
- **Pattern Matching**: Use wildcards to invalidate multiple keys
- **User-Specific**: Invalidate user caches on profile updates

## Benefits

1. **Performance**: Reduced database queries and faster response times
2. **Scalability**: Better handling of concurrent requests
3. **Reliability**: Graceful fallback if Redis is unavailable
4. **Flexibility**: Easy to adjust TTL and caching strategies

## Monitoring

The application logs cache hits and misses:
- `Cache HIT for key: course:all` - Data served from cache
- `Cache MISS for key: course:all` - Data fetched from database and cached

## Fallback Behavior

If Redis is unavailable:
- Application continues to work normally
- All caching operations are skipped
- Database queries execute as before
- No functionality is lost

## Redis Commands for Debugging

```bash
# Connect to Redis CLI
redis-cli

# List all keys
KEYS *

# Get specific key
GET course:all

# Delete specific key
DEL course:all

# Delete keys by pattern
EVAL "return redis.call('del', unpack(redis.call('keys', ARGV[1])))" 0 course:*

# Monitor Redis commands
MONITOR

# Check Redis info
INFO
```

## Production Considerations

1. **Redis Persistence**: Configure Redis persistence for production
2. **Memory Management**: Set appropriate memory limits
3. **Security**: Use Redis AUTH in production
4. **Monitoring**: Implement Redis monitoring and alerting
5. **Backup**: Regular Redis data backups

## Troubleshooting

### Redis Connection Issues
- Check if Redis server is running: `redis-cli ping`
- Verify Redis URL in environment variables
- Check firewall settings for Redis port (6379)

### Cache Not Working
- Check Redis logs for errors
- Verify cache keys in Redis CLI
- Ensure TTL values are appropriate
- Check for cache invalidation issues

### Performance Issues
- Monitor Redis memory usage
- Check cache hit/miss ratios
- Adjust TTL values based on usage patterns
- Consider Redis clustering for high load
