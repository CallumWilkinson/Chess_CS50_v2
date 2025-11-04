const DEFAULT_EMPTY_MESSAGE = "No lobbies available yet.";

const TABLE_HEADERS = ["Lobby", "Host", "Colour", "Players"];

/**
 * Create a modal element for listing available lobbies and wire imperative hooks.
 * @param {Document} doc - document used to create DOM nodes.
 * @returns {Object} api surface for showing, hiding, refreshing, and listening for selections.
 */
export function createLobbyListModal(doc) {
  const template = doc.createElement("template");
  template.innerHTML = buildMarkup();

  const root = template.content.firstElementChild;
  const emptyState = root.querySelector("[data-empty]");
  const tableWrapper = root.querySelector("[data-table-wrapper]");
  const tableBody = root.querySelector("[data-table-body]");
  const refreshButton = root.querySelector("[data-refresh]");
  const closeButton = root.querySelector("[data-close]");

  /** Attach modal root to document body if detached. */
  function ensureMounted() {
    if (!root.isConnected) {
      doc.body.appendChild(root);
    }
  }

  /** Render the provided lobbies and reveal the modal. */
  function show(lobbies) {
    ensureMounted();
    renderRows(tableBody, lobbies);
    toggleEmptyState(emptyState, tableWrapper, lobbies.length === 0);
    root.hidden = false;
  }

  /** Conceal the modal without destroying it. */
  function hide() {
    root.hidden = true;
    if (root.isConnected) {
      root.remove();
    }
  }

  /** Wire a handler for selecting lobby rows. */
  function onSelect(handler) {
    tableBody.addEventListener("click", (event) => {
      const row = event.target.closest("[data-session-id]");
      if (!row) {
        return;
      }
      const sessionId = row.dataset.sessionId;
      handler(sessionId, row.dataset.lobbyName || "");
    });
  }

  /** Wire a handler for the refresh button. */
  function onRefresh(handler) {
    refreshButton.addEventListener("click", () => {
      if (typeof handler !== "function") {
        return;
      }
      handler();
    });
  }

  /** Wire a handler for the close button. */
  function onClose(handler) {
    closeButton.addEventListener("click", () => {
      if (typeof handler !== "function") {
        hide();
        return;
      }
      try {
        handler();
      } finally {
        hide();
      }
    });
  }

  return {
    root,
    show,
    hide,
    onSelect,
    onRefresh,
    onClose,
  };
}

function buildMarkup() {
  return `
    <div class="lobby-modal" role="dialog" aria-modal="true" hidden>
      <div class="lobby-modal__dialog" data-dialog>
        <header class="lobby-modal__header" data-header>
          <h2>Join Existing Game</h2>
          <div class="lobby-modal__controls">
            <button type="button" data-refresh>Refresh</button>
            <button type="button" data-close>Close</button>
          </div>
        </header>
        <p class="lobby-modal__empty" data-empty hidden>
          ${DEFAULT_EMPTY_MESSAGE}
        </p>
        <div class="lobby-modal__table-wrapper" data-table-wrapper>
          <table class="lobby-modal__table">
            <thead>
              <tr>
                ${TABLE_HEADERS.map((label) => `<th scope="col">${label}</th>`).join("")}
              </tr>
            </thead>
            <tbody data-table-body></tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderRows(tbody, lobbies) {
  tbody.innerHTML = "";

  lobbies.forEach((lobby) => {
    const row = tbody.ownerDocument.createElement("tr");
    row.dataset.sessionId = lobby.gameSessionID;
    if (typeof lobby.lobbyName === "string") {
      row.dataset.lobbyName = lobby.lobbyName;
    }

    row.appendChild(createCell(row.ownerDocument, resolveLobbyName(lobby)));
    row.appendChild(createCell(row.ownerDocument, lobby.waitingPlayer?.username || ""));
    row.appendChild(createCell(row.ownerDocument, lobby.waitingPlayer?.colour || ""));
    row.appendChild(
      createCell(
        row.ownerDocument,
        `${lobby.playersConnected || 0}/${lobby.maxPlayers || ""}`
      )
    );

    tbody.appendChild(row);
  });
}

function toggleEmptyState(emptyNode, tableWrapper, isEmpty) {
  emptyNode.hidden = !isEmpty;
  tableWrapper.hidden = isEmpty;
}

function resolveLobbyName(lobby) {
  if (lobby && typeof lobby.lobbyName === "string" && lobby.lobbyName.trim()) {
    return lobby.lobbyName;
  }
  if (lobby && lobby.gameSessionID) {
    return `Session ${lobby.gameSessionID}`;
  }
  return "Unnamed Lobby";
}

function createCell(doc, text) {
  const cell = doc.createElement("td");
  cell.textContent = text;
  return cell;
}
