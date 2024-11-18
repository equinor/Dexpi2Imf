# Use official Java image as the base image
FROM eclipse-temurin:21

# Set the working directory
WORKDIR /app

# Download the JAR file from the release URL and rename it to rmlmapper.jar
ADD https://github.com/RMLio/rmlmapper-java/releases/download/v7.1.2/rmlmapper-7.1.2-r374-all.jar /app/rmlmapper.jar

# Copy the demo bash script
COPY demo.sh /app/
RUN chmod +x /app/demo.sh

# Run the rml mappings
ENTRYPOINT ["/app/demo.sh"]

