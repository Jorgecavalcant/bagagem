.DEFAULT_GOAL := help
SHELL := /bin/bash
COMPOSE ?= docker compose
.PHONY: help up down test ci
help:
	@echo "make up | down | test | ci"
up:
	@test -f .env || cp .env.example .env
	$(COMPOSE) up -d --build
down:
	$(COMPOSE) down
test:
	cd api && (test -d .venv || python3 -m venv .venv) && . .venv/bin/activate && \
	pip install -q -U pip && pip install -q -r requirements.txt && \
	PYTHONPATH=. DATABASE_URL="sqlite+pysqlite:///:memory:" pytest -q
ci: test
