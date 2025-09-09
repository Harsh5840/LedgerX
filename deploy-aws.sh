#!/bin/bash

# AWS EC2 Deployment Script for LedgerX
# This script should be placed on your AWS EC2 instance

set -e

echo "🚀 Starting LedgerX deployment..."

# Configuration
APP_DIR="/home/ubuntu/ledgerx"
BACKUP_DIR="/home/ubuntu/ledgerx-backups"
LOG_FILE="/var/log/ledgerx-deploy.log"

# Create directories if they don't exist
mkdir -p $APP_DIR
mkdir -p $BACKUP_DIR

# Function to log messages
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a $LOG_FILE
}

# Function to backup current deployment
backup_current() {
    if [ -d "$APP_DIR" ]; then
        log "Creating backup of current deployment..."
        BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
        cp -r $APP_DIR $BACKUP_DIR/$BACKUP_NAME
        log "Backup created: $BACKUP_DIR/$BACKUP_NAME"
    fi
}

# Function to rollback on failure
rollback() {
    log "❌ Deployment failed. Rolling back..."
    LATEST_BACKUP=$(ls -t $BACKUP_DIR | head -n1)
    if [ -n "$LATEST_BACKUP" ]; then
        rm -rf $APP_DIR
        cp -r $BACKUP_DIR/$LATEST_BACKUP $APP_DIR
        cd $APP_DIR
        docker-compose -f docker-compose.prod.yml up -d
        log "Rollback completed using backup: $LATEST_BACKUP"
    fi
    exit 1
}

# Set trap for rollback on error
trap rollback ERR

# Main deployment process
main() {
    log "Starting deployment process..."
    
    # Backup current deployment
    backup_current
    
    # Navigate to app directory
    cd $APP_DIR
    
    # Stop current services
    log "Stopping current services..."
    docker-compose -f docker-compose.prod.yml down || true
    
    # Download latest deployment package (this will be done by GitHub Actions)
    # The GitHub Actions workflow will handle the S3 download
    
    # Extract deployment package
    if [ -f "latest-deployment.zip" ]; then
        log "Extracting deployment package..."
        unzip -o latest-deployment.zip
        rm latest-deployment.zip
    fi
    
    # Set up environment variables
    log "Setting up environment..."
    if [ ! -f ".env" ]; then
        log "Warning: .env file not found. Creating from template..."
        cp .env.example .env
        log "Please configure .env file with your actual values"
    fi
    
    # Build and start services
    log "Building and starting services..."
    docker-compose -f docker-compose.prod.yml build --no-cache
    docker-compose -f docker-compose.prod.yml up -d
    
    # Wait for services to start
    log "Waiting for services to start..."
    sleep 30
    
    # Health check
    log "Performing health check..."
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        log "✅ Health check passed"
    else
        log "❌ Health check failed"
        exit 1
    fi
    
    # Clean up old Docker images
    log "Cleaning up old Docker images..."
    docker system prune -f
    
    # Clean up old backups (keep last 5)
    log "Cleaning up old backups..."
    cd $BACKUP_DIR
    ls -t | tail -n +6 | xargs -r rm -rf
    
    log "🎉 Deployment completed successfully!"
}

# Run main function
main "$@"