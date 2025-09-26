import { setupSocketWithAuthentication } from "./src/frontend/setupAuthentication.js";

export const PENDING_SESSION_KEY = "pendingGameSession";
const DEFAULT_LOBBY_PROMPT = "Enter a lobby name:";
const GENERIC_ERROR_MESSAGE = "Unable to create lobby";
const MISSING_NAME_MESSAGE = "Please enter a lobby name.";

export function initializeWelcomePage({
  document: doc = document,
  window: win = window,
  createSocket = setupSocketWithAuthentication,
} = {}) {
  const createButton = doc.querySelector('[data-create-game-button]');
  const joinButton = doc.querySelector('[data-join-game-button]');

  if (!createButton) {
    return;
  }

  let socket;
  let hasConnected = false;

  createButton.addEventListener('click', (event) => {
    event.preventDefault();
    const activeSocket = ensureSocket();

    const rawName = win.prompt(DEFAULT_LOBBY_PROMPT);
    const lobbyName = sanitizeLobbyName(rawName);

    if (!lobbyName) {
      win.alert(MISSING_NAME_MESSAGE);
      return;
    }

    activeSocket.emit('lobby:create', { lobbyName }, (response) => {
      if (!response || response.error) {
        const message = response?.error?.message || GENERIC_ERROR_MESSAGE;
        win.alert(message);
        return;
      }

      if (!response.gameSessionID) {
        win.alert(GENERIC_ERROR_MESSAGE);
        return;
      }

      try {
        storePendingSession(win.sessionStorage, {
          gameSessionID: response.gameSessionID,
          lobbyName,
          username: activeSocket.auth?.username || '',
        });
      } catch (error) {
        console.error("Unable to persist pending session", error);
        win.alert(GENERIC_ERROR_MESSAGE);
        return;
      }

      win.location.assign('index.html');
    });
  });

  if (joinButton) {
    joinButton.addEventListener('click', (event) => {
      event.preventDefault();
      win.alert('Join flow coming soon.');
    });
  }

  function ensureSocket() {
    if (!socket) {
      socket = createSocket();
    }

    if (!hasConnected) {
      socket.connect();
      hasConnected = true;
    }

    return socket;
  }
}

function sanitizeLobbyName(value) {
  if (typeof value !== 'string') {
    return '';
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  return trimmed.replace(/\s+/g, ' ');
}

function storePendingSession(storage, payload) {
  if (!storage) {
    return;
  }

  const record = {
    ...payload,
    createdAt: Date.now(),
  };

  try {
    storage.setItem(PENDING_SESSION_KEY, JSON.stringify(record));
  } catch (error) {
    storage.removeItem(PENDING_SESSION_KEY);
    throw error;
  }
}

