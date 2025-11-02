// depcruise.webpack.cjs
const path = require("path");

module.exports = {
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "shared"),
    },
    extensions: [".js"],
  },
};
