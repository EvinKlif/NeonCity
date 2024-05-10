FROM python:3.10.4
RUN  apt-get update && apt-get install 'ffmpeg' -y
WORKDIR  /backend
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
COPY /pyproject.toml poetry.lock ./
RUN pip3 install poetry
RUN poetry config virtualenvs.create false
RUN poetry install
COPY . .
RUN chmod a+x docker/*.sh