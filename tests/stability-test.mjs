import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const gameJs = fs.readFileSync(path.join(root, "game.js"), "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function fakeElement(id) {
  return {
    id,
    value: id === "rosterSelect" ? "strict" : id === "tempoSelect" ? "fast" : "",
    textContent: "",
    innerHTML: "",
    dataset: {},
    style: {},
    disabled: false,
    className: "",
    classList: {
      add() {},
      remove() {},
      toggle() {},
      contains() {
        return id === "game";
      }
    },
    addEventListener() {},
    setAttribute() {},
    removeAttribute() {},
    appendChild() {},
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    }
  };
}

function createContext() {
  const elements = new Map();
  const storage = new Map();
  const document = {
    body: fakeElement("body"),
    documentElement: fakeElement("html"),
    addEventListener() {},
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, fakeElement(id));
      return elements.get(id);
    },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    createElement(tag) {
      return fakeElement(tag);
    }
  };
  const context = {
    console,
    document,
    setTimeout,
    clearTimeout,
    Date,
    Math,
    localStorage: {
      getItem(key) {
        return storage.has(key) ? storage.get(key) : null;
      },
      setItem(key, value) {
        storage.set(key, String(value));
      },
      removeItem(key) {
        storage.delete(key);
      },
      clear() {
        storage.clear();
      }
    },
    window: null
  };
  context.window = context;
  return vm.createContext(context);
}

async function run() {
  const context = createContext();
  vm.runInContext(gameJs, context, { filename: "game.js" });
  const api = context.window.__SGS_TEST_API;
  assert(api?.stabilityMatrixSummary, "Long-run stability matrix API was not exposed.");

  const summary = await api.stabilityMatrixSummary({
    modes: ["5", "8"],
    rosterModes: ["strict", "all"],
    runs: 3,
    turns: 220,
    aiMode: "strategist"
  });

  assert(summary.scenarioCount === 12, `Expected 12 stability scenarios, got ${summary.scenarioCount}.`);
  if (!summary.ok) {
    throw new Error(`Long-run stability matrix found wait/consistency issues:\n${JSON.stringify(summary.failures, null, 2)}`);
  }
  for (const result of summary.results) {
    assert(result.ok, `Scenario should not leave an active wait state: ${JSON.stringify(result, null, 2)}`);
    assert(result.turnsTaken <= summary.turns, `Scenario exceeded the requested turn limit: ${JSON.stringify(result, null, 2)}`);
  }

  console.log(JSON.stringify({
    ok: true,
    scenarioCount: summary.scenarioCount,
    turns: summary.turns,
    runs: summary.runs,
    results: summary.results.map(({ mode, rosterMode, run, turnsTaken, round, gameOver, alive }) => ({
      mode,
      rosterMode,
      run,
      turnsTaken,
      round,
      gameOver,
      alive
    }))
  }, null, 2));
}

run().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exitCode = 1;
});
