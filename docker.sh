#!/bin/bash

# StudyNotion Docker Management Script

case "$1" in
    "start")
        echo "🚀 Starting StudyNotion with Docker..."
        docker-compose up -d
        echo "✅ Services started! Access at:"
        echo "   Frontend: http://localhost:3000"
        echo "   Backend:  http://localhost:4000"
        ;;
    "dev")
        echo "🔧 Starting development services (MongoDB + Redis only)..."
        docker-compose -f docker-compose.dev.yml up -d
        echo "✅ Development services started!"
        echo "   MongoDB: localhost:27017"
        echo "   Redis:    localhost:6379"
        ;;
    "stop")
        echo "🛑 Stopping all services..."
        docker-compose down
        docker-compose -f docker-compose.dev.yml down
        echo "✅ All services stopped!"
        ;;
    "restart")
        echo "🔄 Restarting services..."
        docker-compose restart
        echo "✅ Services restarted!"
        ;;
    "logs")
        echo "📋 Showing logs..."
        docker-compose logs -f
        ;;
    "build")
        echo "🔨 Building services..."
        docker-compose build
        echo "✅ Services built!"
        ;;
    "clean")
        echo "🧹 Cleaning up..."
        docker-compose down -v
        docker-compose -f docker-compose.dev.yml down -v
        docker system prune -f
        echo "✅ Cleanup completed!"
        ;;
    "status")
        echo "📊 Service Status:"
        docker-compose ps
        ;;
    "shell")
        echo "🐚 Opening shell in server container..."
        docker-compose exec server sh
        ;;
    "db")
        echo "🗄️ Opening MongoDB shell..."
        docker-compose exec mongodb mongosh studynotion
        ;;
    "redis")
        echo "🔴 Opening Redis CLI..."
        docker-compose exec redis redis-cli
        ;;
    *)
        echo "StudyNotion Docker Management Script"
        echo ""
        echo "Usage: $0 {start|dev|stop|restart|logs|build|clean|status|shell|db|redis}"
        echo ""
        echo "Commands:"
        echo "  start   - Start all services (full application)"
        echo "  dev     - Start only database services for development"
        echo "  stop    - Stop all services"
        echo "  restart - Restart all services"
        echo "  logs    - Show logs from all services"
        echo "  build   - Build all services"
        echo "  clean   - Stop services and clean up volumes/images"
        echo "  status  - Show status of all services"
        echo "  shell   - Open shell in server container"
        echo "  db      - Open MongoDB shell"
        echo "  redis   - Open Redis CLI"
        echo ""
        echo "Examples:"
        echo "  ./docker.sh start    # Start full application"
        echo "  ./docker.sh dev      # Start only databases for local dev"
        echo "  ./docker.sh logs     # View application logs"
        ;;
esac
