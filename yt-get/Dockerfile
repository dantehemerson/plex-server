FROM node:18-alpine

# Install ffmpeg dependency to allow merging of audio and video
RUN apk add --no-cache ffmpeg

# Install python3, required by youtube-dl
RUN apk add --no-cache \
              python3 \
              g++ \
              make

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node

