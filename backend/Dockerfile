FROM continuumio/miniconda3

WORKDIR /app


COPY environment.yml .
RUN conda env create -f environment.yml

SHELL ["conda", "run", "-n", "full_stack", "/bin/bash", "-c"]

COPY . .

CMD python manage.py makemigrations && \
    python manage.py migrate && \
    python manage.py runserver 0.0.0.0:8000