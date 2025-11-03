import { setupSocketWithAuthentication } from "./src/frontend/adapters/socket/setupAuthentication.js";
import { createLobbyListModal } from "./src/frontend/presentation/lobby/LobbyListModal.js";

export const PENDING_SESSION_KEY = "pendingGameSession";
const DEFAULT_LOBBY_PROMPT = "Enter a lobby name:";
const GENERIC_ERROR_MESSAGE = "Unable to create lobby";
const MISSING_NAME_MESSAGE = "Please enter a lobby name.";
const LOBBY_LIST_ERROR_MESSAGE = "Unable to fetch available lobbies.";
const LOBBY_UPDATE_EVENT = "lobbies:updated";
const LOBBY_LIST_EVENT = "lobby:list";

/**
 * Initialize welcome page interactions for creating or joining games.
 * Wires button handlers, establishes a socket on demand, and manages modal lifecycle.
 * @param {object} [deps]
 * @param {Document} [deps.document]
 * @param {Window} [deps.window]
 * @param {(options: { promptUser: null }) => any} [deps.createSocket]
 * @returns {void}
 */
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
  let modalApi;
  let unsubscribeLobbyUpdates;
  let activeSocketForModal;

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

      const sessionId = response.gameSessionID;
      const url = new URL('index.html', win.location.href);
      url.searchParams.set('session', sessionId);
      win.location.assign(url.toString());
    });
  });

  if (joinButton) {
    joinButton.addEventListener('click', (event) => {
      event.preventDefault();
      handleJoinFlow();
    });
  }

  function ensureSocket() {
    if (!socket) {
      socket = createSocket({ promptUser: null });
    }

    if (!hasConnected) {
      socket.connect();
      hasConnected = true;
    }

    return socket;
  }

  async function handleJoinFlow() {
    const activeSocket = ensureSocket();
    activeSocketForModal = activeSocket;

    let lobbies;
    try {
      lobbies = await requestLobbySnapshot(activeSocket);
    } catch (error) {
      win.alert(error.message || LOBBY_LIST_ERROR_MESSAGE);
      return;
    }

    const modal = ensureModal();
    modal.show(lobbies);

    resetLobbySubscription();
    unsubscribeLobbyUpdates = subscribeToLobbyUpdates(
      activeSocket,
      (payload) => {
        let listings = [];
        if (Array.isArray(payload?.lobbies)) {
          listings = payload.lobbies;
        }
        modal.show(listings);
      }
    );
  }

  function ensureModal() {
    if (!modalApi) {
      modalApi = createLobbyListModal(doc);
      modalApi.onSelect((sessionId, lobbyName) => {
        handleModalSelection({
          sessionId,
          lobbyName,
          socket: activeSocketForModal,
          modal: modalApi,
          window: win,
        });
      });
      modalApi.onRefresh(async () => {
        if (!activeSocketForModal) {
          return;
        }
        try {
          const refreshed = await requestLobbySnapshot(activeSocketForModal);
          modalApi.show(refreshed);
        } catch (error) {
          win.alert(error.message || LOBBY_LIST_ERROR_MESSAGE);
        }
      });
      modalApi.onClose(() => {
        resetLobbySubscription();
      });
    }
    return modalApi;
  }

  function resetLobbySubscription() {
    if (unsubscribeLobbyUpdates) {
      unsubscribeLobbyUpdates();
      unsubscribeLobbyUpdates = null;
    }
  }

  function handleModalSelection({ sessionId, lobbyName, socket: activeSocket, modal, window: winRef }) {
    if (!sessionId) {
      winRef.alert(LOBBY_LIST_ERROR_MESSAGE);
      return;
    }

    //navigate to game board with session id as URL param
    resetLobbySubscription();
    modal.hide();
    const url = new URL('index.html', winRef.location.href);
    url.searchParams.set('session', sessionId);
    winRef.location.assign(url.toString());
  }
}

/**
 * Subscribe to server-driven lobby updates.
 * @param {any} activeSocket - socket-like object supporting on/off or removeListener.
 * @param {(payload: any) => void} handler - called when lobbies are updated.
 * @returns {() => void} unsubscribe function.
 */
function subscribeToLobbyUpdates(activeSocket, handler) {
  activeSocket.on(LOBBY_UPDATE_EVENT, handler);

  return () => {
    if (typeof activeSocket.off === 'function') {
      activeSocket.off(LOBBY_UPDATE_EVENT, handler);
    } else if (typeof activeSocket.removeListener === 'function') {
      activeSocket.removeListener(LOBBY_UPDATE_EVENT, handler);
    }
  };
}

/**
 * Request a one-shot snapshot of available lobbies from the server.
 * @param {any} activeSocket - socket-like object supporting emit with ack callback.
 * @returns {Promise<Array<any>>} resolves to list of lobbies or rejects with error.
 */
async function requestLobbySnapshot(activeSocket) {
  return await new Promise((resolve, reject) => {
    try {
      activeSocket.emit(LOBBY_LIST_EVENT, undefined, (response) => {
        if (!response) {
          reject(new Error(LOBBY_LIST_ERROR_MESSAGE));
          return;
        }

        if (response.error) {
          const message = response.error.message || LOBBY_LIST_ERROR_MESSAGE;
          reject(new Error(message));
          return;
        }

        let listings = [];
        if (Array.isArray(response.lobbies)) {
          listings = response.lobbies;
        }
        resolve(listings);
      });
    } catch (error) {
      reject(new Error(LOBBY_LIST_ERROR_MESSAGE));
    }
  });
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
