<h1 align="center">React Server Side Rendering</h1>
<p align="center">With Express JS, TypeScript and Jest</p>

## Getting started

1. Click the <kbd>Use this template</kbd> button to create a new repository
2. Clone your project
3. Install dependecies with `yarn`
4. Start hacking by modifying `src/index.tsx` and running `yarn dev` to run the server
5. Open <a target="_blank" href="http://127.0.0.1:8080/">your browser</a>

To build production code simply run `yarn webpack` then `node dist/server.js`.

### `docker-compose` ready

Simply run `docker-compose up -d`

### `docker` ready

To use docker you need to build a docker image and execute it in a container.

1. Build the image

   ```bash
   docker build --build-arg=DEV_UID=$(id -u) -t react-ssr .
   # The DEV_UID argument is used to fix file permission
   ```

2. Run directly

   ```bash
   docker run -p 8080:8080 react-ssr
   ```
