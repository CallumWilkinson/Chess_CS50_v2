//jest maps the socket.io cdn esm import to this file during tests
//reason: jest cannot import remote esm urls; this mock avoids network and makes behavior deterministic
//wiring: see package.json jest.moduleNameMapper pointing the cdn url to this file
//api: tests call __setSocketIoImplementation(fn) to inject a stub io client, then import code under test
//cleanup: tests call __resetSocketIoImplementation() in afterEach to restore the default throwing stub
//scope: test-only; production code never imports this file directly

const state = {
  implementation: () => {
    throw new Error("socket.io client mock not configured");
  },
};

export const io = (...args) => state.implementation(...args);

export function __setSocketIoImplementation(fn) {
  state.implementation = fn;
}

export function __resetSocketIoImplementation() {
  state.implementation = () => {
    throw new Error("socket.io client mock not configured");
  };
}
