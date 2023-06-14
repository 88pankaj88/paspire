FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]


# Command to run docker container
#docker build . -t {imageName}
#docker run -p 8080:4000 -d {imageName}
