import "dotenv/config";
import http from "http";
import httpProxy from "http-proxy";

const targets = [
  process.env.BACKEND_1_URL || "http://localhost:5001",
  process.env.BACKEND_2_URL || "http://localhost:5002",
];

let currentIndex = 0;

function getNextTarget() {
  const target = targets[currentIndex];
  currentIndex = (currentIndex + 1) % targets.length;
  return target;
}

const proxy = httpProxy.createProxyServer({
  ws: true,
  changeOrigin: true,
});

proxy.on("error", (err, req, res) => {
  console.error("[PROXY ERROR]:", err.message);
  if (res && typeof res.writeHead === "function" && !res.headersSent) {
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Bad Gateway", message: err.message }));
  }
});

const server = http.createServer((req, res) => {
  const target = getNextTarget();
  console.log(`[HTTP PROXY] ${req.method} ${req.url} -> ${target}`);
  proxy.web(req, res, { target });
});

server.on("upgrade", (req, socket, head) => {
  const target = getNextTarget();
  console.log(`[WS PROXY] UPGRADE ${req.url} -> ${target}`);
  proxy.ws(req, socket, head, { target });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Reverse Proxy running on http://localhost:${PORT}`);
  console.log(`Round-robin targets: ${targets.join(", ")}`);
});
