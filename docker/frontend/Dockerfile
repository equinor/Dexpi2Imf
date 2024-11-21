FROM node:20
WORKDIR /app


RUN apt-get update && \
    apt-get install -y dos2unix

RUN git clone https://github.com/equinor/NOAKADEXPI.git /app/NOAKADEXPI

COPY demo.sh /app/demo.sh
RUN dos2unix /app/demo.sh
RUN chmod +x /app/demo.sh

# Start react dev environment
ENTRYPOINT "/app/demo.sh"