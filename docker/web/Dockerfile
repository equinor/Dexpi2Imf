# Use official Java image as the base image
FROM eclipse-temurin:21

# Set the working directory
WORKDIR /app

#  apache
RUN apt-get update && \
    apt-get install -y apache2 


# Run the web server
ENTRYPOINT ["apache2ctl", "-D", "FOREGROUND"]

