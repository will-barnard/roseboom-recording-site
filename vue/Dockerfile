FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 5173

# Start the development server (for dev) or serve the build (for prod)
CMD ["npm", "run", "preview"]
