import app from "./app";

// parse port to number
const port = parseInt(process.env.PORT ?? "4000", 10);
app.listen(port, () => {
  console.log(`> Listening on http://localhost:${port}`);
});
