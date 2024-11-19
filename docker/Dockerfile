# Use official Java image as the base image
FROM eclipse-temurin:21

# Set the working directory
WORKDIR /app

# Download the JAR file from the release URL and rename it to rmlmapper.jar
ADD https://github.com/RMLio/rmlmapper-java/releases/download/v7.1.2/rmlmapper-7.1.2-r374-all.jar /app/rmlmapper.jar

# Install Git, xsltproc and flask
RUN apt-get update && \
    apt-get install -y git xsltproc apache2 python3 python3-pip 
#RUN pip3 install flask

# Clone the NOAKADEXPI Git repo
RUN git clone https://github.com/equinor/NOAKADEXPI.git /app/NOAKADEXPI

# Copy the lacking Origo symbol
# COPY ../xslt/PV001A_Origo.svg /app/NOAKADEXPI/Symbols/Origo

# Copy the demo bash script
COPY demo.sh /app/
RUN chmod +x /app/demo.sh

# Run the rml mappings
ENTRYPOINT ["/app/demo.sh"]

