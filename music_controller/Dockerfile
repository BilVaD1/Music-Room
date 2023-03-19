FROM python:latest
ENV PYTHONUNBUFFERED 1
RUN mkdir /music_controller
WORKDIR /music_controller
COPY requirements.txt /music_controller/

# Expose port 8000 for the Django server
EXPOSE 8000

RUN pip install -r requirements.txt
ADD . /music_controller/

ENTRYPOINT ["python", "manage.py", "runserver", "0.0.0.0:8000"]