# Usage

## npm

Use command `npm install` to automatically install any packages that the project depends on. 

``` shell
# check node's version
node -v # v14.16.1

# check npm's version
npm -v # v8.18.0

# install dependencies
npm install --legacy-peer-deps
```

## Docker

Next, we will run our Vue.js app in a Docker container. 

### Environment

| Ubuntu         | 18.04.4  |
| -------------- | -------- |
| Docker         | 20.10.18 |
| Docker Compose | 2.10.2   |

### Installation

```shell
# Install using the convenience script
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh --mirror Aliyun
docker -v # 20.10.18
docker compose version # 2.10.2
# Change registry mirrors
vim /etc/docker/daemon.json
# input the following JSON: {"registry-mirrors": ["https://docker.mirrors.ustc.edu.cn/", "https://registry.docker-cn.com"]}
sudo systemctl daemon-reload
sudo systemctl restart docker
docker info
# Registry Mirrors:
#  https://docker.mirrors.ustc.edu.cn/
#  https://registry.docker-cn.com/
sudo docker run hello-world
# Unable to find image 'hello-world:latest' locally
# latest: Pulling from library/hello-world
# 2db29710123e: Pull complete
# Status: Downloaded newer image for hello-world:latest
# Hello from Docker!
# This message shows that your installation appears to be working correctly.
```

### Build Images and Run Containers of Vue.js App

We create `Dockerfile` for both 'dev' and 'prod' environment in the root folder of our project. Add a `.dockerignore` to speed up the Docker build process as our local dependencies and git repo will not be sent to the Docker daemon.

```
docs
images
README.md
.prettierrc
node_modules
.git
.gitignore
static/.gitkeep
```

#### Dev

We start by creating a `Dockerfile.dev` in the root folder of our project:

```dockerfile
# Dockerfile.dev

FROM node:14.16.1

WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# overwrite Dev Server settings `host` in `config/index.js`
ENV HOST 0.0.0.0

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# copy `patches` before npm runs post-install script
COPY patches ./patches

# update npm and install project dependencies
RUN npm i npm@8.18.0 -g
RUN npm i vue-cli -g --legacy-peer-deps
RUN npm install --legacy-peer-deps

EXPOSE 8080

# configure anonymous volume in order to 
# use the container version of the “node_modules” folder
VOLUME "/app/node_modules"

CMD ["npm", "run", "dev"]
```

> `ENV HOST 0.0.0.0` sets the environment variable `HOST` to the value `0.0.0.0`, which overwrites Dev Server settings `host` in `config/index.js`. If you keep original settings `host: 'localhost'`, our Vue.js app in a docker container will not be accessible from outside. By inspecting container exposed port `docker container port dockerize-vuejs-app-dev`, we get the output `8080/tcp -> 0.0.0.0:8080`, which means the docker container are listening to inner port `0.0.0.0:8080` instead of `localhost:8080`. To be more specific, when apps run in a Docker container the IP `127.0.0.1` is assigned to the Docker container, not the host. Changing it to `0.0.0.0` will allow us to directly access the app from the host.
>
> `COPY patches ./patches` aims at providing patches before npm runs post-install script. After patching, you will get the output: `Applying patches... element-ui@2.15.9 ✔`. 
>
> It may seem reduntant to first copy `package.json` and `package-lock.json` and then all project files and folders in two separate steps but there is actually [a very good reason for that](http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/) (spoiler: it allows us to take advantage of cached Docker layers).

Now let’s build the Docker image of our Vue.js app:

```shell
docker build -f Dockerfile.dev -t dockerize-vuejs-app:dev .
```

Finally, let’s run our Vue.js app in a Docker container:

```shell
docker run -it -p 8080:8080 -v ${PWD}:/app --rm --name dockerize-vuejs-app-dev dockerize-vuejs-app:dev
```

> `-v ${PWD}:/app` mounts our code into the container at “/app” to enable "[Hot Reload](https://vue-loader.vuejs.org/guide/hot-reload.html)". `${PWD}` is `/path/to/your/project`, which may not work on Windows. ( See [this](https://stackoverflow.com/questions/41485217/mount-current-directory-as-a-volume-in-docker-on-windows-10) Stack Overflow question for more info. )

You should be able to access our Vue.js app on `localhost:8080` on your host machine. The logs are as follows:

```
 DONE  Compiled successfully in 12336ms                                                            3:04:24 AM

 I  Your application is running here: http://0.0.0.0:8080
 I  Your Express app is listening on port 8081

 N  © Sylvan Ding 2022 <sylvanding@qq.com>
 N  https://github.com/sylvanding/
```

#### Prod

For realistically complex production use cases, it may be wiser to stand on the shoulders of some giant like [NGINX](https://www.nginx.com/) or [Apache](https://httpd.apache.org/) and that is exactly what we are going to do next: we are about to leverage NGINX to serve our Vue.js app because it is considered to be one of the most performant and battle-tested solutions out there.

We refactor our `Dockerfile.dev` to use NGINX:

```dockerfile
# Dockerfile.prod

# build stage
FROM node:14.16.1 as build-stage
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package*.json ./
COPY patches ./patches
RUN npm i npm@8.18.0 -g
RUN npm i vue-cli -g --legacy-peer-deps
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Now let’s build the Docker image of our Vue.js app:

```shell
docker build -f Dockerfile.prod -t dockerize-vuejs-app:prod .
```

Finally, let’s run our Vue.js app in a Docker container:

```shell
docker run -it -p 80:80 --rm --name dockerize-vuejs-app-prod dockerize-vuejs-app:prod
```

We should be able to access our Vue.js app on `http://localhost` or `http://yourPublibIPAddress`. Note that you need to open 80 port in your firewall. To run a container in background, we use `-d` flag instead of `--rm`: 

```shell
docker run -d -p 80:80 --name dockerize-vuejs-app-prod dockerize-vuejs-app:prod
```

Stop and remove that container:

```shell
docker rm -f dockerize-vuejs-app-prod
```

### View Nginx Access Logs

Type the following command helps us view Nginx real-time access logs shown on the background container's virtual screen:

```shell
docker attach --sig-proxy=false dockerize-vuejs-app-prod
```

What happens there?

* `docker attach` attaches your terminal’s standard input, output, and error (or any combination of the three) to a running container using the container’s ID or name. This allows you to view its ongoing output or to control it interactively, as though the commands were running directly in your terminal.
* `--sig-proxy=false` prevents `CTRL-c` from sending a `SIGINT` to the container. It allows you to detach from the container with a `-d` flag and leave it running Nginx continuously by using the `CTRL-c` key sequence.
