# Use official Java image as the base image
FROM node:20

# Set the working directory
WORKDIR /app/local/www

RUN git clone https://github.com/equinor/NOAKADEXPI.git /app/NOAKADEXPI

#RUN -sf /app/NOAKADEXPI/Symbols/Origo /app/local/www/public/Origo

RUN npm install

# Start react dev environment
ENTRYPOINT ["npm","run","dev"]