FROM mcr.microsoft.com/openjdk/jdk:21-ubuntu
VOLUME /tmp
ARG JAVA_OPTS
ENV JAVA_OPTS=$JAVA_OPTS
COPY build/libs/RJPROJECTWALLAFINAL-0.0.1-SNAPSHOT.jar rjprojectwallafinal.jar
EXPOSE 3000
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar rjprojectwallafinal.jar"]
# For Spring-Boot project, use the entrypoint below to reduce Tomcat startup time.
#ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar rjprojectwallafinal.jar"]
