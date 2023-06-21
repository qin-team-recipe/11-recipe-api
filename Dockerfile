ARG NODE_VERSION=18.12.1

FROM node:${NODE_VERSION}-alpine

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json to Docker container
COPY package*.json /app

# Install node_modules in docker conrainer
RUN npm install

# Copy all folders and files
COPY . .

# Expose the port that the application listens on.
EXPOSE 8080

# Run the application
CMD npm run dev