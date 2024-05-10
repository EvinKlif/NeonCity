#!/bin/bash


alembic upgrade head

cd  src

gunicorn app:app -w 2 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000