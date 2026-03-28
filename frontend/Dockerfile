# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Accept build arguments
ARG VITE_INCOGNOIR_API_BASE
ARG VITE_INCOGNOIR_API_KEY
ARG VITE_INCOGNOIR_ENVIRONMENT_ID

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Set environment variables for build
ENV VITE_INCOGNOIR_API_BASE=$VITE_INCOGNOIR_API_BASE
ENV VITE_INCOGNOIR_API_KEY=$VITE_INCOGNOIR_API_KEY
ENV VITE_INCOGNOIR_ENVIRONMENT_ID=$VITE_INCOGNOIR_ENVIRONMENT_ID

# Build the application
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
