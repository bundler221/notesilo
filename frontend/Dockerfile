# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Accept build arguments
ARG VITE_INCOGNOIR_API_KEY
ARG VITE_INCOGNOIR_ENVIRONMENT_ID
ARG VITE_INCOGNOIR_API_BASE

# Create .env file from build arguments
RUN echo "VITE_INCOGNOIR_API_KEY=${VITE_INCOGNOIR_API_KEY}" > .env && \
    echo "VITE_INCOGNOIR_ENVIRONMENT_ID=${VITE_INCOGNOIR_ENVIRONMENT_ID}" >> .env && \
    echo "VITE_INCOGNOIR_API_BASE=${VITE_INCOGNOIR_API_BASE}" >> .env

# Build the application (Vite will use .env file if it exists)
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
