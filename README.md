GraphiQL Workspace App – your personal copy
===========================================

This is an instance of [`crete-react-app`](https://github.com/facebookincubator/create-react-app) that runs a personal copy of [`graphiql-workspace`](https://github.com/OlegIlyenko/graphiql-workspace) (officially available at http://toolbox.sangria-graphql.org/graphiql).

The tool is available as a docker image that has been automatically generated from source with `.gitlab-ci.yml`.
The benefit of having your team’s instance of `graphiql-workspace-app` is that you can avoid including `graphiql` into every API you create while keeping the exchanged traffic private.


![](https://raw.githubusercontent.com/OlegIlyenko/graphiql-workspace/master/screenshot.png)

Launching
---------


### From source

```bash
git clone https://gitlab.com/kachkaev/graphiql-workspace-app.git
cd graphiql-workspace-app
npm install

cp .env.dist .env
# configure default url, query and variables

# dev mode
npm start

# generate production build in /dist
npm run build
```


### Using docker

There is no need to clone the repo or npm install if you have docker.
To run the app on port 3500 simply execute:

```bash
# update
docker pull registry.gitlab.com/kachkaev/graphiql-workspace-app:master

# start
docker run -it -d \
  --name graphiql \
  -p 3500:80 \
  registry.gitlab.com/kachkaev/graphiql-workspace-app:master \
&& docker logs -f graphiql

# stop
docker rm -f graphiql
```


### Using docker and nginx-proxy

If you organise external access to your containers with [`nginx-proxy`](https://github.com/jwilder/nginx-proxy) and [`docker-letsencrypt-nginx-proxy-companion`](https://github.com/JrCs/docker-letsencrypt-nginx-proxy-companion), you can get a personal copy of graphiql workspace at `https://graphiql.example.com` in just one command:

```bash
HOST=graphiql.example.com
LETSENCRYPT_EMAIL=letsencrypt@example.com

docker run -it -d \
  --name graphiql \
  -e VIRTUAL_HOST=${HOST},www.${HOST} \
  -e VIRTUAL_PORT=80 \
  -e VIRTUAL_NETWORK=web-proxy \
  -e LETSENCRYPT_HOST=${HOST},www.${HOST} \
  -e LETSENCRYPT_EMAIL=${LETSENCRYPT_EMAIL} \
  --network web-proxy \
  registry.gitlab.com/kachkaev/graphiql-workspace-app:master \
&& docker logs -f graphiql
```


### Inside a kubernetes cluster with ingress

If you have kubernetes cluster with an ingress controller, you can add `graphiql-workspace-app` to your team’s toolset just by applying the following yaml.
The ingress rule below is generic, so you might want to supplement it with a few annotations depending on the type of the ingress controller you use.

```bash
HOST=graphiql.example.com
NAMESPACE=default

echo "
---
kind: Deployment
apiVersion: extensions/v1beta1
metadata:
  name: graphiql-workspace-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: graphiql-workspace-app
  template:
    metadata:
      labels:
        app: graphiql-workspace-app
    spec:
      containers:
      - name: main
        image: registry.gitlab.com/kachkaev/graphiql-workspace-app:master
        ports:
        - containerPort: 80
        livenessProbe:
          tcpSocket:
            port: 80
          initialDelaySeconds: 15
          periodSeconds: 20
---
apiVersion: v1
kind: Service
metadata:
  name: graphiql-workspace-app
spec:
  ports:
  - name: http
    port: 80
    targetPort: 80
  selector:
    app: graphiql-workspace-app
---
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: graphiql-workspace-app
  annotations:
    # ... your custom annotations
spec:
  rules:
  - host: ${HOST}
    http:
      paths:
      - backend:
          serviceName: graphiql-workspace-app
          servicePort: http
" | kubectl apply --namespace=${NAMESPACE} -f -
```

HTTP vs HTTPS
-------------

It is recommended to access your team’s instance of `graphiql-workspace-app` via HTTPS unless you run it on `localhost` or fully trust your local network.
When using HTTPS (e.g. `https://graphiql.example.com`), you may experience issues when connecting to HTTP endpoints such as `http://localhost:4000`.
In order to avoid these, tell you browser not to block scripts from unauthenticated sources after you’ve entered the URL of your endpoint.

![graphiql-workspace-app-unsafe-scripts](https://gitlab.com/kachkaev/graphiql-workspace-app/uploads/52e2baaa9d32ca730ae22f456e53b638/graphiql-workspace-app-unsafe-scripts.png)

It is also useful to make sure that the tested GraphQL endpoints do not have [`cors`](https://github.com/expressjs/cors) enabled and thus accept queries from your origin.
