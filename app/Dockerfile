# Use Node.js 20 as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

RUN ls -lah /src/app
RUN ls -lah /src/app/dist  

# Expose the application port (default for NestJS is 3000)
EXPOSE 3000

# Command to start the application
CMD ["npm", "run", "start:prod"]
