import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";

/**
 * @typedef {Object} AuthenticationOptions
 * @property {Function|null} [promptUser] - Optional override used to collect a username.
 */

/**
 * Establish a Socket.IO client with lightweight username authentication.
 * Prompts the user (or uses a supplied override) to choose an identifier.
 * @param {AuthenticationOptions} [options] Optional behavior overrides.
 * @returns {Object} Socket.IO client instance configured for manual connection.
 */
export function setupSocketWithAuthentication(options = {}) {
  let promptResolver = options.promptUser;
  if (promptResolver === undefined) {
    promptResolver = defaultUsernamePrompt;
  }

  let rawInput = "";
  if (typeof promptResolver === "function") {
    rawInput = promptResolver();
  }

  const username = selectUsername(rawInput);

  const socket = io({
    auth: {
      username,
    },
    autoConnect: false,
  });

  ensureSocketAuthState(socket, username);

  return socket;
}

function defaultUsernamePrompt() {
  if (typeof globalThis.prompt === "function") {
    return globalThis.prompt("Enter your username:");
  }
  return "";
}

function createGuestUsername() {
  const randomNumber = Math.floor(Math.random() * 1000);
  return `Guest${randomNumber}`;
}

function selectUsername(rawValue) {
  if (typeof rawValue === "string") {
    const trimmed = rawValue.trim();
    if (trimmed) {
      return trimmed;
    }
  }

  return createGuestUsername();
}

function ensureSocketAuthState(socket, username) {
  if (!socket || typeof socket !== "object") {
    return;
  }

  if (!socket.auth || typeof socket.auth !== "object") {
    socket.auth = {};
  }

  socket.auth.username = username;
}
