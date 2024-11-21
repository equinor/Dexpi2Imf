# Use official Java image as the base image
FROM eclipse-temurin:21

# Set the working directory
WORKDIR /app

# Download the JAR file from the release URL and rename it to rmlmapper.jar
ADD https://github.com/RMLio/rmlmapper-java/releases/download/v7.1.2/rmlmapper-7.1.2-r374-all.jar /app/rmlmapper.jar

# Install Git, xsltproc and apache
RUN apt-get update && \
    apt-get install -y git xsltproc apache2 dos2unix

# Clone the NOAKADEXPI Git repo
RUN git clone https://github.com/equinor/NOAKADEXPI.git /app/NOAKADEXPI

# Copy the demo bash script
COPY demo.sh /app/demo.sh
RUN dos2unix /app/demo.sh
RUN chmod +x /app/demo.sh

# Run the rml mappings
ENTRYPOINT "/app/demo.sh"

