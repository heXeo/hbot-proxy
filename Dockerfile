FROM node:8.1-alpine

COPY ./src /opt/
RUN cd /opt && npm install

EXPOSE 3000
CMD [ "node", "/opt/main.js" ]
