# Redis Setup Script for StudyNotion

echo "Redis Setup for StudyNotion"
echo "============================"
echo ""

# Check if Redis is already running
if redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is already running!"
    echo "   Your application will use Redis caching."
    echo ""
    echo "Redis Status:"
    redis-cli info server | grep redis_version
    echo ""
    echo "To stop Redis: redis-cli shutdown"
    echo "To access Redis CLI: redis-cli"
else
    echo "❌ Redis is not running."
    echo ""
    echo "Options:"
    echo "1. Install and start Redis for caching benefits"
    echo "2. Continue without Redis (app works fine, just no caching)"
    echo ""
    echo "To install Redis:"
    echo "  Windows: Download from https://redis.io/download"
    echo "  macOS:   brew install redis"
    echo "  Ubuntu:  sudo apt install redis-server"
    echo ""
    echo "To start Redis:"
    echo "  redis-server"
    echo ""
    echo "Your application will work perfectly without Redis!"
    echo "Redis only provides performance improvements through caching."
fi
