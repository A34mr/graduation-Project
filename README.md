# Dent AI - Complete Dental Clinic Platform

## Project Overview
Dent AI is a full-stack platform comprising:
- Frontend (React + Vite)
- Backend (Node.js + Express)
- AI Service (Python + FastAPI)

## Prerequisites
- Node.js v18+
- Python 3.10+
- Docker and Docker Compose

## Quick Start
1. Copy `.env.example` to `.env` in all required folders.
2. Install dependencies:
   ```bash
   npm run install:all
   ```
3. Run locally:
   ```bash
   npm run dev
   # And for the AI service:
   cd ai-service && pip install -r requirements.txt && python main.py
   ```
4. Or with Docker:
   ```bash
   docker-compose up --build
   ```
