import buildApp from "./app";

const server = buildApp().listen(8080, () => {
  // @ts-ignore
  console.log(`Listening on http://127.0.0.1:${server.address()?.port}/`);
});
