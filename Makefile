.PHONY: help install dev build lint lint-fix check-links check ci clean ee-calc spell

EE_CALC_SRC := $(wildcard src/ee-calculator/*)
EE_CALC_OUT := js/ee-calculator.js

help:  ## Show this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install:  ## Install dependencies (npm ci)
	npm ci --prefer-offline --no-audit --fund=false

ee-calc: $(EE_CALC_OUT)  ## Bundle src/ee-calculator/ into js/ee-calculator.js

$(EE_CALC_OUT): $(EE_CALC_SRC) _tools/build-ee-calculator.mjs
	node _tools/build-ee-calculator.mjs

dev: ee-calc  ## Run dev server with live reload at localhost:8080
	npx @11ty/eleventy --serve

build: ee-calc  ## Production build to _site/
	npx @11ty/eleventy

lint: ee-calc  ## Check formatting (Prettier)
	npx prettier --check .

lint-fix: ee-calc  ## Auto-fix formatting
	npx prettier --write .

check-links:  ## Verify internal links resolve in _site/
	node _tools/check-internal-links.mjs _site

check: lint build  ## Mirror CI: lint + build + link check
	node _tools/check-internal-links.mjs _site

ci: install check  ## Full CI pipeline locally

spell:  ## Spell + grammar check a Markdown file (usage: make spell FILE=_drafts/foo.md)
	@if [ -z "$(FILE)" ]; then \
		echo "Usage: make spell FILE=path/to/post.md"; exit 1; \
	fi
	node _tools/spell.mjs $(FILE)

clean:  ## Remove build outputs
	rm -rf _site public test
