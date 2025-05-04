# Dockerfile for Express API
FROM node:20

# Create app directory
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy app source
COPY . .

# Start the server
CMD ["node", "src/app.js"]
