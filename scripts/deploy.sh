#!/bin/bash

echo "🚀 Notesify Production Build & Deploy"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Make sure you're in the project root."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    print_error "Node.js version $REQUIRED_VERSION or higher required. Current: $NODE_VERSION"
    exit 1
fi

print_status "Node.js version check passed: $NODE_VERSION"

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Run linting
print_status "Running ESLint..."
npm run lint
if [ $? -ne 0 ]; then
    print_error "Linting failed. Fix errors before deploying."
    exit 1
fi

# Run type checking
print_status "Running TypeScript type check..."
npm run type-check
if [ $? -ne 0 ]; then
    print_error "Type checking failed. Fix type errors before deploying."
    exit 1
fi

# Security audit
print_status "Running security audit..."
npm audit --audit-level moderate
if [ $? -ne 0 ]; then
    print_warning "Security vulnerabilities found. Consider fixing before deploying."
fi

# Build the application
print_status "Building application..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Build failed. Check the errors above."
    exit 1
fi

# Test the built application
print_status "Testing built application..."
timeout 30s npm start &
SERVER_PID=$!
sleep 5

# Check if server is running
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_status "Application starts successfully"
else
    print_error "Application failed to start"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

kill $SERVER_PID 2>/dev/null

# Generate deployment info
cat > deployment-info.json << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)",
  "version": "$(node -p "require('./package.json').version")",
  "commit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "branch": "$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')",
  "nodeVersion": "$NODE_VERSION",
  "environment": "production"
}
EOF

print_status "Deployment info generated"
print_status "Build completed successfully! 🎉"

echo ""
echo "📊 Build Statistics:"
echo "==================="
du -sh .next/static 2>/dev/null && echo "Static files size: $(du -sh .next/static | cut -f1)"
echo "Total build size: $(du -sh .next | cut -f1)"

echo ""
echo "🚀 Ready for deployment!"
echo "Deployment info saved to deployment-info.json"
