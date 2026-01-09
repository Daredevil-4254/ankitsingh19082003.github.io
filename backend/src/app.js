const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.use("/api/public/highlights", require("./routes/public/highlights.routes"));
app.use("/api/admin/highlights", require("./routes/admin/highlights.routes"));

module.exports = app;
