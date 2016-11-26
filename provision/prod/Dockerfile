FROM hypriot/rpi-node:6.9.1

RUN apt-get update && \
    apt-get install python make g++ g++-4.8 -y

WORKDIR /app
VOLUME /root/.yarn-cache

RUN npm install yarn@latest -g

COPY package.json /app/
COPY yarn.lock /app/

# RUN yarn install --production # some bug with building leveldown ¯\_(ツ)_/¯
RUN npm install --production

COPY app.js /app/
COPY dist/ /app/dist/
COPY public/ /app/public/

CMD node /app/app.js
