.PHONY: help install dev build lint lint-fix check-links check ci clean

help:  ## Show this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install:  ## Install dependencies (npm ci)
	npm ci --prefer-offline --no-audit --fund=false

dev:  ## Run dev server with live reload at localhost:8080
	npx @11ty/eleventy --serve

build:  ## Production build to _site/
	npx @11ty/eleventy

lint:  ## Check formatting (Prettier)
	npx prettier --check .

lint-fix:  ## Auto-fix formatting
	npx prettier --write .

check-links:  ## Verify internal links resolve in _site/
	node _tools/check-internal-links.mjs _site

check: lint build  ## Mirror CI: lint + build + link check
	node _tools/check-internal-links.mjs _site

ci: install check  ## Full CI pipeline locally

clean:  ## Remove build outputs
	rm -rf _site public test
