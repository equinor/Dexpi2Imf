FROM eclipse-temurin:21

RUN apt-get update && \
    apt-get install -y apache2 

ENTRYPOINT ["apache2ctl", "-D", "FOREGROUND"]

