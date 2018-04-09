const PROXY_CONFIG = [{
  context: [
    "/wishlist",
    "/wish",
    "/user/status",
    "/_ah"
  ],
  target: "http://localhost:8080",
  secure: false
}]

module.exports = PROXY_CONFIG;