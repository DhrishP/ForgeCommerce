.PHONY: help install dev build lint lint-fix format format-check type-check clean test pre-commit pre-push setup

# Default target
help:
	@echo "Available commands:"
	@echo "  install     - Install dependencies"
	@echo "  dev         - Start development server"
	@echo "  build       - Build for production"
	@echo "  lint        - Run ESLint"
	@echo "  lint-fix    - Run ESLint with auto-fix"
	@echo "  format      - Format code with Prettier"
	@echo "  format-check- Check code formatting"
	@echo "  type-check  - Run TypeScript type checking"
	@echo "  clean       - Clean build artifacts"
	@echo "  test        - Run tests (when available)"
	@echo "  pre-commit  - Run checks before committing"
	@echo "  pre-push    - Run checks before pushing"
	@echo "  setup       - Initial project setup"

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	npm install

# Start development server
dev:
	@echo "🚀 Starting development server..."
	npm run dev

# Build for production
build:
	@echo "🔨 Building for production..."
	npm run build

# Run ESLint (fails only on errors, not warnings)
lint:
	@echo "🔍 Running ESLint (warnings allowed)..."
	npm run lint

# Run ESLint with auto-fix (warnings allowed)
lint-fix:
	@echo "🔧 Running ESLint with auto-fix (warnings allowed)..."
	npx eslint . --ext .js,.jsx,.ts,.tsx --fix

# Format code with Prettier
format:
	@echo "💅 Formatting code..."
	npm run format

# Check code formatting
format-check:
	@echo "✅ Checking code formatting..."
	npm run format:check

# TypeScript type checking
type-check:
	@echo "🔍 Type checking..."
	npx tsc --noEmit

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf .next
	rm -rf out
	rm -rf node_modules/.cache

# Pre-commit checks
pre-commit: lint-fix format-check type-check
	@echo "✅ Pre-commit checks passed!"

# Pre-push checks
pre-push: pre-commit build
	@echo "✅ Pre-push checks passed!"

# Initial setup
setup: install
	@echo "🔧 Setting up development environment..."
	@echo "Installing git hooks..."
	@chmod +x .git/hooks/pre-commit 2>/dev/null || echo "No git hooks found"
	@echo "✅ Setup complete! Run 'make dev' to start development"
