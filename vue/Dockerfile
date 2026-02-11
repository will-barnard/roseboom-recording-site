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

# Start the preview server with correct host binding
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
