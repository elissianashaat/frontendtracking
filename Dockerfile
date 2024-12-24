FROM node:16.14

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN if [ ! -d "/.npm" ]; then mkdir /.npm; fi
RUN if [ ! -d "/app/.angular" ]; then mkdir /app/.angular; fi

# Set ownership for /app directory and specific directories
RUN chown -R 1013690000:0 /app /.npm /app/.angular

USER 1013690000

COPY . . 

CMD ["npm", "start"]