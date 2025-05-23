import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";

export function setupAuthentication() {
  //promt player for their username to use for light-weight authentication
  const username = prompt("Enter your username:");

  //connect to the socket.io server and make the socket available globally in the window
  const socket = io({
    auth: {
      username: username || `Guest${Math.floor(Math.random() * 1000)}`,
    },
  });
  window.socket = socket;
  window.username = socket.auth.username;
}
