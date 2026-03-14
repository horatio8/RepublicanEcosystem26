#!/bin/bash
set -euo pipefail

# Republican Ecosystem Mapper — Deployment Script
# Usage: ./deploy.sh [local|aws]

MODE="${1:-local}"
AWS_REGION="${AWS_REGION:-us-east-1}"
APP_NAME="republican-ecosystem"

echo "============================================"
echo "  Republican Ecosystem Mapper — Deploy"
echo "  Mode: $MODE"
echo "============================================"
echo

case $MODE in
  local)
    echo "Starting local development environment..."
    echo

    # Check prerequisites
    if ! command -v docker &> /dev/null; then
      echo "ERROR: Docker is required. Install from https://docs.docker.com/get-docker/"
      exit 1
    fi

    # Check .env file
    if [ ! -f backend/.env ]; then
      echo "Creating .env from template..."
      cp backend/.env.example backend/.env
      echo "IMPORTANT: Edit backend/.env with your API keys before running."
      exit 1
    fi

    # Build and run
    docker compose up --build -d

    echo
    echo "Services started:"
    echo "  Frontend: http://localhost"
    echo "  Backend API: http://localhost:8000"
    echo "  API Docs: http://localhost:8000/docs"
    echo
    echo "To seed initial data:"
    echo "  docker compose exec backend python -m backend.scripts.seed_data"
    echo
    echo "To view logs:"
    echo "  docker compose logs -f"
    echo
    echo "To stop:"
    echo "  docker compose down"
    ;;

  aws)
    echo "Deploying to AWS ECS Fargate..."
    echo

    # Check prerequisites
    for cmd in aws docker terraform; do
      if ! command -v $cmd &> /dev/null; then
        echo "ERROR: $cmd is required."
        exit 1
      fi
    done

    # Get AWS account ID
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    ECR_BASE="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

    echo "AWS Account: $ACCOUNT_ID"
    echo "ECR Base: $ECR_BASE"
    echo

    # Login to ECR
    aws ecr get-login-password --region $AWS_REGION | \
      docker login --username AWS --password-stdin $ECR_BASE

    # Apply Terraform (creates ECR repos, ECS cluster, etc.)
    echo "Applying Terraform..."
    cd infrastructure/terraform
    terraform init
    terraform apply -auto-approve
    cd ../..

    # Build and push Docker images
    echo "Building and pushing backend..."
    docker build -f infrastructure/docker/Dockerfile.backend -t ${APP_NAME}-backend .
    docker tag ${APP_NAME}-backend:latest ${ECR_BASE}/${APP_NAME}-backend:latest
    docker push ${ECR_BASE}/${APP_NAME}-backend:latest

    echo "Building and pushing frontend..."
    docker build -f infrastructure/docker/Dockerfile.frontend -t ${APP_NAME}-frontend .
    docker tag ${APP_NAME}-frontend:latest ${ECR_BASE}/${APP_NAME}-frontend:latest
    docker push ${ECR_BASE}/${APP_NAME}-frontend:latest

    # Force new deployment
    aws ecs update-service --cluster $APP_NAME --service ${APP_NAME}-backend --force-new-deployment --region $AWS_REGION
    aws ecs update-service --cluster $APP_NAME --service ${APP_NAME}-frontend --force-new-deployment --region $AWS_REGION

    echo
    ALB_DNS=$(terraform -chdir=infrastructure/terraform output -raw alb_dns_name 2>/dev/null || echo "pending")
    echo "Deployment complete!"
    echo "  URL: http://$ALB_DNS"
    echo
    echo "To seed initial data, run on the backend container:"
    echo "  python -m backend.scripts.seed_data"
    ;;

  *)
    echo "Usage: ./deploy.sh [local|aws]"
    exit 1
    ;;
esac
