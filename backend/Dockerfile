# Use official Node.js 20 image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy the remaining source code
COPY . .

# Backend runs on port 5000
EXPOSE 5000

# Start the application
CMD ["npm", "start"]