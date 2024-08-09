# Step 1: Build the React application
FROM node:alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Step 2: Serve the app using Nginx
FROM nginx:alpine

# Add a non-root user for better security
RUN adduser -D myuser
USER myuser

# Copy the build files from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port on which Nginx is running
EXPOSE 80

# Health check to ensure Nginx is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl --silent --fail http://localhost/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
