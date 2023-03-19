# Use an official Node runtime as a parent image
FROM node:latest

# Set the working directory to /frontend
WORKDIR /frontend

# Copy the package.json and package-lock.json files into the container
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the rest of the frontend files into the container
COPY . .

# Expose port 3000 for the React app
EXPOSE 3000

# Start the React app
CMD ["npm", "run dev"]