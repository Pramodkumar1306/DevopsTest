FROM node:20
# The Dockerfile starts with a base image of Node.js version 20, which provides the necessary runtime environment for our application.
WORKDIR /app
# The WORKDIR instruction sets the working directory inside the container to "/app". This means that all subsequent commands will be executed in this directory, and it will be the default location for our application files.
COPY package*.json ./
# The COPY instruction is used to copy the package.json and package-lock.json files from the host machine to the working directory in the container. These files contain the dependencies and scripts needed to run our application.
RUN npm install
# The RUN instruction executes the command "npm install" inside the container, which installs all the dependencies specified in the package.json file. This ensures that our application has all the necessary libraries and modules to run correctly.
COPY . .
# The second COPY instruction copies all the remaining files from the host machine to the working directory in the container. This includes the source code, configuration files, and any other necessary assets for our application.
EXPOSE 4000
# The EXPOSE instruction informs Docker that the container will listen on port 4000 at runtime. This is the port that our application will use to accept incoming requests.
CMD ["npm", "start"]