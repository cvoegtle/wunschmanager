const PROXY_CONFIG = [{
  context: [
    "/wishlist",
    "/wish",
    "/user/status",
    "/_ah",
    "/oauth2/authorization/google"
  ],
  target: "http://localhost:8085",
  secure: false
}]

module.exports = PROXY_CONFIG;
