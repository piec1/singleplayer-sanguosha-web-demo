import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const gameJs = fs.readFileSync(path.join(root, "game.js"), "utf8");
const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const stylesCss = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const visualCheckJs = fs.readFileSync(path.join(root, "tests", "visual-layout-check.mjs"), "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertEvent(actual, expected, label) {
  for (const [key, value] of Object.entries(expected)) {
    assert(
      actual?.[key] === value,
      `${label}: expected ${key}=${JSON.stringify(value)}, got ${JSON.stringify(actual?.[key])}\nEvent: ${JSON.stringify(actual, null, 2)}`
    );
  }
}

function fakeElement(id) {
  const element = {
    id,
    value: id === "rosterSelect" ? "strict" : id === "tempoSelect" ? "fast" : "",
    textContent: "",
    innerHTML: "",
    dataset: {},
    style: {},
    disabled: false,
    classList: {
      add() {},
      remove() {},
      toggle() {},
      contains() {
        return id === "game";
      }
    },
    addEventListener() {},
    setAttribute() {}
  };
  return element;
}

function createContext() {
  const elements = new Map();
  const storage = new Map();
  const document = {
    addEventListener() {},
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, fakeElement(id));
      return elements.get(id);
    },
    querySelectorAll() {
      return [];
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
  if (!api?.runSmokeTest) {
    throw new Error("Smoke test API was not exposed.");
  }
  assert(api.stabilityMatrixSummary, "Long-run stability matrix test API was not exposed.");
  assert(api.parseLogEvent, "Event parser test API was not exposed.");
  assert(api.cardImageSummary, "Card image summary test API was not exposed.");
  assert(api.turnFlowSummary, "Turn flow summary test API was not exposed.");
  assert(api.tooltipContractSummary, "Tooltip contract test API was not exposed.");
  assert(api.ruleRegressionSummary, "Rule regression test API was not exposed.");
  assert(api.aiSupportScenarioSummary, "AI support scenario test API was not exposed.");
  assert(api.generalSelectionContractSummary, "AI general selection contract test API was not exposed.");
  assert(api.aiDecisionTrailContractSummary, "AI decision trail contract test API was not exposed.");
  assert(api.careerRegressionSummary, "Career regression test API was not exposed.");
  assert(api.victoryStatusSummary, "Victory status test API was not exposed.");
  assert(api.identityReadScenarioSummary, "Identity read scenario test API was not exposed.");
  assert(api.lordTargetingScenarioSummary, "Lord targeting scenario test API was not exposed.");
  assert(api.aiReadsPanelContractSummary, "AI reads panel contract test API was not exposed.");
  assert(api.eventVisualContractSummary, "Event visual contract test API was not exposed.");
  assert(api.tempoContractSummary, "Tempo contract test API was not exposed.");
  assert(api.battleLogContractSummary, "Battle log contract test API was not exposed.");
  assert(api.nameDisplayContractSummary, "Name display contract test API was not exposed.");
  assert(api.layoutPreferenceSummary, "Layout preference test API was not exposed.");
  assert(api.fairnessContractSummary, "AI fairness contract test API was not exposed.");
  assert(api.humanPlayUiContractSummary, "Human play UI contract test API was not exposed.");
  assert(api.prepareHumanPlayUiScenario, "Human play UI browser prep API was not exposed.");
  assert(api.prepareActionPromptOverflowScenario, "Action prompt overflow browser prep API was not exposed.");
  assert(api.prepareSkillGainVisualScenario, "Skill-gain visual browser prep API was not exposed.");
  assert(api.prepareDelayedNullifyVisualScenario, "Delayed-nullify visual browser prep API was not exposed.");
  assert(api.prepareJudgementRevealVisualScenario, "Judgement reveal visual browser prep API was not exposed.");
  assert(api.prepareRelationEventVisualScenario, "Relation-event visual browser prep API was not exposed.");
  assert(api.prepareDeathRevealVisualScenario, "Death-reveal visual browser prep API was not exposed.");
  assert(api.prepareAIDecisionTrailVisualScenario, "AI decision trail visual browser prep API was not exposed.");
  assert(api.prepareEndGameVisualScenario, "End-game visual browser prep API was not exposed.");
  assert(api.boardUiContractSummary, "Full board UI contract test API was not exposed.");
  assert(api.setupLandingContractSummary, "Setup landing UI contract test API was not exposed.");
  assert(api.matchSaveContractSummary, "Match save/resume contract test API was not exposed.");
  assert(api.prepareResumeLauncherVisualScenario, "Resume launcher visual browser prep API was not exposed.");
  assert(api.rosterSummary, "Roster summary test API was not exposed.");

  assert(indexHtml.includes("styles.css?v=265"), "index.html should reference the current stylesheet cache key.");
  assert(indexHtml.includes("game.js?v=176"), "index.html should reference the current script cache key.");
  assert(gameJs.includes('params.get("scenario") === "human-play-ui"'), "Browser verification should have a stable human play UI scenario URL.");
  assert(gameJs.includes('params.get("scenario") === "ai-decision-ui"'), "Browser verification should have a stable AI decision panel scenario URL.");
  assert(gameJs.includes('params.get("scenario") === "judgement-reveal-ui"'), "Browser verification should have a stable judgement reveal scenario URL.");
  assert(gameJs.includes('params.get("scenario") === "relation-event-ui"'), "Browser verification should have a stable rescue/nullify relation scenario URL.");
  assert(gameJs.includes('params.get("scenario") === "death-reveal-ui"'), "Browser verification should have a stable death reveal scenario URL.");
  assert(gameJs.includes('params.get("scenario") === "endgame-ui"'), "Browser verification should have a stable end-game result scenario URL.");
  assert(!indexHtml.includes('id="diagnostics"'), "Visible diagnostics panel should not be present in the game UI.");
  assert(!indexHtml.includes("diagnostics-drawer"), "Visible diagnostics drawer should not be present in the battle log panel.");
  assert(!stylesCss.includes("diagnostics-drawer"), "Stylesheet should not include the removed diagnostics drawer.");
  assert(!stylesCss.includes(".diagnostics"), "Stylesheet should not include visible diagnostics panel styles.");
  assert(!gameJs.includes("renderDiagnostics"), "Game script should not render a visible diagnostics panel.");
  assert(!gameJs.includes("diagnosticsOpen"), "Game state should not track a visible diagnostics drawer.");
  assert(gameJs.includes('document.addEventListener("mouseover", handleTooltipOver);'), "Tooltip should support mouseover fallback.");
  assert(gameJs.includes('document.addEventListener("focusin", handleTooltipOver);'), "Tooltip should support keyboard focus fallback.");
  assert(gameJs.includes("function syncNativeTooltips"), "Tooltip should sync native title fallback after render.");
  assert(gameJs.includes('setAttribute("title", node.dataset.tip)'), "Tooltip native title fallback should copy data-tip.");
  const layoutPrefs = api.layoutPreferenceSummary();
  assert(layoutPrefs.defaultInfoTab === "log", `The battle log should be the default info tab: ${JSON.stringify(layoutPrefs)}`);
  assert(layoutPrefs.sidePanelCollapsed === false, `The right panel should be open by default so battle log is visible: ${JSON.stringify(layoutPrefs)}`);
  assert(layoutPrefs.panelToggleTextWhenDefault === "收起战报", `Default panel toggle should name the player-facing battle log, not a generic panel: ${JSON.stringify(layoutPrefs)}`);
  const layoutGuardrails = {
    hidesSidePanelClutter: stylesCss.includes(".side-panel .pile-card,\n.side-panel .event-card {\n  display: none !important;"),
    sidePanelIsSingleLogRail: stylesCss.includes(".side-panel {\n  grid-template-rows: minmax(0, 1fr) !important;\n  min-height: 0;"),
    centerMatHasLockedHeight: stylesCss.includes(".board .center-mat {\n  height: clamp(162px, 24dvh, 204px);\n  min-height: 0;\n  max-height: clamp(162px, 24dvh, 204px);\n  overflow: hidden;"),
    waitMatHasLockedHeight: stylesCss.includes(".board .center-mat.event-kind-wait {\n  height: clamp(150px, 21dvh, 178px);\n  max-height: clamp(150px, 21dvh, 178px);"),
    narrowBoardReclaimsSideRail: stylesCss.includes("@media (max-width: 900px)") && stylesCss.includes(".game-screen.log-collapsed .board-wrap {\n    grid-template-columns: minmax(0, 1fr) !important;"),
    handPanelBounded: stylesCss.includes(".game-screen > .hand-panel {\n  height: clamp(196px, 26dvh, 224px);") && stylesCss.includes("max-height: 224px;") && stylesCss.includes("overflow: hidden;\n}"),
    handCardsScrollHorizontally: stylesCss.includes(".hand {\n  min-height: 0;\n  height: 100%;\n  align-items: center;\n  overflow-x: auto;\n  overflow-y: hidden;"),
    cardNamesWrapAndShrink: stylesCss.includes(".card-name {\n  min-height: 0;") && stylesCss.includes("word-break: break-word;") && stylesCss.includes(".hand .card.long-name .card-name"),
    actionBarStaysInPanel: stylesCss.includes(".action-bar:not(:empty) {\n  position: static !important;") && stylesCss.includes("max-height: 52px;"),
    actionButtonsScrollHorizontally: stylesCss.includes(".action-bar:not(:empty) .action-buttons {\n  min-width: 0;") && stylesCss.includes("overflow-x: auto;\n  overflow-y: hidden;"),
    visibleZonesStayCompact: stylesCss.includes(".board .player-zones {\n  min-height: 0;\n  gap: 1px;\n  overflow: hidden;") && stylesCss.includes(".board .zone-chip {\n  max-width: 72px;") && stylesCss.includes(".zone-chip.zone-chip-image"),
    eventMotionFeedback: stylesCss.includes("@keyframes centerEventPop") && stylesCss.includes("@keyframes eventRouteFlash") && stylesCss.includes("@keyframes eventTargetRing") && stylesCss.includes("@keyframes dangerBeat"),
    reducedMotionFallback: stylesCss.includes("@media (prefers-reduced-motion: reduce)") && stylesCss.includes("animation: none !important;"),
    coolerVisualTheme: stylesCss.includes("/* v136: cooler battle-client polish") && stylesCss.includes("--accent: #53e6d2;") && stylesCss.includes("--violet: #b99cff;"),
    promptSurfacePolish: stylesCss.includes(".board .center-mat::before") && stylesCss.includes("@keyframes eventToneSweep"),
    currentLogHasVisualStrip: stylesCss.includes(".log-section.current-log-section::before"),
    actionPromptHasAmbientLayer: stylesCss.includes(".action-bar:not(:empty)::before"),
    eventOutcomeBadges: stylesCss.includes("/* v137: event outcome badges") && stylesCss.includes(".event-outcome") && stylesCss.includes(".center-event-recovery") && stylesCss.includes(".center-event-control"),
    centerHudPolish: stylesCss.includes("/* v141: cleaner center HUD and stronger public-card popups.") && stylesCss.includes(".board .center-mat.event-kind-wait .event-stage-head small {\n  display: none;"),
    publicCardPopupPolish: stylesCss.includes(".board .center-mat.center-event-cardlist") && stylesCss.includes(".resource-card-face {\n  width: 88px;\n  height: 116px;") && stylesCss.includes(".resource-card-code") && stylesCss.includes(".resource-card-name"),
    seatFocusPolish: stylesCss.includes("/* v148: stronger seat focus layer") && stylesCss.includes(".seat-focus") && stylesCss.includes("@keyframes seatFocusBreath"),
    playerFacingTopbarTools: !indexHtml.includes('class="table-tools"') && indexHtml.includes('id="settingsOpen"') && gameJs.includes('data-settings-action="step"') && gameJs.includes('data-settings-action="autoplay"'),
    compactIdentityTokens: stylesCss.includes("/* v150: player cards use compact identity tokens") && stylesCss.includes(".board .role-note.note-rebel") && stylesCss.includes(".board .role-note.note-loyal"),
    centerSettlementLane: stylesCss.includes("/* v151: center event settlement lane") && stylesCss.includes(".cast-settlement-lane") && stylesCss.includes(".lane-card"),
    handOperationHud: stylesCss.includes("/* v152: hand-operation HUD") && stylesCss.includes(".hand-mode-mark") && stylesCss.includes(".hand-flow span.active") && gameJs.includes("hand-state-target"),
    finalTabletopSurface: stylesCss.includes("/* v153: final tabletop surface") && stylesCss.includes(".board::before") && stylesCss.includes("repeating-radial-gradient") && stylesCss.includes(".board .player::after"),
    topTableStatusHud: indexHtml.includes('id="tableStatusBar"') && stylesCss.includes("/* v154: top table status HUD") && stylesCss.includes(".status-pill") && gameJs.includes("renderTableStatusBar"),
    setupMatchSummary: indexHtml.includes('id="setupMatchSummary"') && stylesCss.includes("/* v155: setup match summary") && stylesCss.includes(".setup-summary-chip") && gameJs.includes("renderSetupMatchSummary"),
    playerSettingsModal: indexHtml.includes('id="settingsModal"') && indexHtml.includes('id="tempoQuick"') && indexHtml.includes('id="tempoSelect" class="native-hidden"') && stylesCss.includes("/* v206: player-facing table settings */") && gameJs.includes("renderSettingsPanel"),
    settingsAdvancedTools: gameJs.includes("settings-advanced-tools") && gameJs.includes("高级辅助") && stylesCss.includes("/* v218: keep helper/debug-like table controls behind an advanced disclosure in settings.") && stylesCss.includes(".settings-advanced-tools summary"),
    v219MockupPolish: stylesCss.includes("/* v219: sharper mockup-aligned table affordances") && stylesCss.includes(".table-pile.table-pile-judge") && stylesCss.includes("clip-path: polygon(52% 0%") && gameJs.includes("主公公开 · 暗身份"),
    nativeHiddenRemovedFromPlayerLayout: stylesCss.includes(".native-hidden {") && stylesCss.includes("display: none !important;"),
    setupModeSegment: indexHtml.includes('id="modeSelect" class="native-hidden"') && indexHtml.includes('id="modeSegment"') && indexHtml.includes('data-mode-value="8"') && indexHtml.includes('data-mode-value="5"') && stylesCss.includes(".setup-mode-segment") && gameJs.includes("function setSetupMode") && gameJs.includes("function renderModeSegment"),
    setupAiSegment: indexHtml.includes('id="aiMode" class="native-hidden"') && indexHtml.includes('id="aiSegment"') && indexHtml.includes('data-ai-mode="fair"') && indexHtml.includes('data-ai-mode="strategist"') && indexHtml.includes('data-ai-mode="oracle"') && stylesCss.includes(".setup-ai-segment") && gameJs.includes("function setSetupAiMode") && gameJs.includes("function renderAiSegment"),
    setupRosterSegment: indexHtml.includes('id="rosterSelect" class="native-hidden"') && indexHtml.includes('id="rosterSegment"') && indexHtml.includes('data-roster-mode="strict"') && indexHtml.includes('data-roster-mode="standard2013"') && indexHtml.includes('data-roster-mode="all"') && stylesCss.includes(".setup-roster-segment") && gameJs.includes("function setSetupRosterMode") && gameJs.includes("function renderRosterSegment"),
    passiveActionBarCopy: gameJs.includes("function passiveActionBarCopy") && gameJs.includes("观战中 ·") && gameJs.includes("你当前无需操作"),
    discoverableIdentityMarks: gameJs.includes('unknown: "标"') && gameJs.includes("function topbarRoundTitle") && gameJs.includes("function topbarActorLabel") && stylesCss.includes("/* v214: make the current turn title and personal identity marker easier to read.") && stylesCss.includes(".status-actor-pill") && stylesCss.includes(".identity-mark-menu::before"),
    battleLogToggleCopy: indexHtml.includes(">展开战报</button>") && gameJs.includes('button.textContent = collapsed ? "展开战报" : "收起战报"') && !gameJs.includes('button.textContent = collapsed ? "展开面板" : "收起面板"'),
    battleLogHeaderCopy: indexHtml.includes(">最新行动</span>") && indexHtml.includes(">放大</button>") && indexHtml.includes(">局势判断</button>") && indexHtml.includes(">技能状态</button>") && gameJs.includes('mode.textContent = state.logCollapsed') && gameJs.includes('? "已收起"') && gameJs.includes('? "还原" : "放大"'),
    rightRailMoreMenuWorks: stylesCss.includes("/* v221: make the right-rail \"more\" menu a real, player-facing dropdown.") && stylesCss.includes(".panel-advanced[open] > div") && stylesCss.includes("display: grid !important;") && stylesCss.includes(".panel-advanced[open] > div button:hover") && stylesCss.includes(".panel-tabs {\n  position: relative !important;\n  z-index: 90 !important;"),
    playerFacingAiDifficultyCopy: indexHtml.includes("<b>强敌</b>") && indexHtml.includes("<small>额外信息</small>") && gameJs.includes('oracle: "强敌挑战"') && gameJs.includes("强敌挑战：AI 有额外信息") && !indexHtml.includes("开眼"),
    v223FocusPolish: stylesCss.includes("/* v223: unify table focus, target selection and personal seat polish.") && stylesCss.includes(".player.targetable {") && stylesCss.includes(".identity-mark-menu::before") && stylesCss.includes('content: "我的判断"') && stylesCss.includes(".human-seat-portrait") && stylesCss.includes(".hand-panel.hand-state-target #actionBar.action-bar:not(:empty)") && stylesCss.includes(".hand-panel.hand-state-response #actionBar.action-bar:not(:empty)"),
    v224HumanSeatReadability: stylesCss.includes("/* v224: keep the bottom human seat readable; the action box owns next-step copy.") && stylesCss.includes("grid-template-columns: 246px fit-content(520px) minmax(360px, 1fr) !important;") && stylesCss.includes(".human-seat-copy {\n    min-width: max-content !important;") && stylesCss.includes(".hand-head #handMode.hand-mode {\n    display: none !important;"),
    v225ActionTaskPanel: gameJs.includes("function renderActionHintTask") && gameJs.includes("action-hint-task") && gameJs.includes("actionPhaseEyebrow") && stylesCss.includes("/* v225: action prompts read as compact task panels") && stylesCss.includes(".action-hint-task strong") && stylesCss.includes(".action-task-target .action-eyebrow"),
    v226BattleLogSummary: gameJs.includes("function logSectionSummary") && gameJs.includes("log-detail-redundant") && gameJs.includes("log-section-meta") && stylesCss.includes("/* v226: battle log sections summarize actions") && stylesCss.includes(".log-section-meta") && stylesCss.includes(".log-route-muted"),
    v227ReviewPolish: stylesCss.includes("/* v227: reinforce the mockup details called out in the June 20 UI review.") && stylesCss.includes("width: 104px !important;") && stylesCss.includes(".table-status-bar .status-phase-step::before") && stylesCss.includes(".player-head .avatar-row:hover + .role-stack .identity-mark-menu") && stylesCss.includes(".log-name-rebel") && stylesCss.includes("min-height: 44px !important;"),
    v228MobileActionClickFix: stylesCss.includes("/* v228: keep mobile action buttons physically clickable") && stylesCss.includes("@media (max-width: 900px)") && stylesCss.includes("#cancelTargets") && stylesCss.includes("height: 30px !important;") && stylesCss.includes("z-index: 98 !important;"),
    v229EndGameSettlement: stylesCss.includes("/* v229/v265: end-game result should feel like a game settlement screen") && stylesCss.includes(".endgame-actions {\n  position: sticky !important;") && stylesCss.includes("box-sizing: border-box !important;") && stylesCss.includes(".endgame-modal {\n    padding: 10px !important;") && stylesCss.includes("grid-template-columns: repeat(5, minmax(0, 1fr)) !important;") && gameJs.includes("function prepareEndGameVisualScenario") && gameJs.includes("actionCount: document.querySelectorAll"),
    v230MobileLauncherAndTargetBadges: stylesCss.includes("/* v230: mobile target markers should read as seat badges") && stylesCss.includes("body:not(.in-game) .setup-screen") && stylesCss.includes("height: 100dvh !important;") && stylesCss.includes("-webkit-overflow-scrolling: touch !important;") && stylesCss.includes(".board .player .marker-target") && stylesCss.includes("max-width: 62px !important;") && visualCheckJs.includes("renderSetupLanding") && visualCheckJs.includes("mobile event marker is too wide"),
    v231ResumeLauncherPath: stylesCss.includes("/* v231: saved-match resume should feel like a real launcher path") && stylesCss.includes("#continueGame.is-ready::before") && gameJs.includes("function prepareResumeLauncherVisualScenario") && gameJs.includes("dataset.resumeState") && visualCheckJs.includes("renderResumeSetupLanding"),
    v232SettingsModalGuard: stylesCss.includes("/* v232: settings modal stays player-facing") && stylesCss.includes(".settings-advanced-tools:not([open]) .settings-actions") && gameJs.includes('state.eventStepMode ? "单步中" : "展开"') && visualCheckJs.includes("renderSettingsScenario") && visualCheckJs.includes("advanced helper actions are visible by default"),
    v235ActionTaskCard: stylesCss.includes("/* v235: bottom operation prompt reads like a compact game task card.") && stylesCss.includes(".action-task-main") && stylesCss.includes(".action-task-meta") && gameJs.includes("action-task-dot") && gameJs.includes("meta: selectedCard ? \"已选牌\" : \"出牌阶段\""),
    v236MassTrickPolish: gameJs.includes("function massTrickTargetsInOrder") && gameJs.includes("桃园结义即将对") && indexHtml.includes('<strong id="tempoLabel">正常</strong>') && stylesCss.includes("/* v236: tighter player-facing table information after flow-order review.") && stylesCss.includes(".zone-state-chain") && stylesCss.includes(".log-message {\n  grid-template-columns: 14px minmax(0, 1fr) !important;"),
    v237HumanSeatBadgeState: stylesCss.includes("/* v237: make the bottom personal seat badge follow the real hand/action state.") && stylesCss.includes(".game-screen > .hand-panel > .hand-head::before {\n    content: \"\" !important;") && stylesCss.includes(".game-screen > .hand-panel.hand-state-play > .hand-head::before") && stylesCss.includes('content: "出牌中" !important;'),
    v238CompactTaskCard: stylesCss.includes("/* v238: keep the bottom task card readable while leaving more room for hand cards.") && stylesCss.includes("grid-template-columns: minmax(0, 1fr) max-content !important;") && stylesCss.includes(".action-hint-task em {\n    display: none !important;") && stylesCss.includes("padding: 0 14px !important;"),
    v239TopbarTurnRoute: gameJs.includes("function renderTopbarTurnRoute") && gameJs.includes("status-route-pill") && stylesCss.includes("/* v239: make the visible turn route obvious without crowding the table.") && stylesCss.includes(".table-status-bar .status-route-pill"),
    v254CounterClockwiseSeatOrder: gameJs.includes('label: "逆时针"') && gameJs.includes("下家在你的右手边") && stylesCss.includes("/* v254: player-perspective counter-clockwise seating. The next player starts on the human player's right.") && stylesCss.includes(".board.players-5 .p1 {\n    left: auto !important;\n    right: 5% !important;\n    top: auto !important;\n    bottom: 20% !important;") && stylesCss.includes(".board.players-5 .p4 {\n    left: 5% !important;\n    right: auto !important;\n    top: auto !important;\n    bottom: 20% !important;"),
    v241RelationCaption: gameJs.includes("function renderEventRelationCaption") && stylesCss.includes("/* v241: relation events should read as") && stylesCss.includes(".visual-relation-caption"),
    v242DeathRevealVisual: gameJs.includes("function renderDeathRevealVisual") && gameJs.includes("function eventDeathRoleInfo") && stylesCss.includes(".visual-death-reveal") && stylesCss.includes(".visual-death-role-rebel"),
    v244PublicGainVisual: stylesCss.includes("/* v244: public gained cards should read as cards flowing into a player's hand") && stylesCss.includes(".visual-resource-gain .resource-card-stack::after") && stylesCss.includes('content: "收入手牌"'),
    v247EndGameCareerProgress: gameJs.includes("endgame-career-callout") && gameJs.includes("生涯进度") && gameJs.includes("下个目标") && stylesCss.includes("/* v247: end-game settlement should nudge replay") && stylesCss.includes(".endgame-career-grid"),
    v249ReadableSeatZones: stylesCss.includes("/* v249: make public seat state readable without hover hunting.") && stylesCss.includes(".board .zone-equip") && stylesCss.includes(".board .zone-judge") && stylesCss.includes(".board .zone-state-chain") && stylesCss.includes("max-height: 44px !important;"),
    v250DenseBattleLog: stylesCss.includes("/* v250: denser battle log with the same scan hierarchy.") && stylesCss.includes(".log-message {\n  grid-template-columns: 14px minmax(0, 1fr) !important;\n  gap: 6px !important;\n  padding: 0 0 5px !important;") && stylesCss.includes("-webkit-line-clamp: 2 !important;"),
    v251HumanSeatStates: gameJs.includes("function renderHumanSeatStats") && stylesCss.includes("/* v251: the bottom personal seat shows the player's own public states.") && stylesCss.includes(".human-stats .human-stat-judge") && stylesCss.includes(".human-stats .human-stat-chain"),
    v252PromptAndSeatDecrowding: gameJs.includes("action-task-eyebrow-row") && gameJs.includes("skill-more") && stylesCss.includes("/* v252: de-crowd the two core decision surfaces: action prompt and player seats.") && stylesCss.includes("min-height: 120px !important;") && stylesCss.includes("flex-wrap: wrap !important;") && stylesCss.includes("width: 176px !important;") && stylesCss.includes(".board .identity-mark-menu"),
    v255FloatingIdentityAndSelfSkillHelp: indexHtml.includes('id="identityPopover"') && gameJs.includes("function setupIdentityPopover") && gameJs.includes("function positionFloatingLayer") && gameJs.includes("data-note-trigger-id") && gameJs.includes("function playerInfoTooltipText") && gameJs.includes("human-skill-trigger") && stylesCss.includes("/* v255: identity marking is a real floating popover") && stylesCss.includes("--z-popover: 720;") && stylesCss.includes(".player .identity-mark-menu,\n.board .identity-mark-menu {\n  display: none !important;") && visualCheckJs.includes("renderFloatingUiScenario") && visualCheckJs.includes("human-skill-tooltip"),
    v256RightRailTabCopy: stylesCss.includes("/* v256: keep the right-rail tabs as navigation only") && stylesCss.includes(".panel-tabs::after {\n  content: \"\" !important;\n  display: none !important;") && gameJs.includes('? "放大 · 最新在上"') && gameJs.includes(': "最新在上"'),
    v257BoardContractHumanPanel: gameJs.includes("const humanPanelText") && gameJs.includes("hasHumanPanelSeat") && visualCheckJs.includes("contract board left personal seat is blank or incomplete"),
    v258NoDuplicatedHumanSeatName: !gameJs.includes("portraitDisplayName(human.general.name)") && visualCheckJs.includes("bottom personal seat repeats the general name"),
    v259LiveSpotlightLogFallback: gameJs.includes("function logEntriesForDisplay") && gameJs.includes("function liveSpotlightLogEntry") && visualCheckJs.includes("contract board battle log should show the live spotlight event"),
    v260ActionPromptOverflowGuard: gameJs.includes("function prepareActionPromptOverflowScenario") && visualCheckJs.includes("overflow prompt buttons overlap task copy") && stylesCss.includes("/* v260: multi-option action prompts") && stylesCss.includes("/* v263: final cascade guard for pending prompts")
  };
  assert(layoutGuardrails.hidesSidePanelClutter, `Right rail should hide pile/current-event clutter so battle log stays readable: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.sidePanelIsSingleLogRail, `Right rail should reserve its height for the tabbed log/AI/coverage/career panel: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.centerMatHasLockedHeight, `Center event panel should have a bounded height to prevent random growth: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.waitMatHasLockedHeight, `Waiting prompt center event should also have a bounded height: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.narrowBoardReclaimsSideRail, `Narrow viewport should collapse to a single board column after hiding the side rail: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.handPanelBounded, `Hand panel should have a bounded viewport-relative height: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.handCardsScrollHorizontally, `Hand cards should scroll horizontally instead of covering the board: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.cardNamesWrapAndShrink, `Card names should wrap and long names should shrink for readability: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.actionBarStaysInPanel, `Action bar should stay inside the hand panel instead of fixed/offscreen: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.actionButtonsScrollHorizontally, `Action buttons should scroll horizontally when cramped: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.visibleZonesStayCompact, `Equipment/judgement chips should remain visible but compact on player cards: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.eventMotionFeedback, `Center events should have lightweight motion feedback for action readability: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.reducedMotionFallback, `Event motion should respect reduced-motion preferences: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.coolerVisualTheme, `The visual theme should stay cooler and less brass/yellow dominated: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.promptSurfacePolish, `Center prompts should have a polished ambient layer without changing geometry: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.currentLogHasVisualStrip, `The current battle-log section should have a strong visual anchor: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.actionPromptHasAmbientLayer, `Action prompts should read as active controls, not flat text: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.eventOutcomeBadges, `Important events should have compact outcome badges and mood-specific surfaces: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.centerHudPolish, `Center wait HUD should stay clean and avoid repeated labels: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.publicCardPopupPolish, `Public discard/dismantle popups should stay visually prominent: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.seatFocusPolish, `Current actor and target seats should have a strong game-like focus layer: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.playerFacingTopbarTools, `Diagnostic-style helper controls should move out of the default topbar and into player-facing settings: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.compactIdentityTokens, `Player cards should style manual identity reads as compact colored game tokens: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.centerSettlementLane, `Center events should include a table-like settlement lane instead of only text/card blocks: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.handOperationHud, `Hand prompts should render as a game operation HUD with state styling and step flow: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.finalTabletopSurface, `Board background should keep the final tabletop surface instead of reverting to a debug grid: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.topTableStatusHud, `Topbar should include a player-facing table status HUD for current actor, phase, and next seat: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.setupMatchSummary, `Setup screen should show a player-facing match summary strip instead of only form controls: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.playerSettingsModal, `Topbar tempo and helper controls should be exposed through a polished player settings modal, not a visible native form control: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.settingsAdvancedTools, `Debug-like helper controls should stay behind an advanced disclosure in settings: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.nativeHiddenRemovedFromPlayerLayout, `Storage-only native selects should not leak into the player-facing launcher layout/text: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.setupModeSegment, `Setup mode should use a segmented game control backed by a hidden native state select: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.setupAiSegment, `Setup AI difficulty should use a segmented player control backed by a hidden native state select: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.setupRosterSegment, `Setup roster pack should use a segmented player control backed by a hidden native state select: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.passiveActionBarCopy, `Passive wait prompt should be player-facing instead of debug-like repeated status text: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.discoverableIdentityMarks, `Current turn title and manual identity marks should stay discoverable in the player UI: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.battleLogToggleCopy, `Topbar log toggle should use player-facing battle-log copy instead of generic panel copy: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.battleLogHeaderCopy, `Battle log header and secondary tabs should read like player-facing game UI, not tooling copy: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.rightRailMoreMenuWorks, `Right rail more menu should be a visible dropdown instead of hidden inert controls: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.playerFacingAiDifficultyCopy, `AI difficulty labels should read like player-facing game difficulty, not debug/cheat wording: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v223FocusPolish, `Table focus polish should keep current actor, target choice, identity marks, and the human seat visually unified: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v224HumanSeatReadability, `Bottom human seat should stay readable and not compete with next-step action copy: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v225ActionTaskPanel, `Bottom action prompts should render as clear task panels, not plain status text: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v226BattleLogSummary, `Battle log sections should summarize actions and suppress repeated filler text: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v227ReviewPolish, `June 20 UI review details should stay visible: larger piles, stronger phase rail, avatar identity marks, highlighted log names, and polished action buttons: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v228MobileActionClickFix, `Mobile target/discard action buttons should stay physically clickable after desktop polish: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v229EndGameSettlement, `End-game settlement should stay compact, verified, and keep next-action buttons visible: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v230MobileLauncherAndTargetBadges, `Mobile launcher should scroll independently and target markers should stay as compact seat badges: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v231ResumeLauncherPath, `Saved-match resume should be a verified launcher path with a visible ready state: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v232SettingsModalGuard, `Settings modal should keep helper tools collapsed by default and stay covered by visual regression: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v235ActionTaskCard, `Bottom action prompts should read as compact player-facing task cards with visible progress metadata: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v236MassTrickPolish, `Per-target mass-trick prompts, normal default speed, status chips and compact log polish should stay protected: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v237HumanSeatBadgeState, `Bottom personal seat badge should be state-driven, not hardcoded as actioning while idle: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v238CompactTaskCard, `Bottom task card should stay compact and readable so hand cards remain visible: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v239TopbarTurnRoute, `Topbar should keep a visible current-to-next turn route so table order is easy to follow: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v254CounterClockwiseSeatOrder, `Seat order and turn flow should keep the next player on the human player's right: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v241RelationCaption, `Rescue/nullify center events should keep a clear who-affected-whom caption: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v242DeathRevealVisual, `Death center events should keep an explicit revealed-identity visual: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v244PublicGainVisual, `Public gain card popups should have a distinct gained-card visual treatment: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v247EndGameCareerProgress, `End-game settlement should show career progress and next milestone as a replay hook: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v249ReadableSeatZones, `Public equipment, judgement, and special states should be readable on player seats without hover hunting: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v250DenseBattleLog, `Battle log should be dense enough to scan without losing hierarchy: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v251HumanSeatStates, `Bottom personal seat should show the player's own equipment, judgement, and special states: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v252PromptAndSeatDecrowding, `Action prompt and player seats should have enough structure, spacing, and wrapped controls to avoid cramped UI: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v255FloatingIdentityAndSelfSkillHelp, `Identity marking should be a top-level popover and the bottom self seat should expose shared skill help: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v256RightRailTabCopy, `Right-rail tabs should not show clipped ordering copy; the battle-log header should own that state: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v257BoardContractHumanPanel, `Board visual contracts should render and verify the bottom personal seat, not leave a blank frame: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v258NoDuplicatedHumanSeatName, `Bottom personal seat should not repeat the general name in both portrait and label: ${JSON.stringify(layoutGuardrails)}`);
  assert(layoutGuardrails.v219MockupPolish, `Latest mockup polish should keep piles, magatama HP, and player-facing setup info explicit: ${JSON.stringify(layoutGuardrails)}`);
  assert(indexHtml.includes('id="endGameModal"') && stylesCss.includes("/* v204: polished end-game result layer */") && gameJs.includes("renderEndGameModal"), "Game should include a polished end-game result modal connected to real state.");
  const fairness = api.fairnessContractSummary();
  assert(fairness.fairDodgeHeavy === fairness.fairDodgeLight, `Fair AI should estimate hidden dodge count from public hand count/reads, not exact hidden cards: ${JSON.stringify(fairness)}`);
  assert(fairness.fairHeartHeavy === fairness.fairHeartLight, `Fair AI should estimate hidden suit presence without reading exact hand suits: ${JSON.stringify(fairness)}`);
  assert(fairness.fairPindianHigh === fairness.fairPindianLow, `Fair AI should estimate hidden pindian strength without reading exact target ranks: ${JSON.stringify(fairness)}`);
  assert(fairness.oracleDodgeHeavy > fairness.oracleDodgeLight, `Oracle AI should be the only mode allowed to read exact hidden response cards: ${JSON.stringify(fairness)}`);
  assert(fairness.oracleHeartHeavy > fairness.oracleHeartLight, `Oracle AI should be the only mode allowed to read exact hidden suit presence: ${JSON.stringify(fairness)}`);
  assert(fairness.oraclePindianHigh < fairness.oraclePindianLow, `Oracle AI should see exact pindian rank differences: ${JSON.stringify(fairness)}`);
  assert(fairness.fairSelfDodge > fairness.fairDodgeHeavy, `A player should still know its own exact response cards: ${JSON.stringify(fairness)}`);
  assert(fairness.fairnessAuditHtml.includes("公平边界") && fairness.fairnessAuditHtml.includes("手牌只按数量/响应读数估计"), `AI panel should explain fair hidden-hand boundaries: ${fairness.fairnessAuditHtml}`);
  for (const id of ["startGame", "continueGame", "quickSim", "tempoQuick", "settingsOpen", "newGame", "logTab", "readsTab", "coverageTab", "careerTab"]) {
    const buttonPattern = new RegExp(`id="${id}"[^>]*data-tip=`);
    assert(buttonPattern.test(indexHtml), `${id} should have a hover tooltip.`);
  }
  assert(stylesCss.includes(".board.players-8 .p1,\n  .board:not(.players-5):not(.players-3) .p1 {\n    left: auto !important;\n    right: 2.5% !important;"), "8-player seat p1 should start the visible counter-clockwise route on the right-lower side.");
  assert(stylesCss.includes(".board.players-5 .p1 {\n    left: auto !important;\n    right: 5% !important;\n    top: auto !important;\n    bottom: 20% !important;"), "5-player seat p1 should start the visible counter-clockwise route on the right-lower side.");

  const cardImages = api.cardImageSummary();
  assert(cardImages.count >= 25, `Expected at least 25 local card image mappings, got ${cardImages.count}.`);
  assert(cardImages.officialCount >= 25, `Expected at least 25 official local card image mappings, got ${cardImages.officialCount}.`);
  for (const item of cardImages.mapped) {
    assert(item.url.startsWith("assets/cards/official/"), `${item.name} should use the official local card image directory.`);
    assert(fs.existsSync(path.join(root, item.url)), `Mapped card image file is missing for ${item.name}: ${item.url}`);
  }
  for (const item of cardImages.required) {
    assert(item.url && item.url.startsWith("assets/cards/official/"), `Missing official local card image mapping for ${item.name}.`);
    assert(fs.existsSync(path.join(root, item.url)), `Mapped card image file is missing for ${item.name}: ${item.url}`);
  }

  const parserCases = [
    {
      label: "damage with source and target",
      text: "关羽 对 你(诸葛亮) 造成 1 点普通伤害，你(诸葛亮) 体力 0/3。",
      expected: { kind: "damage", actor: "关羽", target: "你(诸葛亮)", title: "1点普通伤害", damage: "你(诸葛亮)" }
    },
    {
      label: "dying with source",
      text: "你(诸葛亮) 濒死，来源 关羽，需要 1 个桃或可用的自救牌。",
      expected: { kind: "dying", actor: "关羽", target: "你(诸葛亮)", title: "濒死", damage: "你(诸葛亮)" }
    },
    {
      label: "peach rescue",
      text: "贾诩 使用桃，救援 大乔。",
      expected: { kind: "heal", actor: "贾诩", target: "大乔", title: "桃", detail: "濒死救援" }
    },
    {
      label: "wine self rescue",
      text: "郭嘉 使用酒，自救。",
      expected: { kind: "heal", actor: "郭嘉", target: "郭嘉", title: "酒", detail: "濒死自救" }
    },
    {
      label: "death with killer",
      text: "黄月英 被 于吉 击杀，身份为 主公。",
      expected: { kind: "death", actor: "于吉", target: "黄月英", title: "角色阵亡", detail: "身份：主公", damage: "黄月英" }
    },
    {
      label: "death without killer",
      text: "吕蒙 阵亡，身份为 内奸。",
      expected: { kind: "death", actor: "吕蒙", target: "吕蒙", title: "角色阵亡", detail: "身份：内奸", damage: "吕蒙" }
    },
    {
      label: "identity game start",
      text: "身份局开始。主公是赵云。",
      expected: { kind: "system", actor: "系统", target: "赵云", title: "身份局开始", detail: "主公是赵云" }
    },
    {
      label: "miss response",
      text: "张辽 未响应闪，来源 关羽。",
      expected: { kind: "miss", actor: "张辽", target: "关羽", title: "未响应闪", detail: "来源：关羽" }
    },
    {
      label: "nullify response",
      text: "诸葛亮 使用无懈可击，抵消 南蛮入侵。",
      expected: { kind: "response", actor: "诸葛亮", target: "南蛮入侵", title: "无懈可击", detail: "抵消" }
    },
    {
      label: "delayed trick nullified during judgement",
      text: "曹操 判定阶段结算 乐不思蜀，被无懈可击抵消。",
      expected: { kind: "judge", actor: "曹操", target: "曹操", title: "乐不思蜀被抵消", detail: "判定阶段 · 无懈可击抵消" }
    }
  ];
  for (const testCase of parserCases) {
    assertEvent(api.parseLogEvent(testCase.text), testCase.expected, testCase.label);
  }

  const turnFlows = [];
  for (const mode of ["5", "8"]) {
    const flow = api.turnFlowSummary(mode);
    turnFlows.push(flow);
    assert(flow.step === 1, `Mode ${mode}: TURN_FLOW.step should remain 1 while the visual table maps the next seat to the right hand.`);
    assert(flow.label === "逆时针", `Mode ${mode}: flow label should be 逆时针.`);
    assert(flow.humanNextHint.includes("右手边") && flow.humanNextHint.includes("逆时针"), `Mode ${mode}: next-player hint should mention right-hand counter-clockwise table flow.`);
    assert(flow.humanSeat === 0, `Mode ${mode}: human player should be seat 0.`);
    assert(flow.allAliveNext === 1 && flow.allAliveNextSeat === 1, `Mode ${mode}: all-alive next seat from player should be the right-hand next seat.`);
    assert(flow.skipDeadNext === 2 && flow.skipDeadNextSeat === 2, `Mode ${mode}: dead seat 1 should advance to the next living seat on the same visual route.`);
    const expectedPath = "0,1,2,3";
    assert(flow.path.map((item) => item.seat).join(",") === expectedPath, `Mode ${mode}: visible turn path should begin ${expectedPath}.`);
  }

  const tooltips = api.tooltipContractSummary();
  for (const item of tooltips.cardTooltips) {
    assert(/类型：/.test(item.text), `${item.name} tooltip should include card type.`);
    assert(/时机：/.test(item.text), `${item.name} tooltip should include timing.`);
    assert(/目标：/.test(item.text), `${item.name} tooltip should include target rules.`);
    assert(/效果：/.test(item.text), `${item.name} tooltip should include effect.`);
  }
  assert(tooltips.cardTooltips.find((item) => item.name === "乐不思蜀")?.text.includes("判定阶段结算前可被无懈抵消"), "Delayed trick tooltip should explain nullify timing.");
  assert(tooltips.cardTooltips.find((item) => item.name === "白银狮子")?.text.includes("失去装备区里的白银狮子后回复"), "Silver Lion tooltip should explain lose-equipment heal.");
  for (const item of tooltips.harvestChoiceTooltips) {
    assert(item.text.startsWith("五谷丰登可选牌"), `${item.label} harvest choice tooltip should identify the choice context.`);
    assert(/类型：/.test(item.text), `${item.label} harvest choice tooltip should include card type.`);
    assert(/时机：/.test(item.text), `${item.label} harvest choice tooltip should include timing.`);
    assert(/目标：/.test(item.text), `${item.label} harvest choice tooltip should include target rules.`);
    assert(/效果：/.test(item.text), `${item.label} harvest choice tooltip should include effect.`);
  }
  for (const item of tooltips.skillTooltips) {
    assert(/：/.test(item.text), `${item.skill} skill tooltip should include a rule sentence.`);
    assert(/实现：/.test(item.text), `${item.skill} skill tooltip should include implementation coverage.`);
    assert(/完整|简化可玩|关键缺失/.test(item.text), `${item.skill} skill tooltip should use explicit coverage labels.`);
  }
  assert(tooltips.skillTooltips.find((item) => item.skill === "haoshi")?.text.includes("实现：完整"), `好施 tooltip should reflect its strict implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "haoshi")?.text.includes("手牌数大于 5") && tooltips.skillTooltips.find((item) => item.skill === "haoshi")?.text.includes("一半的手牌"), `好施 tooltip should preserve the strict hand-count/half-gift rule: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "rende")?.text.includes("实现：完整"), `仁德 tooltip should reflect its strict implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "rende")?.text.includes("其他角色") && tooltips.skillTooltips.find((item) => item.skill === "rende")?.text.includes("首次累计达到两张"), `仁德 tooltip should preserve the other-target/cumulative-heal rule: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "qingnang")?.text.includes("实现：完整"), `青囊 tooltip should reflect its strict implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "qingnang")?.text.includes("限一次") && tooltips.skillTooltips.find((item) => item.skill === "qingnang")?.text.includes("已受伤角色"), `青囊 tooltip should preserve the once-per-phase wounded-target rule: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "jieyin")?.text.includes("实现：完整"), `结姻 tooltip should reflect its strict implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "jieyin")?.text.includes("限一次") && tooltips.skillTooltips.find((item) => item.skill === "jieyin")?.text.includes("已受伤男性其他角色"), `结姻 tooltip should preserve the once-per-phase wounded-male-other-target rule: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "ganglie")?.text.includes("实现：完整"), `刚烈 tooltip should reflect its strict implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "ganglie")?.text.includes("红桃") && tooltips.skillTooltips.find((item) => item.skill === "ganglie")?.text.includes("弃两张手牌"), `刚烈 tooltip should preserve the heart-judgement/source-choice rule: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "lijian")?.text.includes("实现：完整"), `离间 tooltip should reflect its equipment-aware implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "lijian")?.text.includes("弃置一张牌") && tooltips.skillTooltips.find((item) => item.skill === "lijian")?.text.includes("两名男性角色"), `离间 tooltip should preserve the one-card/two-male-target rule: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "guhuo")?.text.includes("实现：完整"), `蛊惑 tooltip should reflect its challenge-resolution coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "guhuo")?.text.includes("红桃真牌继续生效") && tooltips.skillTooltips.find((item) => item.skill === "guhuo")?.text.includes("假牌令质疑者各摸一张牌"), `蛊惑 tooltip should preserve the challenged true/false and heart-continuation rules: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "qiangxi")?.text.includes("实现：完整"), `强袭 tooltip should reflect its cost-choice implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "qiangxi")?.text.includes("失去 1 点体力") && tooltips.skillTooltips.find((item) => item.skill === "qiangxi")?.text.includes("弃置一张武器牌"), `强袭 tooltip should preserve the hp-or-weapon cost choice: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "dimeng")?.text.includes("实现：完整"), `缔盟 tooltip should reflect its strict implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "dimeng")?.text.includes("手牌数的差") && tooltips.skillTooltips.find((item) => item.skill === "dimeng")?.text.includes("交换手牌"), `缔盟 tooltip should preserve the strict discard-cost/swap rule: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "leiji")?.text.includes("实现：完整"), `雷击 tooltip should reflect its strict implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "leiji")?.text.includes("黑桃") && tooltips.skillTooltips.find((item) => item.skill === "leiji")?.text.includes("梅花") && tooltips.skillTooltips.find((item) => item.skill === "leiji")?.text.includes("雷伤"), `雷击 tooltip should preserve the spade/club thunder judgement rule: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "guidao")?.text.includes("实现：完整"), `鬼道 tooltip should reflect its judgement-rewrite coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "guidao")?.text.includes("黑色牌") && tooltips.skillTooltips.find((item) => item.skill === "guidao")?.text.includes("替换判定"), `鬼道 tooltip should preserve the black-card judgement rewrite rule: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "zhiheng")?.text.includes("实现：完整"), `制衡 tooltip should reflect its equipment-aware implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "zhiheng")?.text.includes("手牌或装备区"), `制衡 tooltip should explain that equipment-zone cards can be discarded too: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "guose")?.text.includes("实现：完整"), `国色 tooltip should reflect its delayed-trick implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "guose")?.text.includes("方片牌") && tooltips.skillTooltips.find((item) => item.skill === "guose")?.text.includes("乐不思蜀"), `国色 tooltip should preserve the diamond-as-Lebu rule: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "fanjian")?.text.includes("实现：完整"), `反间 tooltip should reflect its strict implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "fanjian")?.text.includes("选择一种花色") && tooltips.skillTooltips.find((item) => item.skill === "fanjian")?.text.includes("获得你一张手牌"), `反间 tooltip should preserve the target-guess/exact-card rule: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "tieji")?.text.includes("实现：完整"), `铁骑 tooltip should reflect its strict implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "tieji")?.text.includes("红色") && tooltips.skillTooltips.find((item) => item.skill === "tieji")?.text.includes("不能使用闪"), `铁骑 tooltip should preserve the red-judgement/no-dodge rule: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "liuli")?.text.includes("实现：完整"), `流离 tooltip should reflect its strict implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "liuli")?.text.includes("攻击范围") && tooltips.skillTooltips.find((item) => item.skill === "liuli")?.text.includes("不能是此杀的使用者"), `流离 tooltip should preserve the legal redirect target rule: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "liegong")?.text.includes("实现：完整"), `烈弓 tooltip should reflect its strict implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "liegong")?.text.includes("手牌数") && tooltips.skillTooltips.find((item) => item.skill === "liegong")?.text.includes("攻击范围") && tooltips.skillTooltips.find((item) => item.skill === "liegong")?.text.includes("不能使用闪"), `烈弓 tooltip should preserve both hand-count trigger conditions and the no-dodge effect: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "kuanggu")?.text.includes("实现：完整"), `狂骨 tooltip should reflect its strict implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "kuanggu")?.text.includes("距离 1") && tooltips.skillTooltips.find((item) => item.skill === "kuanggu")?.text.includes("回复 1 点体力"), `狂骨 tooltip should preserve the distance-1 per-damage recovery rule: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "jiuchi")?.text.includes("实现：完整"), `酒池 tooltip should reflect its strict implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "jiuchi")?.text.includes("黑桃牌") && tooltips.skillTooltips.find((item) => item.skill === "jiuchi")?.text.includes("酒"), `酒池 tooltip should preserve the spade-as-wine rule: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "roulin")?.text.includes("实现：完整"), `肉林 tooltip should reflect its strict implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "roulin")?.text.includes("女性角色") && tooltips.skillTooltips.find((item) => item.skill === "roulin")?.text.includes("额外响应"), `肉林 tooltip should preserve the female Slash extra-dodge rule: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "wansha")?.text.includes("实现：完整"), `完杀 tooltip should reflect its strict implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "wansha")?.text.includes("濒死") && tooltips.skillTooltips.find((item) => item.skill === "wansha")?.text.includes("求桃受限"), `完杀 tooltip should explain the restricted dying rescue window: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "jiuyuan")?.text.includes("实现：完整"), `救援 tooltip should reflect its strict implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "jiuyuan")?.text.includes("吴势力") && tooltips.skillTooltips.find((item) => item.skill === "jiuyuan")?.text.includes("额外回复"), `救援 tooltip should preserve the Wu rescuer extra-recovery rule: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "kurou")?.text.includes("实现：完整"), `苦肉 tooltip should reflect its strict implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "kurou")?.text.includes("失去 1 点体力") && tooltips.skillTooltips.find((item) => item.skill === "kurou")?.text.includes("摸两张牌"), `苦肉 tooltip should preserve the HP-loss then draw-two rule: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "luoyi")?.text.includes("实现：完整"), `裸衣 tooltip should reflect its strict implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "luoyi")?.text.includes("杀") && tooltips.skillTooltips.find((item) => item.skill === "luoyi")?.text.includes("决斗") && tooltips.skillTooltips.find((item) => item.skill === "luoyi")?.text.includes("+1"), `裸衣 tooltip should preserve the Slash/Duel damage bonus rule: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "mengjin")?.text.includes("实现：完整"), `猛进 tooltip should reflect its strict implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "mengjin")?.text.includes("杀被闪避") && tooltips.skillTooltips.find((item) => item.skill === "mengjin")?.text.includes("弃置目标一张牌"), `猛进 tooltip should preserve the post-dodge dismantle rule: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "shensu")?.text.includes("实现：完整"), `神速 tooltip should reflect its strict implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "shensu")?.text.includes("跳过判定阶段和摸牌阶段") && tooltips.skillTooltips.find((item) => item.skill === "shensu")?.text.includes("弃置一张装备") && tooltips.skillTooltips.find((item) => item.skill === "shensu")?.text.includes("无距离限制"), `神速 tooltip should explain both stage-skipping Slash modes: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "xueyi")?.text.includes("实现：完整"), `血裔 tooltip should reflect its strict implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "xueyi")?.text.includes("其他群势力") && tooltips.skillTooltips.find((item) => item.skill === "xueyi")?.text.includes("手牌上限 +2"), `血裔 tooltip should preserve the Qun hand-limit rule: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "jushou")?.text.includes("实现：完整"), `据守 tooltip should reflect its strict implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "jushou")?.text.includes("摸三张") && tooltips.skillTooltips.find((item) => item.skill === "jushou")?.text.includes("跳过整个回合"), `据守 tooltip should preserve the draw/flip/skip-turn rule: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "fangzhu")?.text.includes("实现：完整"), `放逐 tooltip should reflect its strict implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "fangzhu")?.text.includes("摸X张牌") && tooltips.skillTooltips.find((item) => item.skill === "fangzhu")?.text.includes("翻面"), `放逐 tooltip should preserve draw-by-lost-HP and flip rules: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "songwei")?.text.includes("实现：完整"), `颂威 tooltip should reflect its strict implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "songwei")?.text.includes("魏势力") && tooltips.skillTooltips.find((item) => item.skill === "songwei")?.text.includes("黑色判定") && tooltips.skillTooltips.find((item) => item.skill === "songwei")?.text.includes("摸一张牌"), `颂威 tooltip should preserve Wei black-judgement lord draw rule: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "zhiba")?.text.includes("实现：完整"), `制霸 tooltip should reflect its strict implementation coverage: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.skillTooltips.find((item) => item.skill === "zhiba")?.text.includes("拼点") && tooltips.skillTooltips.find((item) => item.skill === "zhiba")?.text.includes("没赢") && tooltips.skillTooltips.find((item) => item.skill === "zhiba")?.text.includes("两张拼点牌"), `制霸 tooltip should preserve pindian and card-gain rules: ${JSON.stringify(tooltips.skillTooltips)}`);
  assert(tooltips.statusSkillTooltips.some((item) => item.source === "extra" && item.text.includes("来源：额外获得")), `Extra skill tooltip should explain that it was newly gained: ${JSON.stringify(tooltips.statusSkillTooltips)}`);
  assert(tooltips.statusSkillTooltips.some((item) => item.source === "temp" && item.text.includes("来源：临时技能")), `Temporary skill tooltip should explain that it is temporary: ${JSON.stringify(tooltips.statusSkillTooltips)}`);
  assert(tooltips.statusSkillTooltips.some((item) => item.disabled && item.text.includes("状态：已失效")), `Disabled skill tooltip should explain that it cannot currently be used: ${JSON.stringify(tooltips.statusSkillTooltips)}`);
  assert(tooltips.statusSkillTooltips.every((item) => item.text.includes("实现：")), `Status skill tooltips should include implementation coverage: ${JSON.stringify(tooltips.statusSkillTooltips)}`);
  assert(tooltips.limitedSkillTooltips.some((item) => item.skill === "luanwu" && item.spent && item.text.includes("限定技") && item.text.includes("本局不能再次发动")), `Spent limited skill tooltip should explain one-use status: ${JSON.stringify(tooltips.limitedSkillTooltips)}`);
  assert(tooltips.playerHtmlContracts.hasLimitedSkillClass && tooltips.playerHtmlContracts.hasSpentSkillClass && tooltips.playerHtmlContracts.hasSpentLimitedBadge, `Player cards should visually mark limited and spent limited skills: ${JSON.stringify(tooltips.playerHtmlContracts)}`);
  for (const item of tooltips.actionTooltips) {
    assert(item.text.split("\n").length >= 2, `${item.label} action tooltip should include details.`);
  }
  assert(tooltips.actionTooltips.find((item) => item.label === "急救")?.text.includes("实现："), `Skill action tooltip should include implementation coverage: ${JSON.stringify(tooltips.actionTooltips)}`);
  assert(tooltips.playTipIdle.includes("直接点击手牌"), "Idle play-context tooltip should explain direct hand-card play.");
  assert(tooltips.playTipSelected.includes("需要目标"), "Selected-card play-context tooltip should explain target selection.");

  const roster = api.rosterSummary();
  const rosterByMode = Object.fromEntries(roster.modes.map((item) => [item.mode, item]));
  assert(roster.totalGenerals === 65, `Current roster should include 65 implemented general records: ${JSON.stringify(roster)}`);
  assert(rosterByMode.strict.count === 57 && !rosterByMode.strict.hasHuaxiong && !rosterByMode.strict.hasXunyou, `Strict roster should be the 57-general v1 pool: ${JSON.stringify(rosterByMode.strict)}`);
  assert(rosterByMode.standard2013.count === 59 && rosterByMode.standard2013.hasHuaxiong && rosterByMode.standard2013.ids.includes("yuanshu") && !rosterByMode.standard2013.hasXunyou, `2013 roster should add 华雄 and 袁术: ${JSON.stringify(rosterByMode.standard2013)}`);
  assert(rosterByMode.all.count === 65 && rosterByMode.all.hasHuaxiong && rosterByMode.all.hasXunyou && ["yuanshu", "fazheng", "xushu", "zhangchunhua", "wuguotai", "bulianshi"].every((id) => rosterByMode.all.ids.includes(id)), `All roster should include 华雄、荀攸 and the extension generals: ${JSON.stringify(rosterByMode.all)}`);
  const setupRoster = api.setupRosterSelectSummary("all");
  assert(setupRoster.stateRosterMode === "all" && setupRoster.randomLabel.includes("65人") && setupRoster.optionCount === 66, `Setup general dropdown should refresh to the all-roster count after changing the roster select: ${JSON.stringify(setupRoster)}`);
  assert(setupRoster.includesYuanshu && setupRoster.includesFazheng && setupRoster.includesXushu && setupRoster.includesZhangchunhua && setupRoster.includesWuguotai && setupRoster.includesBulianshi, `Setup general dropdown should expose extension generals in all-roster mode: ${JSON.stringify(setupRoster)}`);
  const setupLanding = api.setupLandingContractSummary();
  assert(setupLanding.initialStartSubtitle.includes("8 人身份局") && setupLanding.initialText.includes("老练") && setupLanding.initialText.includes("身份信息") && setupLanding.initialText.includes("主公公开") && !setupLanding.initialText.includes("手牌可见性") && setupLanding.initialGeneralSummary.includes("随机武将"), `Setup summary and featured general card should show the default match at a glance: ${JSON.stringify(setupLanding)}`);
  assert(setupLanding.customizedStartSubtitle.includes("5 人身份局") && setupLanding.customizedText.includes("稳健") && setupLanding.customizedText.includes("全部武将") && setupLanding.generalSummary === "袁术", `Setup summary and featured general card should update when mode, roster, AI, and general change: ${JSON.stringify(setupLanding)}`);
  assert(setupLanding.startLabel === "开始新局" && setupLanding.customizedStartSubtitle.includes("5 人身份局") && setupLanding.customizedStartSubtitle.includes("袁术") && setupLanding.customizedStartSubtitle.includes("稳健") && setupLanding.customizedStartSubtitle.includes("全部武将"), `Setup primary CTA should stay product-facing while its subtitle stays synced to mode/general/AI/roster: ${JSON.stringify(setupLanding)}`);
  assert(setupLanding.continueLabel === "继续上次对局" && setupLanding.continueDisabled && setupLanding.continueStatus.includes("暂无"), `Setup launcher should include a disabled continue affordance when no safe match save exists: ${JSON.stringify(setupLanding)}`);
  const matchSave = api.matchSaveContractSummary();
  assert(matchSave.saved && matchSave.savedReason === "contract" && matchSave.continueEnabled, `Safe match snapshots should enable the continue-game launcher affordance: ${JSON.stringify(matchSave)}`);
  assert(matchSave.continueStatus.includes("曹操行动"), `Continue affordance should tell the player whose turn will resume: ${JSON.stringify(matchSave)}`);
  assert(matchSave.settingsSaveText.includes("本机保存") && matchSave.settingsSaveText.includes("安全"), `Settings should explain local safe-point saving in player-facing language: ${JSON.stringify(matchSave)}`);
  assert(matchSave.restored && matchSave.restoredRound === 4 && matchSave.restoredCurrent === "曹操" && matchSave.restoredMode === "5", `Saved matches should restore the current turn, round, and mode: ${JSON.stringify(matchSave)}`);
  assert(matchSave.savedDeckCount === matchSave.restoredDeckCount && matchSave.savedHumanHand === matchSave.restoredHumanHand, `Saved matches should preserve deck and hand state at the safe point: ${JSON.stringify(matchSave)}`);
  assert(matchSave.transientStateCleared && matchSave.canRestartLoop, `Saved matches should restore to a loop-safe state without stale pending UI resolvers: ${JSON.stringify(matchSave)}`);

  const ruleRegressions = await api.ruleRegressionSummary();
  assert(ruleRegressions.syntheticGanglieGain === 0, `曹操 should not gain a fake 刚烈 card via 奸雄: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.syntheticJianxiongLogCount === 0, `Synthetic skill damage should not log 奸雄 gain: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.physicalCardGain === 1, `曹操 should still gain a real physical damage card via 奸雄: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.physicalCardName === "杀", `曹操 should gain the real 杀 in the physical-card regression: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.movePhysicalCardInHand, `曹操 should gain the actual used physical card through 奸雄: ${JSON.stringify(ruleRegressions)}`);
  assert(!ruleRegressions.movePhysicalCardInDiscard, `A card gained by 奸雄 should not also enter the discard pile: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.ganglieHeartDidNotTrigger && ruleRegressions.ganglieHeartLogCount >= 1, `刚烈 should not punish the damage source on a heart judgement: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.ganglieDiamondTriggeredOnNonHeart && ruleRegressions.ganglieDiamondDiscardedTwoHand, `刚烈 should trigger on non-heart judgements and allow the source to discard two hand cards: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.ganglieDiamondLogShowsHandCards, `刚烈 discard response should reveal the exact discarded hand cards: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.ganglieForcedDamageWithoutTwoHand && ruleRegressions.ganglieForcedDamageLogCount >= 1, `刚烈 should deal 1 damage when the source cannot discard two hand cards: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.ganglieRewriteToNonHeart && ruleRegressions.ganglieRewriteDamagedSource && ruleRegressions.ganglieRewriteLogCount >= 1, `鬼才/鬼道 AI should treat non-heart as the good 刚烈 judgement for 夏侯惇: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.ganglieHumanCanDecline, `Human 夏侯惇 should be able to decline 刚烈 without revealing a judgement card or punishing the damage source: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.jizhiNullifyHandCount === 1, `黄月英 should net one hand card after using 无懈可击 and triggering 集智: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.jizhiNullifyDrewCard, `黄月英 should draw from 集智 after using 无懈可击: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.jizhiNullifyLogCount === 1, `黄月英 using 无懈可击 should log exactly one 集智 trigger: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.jizhiDelayedTrickDidNotDraw && ruleRegressions.jizhiDelayedTrickLogCount === 0, `黄月英 should not trigger 集智 when using delayed tricks such as 乐不思蜀: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.rendeTargetsOtherOnly && ruleRegressions.rendeHumanCanPickGivenCards && ruleRegressions.rendeCanGiveAcrossMultipleUses && ruleRegressions.rendeHealsOnceWhenCumulativeTwo && ruleRegressions.rendeLogShowsThreeGiftEvents, `刘备 仁德 should give hand cards to other players across multiple uses and heal only once when cumulative gifts reach two cards: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.qingnangTargetsOnlyWoundedAndAllowsSelf && ruleRegressions.qingnangHumanPaysOneHandAndHeals && ruleRegressions.qingnangOncePerPhase && ruleRegressions.qingnangLogShowsCostAndHeal, `华佗 青囊 should target only wounded characters, allow self-heal, pay one hand card, heal the target, and be once per phase: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.jieyinTargetsOnlyWoundedMaleOther && ruleRegressions.jieyinHumanPaysTwoHandAndHealsBoth && ruleRegressions.jieyinOncePerPhase && ruleRegressions.jieyinLogShowsCostAndHeal, `孙尚香 结姻 should target only wounded male other characters, pay two hand cards, heal both sides, and be once per phase: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.lijianAvailableWithOnlyEquipment && ruleRegressions.lijianTargetsOnlyMaleOther && ruleRegressions.lijianHumanCanPayEquipmentCost && ruleRegressions.lijianDuelResolves && ruleRegressions.lijianOncePerPhase, `貂蝉 离间 should target two male other characters, allow hand/equipment cost, resolve duel, and be once per phase: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.guoseDiamondBecomesDelayedLebu && ruleRegressions.guoseDoesNotAskImmediateNullify && ruleRegressions.guoseNullifyDuringJudgePhase, `大乔 国色 should use a diamond card as 乐不思蜀, place it in the judge area, and only allow nullify during judgement: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.delayedJudgementAsksHumanBeforeAllyAI, `Delayed tricks should open a human 无懈可击 response window before revealing the judgement card: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.harvestNullifyPerTargetPrompted && ruleRegressions.harvestNullifyOnlySkipsOneTarget, `五谷丰登 should allow per-target 无懈可击 so only the nullified target misses the harvest: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.arrowsNullifyPerTargetPrompted && ruleRegressions.arrowsNullifyOnlySkipsOneTarget, `万箭齐发 should allow per-target 无懈可击 so only the nullified target avoids damage: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.taoyuanNullifyPerTargetPrompted && ruleRegressions.taoyuanNullifyOnlySkipsOneTarget, `桃园结义 should allow per-target 无懈可击 so only the nullified target misses the heal: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.barbariansNullifyPerTargetPrompted && ruleRegressions.barbariansNullifyOnlySkipsOneTarget, `南蛮入侵 should allow per-target 无懈可击 so only the nullified target avoids damage: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.fanjianTargetsOtherOnly && ruleRegressions.fanjianAsksTargetToGuessSuit && ruleRegressions.fanjianGivesExactCardAndDamagesOnWrongGuess && ruleRegressions.fanjianLogShowsSuitAndCard, `周瑜 反间 should target another player, ask for a suit guess, give the exact hand card, and damage on a wrong guess: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.tiejiRedForbidsDodgeAndDealsDamage && ruleRegressions.tiejiBlackAllowsDodge && ruleRegressions.tiejiHumanCanDecline, `马超 铁骑 should be optional, forbid dodge only on red judgement, and allow dodge on black or declined use: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.liuliHumanPromptsUseTargetAndCost && ruleRegressions.liuliHumanTargetsLegalOtherOnly && ruleRegressions.liuliHumanCanPayEquipmentAndRedirect, `大乔 流离 should ask the player, redirect only to legal other targets, and allow equipment as the discard cost: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.liegongHighHandForbidsDodge && ruleRegressions.liegongLowHandForbidsDodge && ruleRegressions.liegongHumanCanDecline, `黄忠 烈弓 should forbid Dodge for either hand-count condition and remain optional for the human player: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.aiSelfNullifiesDismantle && ruleRegressions.aiSelfNullifyDismantleLogCount === 1, `AI should use 无懈可击 to protect itself from direct harmful tricks such as 过河拆桥: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.aiWeakUnknownNullifyBlocked, `AI should not spend 无懈可击 to protect a weakly-read unknown non-teammate: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.humanYijiPromptsAndTargets && ruleRegressions.humanYijiOnlyAllowsDrawnCards && ruleRegressions.humanYijiMovesChosenCard && ruleRegressions.humanYijiKeepsUnchosenAndOldCards && ruleRegressions.humanYijiLogCount === 1, `Human 郭嘉 should be able to distribute newly drawn 遗计 cards to a chosen target: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.guhuoActiveCanDeclareMultipleNames && ruleRegressions.guhuoActiveNoRecastDeclaration, `于吉蛊惑 should offer multiple basic/common-trick declarations, not only Slash or recast: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.guhuoResponseCanDeclareBasicAndNullify, `于吉蛊惑 should also be available in response windows such as 闪 and 无懈可击: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.guhuoTrueHeartChallengeContinues, `Red-heart truthful 蛊惑 should continue resolving after challenge while doubters lose HP: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.guhuoFalseChallengeFizzles && ruleRegressions.guhuoTrueNonHeartChallengeFizzles, `Challenged false or non-heart truthful 蛊惑 should be discarded and not resolve: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.guicaiJudgeSuit === "♥" && ruleRegressions.guicaiJudgeCardId === ruleRegressions.guicaiRewriteCardId, `司马懿 should be able to replace another player's delayed-trick judgement with 鬼才: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.guicaiLogCount === 1, `司马懿 鬼才 judgement rewrite should be logged once: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.guicaiAfterLoseHandTriggered, `Using the last hand card for 鬼才 should trigger after-lose-hand skills such as 连营: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.guicaiLianyingLogCount === 1, `鬼才 replacement with temporary 连营 should log one 连营 trigger: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.guidaoJudgeSuit === "♣" && ruleRegressions.guidaoJudgeCardId === ruleRegressions.guidaoRewriteCardId, `张角 should be able to replace another player's judgement with a black card via 鬼道: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.guidaoLogCount === 1, `张角 鬼道 judgement rewrite should be logged once: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.luoshenRewriteWorked && ruleRegressions.luoshenStoppedOnRed, `洛神 should use the shared judgement rewrite flow and still stop on the next red card: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.leijiGuidaoLogCount === 1 && ruleRegressions.leijiGuidaoCausedDamage && ruleRegressions.leijiRewriteCardDiscarded, `张角 should understand 雷击 judgement rewrites and cause damage after 鬼道 changes the judgement to spade: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.leijiHumanPromptedUse && ruleRegressions.leijiHumanPromptedTarget, `Human 张角 should be asked whether to trigger 雷击 and then choose a target: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.leijiHumanCanChooseNonSource, `雷击 should allow choosing a target other than the Slash source: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.leijiThunderDamageCannotBeDodged && ruleRegressions.leijiTargetPerformsJudge, `雷击 should be direct thunder judgement damage, not a dodgeable Slash-like attack: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.leijiClubHealsOwnerAndDamagesTarget && ruleRegressions.leijiClubLogShowsHealAndThunderDamage, `雷击 club judgement should heal 张角 and deal 1 thunder damage: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.leijiThunderChainsLinkedTargets && ruleRegressions.leijiThunderChainLogged, `雷击 thunder damage should propagate through 铁索连环: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.targetCardOptionLabels.some((label) => label.includes("手牌 1")), `顺手/过拆 target card choices should expose hidden hand-card positions: ${JSON.stringify(ruleRegressions.targetCardOptionLabels)}`);
  assert(ruleRegressions.targetCardOptionLabels.some((label) => label.includes("装备") && label.includes("白银狮子")), `顺手/过拆 target card choices should expose equipment names: ${JSON.stringify(ruleRegressions.targetCardOptionLabels)}`);
  assert(ruleRegressions.targetCardOptionLabels.some((label) => label.includes("判定") && label.includes("乐不思蜀")), `顺手/过拆 target card choices should expose judgement-zone cards: ${JSON.stringify(ruleRegressions.targetCardOptionLabels)}`);
  const handTargetTip = ruleRegressions.targetCardOptionTips.find((item) => item.zone === "hand")?.dismantleTip || "";
  const equipTargetTip = ruleRegressions.targetCardOptionTips.find((item) => item.zone === "equip")?.dismantleTip || "";
  const judgeTargetTip = ruleRegressions.targetCardOptionTips.find((item) => item.zone === "judge")?.stealTip || "";
  assert(handTargetTip.includes("未知手牌") && handTargetTip.includes("不会显示具体牌名"), `Hidden hand target card choices should explain uncertainty without leaking the card: ${JSON.stringify(ruleRegressions.targetCardOptionTips)}`);
  assert(!handTargetTip.includes("桃") && !handTargetTip.includes("闪"), `Hidden hand target tooltip should not leak hidden card names: ${handTargetTip}`);
  assert(equipTargetTip.includes("公开装备牌") && equipTargetTip.includes("白银狮子") && equipTargetTip.includes("弃置这张牌"), `Equipment target choice should explain visible equipment and dismantle effect: ${equipTargetTip}`);
  assert(judgeTargetTip.includes("公开判定牌") && judgeTargetTip.includes("乐不思蜀") && judgeTargetTip.includes("获得这张牌"), `Judgement target choice should explain visible judgement and steal effect: ${judgeTargetTip}`);
  assert(ruleRegressions.dismantleRangeIncludesFar, `过河拆桥 should have unlimited trick distance in legal target selection: ${JSON.stringify(ruleRegressions)}`);
  assert(!ruleRegressions.stealRangeIncludesFar, `顺手牵羊 should still be limited by distance 1 unless skills change it: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.dismantleRemovedEquip && ruleRegressions.dismantleTargetStillHasJudge, `过河拆桥 AI should choose a concrete visible target card instead of random hidden cards: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.stealHandWorked, `顺手牵羊 should be able to choose/take one target hand-card slot: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.humanDismantlePendingKind === "选择" && ruleRegressions.humanDismantlePendingLabels.some((label) => label.includes("白银狮子")), `Human 过河拆桥 should open a concrete card-choice window: ${JSON.stringify(ruleRegressions.humanDismantlePendingLabels)}`);
  assert(ruleRegressions.humanDismantleRemovedChosenEquip && ruleRegressions.humanDismantleDidNotTouchRandomHand, `Human 过河拆桥 should remove the chosen visible equipment instead of a random hand card: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.humanStealPendingKind === "选择" && ruleRegressions.humanStealPendingLabels.includes("手牌 2"), `Human 顺手牵羊 should expose selectable hand-card slots: ${JSON.stringify(ruleRegressions.humanStealPendingLabels)}`);
  assert(ruleRegressions.humanStealTookChosenHandSlot, `Human 顺手牵羊 should take the selected hand slot, not a random card: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.humanFankuiAskKind === "是否发动" && ruleRegressions.humanFankuiAskLabels.includes("是"), `Human 反馈 should first ask whether to trigger: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.humanFankuiChoiceKind === "选择" && ruleRegressions.humanFankuiChoiceLabels.some((label) => label.includes("八卦阵")), `Human 反馈 should expose concrete source card choices: ${JSON.stringify(ruleRegressions.humanFankuiChoiceLabels)}`);
  assert(ruleRegressions.humanFankuiTookChosenEquip && ruleRegressions.humanFankuiDidNotTouchRandomHand && ruleRegressions.humanFankuiLogCount >= 1, `Human 反馈 should take the chosen visible card instead of random cards: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.aiFankuiTookVisibleEquip && ruleRegressions.aiFankuiLogShowsEquip, `AI 反馈 should prefer valuable visible source cards and log the obtained zone: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.actualFankuiTriggersLianying && ruleRegressions.actualFankuiLianyingLogCount >= 1, `Actual 反馈 hand-card loss should trigger after-lose-hand skills such as 连营: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.beigeSelfTriggered && ruleRegressions.beigeSelfHealedBeforeDying, `蔡文姬 should be able to trigger 悲歌 for herself after Slash damage and heal before dying: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.beigeSelfCostLogged && ruleRegressions.beigeSelfJudgeHeartLogged, `Self-triggered 悲歌 should reveal the discarded cost and judgement card: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.beigeHeartEffectLogged, `悲歌 heart result should explicitly log the recovery effect: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.beigeDiamondDrewTwo && ruleRegressions.beigeDiamondEffectLogged, `悲歌 diamond result should draw two with a reasoned log instead of a generic draw line: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.beigeSpadeSkippedSourcePlay && ruleRegressions.beigeSpadeEffectLogged, `悲歌 spade result should mark and log the source's skipped play phase: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.guzhengReturnedExactCard && ruleRegressions.guzhengGainedExactCard && ruleRegressions.guzhengRemovedCardsFromDiscard, `固政 should move the returned card and gained cards out of discard into the right hands: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.guzhengLogShowsExactCards, `固政 battle log should reveal the exact returned and gained cards: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.tianxiangPreventedSelfDamage && ruleRegressions.tianxiangRedirectedDamage, `天香 should prevent the original damage and redirect it to the chosen target: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.tianxiangTargetDrewLostHp, `天香 target should draw cards equal to lost HP after the redirected damage: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.tianxiangCostLogged && ruleRegressions.tianxiangLogShowsAmount && ruleRegressions.tianxiangDrawReasonLogged, `天香 battle log should reveal the cost, redirected damage amount, and reasoned draw without duplicate generic draw logs: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.randomStealTriggeredAfterLoseHand, `Random steal effects such as 反馈/烈刃 should await after-lose-hand skills like 连营: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.randomStealLianyingLogCount === 1, `Random steal effects should log one 连营 trigger when taking the target's last hand card: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.humanLierenAskedThenPindian && ruleRegressions.humanLierenChoiceShowsTargetCards, `Human 烈刃 should ask to trigger, then expose concrete target card choices after winning pindian: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.humanLierenTookChosenEquip && ruleRegressions.humanLierenLogShowsExactEquip, `Human 烈刃 should gain the chosen visible equipment and log it exactly: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.aiLierenPrefersVisibleEquip && ruleRegressions.aiLierenLogShowsExactEquip, `AI 烈刃 should prefer valuable visible equipment over random hidden hand cards: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.discardFromHandTriggeredAfterLoseHand, `Direct hand discards should await after-lose-hand skills like 连营: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.discardFromHandLianyingLogCount === 1, `Direct hand discards should log one 连营 trigger when discarding the player's last hand card: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.discardFromHandShowsCardNames, `Discard-phase/cost logs should reveal the exact discarded hand cards: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.discardTargetHandShowsCardNameAfterDiscard, `Dismantled hidden hand cards should become public after entering discard: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.nonHandLossDoesNotTriggerLianying && ruleRegressions.nonHandLossLianyingLogCount === 0, `Losing equipment/judgement cards should not trigger 连营 when no hand card was lost: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.discardTargetEquipShowsCardName, `Dismantled equipment should be logged with exact card suit/rank/name: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.nonHandLossStillTriggersTuntian && ruleRegressions.nonHandLossTuntianLogCount === 1, `屯田 should still trigger after losing a non-hand card outside the player's turn: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.qiaobianMoveTriggersTuntian && ruleRegressions.qiaobianMoveTuntianLogCount === 1, `巧变 moving a field card away from 邓艾 outside his turn should trigger 屯田: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.borrowSwordTransferTriggersTuntian && ruleRegressions.borrowSwordTransferTuntianLogCount === 1, `借刀杀人 transferring a weapon away from 邓艾 outside his turn should trigger 屯田: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.qilinHorseLossTriggersTuntian && ruleRegressions.qilinHorseLossTuntianLogCount === 1, `麒麟弓 discarding 邓艾's horse outside his turn should trigger 屯田: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.qilinHorseLossShowsCardName, `麒麟弓 discard logs should reveal the exact discarded horse card: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.horseDisplayNameShowsSpecificMount, `Horse cards should display concrete mount names such as 的卢 instead of only +1马/-1马: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.qinggangIgnoresTengjiaNormalSlash, `青釭剑 should make normal Slash ignore 藤甲's normal-Slash immunity: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.qinggangIgnoresTengjiaFireBoost, `青釭剑 should make fire Slash ignore 藤甲's fire-damage +1 armor effect: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.hanbingSwordInPool && ruleRegressions.hanbingSwordInDeck, `寒冰剑 should exist in both the card pool and concrete deck: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.hanbingPreventsDamageAndDiscardsTwo && ruleRegressions.hanbingLogsExactDiscardedCards && ruleRegressions.hanbingTooltipExplainsPreventDamage, `寒冰剑 should prevent non-lethal Slash damage, discard two exact target cards, and explain itself in tooltip: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.hanbingDoesNotReplaceLethalDamage, `AI should not use 寒冰剑 to replace lethal damage with card discard: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.wineDodgedSlashConsumed && ruleRegressions.wineArmorCancelConsumed && ruleRegressions.wineHitAddsDamageAndConsumes, `酒 should be consumed by the next Slash while still adding damage on hit: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.jiuchiActiveSpadeAsWine && ruleRegressions.jiuchiOncePerTurn && ruleRegressions.jiuchiActiveLogShowsSkill, `董卓酒池 should let a spade hand card become the once-per-turn active Wine: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.jiuchiDyingSpadeSelfRescue && ruleRegressions.jiuchiDyingLogShowsSelfWine, `董卓酒池 should let a spade hand card become Wine for self-rescue in dying: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.roulinDongzhuoSlashFemaleRequiresTwoDodges && ruleRegressions.roulinFemaleSlashDongzhuoRequiresTwoDodges && ruleRegressions.roulinLogsBothDirections, `董卓肉林 should require two Dodges both when Dong Zhuo slashes a female character and when a female character slashes Dong Zhuo: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.kuangguHealsPerDamagePoint && ruleRegressions.kuangguLogShowsRecoveredAmount && ruleRegressions.kuangguRequiresDistanceOne, `魏延狂骨 should recover per damage point only when the damaged target is within distance 1: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.mengjinUsesConcreteDismantle && ruleRegressions.mengjinKeepsUnknownHandWhenVisibleEquipBetter && ruleRegressions.mengjinLogShowsChosenEquip, `猛进 should use the concrete dismantle flow and reveal the chosen discarded card: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.liuliEquipCostTriggersTuntian && ruleRegressions.liuliEquipCostTuntianLogCount === 1, `流离 discarding an equipment card outside the player's turn should trigger 屯田 when the player has that skill: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.zhijianReplacementTriggersTuntian && ruleRegressions.zhijianReplacementTuntianLogCount === 1, `直谏 replacing 邓艾's equipment outside his turn should trigger 屯田: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.lordKillLoyalTriggersLianying && ruleRegressions.lordKillLoyalLianyingLogCount === 1, `A lord who loses the last hand card for killing a loyalist should still trigger 连营: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.lordKillLoyalShowsDiscardedCards, `Lord loyal-kill penalty should reveal the exact discarded cards: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.buquSuccessSustainedOnce && ruleRegressions.buquSuccessDidNotLoopDraw && ruleRegressions.buquSuccessLogCount === 1, `周泰不屈 should sustain death once without looping through extra judgement cards: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.buquDuplicateFailedAndDied && ruleRegressions.buquDuplicateLogCount === 1, `周泰不屈 should fail and die when the new 不屈 card repeats a rank: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.shensuEarlyUsed && ruleRegressions.shensuEarlySkippedJudgeAndDraw && ruleRegressions.shensuEarlyDamagedTarget && ruleRegressions.shensuEarlyLogCount === 1, `夏侯渊神速一 should skip judgement/draw phases as the cost, not resolve them before the Slash: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.shensuPlayUsed && ruleRegressions.shensuPlayPaidEquip && ruleRegressions.shensuPlayDamagedTarget && ruleRegressions.shensuPlayLogCount === 1, `夏侯渊神速二 should pay an equipment card and skip play phase for the virtual Slash: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.shensuFreeActionRemoved, `神速 should not remain as a free normal play-phase action: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.jijiangActiveRealSlashLeftProvider && ruleRegressions.jijiangActiveDamagedTarget && ruleRegressions.jijiangActiveCountsAsLordSlash, `刘备主公 should use 激将 for an active Slash while consuming the Shu provider's real Slash: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.jijiangActiveJianxiongGotRealSlash, `激将 damage should pass the provider's real Slash into damage-card effects such as 奸雄: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.jijiangActiveLogCount >= 1, `Active 激将 should be visible in the battle log: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.jijiangResponseOk && ruleRegressions.jijiangResponseUsedProviderSlash, `刘备主公 should use 激将 when required to respond with 杀: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.jijiangResponseLogCount >= 1, `Response 激将 should be visible in the battle log: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.hujiaResponseOk && ruleRegressions.hujiaProviderUsedDodge, `曹操主公 should use 护驾 when required to respond with 闪: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.hujiaLogCount >= 1, `护驾 should be visible in the battle log: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.jiuyuanSaved && ruleRegressions.jiuyuanHpAfter === 2 && ruleRegressions.jiuyuanProviderUsedPeach, `孙权主公 should gain the extra 救援 recovery from a Wu rescuer's 桃: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.jiuyuanLogCount >= 1, `救援 should be visible in the battle log: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.jiuyuanNonWuNoExtra && ruleRegressions.jiuyuanSelfNoExtra, `救援 should only add extra recovery when another Wu character uses Peach on the Jiuyuan lord: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.wanshaBlocksOtherPeach && ruleRegressions.wanshaAllowsCasterRescue && ruleRegressions.wanshaAllowsSelfRescue, `贾诩完杀 should block third-party Peach rescues while still allowing the turn owner and dying player to rescue: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.ruoyuAwakenedWithJijiang && ruleRegressions.ruoyuMaxHpAndHealApplied, `刘禅若愚 should awaken by raising max HP, healing, and gaining 激将: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.ruoyuAwakenLogCount >= 1, `若愚 awakening log should mention gaining 激将: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.ruoyuJijiangResponseOk && ruleRegressions.ruoyuJijiangUsedProviderSlash, `刘禅 should be able to use the 激将 gained from 若愚 for a later Slash response: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.ruoyuJijiangLogCount >= 1, `若愚-granted 激将 should be visible in the battle log: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.zhijiWoundedHealed && ruleRegressions.zhijiWoundedDidNotDraw && ruleRegressions.zhijiWoundedLogCount >= 1, `姜维志继 should heal when awakened wounded, then gain 观星: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.zhijiFullDrew && ruleRegressions.zhijiFullLogCount >= 1, `姜维志继 should draw two when awakened unwounded, then gain 观星: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.xueyiDoesNotRaiseMaxHp && ruleRegressions.xueyiHandLimit === 7, `袁绍血裔 should raise hand limit by other Qun characters, not max HP: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.xueyiKeptCardsAtLimit && ruleRegressions.xueyiDiscardedOnlyAboveLimit, `血裔 hand limit should be respected by discard phase: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.luanjiRepeatUseAvailable, `乱击 should remain available multiple times per turn while Yuan Shao can pay two same-suit cards: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.fangquanQueued && ruleRegressions.fangquanExtraTurnStartsTarget && ruleRegressions.fangquanExtraReturnStored && ruleRegressions.fangquanReturnsToOriginalNext, `刘禅放权 should grant an immediate extra turn, then return to 刘禅's original next player instead of skipping that seat: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.luanwuCanTargetCasterWhenNearest && ruleRegressions.luanwuDoesNotForceNearestAllyOverCaster && ruleRegressions.luanwuCasterTargetLogCount === 1, `贾诩乱武 should allow/choose the caster as a nearest target instead of forcing attacks away from 贾诩: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.jiaxuHasLuanwuSkill, `贾诩 should have 乱武 in his skill list: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.yuanshuWeidiHasJijiang && ruleRegressions.yongsiDrawsByKingdomCount && ruleRegressions.yongsiDiscardsByKingdomCount, `袁术 should support 伪帝 and 庸肆 draw/discard by kingdom count: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.enyuanPunishesDamageSource && ruleRegressions.enyuanRewardsHealer && ruleRegressions.xuanhuoMovesConcreteCard && ruleRegressions.xuanhuoLogShowsTransfer, `法正 should support 恩怨 and 眩惑 concrete card movement: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.wuyanSourceBlocksTrick
    && ruleRegressions.wuyanTargetBlocksBorrowSword
    && ruleRegressions.wuyanTargetBorrowSwordLogCount >= 1
    && ruleRegressions.wuyanTargetBlocksChain
    && ruleRegressions.wuyanTargetChainLogCount >= 1
    && ruleRegressions.wuyanTargetBlocksTaoyuanOnlyForXushu
    && ruleRegressions.wuyanTargetTaoyuanLogCount >= 1
    && ruleRegressions.wuyanTargetBlocksHarvestOnlyForXushu
    && ruleRegressions.wuyanTargetHarvestLogCount >= 1
    && ruleRegressions.wuyanSourceGlobalKeepsSelfEffect
    && ruleRegressions.wuyanSourceGlobalLogCount >= 1
    && ruleRegressions.jujianDrawsAndHeals
    && ruleRegressions.jujianLogShowsSupport, `徐庶 should support 无言 and 举荐: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.jueqingTurnsDamageIntoHpLoss && ruleRegressions.shangshiReplenishesToLostHpCap, `张春华 should support 绝情 and 伤逝: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.ganluSwapsEquipmentZones && ruleRegressions.ganluTriggersLoseEquipEffects && ruleRegressions.ganluLogShowsBothPlayers && ruleRegressions.ganluLogShowsLoseEquipTriggers && ruleRegressions.buyiSavesWithNonBasicReveal, `吴国太 should support 甘露, its lose-equipment follow-ups, and 补益: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.anxuMovesAndRevealsHandCard && ruleRegressions.anxuLogShowsRevealedCard && ruleRegressions.zhuiyiRewardsNonKiller && ruleRegressions.zhuiyiLogShowsReward, `步练师 should support 安恤 and 追忆: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.haoshiStrictDrawsExtraAndGivesHalf && ruleRegressions.haoshiStrictTargetIsLowestHand && ruleRegressions.haoshiStrictLogShowsHalfGift, `鲁肃 好施 should draw two extra cards and then give half the hand to a lowest-hand other player with clear log text: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.zhihengAvailableWithOnlyEquipment && ruleRegressions.zhihengDiscardsEquipmentAndDraws && ruleRegressions.zhihengEquipLogShowsExactCard, `孙权 制衡 should be usable with equipment-only cards and reveal the exact discarded equipment: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.zhihengEquipTriggersLoseEquipSkills && ruleRegressions.zhihengXiaojiLogCount === 1, `制衡 discarding equipment should trigger lose-equipment skills such as 枭姬 before drawing for 制衡: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.humanZhihengCanSelectEquipment, `Human 制衡 should allow selecting equipment-zone cards, not only hand cards: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.dimengStrictCostAndSwap && ruleRegressions.dimengStrictDiscardedExactCost && ruleRegressions.dimengStrictLogShowsCost && ruleRegressions.dimengZeroCostLegalWithoutHand && ruleRegressions.dimengAllowsEquipmentCost && ruleRegressions.dimengEquipmentCostLogged, `鲁肃 缔盟 should discard exactly the hand-count difference from hand/equipment cards, support zero-cost swaps, and exchange target hands: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.humanDimengOneStepPick && ruleRegressions.humanDimengSelectionValid && ruleRegressions.humanDimengPickedBothTargets, `Human 鲁肃 缔盟 should select two targets in one confirmation flow: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.qiceShowsAllCostCards, `奇策 should reveal all hand cards consumed as the trick cost: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.baonueLoyalHealedLord && ruleRegressions.baonueLoyalJudgedOnLord, `暴虐 should let a loyal Qun damage source ask 董卓 to judge and recover on spade: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.baonueLoyalLogCount >= 1, `暴虐 should be visible in the battle log with source and lord: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.baonueRebelDidNotHealLord && ruleRegressions.baonueRebelDidNotJudge, `暴虐 should not make a rebel Qun source help an enemy 董卓主公: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.baonueRebelLogCount === 0, `Enemy-side 暴虐 should not be logged as triggered: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.songweiLoyalDrewForLord && ruleRegressions.songweiLoyalJudgeCardDiscarded, `颂威 should let the Wei judge owner resolve a black judgement and let 曹丕主公 draw: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.songweiLoyalLogCount >= 1, `颂威 should be visible as the judge owner's choice in the battle log: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.songweiRebelDidNotDrawForLord && ruleRegressions.songweiRebelLogCount === 0, `Enemy-side 颂威 should not make a rebel Wei character donate a draw to 曹丕主公: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.zhibaLoseGavePindianCardsToLord && ruleRegressions.zhibaLoseSourceDidNotDraw, `制霸 should give both pindian cards to 孙策 when the Wu challenger does not win, without drawing from deck: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.zhibaLoseLogCount >= 1, `Losing-side 制霸 should be visible as gaining the pindian cards: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.zhibaWinDidNotDraw && ruleRegressions.zhibaWinDiscardedPindianCards, `Winning-side 制霸 should discard the pindian cards and not draw from deck: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.zhibaWinLogCount >= 1, `Winning-side 制霸 should log that pindian cards entered discard: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.benghuaiHighChoseLoseHp && ruleRegressions.benghuaiHighLogCount >= 1, `High-HP 董卓 should usually pay 崩坏 with HP instead of wasting max HP: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.benghuaiLowChoseLoseMaxHp && ruleRegressions.benghuaiLowAvoidedDying && ruleRegressions.benghuaiLowLogCount >= 1, `Low-HP 董卓 should pay 崩坏 with max HP to avoid pointless dying risk: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.luoyiAiSkipsWithoutAttackCard && ruleRegressions.luoyiAiUsesWithReadySlash && ruleRegressions.luoyiSlashDamagePlusOne && ruleRegressions.luoyiDuelDamagePlusOne, `许褚裸衣 AI should only skip a draw when it has a ready Slash/Duel payoff, and the damage bonus should apply to both Slash and Duel: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.jushouFlipsAfterEnd && ruleRegressions.jushouSkipsWholeNextTurn, `曹仁据守 should flip after drawing 3 and skip the entire next turn, not only the play phase: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.fangzhuFlipsTarget && ruleRegressions.fangzhuSkipsWholeNextTurn && ruleRegressions.fangzhuBoardShowsBackSide, `曹丕放逐 should flip the target, show the back-side state, and skip the entire next turn: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.kurouAvailableBefore && ruleRegressions.kurouAvailableAfterFirst && ruleRegressions.kurouCanRepeatSameTurn, `黄盖苦肉 should be repeatable in the same play phase, not limited once per turn: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.kurouAvailableAtOneHp && ruleRegressions.kurouLowHpScoreAvoidsAiSuicide, `苦肉 should remain player-legal at 1 HP while AI strongly avoids suicidal use: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.kurouDyingRescueThenDraws && ruleRegressions.kurouDyingLogShowsRescueBeforeDraw, `苦肉 at 1 HP should enter dying, allow self-rescue, then continue to draw two cards: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.qiangxiLegalAtOneHp && ruleRegressions.qiangxiLowHpScoreAvoidsAiSuicide && ruleRegressions.qiangxiHumanCanChooseHpCost && ruleRegressions.qiangxiHumanCanChooseWeaponCost && ruleRegressions.qiangxiLogsChosenCosts, `典韦 强袭 should be legal at 1 HP, avoid AI suicide scoring, and let humans choose HP or weapon cost: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.quhuHumanPindianPrompted && ruleRegressions.quhuHumanChoosesDamageTarget && ruleRegressions.quhuHumanChosenVictimDamaged && ruleRegressions.quhuHumanLogShowsChosenVictim, `荀彧 驱虎 should let Xun Yu choose the damage target after winning pindian: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.tianyiWinAllowsDistanceFreeSlash && ruleRegressions.tianyiWinAllowsTwoSlashTargets && ruleRegressions.tianyiMultiTargetSlashConsumesOneUse, `太史慈 天义 should make Slash distance-free, allow one extra target, and consume only one Slash use: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.shuangxiongGivesOnlyJudgeCard && ruleRegressions.shuangxiongOppositeColorAsDuel && ruleRegressions.shuangxiongLogShowsJudgeOnly, `颜良文丑 双雄 should skip normal draw, gain only the judgement card, and enable opposite-color Duel conversion: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.noMissSlashSuppressed && ruleRegressions.noMissMassSuppressed && ruleRegressions.noMissTiaoxinSuppressed, `Failed 杀/闪 responses that immediately lead to damage or follow-up resolution should not spam visible 未响应 logs: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.aiMassSlashResponseOk && ruleRegressions.aiMassSlashConsumed && ruleRegressions.aiMassSlashResponseLogCount === 1, `AI should use an available 杀 to respond to 南蛮入侵 and protect HP, even when the source is not hostile: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.juxiangIgnoresNanmanAndGainsIt && ruleRegressions.juxiangNanmanNotDiscardedAfterGain && ruleRegressions.juxiangLogShowsResolvedGain, `祝融巨象 should ignore another player's 南蛮入侵 and gain the resolved physical card: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.juxiangDoesNotRecoverOwnNanman && ruleRegressions.juxiangSelfUseNoGainLog, `巨象 should not recover 南蛮入侵 used by 祝融 herself: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.deathRevealPublicToAll && ruleRegressions.deathRevealUpdatesReads && ruleRegressions.deathRevealLogShowsRole, `Death should publicly reveal identity and update AI reads for every observer: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.deathKillRebelLoyalSignal, `Killing a revealed rebel should become public loyal-leaning evidence for the killer: ${JSON.stringify(ruleRegressions)}`);
  assert(ruleRegressions.aoeDamageReadCapped && ruleRegressions.aoeDamageReadWeakReason, `AOE damage to the lord should remain weak/capped identity evidence, not direct-attack certainty: ${JSON.stringify(ruleRegressions)}`);

  const aiSupport = api.aiSupportScenarioSummary();
  assert(aiSupport.qingnang.suspectedRebelBonus > aiSupport.qingnang.suspectedLoyalBonus + 1.4, `Support bonus should strongly prefer a suspected rebel teammate: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.qingnang.suspectedRebelScore > aiSupport.qingnang.suspectedLoyalScore + 2.0, `青囊 should score suspected teammate higher than suspected loyalist: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.qingnang.bestTarget === "张飞", `青囊 should prefer the suspected rebel teammate as its best support target: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.qingnang.teammateAccepted, `青囊 teammate support should pass the AI's play threshold: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.rende.suspectedRebelCards.length > 0, `仁德 should be willing to gift a suspected rebel teammate: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.rende.suspectedLoyalCards.length === 0, `仁德 should avoid gifting a suspected loyalist enemy: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.rende.suspectedRebelScore > aiSupport.rende.suspectedLoyalScore + 1.0, `仁德 should score suspected teammate higher than suspected loyalist: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.rende.bestTarget === "马超", `仁德 should prefer the suspected rebel teammate as its best gift target: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.rende.teammateAccepted, `仁德 teammate support should pass the AI's play threshold: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.zhijian.suspectedRebelScore > aiSupport.zhijian.suspectedLoyalScore + 1.2, `直谏 should score equipping a suspected teammate higher than a suspected loyalist: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.zhijian.bestTarget === "张飞", `直谏 should place equipment on the suspected rebel teammate first: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.zhijian.teammateAccepted, `直谏 teammate support should pass the AI's play threshold: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.fangquan.bestTarget === "马超", `放权 should grant the extra turn to the suspected rebel teammate: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.fangquan.moveScore > 1.8, `放权 should become a strong support move when a suspected teammate can use the turn: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.fangquan.teammateAccepted, `放权 teammate support should pass the AI's play threshold: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.jieyin.suspectedRebelScore > aiSupport.jieyin.suspectedLoyalScore + 1.2, `结姻 should score healing a suspected teammate higher than a suspected loyalist: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.jieyin.bestTarget === "张飞", `结姻 should prefer the wounded suspected rebel teammate: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.jieyin.teammateAccepted, `结姻 teammate support should pass the AI's play threshold: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.jieming.suspectedRebelScore > aiSupport.jieming.suspectedLoyalScore + 1.2, `节命 should score refilling a suspected teammate higher than a suspected loyalist: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.jieming.bestTarget === "马超", `节命 should refill the suspected rebel teammate first: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.yiji.suspectedRebelScore > aiSupport.yiji.suspectedLoyalScore + 1.2, `遗计 should score gifting drawn cards to a suspected teammate higher than a suspected loyalist: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.yiji.bestTarget === "马超", `遗计 should choose the suspected rebel teammate for drawn cards: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.yiji.giftedCards.length > 0, `遗计 should actually gift at least one drawn card to the teammate: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.yiji.allocationTargets.includes("马超") && aiSupport.yiji.allocationTargets.includes("张飞"), `遗计 should be able to split newly drawn cards across multiple suspected teammates: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.yiji.teammateHandAfterGift > 0 && aiSupport.yiji.secondTeammateHandAfterGift > 0 && aiSupport.yiji.teammateHandAfterGift + aiSupport.yiji.secondTeammateHandAfterGift === aiSupport.yiji.giftedCards.length && aiSupport.yiji.loyalHandAfterGift === 0, `遗计 should move drawn cards to teammate state, not the suspected loyalist: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.haoshi.bestTarget === "马超" && aiSupport.haoshi.shouldUseWithTeammateLowest, `好施 should give to the lowest-hand suspected teammate and be willing to use: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.haoshi.giftCards.length > 0, `好施 should choose actual cards to gift the suspected teammate: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.haoshi.enemyOnlyTarget === "赵云" && aiSupport.haoshi.shouldAvoidEnemyOnlyLowest, `好施 should avoid extra draw when the only lowest-hand target is a suspected loyalist enemy: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.yinghun.suspectedRebelScore > aiSupport.yinghun.suspectedLoyalScore + 1.0, `英魂 should score the suspected teammate higher for supportive draw/discard mode: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.yinghun.bestTarget === "张飞" && aiSupport.yinghun.bestMode === "drawLostDiscardOne", `英魂 should support the suspected teammate with the draw-heavy mode: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.fangzhu.bestTarget !== "马超", `放逐 should avoid flipping a suspected teammate when enemy control is available: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.fangzhu.suspectedLoyalEnemyScore > aiSupport.fangzhu.suspectedRebelScore + 0.6, `放逐 should score enemy control higher than harmful teammate support: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.dimeng.bestTargets.includes("马超") && aiSupport.dimeng.bestTargets.includes("赵云"), `缔盟 should swap the suspected teammate and suspected enemy in the hand-advantage setup: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.dimeng.bestScore > 0.8 && aiSupport.dimeng.allyEnemyScore > 0.8, `缔盟 teammate/enemy swap should be a clearly positive move: ${JSON.stringify(aiSupport)}`);
  assert(aiSupport.huangtian.loyalAccepted, `黄天 should be accepted when a Qun loyalist can support 张角主公: ${JSON.stringify(aiSupport.huangtian)}`);
  assert(aiSupport.huangtian.loyalTarget === "张角", `黄天 decision trail should identify 张角 as the support target: ${JSON.stringify(aiSupport.huangtian)}`);
  assert(aiSupport.huangtian.loyalCard === "闪", `黄天 should prefer handing a useful dodge to 张角 when the provider is not in low-HP danger: ${JSON.stringify(aiSupport.huangtian)}`);
  assert(!aiSupport.huangtian.rebelAccepted, `黄天 should not make a rebel Qun character donate cards to an enemy 张角主公: ${JSON.stringify(aiSupport.huangtian)}`);
  assert(aiSupport.huangtian.loyalScore > aiSupport.huangtian.rebelScore + 2.0, `黄天 scoring should separate teammate support from enemy-lord support: ${JSON.stringify(aiSupport.huangtian)}`);
  assert(aiSupport.zhiba.loyalAccepted, `制霸 should be accepted when a Wu loyalist can cooperate with 孙策主公: ${JSON.stringify(aiSupport.zhiba)}`);
  assert(!aiSupport.zhiba.rebelAccepted, `制霸 should not make a rebel Wu character feed an enemy 孙策主公: ${JSON.stringify(aiSupport.zhiba)}`);
  assert(aiSupport.zhiba.loyalScore > aiSupport.zhiba.rebelScore + 2.0, `制霸 scoring should separate teammate cooperation from enemy-lord help: ${JSON.stringify(aiSupport.zhiba)}`);
  assert(aiSupport.moderateDeclaredAlly.supportAccepted, `A moderately signaled teammate should still pass the support threshold: ${JSON.stringify(aiSupport.moderateDeclaredAlly)}`);
  assert(aiSupport.moderateDeclaredAlly.chosenTitle === "青囊" && aiSupport.moderateDeclaredAlly.chosenTarget.includes("马超"), `AI should visibly choose teammate support when a strong support move is close to other actions: ${JSON.stringify(aiSupport.moderateDeclaredAlly)}`);
  assert(aiSupport.moderateDeclaredAlly.teamwork > 1.0 && aiSupport.moderateDeclaredAlly.committedBonus > 0.12, `Declared teammate support should include a committed ally bonus: ${JSON.stringify(aiSupport.moderateDeclaredAlly)}`);
  assert(aiSupport.basicCardUse.selfEquipAccepted && aiSupport.basicCardUse.selfEquipTopIsEquip, `AI should actively equip useful gear instead of holding it until discard: ${JSON.stringify(aiSupport.basicCardUse)}`);
  assert(aiSupport.basicCardUse.drawTrickAccepted && aiSupport.basicCardUse.drawTrickTopTitle.includes("无中生有"), `AI should still actively use clearly valuable trick cards: ${JSON.stringify(aiSupport.basicCardUse)}`);
  assert(aiSupport.basicCardUse.utilityThresholdBelowBase && Object.values(aiSupport.basicCardUse.utilityJitter).every((value) => value <= 0.06), `Basic utility moves should have stable acceptance so AI does not randomly skip obvious equipment/draw/control plays: ${JSON.stringify(aiSupport.basicCardUse)}`);
  assert(aiSupport.basicCardUse.dismantleVisibleEquipAccepted && aiSupport.basicCardUse.dismantleVisibleEquipChoice === "equip", `AI should use 过河拆桥 on visible enemy equipment instead of waiting or picking random hand slots: ${JSON.stringify(aiSupport.basicCardUse)}`);
  assert(aiSupport.basicCardUse.stealVisibleEquipAccepted && aiSupport.basicCardUse.stealVisibleEquipChoice === "equip", `AI should use 顺手牵羊 to take visible valuable equipment when available: ${JSON.stringify(aiSupport.basicCardUse)}`);
  assert(aiSupport.basicCardUse.borrowSwordEnemyAccepted && aiSupport.basicCardUse.borrowSwordTopWielder === "关羽", `AI should treat 借刀杀人 as pressure against enemy weapon holders by default: ${JSON.stringify(aiSupport.basicCardUse)}`);
  assert(aiSupport.basicCardUse.borrowSwordAvoidsTeammateWeapon && aiSupport.basicCardUse.borrowSwordEnemyScore > aiSupport.basicCardUse.borrowSwordAllyScore + 1.2, `AI should not casually use 借刀杀人 on a suspected teammate's weapon: ${JSON.stringify(aiSupport.basicCardUse)}`);
  assert(aiSupport.basicCardUse.borrowSwordOnlyTeammateRejected && aiSupport.basicCardUse.borrowSwordOnlyTeammateScore < aiSupport.basicCardUse.borrowSwordOnlyTeammateThreshold, `AI should reject 借刀杀人 when the only weapon holder is a suspected teammate without reliable advanced-coop evidence: ${JSON.stringify(aiSupport.basicCardUse)}`);
  assert(aiSupport.basicCardUse.allyJudgeRemovalAccepted && aiSupport.basicCardUse.allyJudgeRemovalTarget === "曹操" && aiSupport.basicCardUse.allyJudgeRemovalChoice === "judge", `AI should treat removing an ally/lord's harmful judgement as support: ${JSON.stringify(aiSupport.basicCardUse)}`);
  assert(aiSupport.basicCardUse.allyJudgeCountsAsSupport, `拆掉队友负面判定 should be recorded as support, not offense: ${JSON.stringify(aiSupport.basicCardUse)}`);
  assert(aiSupport.basicCardUse.urgentDismantleAllyJudgeAccepted && aiSupport.basicCardUse.urgentDismantleAllyJudgeTarget === "马超" && aiSupport.basicCardUse.urgentDismantleAllyJudgeChoice === "judge" && aiSupport.basicCardUse.urgentDismantleAllyJudgeCard === "乐不思蜀", `AI should prioritize 过河拆桥 to clear a suspected teammate's imminent 乐不思蜀: ${JSON.stringify(aiSupport.basicCardUse)}`);
  assert(aiSupport.basicCardUse.urgentDismantleBeatsEnemyEquip && aiSupport.basicCardUse.urgentDismantleTopTarget === "马超", `Clearing teammate debuffs should beat ordinary enemy-equipment dismantle when the teammate acts soon: ${JSON.stringify(aiSupport.basicCardUse)}`);
  assert(aiSupport.basicCardUse.urgentDismantleIntentReason.includes("支援/保护"), `AI explanation should describe teammate debuff removal as support: ${JSON.stringify(aiSupport.basicCardUse)}`);
  assert(aiSupport.basicCardUse.urgentStealAllyJudgeAccepted && aiSupport.basicCardUse.urgentStealAllyJudgeTarget === "马超" && aiSupport.basicCardUse.urgentStealAllyJudgeChoice === "judge" && aiSupport.basicCardUse.urgentStealAllyJudgeCard === "兵粮寸断", `AI should use legal-distance 顺手牵羊 to remove a suspected teammate's 兵粮寸断: ${JSON.stringify(aiSupport.basicCardUse)}`);
  assert(aiSupport.basicCardUse.urgentStealBeatsEnemyEquip && aiSupport.basicCardUse.urgentStealTopTarget === "马超", `Legal-distance 顺手牵羊 should prefer teammate debuff relief over ordinary enemy equipment theft: ${JSON.stringify(aiSupport.basicCardUse)}`);
  assert(aiSupport.basicCardUse.urgentStealIntentReason.includes("支援/保护"), `AI explanation should describe teammate 顺手 relief as support: ${JSON.stringify(aiSupport.basicCardUse)}`);

  const generalSelection = api.generalSelectionContractSummary();
  assert(generalSelection.loyalSameKingdomBiasedButNotLocked, `忠臣选将 should lean toward 曹操's Wei synergy without locking every pick: ${JSON.stringify(generalSelection.caocaoLoyal)}`);
  assert(generalSelection.liubeiLoyalShuBiasedButNotLocked, `忠臣选将 should lean toward 刘备/激将 Shu synergy without locking every pick: ${JSON.stringify(generalSelection.liubeiLoyal)}`);
  assert(generalSelection.rebelNotSameKingdomLocked, `反贼选将 should not copy the loyalist same-kingdom bias: ${JSON.stringify(generalSelection.caocaoRebel)}`);
  assert(generalSelection.rebelPrefersActionKits, `反贼选将 should favor offense/control kits over pure support: ${JSON.stringify(generalSelection.caocaoRebel)}`);
  assert(generalSelection.traitorHasControlOrDefenseBias, `内奸选将 should prefer self-sufficient control/defense kits: ${JSON.stringify(generalSelection.caocaoTraitor)}`);
  assert(generalSelection.extensionSupportSkillsTagged && generalSelection.extensionControlDefenseTagged, `扩展武将选将 should recognize newly added support/control/defense kits instead of treating them as random bodies: ${JSON.stringify(generalSelection)}`);
  assert(generalSelection.allPoolStillBiasedButNotLocked, `All-roster loyal selection should still lean toward lord synergy without becoming deterministic: ${JSON.stringify(generalSelection.caocaoAllLoyal)}`);

  const decisionTrail = api.aiDecisionTrailContractSummary();
  assert(decisionTrail.hasDecisionEntry, `AI decision trail should record the selected move: ${JSON.stringify(decisionTrail)}`);
  assert(decisionTrail.hasSupportSkill && decisionTrail.targetsSuspectedTeammate, `AI decision trail should identify the support skill and target: ${JSON.stringify(decisionTrail)}`);
  assert(decisionTrail.hasCandidateRank && decisionTrail.hasScore, `AI decision trail should show candidate rank and score: ${JSON.stringify(decisionTrail)}`);
  assert(decisionTrail.hasSupportIntent && decisionTrail.hasTeamworkScore, `AI decision trail should explain support intent and teamwork score: ${JSON.stringify(decisionTrail)}`);
  assert(decisionTrail.hasFairRead && decisionTrail.hasPublicEvidence, `AI decision trail should cite fair identity reads and public behavior evidence: ${JSON.stringify(decisionTrail)}`);
  assert(decisionTrail.rendersInReadsPanel, `AI reads panel should render recent decision details: ${JSON.stringify(decisionTrail)}`);
  assert(!decisionTrail.leaksHiddenRole, `Fair AI decision trail should not leak hidden roles: ${JSON.stringify(decisionTrail)}`);

  const decisionTrailUi = api.prepareAIDecisionTrailVisualScenario();
  assert(decisionTrailUi.readsText.includes("华佗") && decisionTrailUi.readsText.includes("青囊"), `AI decision visual scenario should render the support decision: ${decisionTrailUi.readsText}`);
  assert(decisionTrailUi.readsText.includes("配合分") && decisionTrailUi.readsText.includes("公开行为"), `AI decision visual scenario should render decision scoring and public evidence: ${decisionTrailUi.readsText}`);
  assert(decisionTrailUi.readsText.includes("公平边界") && decisionTrailUi.readsText.includes("暗身份未给 AI 直接读取"), `AI decision visual scenario should render fairness boundary: ${decisionTrailUi.readsText}`);
  assert(!/(?:开眼身份|挑战模式身份|公开：(?:反贼|忠臣|内奸))/.test(decisionTrailUi.readsText), `AI decision visual scenario should not leak hidden roles: ${decisionTrailUi.readsText}`);

  const career = await api.careerRegressionSummary();
  assert(career.totalGames === 1, `Career should record a finished game once only: ${JSON.stringify(career)}`);
  assert(career.wins === 1 && career.losses === 0, `Career should count the rebel player's win: ${JSON.stringify(career)}`);
  assert(career.survivedGames === 1 && career.longestGameRound === 3, `Career should keep survival and long-game stats: ${JSON.stringify(career)}`);
  assert(career.roleGames === 1 && career.roleWins === 1, `Career should update rebel role stats: ${JSON.stringify(career)}`);
  assert(career.roleSurvived === 1, `Career role stats should track survival: ${JSON.stringify(career)}`);
  assert(career.roleDamageDealt === 1 && career.roleKills === 1, `Career role stats should track combat metrics: ${JSON.stringify(career)}`);
  assert(career.modeGames === 1 && career.modeWins === 1, `Career should update mode scoreboard stats: ${JSON.stringify(career)}`);
  assert(career.generalGames === 1, `Career should update the selected general stats: ${JSON.stringify(career)}`);
  assert(career.generalSurvived === 1, `Career general stats should track survival: ${JSON.stringify(career)}`);
  assert(career.generalDamageDealt === 1 && career.generalKills === 1, `Career general stats should track damage and kills: ${JSON.stringify(career)}`);
  assert(career.runMetricsBeforeRecord.damageDealt === 1 && career.runMetricsBeforeRecord.kills === 1, `Career should collect damage and kills from actual damage/death hooks before recording: ${JSON.stringify(career)}`);
  assert(career.totalDamageDealt === 1 && career.totalDamageTaken === 0 && career.totalKills === 1 && career.totalDeaths === 0, `Career totals should store combat metrics: ${JSON.stringify(career)}`);
  assert(career.totalCardsUsed === 2 && career.totalSkillsUsed === 1 && career.bestDamageDealt === 1 && career.bestKills === 1, `Career totals should store action metrics and personal bests: ${JSON.stringify(career)}`);
  assert(career.lastGameRole === "反贼" && career.lastGameResult === "反贼获胜", `Career should keep a recent game record: ${JSON.stringify(career)}`);
  assert(career.lastGameDamageDealt === 1 && career.lastGameKills === 1 && career.lastGameCardsUsed === 2 && career.lastGameSkillsUsed === 1, `Career recent game record should keep combat/action metrics: ${JSON.stringify(career)}`);
  assert(career.lastGameDurationSec >= 0, `Career recent game record should keep duration: ${JSON.stringify(career)}`);
  assert(career.exportHasEnvelope && career.importRoundTripGames === 1, `Career should support local archive export/import round trip: ${JSON.stringify(career)}`);
  assert(career.setupCareerRenders && career.careerPanelRenders && career.careerCombatRenders, `Career UI should render a setup teaser and richer combat scoreboard panel: ${JSON.stringify(career)}`);
  assert(career.milestonesDone.includes("初阵") && career.milestonesDone.includes("反贼首胜") && career.milestonesDone.includes("斩将"), `Career milestones should unlock from recorded stats: ${JSON.stringify(career)}`);

  const victory = api.victoryStatusSummary();
  assert(victory.gameOver === true, `Victory summary should mark the game over: ${JSON.stringify(victory)}`);
  assert(victory.phase === "对局结束", `Victory summary should record the final phase: ${JSON.stringify(victory)}`);
  assert(victory.detail === "反贼获胜", `Victory summary should keep the exact winner text: ${JSON.stringify(victory)}`);
  assert(victory.waitKind === "对局结束" && victory.waitPrompt.includes("反贼获胜"), `Victory wait state should show the winner: ${JSON.stringify(victory)}`);
  assert(victory.pendingPrompt.includes("反贼获胜"), `Victory pending prompt should show the winner: ${JSON.stringify(victory)}`);
  assert(victory.infoTab === "career", `Victory should open the career tab: ${JSON.stringify(victory)}`);
  assert(victory.careerTotalGames === 1, `Victory should record the career result: ${JSON.stringify(victory)}`);
  assert(victory.endGameModalOpen, `Victory should open the end-game modal: ${JSON.stringify(victory)}`);
  assert(victory.endGameModalText.includes("胜利") && victory.endGameModalText.includes("你的阵营获胜") && victory.endGameModalText.includes("获胜阵营") && victory.endGameModalText.includes("身份揭示"), `End-game modal should summarize result, personal outcome, and revealed roles: ${JSON.stringify(victory)}`);
  assert(victory.endGameModalText.includes("生涯进度") && victory.endGameModalText.includes("下个目标") && victory.endGameModalText.includes("里程碑"), `End-game modal should give players a career progression hook for the next game: ${JSON.stringify(victory)}`);
  assert(victory.endGameModalHasActions && victory.endGameModalHasRevealedRoles, `End-game modal should include next actions and revealed identities: ${JSON.stringify(victory)}`);

  const identityReads = api.identityReadScenarioSummary();
  assert(identityReads.attackLord.read > 1.0, `Attacking the lord should make the actor look rebel: ${JSON.stringify(identityReads.attackLord)}`);
  assert(identityReads.attackLord.reasons.some((reason) => reason.includes("主公")), `Attacking lord should leave a public reason: ${JSON.stringify(identityReads.attackLord)}`);
  assert(identityReads.supportLord.read < -0.8, `Supporting the lord should make the actor look loyal: ${JSON.stringify(identityReads.supportLord)}`);
  assert(identityReads.avoidLord.read < -0.4, `Avoiding an available attack on the lord should lower rebel suspicion: ${JSON.stringify(identityReads.avoidLord)}`);
  assert(identityReads.avoidLordByCamp.lord.read < -0.5 && identityReads.avoidLordByCamp.lord.reasons.some((reason) => reason.includes("表露偏忠")), `The lord should read an actor who could attack the lord but attacked elsewhere as publicly loyal-leaning: ${JSON.stringify(identityReads.avoidLordByCamp)}`);
  assert(identityReads.avoidLordByCamp.rebel.read < -0.55 && identityReads.avoidLordByCamp.rebel.reasons.some((reason) => reason.includes("表露主忠立场")), `Rebels should interpret that same avoid-lord action as an enemy-side public stance: ${JSON.stringify(identityReads.avoidLordByCamp)}`);
  assert(identityReads.avoidLordByCamp.traitor.read < -0.2 && identityReads.avoidLordByCamp.traitor.read > -0.55, `Traitors should record avoid-lord behavior as a lighter control signal, not hard certainty: ${JSON.stringify(identityReads.avoidLordByCamp)}`);
  assert(identityReads.attackSuspectedRebel.read < -0.5, `Attacking a suspected rebel should lower rebel suspicion: ${JSON.stringify(identityReads.attackSuspectedRebel)}`);
  assert(identityReads.supportSuspectedRebel.read > 0.25, `Supporting a suspected rebel should raise rebel suspicion: ${JSON.stringify(identityReads.supportSuspectedRebel)}`);
  assert(identityReads.attackSuspectedLoyal.read > 0.2, `Attacking a suspected loyalist should raise rebel suspicion: ${JSON.stringify(identityReads.attackSuspectedLoyal)}`);
  assert(identityReads.supportSuspectedLoyal.read < -0.19, `Supporting a suspected loyalist should lower rebel suspicion: ${JSON.stringify(identityReads.supportSuspectedLoyal)}`);
  assert(identityReads.aoe.normalLord.read > 0.08 && identityReads.aoe.normalLord.read < 0.45, `AOE touching the lord should be medium-weight, not absolute: ${JSON.stringify(identityReads.aoe.normalLord)}`);
  assert(identityReads.aoe.lowHpLord.read > identityReads.aoe.normalLord.read + 0.04, `AOE should still weigh low-HP lord risk more heavily: ${JSON.stringify(identityReads.aoe)}`);
  assert(identityReads.aoe.lowHpLord.read < 0.35 && identityReads.aoe.lowHpLord.label !== "偏反", `One AOE should not push a neutral actor into enemy classification by itself: ${JSON.stringify(identityReads.aoe.lowHpLord)}`);
  assert(identityReads.aoe.normalLord.reasons.some((reason) => reason.includes("万箭齐发") && reason.includes("疑似反贼")), `万箭齐发 should explain teammate collateral instead of hard judgement: ${JSON.stringify(identityReads.aoe.normalLord)}`);
  assert(identityReads.aoe.barbariansNormalLord.read > 0.08 && identityReads.aoe.barbariansNormalLord.read < 0.45, `南蛮入侵 touching the lord should be medium-weight, not absolute: ${JSON.stringify(identityReads.aoe.barbariansNormalLord)}`);
  assert(identityReads.aoe.barbariansLowHpLord.read > identityReads.aoe.barbariansNormalLord.read + 0.04, `南蛮入侵 should still weigh low-HP lord risk more heavily: ${JSON.stringify(identityReads.aoe)}`);
  assert(identityReads.aoe.barbariansLowHpLord.read < 0.35 && identityReads.aoe.barbariansLowHpLord.label !== "偏反", `One 南蛮入侵 should not push a neutral actor into enemy classification by itself: ${JSON.stringify(identityReads.aoe.barbariansLowHpLord)}`);
  assert(identityReads.aoe.barbariansNormalLord.reasons.some((reason) => reason.includes("南蛮入侵") && reason.includes("疑似反贼")), `南蛮入侵 should mention collateral on suspected rebels: ${JSON.stringify(identityReads.aoe.barbariansNormalLord)}`);
  assert(identityReads.aoe.keepsPriorLoyalRead.read < -0.85, `A single AOE should not flip an established loyal-leaning read into enemy certainty: ${JSON.stringify(identityReads.aoe.keepsPriorLoyalRead)}`);
  assert(identityReads.aoe.keepsPriorLoyalRead.reasons.some((reason) => reason.includes("AOE不直接翻案")), `AOE read reasons should explain prior loyal inertia: ${JSON.stringify(identityReads.aoe.keepsPriorLoyalRead)}`);
  assert(identityReads.aoe.mildPriorLoyalRead.read < 0.2 && identityReads.aoe.mildPriorLoyalRead.label !== "偏反", `A single high-risk AOE should at most soften a prior loyal read, not turn it into an enemy label: ${JSON.stringify(identityReads.aoe.mildPriorLoyalRead)}`);
  assert(identityReads.aoe.mildPriorLoyalRead.reasons.some((reason) => reason.includes("AOE不直接翻案")), `Mild prior loyal AOE reasons should explain that it is not black-and-white: ${JSON.stringify(identityReads.aoe.mildPriorLoyalRead)}`);
  assert(identityReads.aoe.singleActualFromNeutral.read < 0.35 && identityReads.aoe.singleActualFromNeutral.label !== "偏反", `A single actual AOE hit should stay below the AI enemy threshold from neutral: ${JSON.stringify(identityReads.aoe.singleActualFromNeutral)}`);
  assert(identityReads.aoe.singleActualFromNeutral.reasons.some((reason) => reason.includes("单次AOE不直接定性")), `Single actual AOE evidence should explain that it is not a hard identity call: ${JSON.stringify(identityReads.aoe.singleActualFromNeutral)}`);
  assert(identityReads.aoe.singleActualFromPriorLoyal.read < 0.2 && identityReads.aoe.singleActualFromPriorLoyal.label !== "偏反", `A single actual AOE hit should not flip a prior loyal read into enemy classification: ${JSON.stringify(identityReads.aoe.singleActualFromPriorLoyal)}`);

  const lordTargeting = api.lordTargetingScenarioSummary();
  assert(lordTargeting.avoiderRead < -0.4, `Avoiding a lord attack should leave the lord with a loyal-leaning read: ${JSON.stringify(lordTargeting)}`);
  assert(lordTargeting.avoiderReasons.some((reason) => reason.includes("可压制主公")), `Avoid-lord targeting should keep an explainable public reason: ${JSON.stringify(lordTargeting)}`);
  assert(lordTargeting.suspectedRead > 1.2, `Scenario should include a clearly suspected rebel comparison target: ${JSON.stringify(lordTargeting)}`);
  assert(lordTargeting.scoreAgainstSuspected > lordTargeting.scoreAgainstAvoider + 1.2, `Lord scoring should strongly prefer pressuring the suspected rebel over the actor who avoided the lord: ${JSON.stringify(lordTargeting)}`);
  assert(lordTargeting.bestSlashTarget === "张飞", `Lord's best slash target should be the suspected rebel, not the lord-avoiding actor: ${JSON.stringify(lordTargeting)}`);

  const traitorControl = api.traitorControlScenarioSummary();
  assert(traitorControl.rebelPressure.preferredTarget === "suspectedRebel", `Traitor should pressure suspected rebels when rebel-side pressure is ahead: ${JSON.stringify(traitorControl.rebelPressure)}`);
  assert(traitorControl.rebelPressure.rebelScore > traitorControl.rebelPressure.loyalScore + 0.35, `Traitor rebel-pressure score should clearly prefer suspected rebels over suspected loyalists: ${JSON.stringify(traitorControl.rebelPressure)}`);
  assert(traitorControl.rebelPressure.lordAttitude > 0.7, `Traitor should protect/avoid killing the lord while rebels are ahead and the lord is not final target: ${JSON.stringify(traitorControl.rebelPressure)}`);
  assert(traitorControl.loyalPressure.preferredTarget === "suspectedLoyal", `Traitor should pressure suspected loyalists when loyal-side pressure is ahead: ${JSON.stringify(traitorControl.loyalPressure)}`);
  assert(traitorControl.loyalPressure.loyalScore > traitorControl.loyalPressure.rebelScore + 0.5, `Traitor loyal-pressure score should clearly prefer suspected loyalists over suspected rebels: ${JSON.stringify(traitorControl.loyalPressure)}`);

  const readsPanel = api.aiReadsPanelContractSummary();
  assert(readsPanel.hasFairnessBoundary && readsPanel.hasDecisionBoundary, `AI reads panel should explain the fairness boundary: ${JSON.stringify(readsPanel)}`);
  assert(readsPanel.hasActorRow && readsPanel.showsHiddenIdentity, `AI reads panel should show the observed hidden actor row without revealing role: ${JSON.stringify(readsPanel)}`);
  assert(!readsPanel.leaksActorRole, `AI reads panel should not leak hidden rebel role as public information: ${JSON.stringify(readsPanel)}`);
  assert(readsPanel.actorRead > 1.0 && readsPanel.showsReadLabel, `AI reads panel should show a visible suspicious read label: ${JSON.stringify(readsPanel)}`);
  assert(readsPanel.showsPublicReason && readsPanel.actorReasons.some((reason) => reason.includes("主公")), `AI reads panel should surface public behavior reasons: ${JSON.stringify(readsPanel)}`);

  const eventVisuals = api.eventVisualContractSummary();
  assert(eventVisuals.systemStart.kind === "system" && eventVisuals.systemStart.title === "身份局开始", `Identity-game start should parse as a specific system event: ${JSON.stringify(eventVisuals.systemStart)}`);
  assert(eventVisuals.systemStart.icon === "局" && eventVisuals.systemStart.detail.includes("主公是赵云"), `System events should use a table-state icon/detail, not the combat Slash icon: ${JSON.stringify(eventVisuals.systemStart)}`);
  assert(eventVisuals.singleSlash.kind === "card", `Single-target card event should parse as a card: ${JSON.stringify(eventVisuals.singleSlash)}`);
  assert(eventVisuals.singleSlash.visualDirected && !eventVisuals.singleSlash.visualArea, `Single-target card event should render as a directed arrow: ${JSON.stringify(eventVisuals.singleSlash)}`);
  assert(eventVisuals.singleSlash.routeTargets.includes("曹操"), `Single-target card event should route to the target: ${JSON.stringify(eventVisuals.singleSlash)}`);
  assert(eventVisuals.singleSlash.castHasSettlementLane, `Single-target center event should render a source-card-target settlement lane: ${JSON.stringify(eventVisuals.singleSlash)}`);
  assert(!eventVisuals.singleSlash.castUsesOfficialImage && eventVisuals.singleSlash.castHasTextCardFace, `Single-target center event should use the mockup text-card face, not official card art: ${JSON.stringify(eventVisuals.singleSlash)}`);
  assert(eventVisuals.arrows.kind === "card" && eventVisuals.arrows.isArea, `万箭齐发 should be treated as an area event: ${JSON.stringify(eventVisuals.arrows)}`);
  assert(eventVisuals.arrows.visualArea && eventVisuals.arrows.targetCount === 4, `万箭齐发 should show an area visual affecting all other players: ${JSON.stringify(eventVisuals.arrows)}`);
  assert(eventVisuals.arrows.routeTargets.length === 4, `万箭齐发 should expose its multiple visual targets: ${JSON.stringify(eventVisuals.arrows)}`);
  assert(eventVisuals.arrows.mood === "area" && eventVisuals.arrows.outcome === "影响4" && eventVisuals.arrows.castHasOutcome, `AOE events should show an area mood and affected count badge: ${JSON.stringify(eventVisuals.arrows)}`);
  assert(eventVisuals.arrows.castHasSettlementLane, `AOE center event should still keep the table settlement lane while showing multiple targets: ${JSON.stringify(eventVisuals.arrows)}`);
  assert(eventVisuals.barbarians.kind === "card" && eventVisuals.barbarians.visualArea && eventVisuals.barbarians.targetCount === 4, `南蛮入侵 should show an area visual affecting all other players: ${JSON.stringify(eventVisuals.barbarians)}`);
  assert(!eventVisuals.barbarians.castUsesOfficialImage && eventVisuals.barbarians.castHasTextCardFace, `南蛮入侵 center visual should stay on the mockup text-card system: ${JSON.stringify(eventVisuals.barbarians)}`);
  assert(eventVisuals.taoyuan.visualArea && eventVisuals.taoyuan.targetCount === 5, `桃园结义 should show an all-player area visual: ${JSON.stringify(eventVisuals.taoyuan)}`);
  assert(eventVisuals.harvest.kind === "card" && eventVisuals.harvest.visualArea && eventVisuals.harvest.targetCount === 5, `五谷丰登 should show an all-player card-choice visual: ${JSON.stringify(eventVisuals.harvest)}`);
  assert(!eventVisuals.harvest.castUsesOfficialImage && eventVisuals.harvest.routeTargets.includes("刘备"), `五谷丰登 visual should avoid card art and include all alive players: ${JSON.stringify(eventVisuals.harvest)}`);
  assert(eventVisuals.dodgeResponse.kind === "response" && eventVisuals.dodgeResponse.visualDirected, `闪 response should remain a directed visible event: ${JSON.stringify(eventVisuals.dodgeResponse)}`);
  assert(eventVisuals.nullifyResponse.title === "无懈可击" && !eventVisuals.nullifyResponse.castUsesOfficialImage && eventVisuals.nullifyResponse.castHasTextCardFace, `无懈可击 response should use a visible text-card surface: ${JSON.stringify(eventVisuals.nullifyResponse)}`);
  assert(eventVisuals.nullifyProtect.target === "刘备" && eventVisuals.nullifyProtect.routeTargets.includes("刘备") && eventVisuals.nullifyProtect.visualRelationNullify, `Targeted nullify should clearly route from the nullifier to the protected player: ${JSON.stringify(eventVisuals.nullifyProtect)}`);
  assert(eventVisuals.nullifyProtect.visualRelationCaption && eventVisuals.nullifyProtect.visualRelationCaptionText.includes("诸葛亮") && eventVisuals.nullifyProtect.visualRelationCaptionText.includes("保护") && eventVisuals.nullifyProtect.visualRelationCaptionText.includes("刘备"), `Targeted nullify should show a clear who-protected-whom relation caption: ${JSON.stringify(eventVisuals.nullifyProtect)}`);
  assert(eventVisuals.counterNullify.target === "刘备" && eventVisuals.counterNullify.visualRelationCounterNullify && eventVisuals.counterNullify.detail.includes("继续影响"), `Counter-nullify should clearly show who the trick continues to affect: ${JSON.stringify(eventVisuals.counterNullify)}`);
  assert(eventVisuals.counterNullify.visualRelationCaption && eventVisuals.counterNullify.visualRelationCaptionText.includes("司马懿") && eventVisuals.counterNullify.visualRelationCaptionText.includes("继续影响") && eventVisuals.counterNullify.visualRelationCaptionText.includes("刘备"), `Counter-nullify should show a clear who-kept-the-effect relation caption: ${JSON.stringify(eventVisuals.counterNullify)}`);
  assert(eventVisuals.judgeReveal.kind === "judge" && eventVisuals.judgeReveal.judgeVisualCard && eventVisuals.judgeReveal.judgeSuitVisible, `Judgement reveals should render a visible judgement-card popup, not only text: ${JSON.stringify(eventVisuals.judgeReveal)}`);
  assert(eventVisuals.judgeReveal.judgeCard?.suit === "♥" && eventVisuals.judgeReveal.judgeCard?.rank === "2" && eventVisuals.judgeReveal.judgeCard?.name === "闪" && eventVisuals.judgeReveal.judgeCard?.color === "red", `Red judgement card metadata should preserve suit/rank/name/color: ${JSON.stringify(eventVisuals.judgeReveal)}`);
  assert(eventVisuals.judgeBlackReveal.judgeVisualCard && eventVisuals.judgeBlackReveal.judgeCard?.suit === "♠" && eventVisuals.judgeBlackReveal.judgeCard?.color === "black", `Black judgement card popup should preserve black suit information: ${JSON.stringify(eventVisuals.judgeBlackReveal)}`);
  assert(eventVisuals.judgeRewrite.kind === "judge" && eventVisuals.judgeRewrite.title.includes("改判"), `Judge rewrite should be parsed as a judgement event: ${JSON.stringify(eventVisuals.judgeRewrite)}`);
  assert(eventVisuals.judgeRewrite.visualDirected && eventVisuals.judgeRewrite.routeTargets.includes("曹操"), `Judge rewrite should visually route from rewriter to judgement owner: ${JSON.stringify(eventVisuals.judgeRewrite)}`);
  assert(eventVisuals.judgeRewrite.detail.includes("乐不思蜀") && eventVisuals.judgeRewrite.detail.includes("♥2 闪"), `Judge rewrite detail should show the affected judgement and replacement card: ${JSON.stringify(eventVisuals.judgeRewrite)}`);
  assert(eventVisuals.judgeRewrite.judgeVisualCard && eventVisuals.judgeRewrite.judgeCard?.name === "闪", `Judge rewrite should also show the replacement card as a judgement-card popup: ${JSON.stringify(eventVisuals.judgeRewrite)}`);
  assert(eventVisuals.judgeRewrite.mood === "control" && eventVisuals.judgeRewrite.outcome === "改判" && eventVisuals.judgeRewrite.castHasMoodClass, `Judge rewrites should have a control mood and outcome badge: ${JSON.stringify(eventVisuals.judgeRewrite)}`);
  assert(eventVisuals.delayedNullify.kind === "judge" && eventVisuals.delayedNullify.title.includes("乐不思蜀被抵消"), `Delayed-trick nullify should be parsed as a judgement-stage event: ${JSON.stringify(eventVisuals.delayedNullify)}`);
  assert(eventVisuals.delayedNullify.detail.includes("判定阶段") && eventVisuals.delayedNullify.detail.includes("无懈可击"), `Delayed-trick nullify should explain that nullify happened during judgement: ${JSON.stringify(eventVisuals.delayedNullify)}`);
  assert(eventVisuals.discardKnown.kind === "discard" && eventVisuals.discardKnown.resourceCardVisual, `Known dismantle/discard events should render a visible public-card popup: ${JSON.stringify(eventVisuals.discardKnown)}`);
  assert(eventVisuals.discardKnown.resourceCards[0]?.suit === "♦" && eventVisuals.discardKnown.resourceCards[0]?.rank === "9" && eventVisuals.discardKnown.resourceCards[0]?.name === "闪", `Known dismantle/discard popup should preserve suit/rank/name: ${JSON.stringify(eventVisuals.discardKnown)}`);
  assert(eventVisuals.discardKnown.resourceVisualHasFullCardText, `Known dismantle/discard popup should render the full visible card face, not only the card type: ${JSON.stringify(eventVisuals.discardKnown)}`);
  assert(eventVisuals.discardPhase.resourceCards.length === 2 && eventVisuals.discardPhase.resourceCards.some((card) => card.name === "杀") && eventVisuals.discardPhase.resourceCards.some((card) => card.name === "闪"), `Discard-phase popup should show every public discarded card: ${JSON.stringify(eventVisuals.discardPhase)}`);
  assert(eventVisuals.discardPhase.resourceVisualHasFullCardText && eventVisuals.discardPhase.resourceVisibleCount >= 2, `Discard-phase popup should render each public discarded card with suit/rank/name visible: ${JSON.stringify(eventVisuals.discardPhase)}`);
  assert(eventVisuals.discardKnown.importance === "important" && eventVisuals.discardKnown.holdDuration > eventVisuals.draw.holdDuration, `Public discard/dismantle events should stay on screen longer than minor draw events: ${JSON.stringify({ discard: eventVisuals.discardKnown, draw: eventVisuals.draw })}`);
  assert(eventVisuals.gainKnown.kind === "gain" && eventVisuals.gainKnown.resourceCardVisual, `Known gained-card events should render a visible public-card popup: ${JSON.stringify(eventVisuals.gainKnown)}`);
  assert(eventVisuals.gainKnown.resourceCards[0]?.suit === "♠" && eventVisuals.gainKnown.resourceCards[0]?.rank === "2" && eventVisuals.gainKnown.resourceCards[0]?.name === "八卦阵", `Known gained-card popup should preserve suit/rank/name: ${JSON.stringify(eventVisuals.gainKnown)}`);
  assert(eventVisuals.gainKnown.resourceVisualHasFullCardText && eventVisuals.gainKnown.visualFooter === "反馈", `Known gained-card popup should show the exact card face and reason: ${JSON.stringify(eventVisuals.gainKnown)}`);
  assert(eventVisuals.gainKnown.importance === "important" && eventVisuals.gainKnown.holdDuration > eventVisuals.draw.holdDuration, `Public gained-card events should stay on screen long enough to read: ${JSON.stringify({ gain: eventVisuals.gainKnown, draw: eventVisuals.draw })}`);
  assert(eventVisuals.deferredWaitAfterDiscard.retainedDiscard && eventVisuals.deferredWaitAfterDiscard.pendingWait && eventVisuals.deferredWaitAfterDiscard.promotedWait, `A wait prompt should not immediately cover a public dismantle/discard popup: ${JSON.stringify(eventVisuals.deferredWaitAfterDiscard)}`);
  assert(eventVisuals.deferredWaitAfterDiscard.holdDuration >= eventVisuals.discardKnown.holdDuration - 40, `Deferred public-card popup should keep its full readable hold window: ${JSON.stringify(eventVisuals.deferredWaitAfterDiscard)}`);
  assert(eventVisuals.waitClean.castHtml === "" && eventVisuals.waitClean.visualHtml === "" && eventVisuals.waitClean.classes.includes("center-event-wait-clean"), `Wait states should not render the awkward route/card center visual: ${JSON.stringify(eventVisuals.waitClean)}`);
  assert(eventVisuals.rescue.visualRelationRescue && eventVisuals.rescue.visualRelationCaption && eventVisuals.rescue.visualRelationCaptionText.includes("刘备") && eventVisuals.rescue.visualRelationCaptionText.includes("救援") && eventVisuals.rescue.visualRelationCaptionText.includes("曹操"), `Peach rescue should show a clear who-rescued-whom relation caption: ${JSON.stringify(eventVisuals.rescue)}`);
  assert(eventVisuals.selfWineRescue.visualRelationSelfSave && eventVisuals.selfWineRescue.visualRelationCaption && eventVisuals.selfWineRescue.visualRelationCaptionText.includes("曹操") && eventVisuals.selfWineRescue.visualRelationCaptionText.includes("自救"), `Self wine rescue should show a clear self-save relation caption: ${JSON.stringify(eventVisuals.selfWineRescue)}`);
  assert(eventVisuals.huashenGain.kind === "skill" && eventVisuals.huashenGain.visualTitle.includes("奇才"), `化身 should show the gained skill in the center event title: ${JSON.stringify(eventVisuals.huashenGain)}`);
  assert(eventVisuals.huashenGain.detail.includes("本回合获得 奇才") && eventVisuals.huashenGain.detail.includes("锦囊距离限制放宽"), `化身 detail should explain the newly gained skill: ${JSON.stringify(eventVisuals.huashenGain)}`);
  assert(eventVisuals.huashenGain.visualType === "获得技能" && eventVisuals.huashenGain.visualFooter.includes("锦囊距离限制放宽"), `化身 visual face should summarize the gained skill rule: ${JSON.stringify(eventVisuals.huashenGain)}`);
  assert(eventVisuals.xinshengGain.kind === "skill" && eventVisuals.xinshengGain.visualTitle.includes("观星") && eventVisuals.xinshengGain.detail.includes("获得 观星"), `新生 should show the permanent gained skill and its name: ${JSON.stringify(eventVisuals.xinshengGain)}`);
  assert(eventVisuals.dying.kind === "dying" && eventVisuals.dying.visualDirected && eventVisuals.dying.detail.includes("需要"), `Dying should show target and rescue need: ${JSON.stringify(eventVisuals.dying)}`);
  assert(eventVisuals.dying.mood === "danger" && eventVisuals.dying.outcome === "求桃" && eventVisuals.dying.castHasOutcome, `Dying should have a danger mood and rescue-needed badge: ${JSON.stringify(eventVisuals.dying)}`);
  assert(eventVisuals.rescue.kind === "heal" && eventVisuals.rescue.visualDirected && eventVisuals.rescue.detail.includes("救援"), `Rescue should show who saved whom: ${JSON.stringify(eventVisuals.rescue)}`);
  assert(eventVisuals.rescue.mood === "recovery" && eventVisuals.rescue.outcome === "救援" && eventVisuals.rescue.castHasOutcome, `Rescue should have a recovery mood and explicit rescue badge: ${JSON.stringify(eventVisuals.rescue)}`);
  assert(eventVisuals.rescue.visualRelationRescue && eventVisuals.rescue.routeTargets.includes("曹操"), `Peach rescue center visual should emphasize the rescuer -> dying player relationship: ${JSON.stringify(eventVisuals.rescue)}`);
  assert(eventVisuals.selfWineRescue.kind === "heal" && eventVisuals.selfWineRescue.visualTitle === "酒" && eventVisuals.selfWineRescue.detail.includes("自救") && eventVisuals.selfWineRescue.targetCount === 1, `Wine self-rescue should visibly show who saved themselves: ${JSON.stringify(eventVisuals.selfWineRescue)}`);
  assert(eventVisuals.death.kind === "death" && eventVisuals.death.routeTargets.includes("曹操") && eventVisuals.death.detail.includes("身份"), `Death should show target and revealed identity: ${JSON.stringify(eventVisuals.death)}`);
  assert(eventVisuals.death.mood === "danger" && eventVisuals.death.outcome === "亮身份" && eventVisuals.death.castHasOutcome, `Death should have a danger mood and identity-reveal badge: ${JSON.stringify(eventVisuals.death)}`);
  assert(eventVisuals.death.visualDeathReveal && eventVisuals.death.visualDeathRevealText.includes("曹操") && eventVisuals.death.visualDeathRevealText.includes("主公"), `Death should render a prominent revealed-identity chip in the center event: ${JSON.stringify(eventVisuals.death)}`);
  assert(eventVisuals.dodgeResponse.importance === "important" && eventVisuals.dying.importance === "important", `Responses and dying states should be important events: ${JSON.stringify(eventVisuals)}`);
  assert(eventVisuals.dodgeResponse.holdDuration > eventVisuals.draw.holdDuration, `Response events should pause longer than draw events: ${JSON.stringify({ response: eventVisuals.dodgeResponse, draw: eventVisuals.draw })}`);

  const skillGainUi = api.prepareSkillGainVisualScenario();
  assert(skillGainUi.centerText.includes("化身") && skillGainUi.centerText.includes("奇才"), `Skill-gain center event should visibly name the gained skill: ${skillGainUi.centerText}`);
  assert(skillGainUi.centerText.includes("获得技能") || skillGainUi.centerText.includes("锦囊距离限制放宽"), `Skill-gain center event should explain the gained skill: ${skillGainUi.centerText}`);
  assert(skillGainUi.logHtml.includes("化身：奇才") && skillGainUi.logHtml.includes("锦囊距离限制放宽"), `Skill-gain battle log should show the gained skill rule: ${skillGainUi.logHtml}`);
  assert(skillGainUi.boardHtml.includes("skill-temp") && skillGainUi.boardHtml.includes("奇才"), `Skill-gain player card should show the temporary gained skill tag: ${skillGainUi.boardHtml}`);

  const delayedNullifyUi = api.prepareDelayedNullifyVisualScenario();
  assert(delayedNullifyUi.centerText.includes("乐不思蜀") && delayedNullifyUi.centerText.includes("无懈可击"), `Delayed-nullify center event should visibly name the delayed trick and nullify: ${delayedNullifyUi.centerText}`);
  assert(delayedNullifyUi.centerText.includes("判定阶段"), `Delayed-nullify center event should explain the judgement timing: ${delayedNullifyUi.centerText}`);
  assert(delayedNullifyUi.logHtml.includes("诸葛亮") && delayedNullifyUi.logHtml.includes("乐不思蜀") && delayedNullifyUi.logHtml.includes("判定阶段"), `Delayed-nullify battle log should show who nullified which delayed trick and when: ${delayedNullifyUi.logHtml}`);

  const tempo = api.tempoContractSummary();
  assert(tempo.ultra.response >= 4200, `Ultra-slow tempo should hold response events for watcher-readable pacing: ${JSON.stringify(tempo)}`);
  assert(tempo.ultra.dying >= 5000, `Ultra-slow tempo should make dying/rescue windows hard to miss: ${JSON.stringify(tempo)}`);
  assert(tempo.ultra.draw >= 1200 && tempo.ultra.draw < tempo.ultra.response, `Ultra-slow tempo should still keep minor draw events shorter than responses: ${JSON.stringify(tempo)}`);
  assert(tempo.ultra.response > tempo.slow.response * 1.45, `Ultra-slow tempo should be materially slower than slow tempo: ${JSON.stringify(tempo)}`);
  assert(tempo.slow.response >= 2600, `Slow tempo should hold response events long enough to read: ${JSON.stringify(tempo)}`);
  assert(tempo.slow.dying >= 3200, `Slow tempo should make dying/rescue windows very visible: ${JSON.stringify(tempo)}`);
  assert(tempo.slow.draw >= 850 && tempo.slow.draw < tempo.slow.response, `Slow tempo should still keep minor draw events shorter than responses: ${JSON.stringify(tempo)}`);
  assert(tempo.slow.response > tempo.normal.response * 2.4, `Slow tempo should be noticeably slower than normal tempo: ${JSON.stringify(tempo)}`);
  assert(tempo.normal.response > tempo.fast.response * 1.8, `Normal tempo should remain clearly slower than fast tempo: ${JSON.stringify(tempo)}`);

  const battleLog = api.battleLogContractSummary();
  assert(battleLog.hasLatestFirst && battleLog.firstCurrent, `Battle log should show the current/latest turn first: ${JSON.stringify(battleLog.sectionTitles)}`);
  assert(battleLog.hasActionHeader, "Battle log entries should render a structured action header.");
  assert(battleLog.hasCardAction, `Battle log should expose useful card and draw actions: ${JSON.stringify(battleLog)}`);
  assert(battleLog.hasTargetRoute, `Battle log should show actor-to-target routes: ${JSON.stringify(battleLog)}`);
  assert(battleLog.hasJudgeRewrite, `Battle log should summarize judge rewrites as useful routed actions: ${JSON.stringify(battleLog)}`);
  assert(battleLog.hasJudgeRewriteKind, `Battle log judge rewrites should be grouped as judgement entries, not generic skill text: ${JSON.stringify(battleLog)}`);
  assert(battleLog.hasNullifyRoute, `Battle log should show who used nullify and which trick was cancelled: ${JSON.stringify(battleLog)}`);
  assert(battleLog.hasNullifyResponseKind, `Battle log nullify use should be grouped as a response, not a generic card play: ${JSON.stringify(battleLog)}`);
  assert(battleLog.hasDelayedNullifyJudge, `Battle log should show delayed-trick nullify as judgement-stage resolution: ${JSON.stringify(battleLog)}`);
  assert(battleLog.hasSkillGain && battleLog.hasSkillGainRule, `Battle log should show newly gained skills with their rule text: ${JSON.stringify(battleLog)}`);
  assert(battleLog.hasDamageDetail, `Battle log should include damage detail, not just turn starts: ${JSON.stringify(battleLog)}`);
  assert(battleLog.suppressesNoResponseNoise, `Battle log should skip failed response noise and let damage/rescue carry the important information: ${JSON.stringify(battleLog)}`);
  assert(battleLog.hasDiscardKind && battleLog.hasDiscardDetail, `Battle log should show discard actions with the exact discarded cards: ${JSON.stringify(battleLog)}`);
  assert(battleLog.hasDyingSection, `Battle log should visibly separate dying states from generic damage: ${JSON.stringify(battleLog)}`);
  assert(battleLog.hasRescueRoute, `Battle log should show who rescued a dying player and with what kind of action: ${JSON.stringify(battleLog)}`);
  assert(battleLog.hasDyingRecovery, `Battle log should show that the dying player recovered after rescue: ${JSON.stringify(battleLog)}`);

  const nameDisplay = api.nameDisplayContractSummary();
  assert(nameDisplay.aiName === "黄月英", `AI-controlled seats should use the general name as the main name: ${JSON.stringify(nameDisplay)}`);
  assert(nameDisplay.humanName === "你(司马懿)", `Human seat should keep the player-facing you(general) label: ${JSON.stringify(nameDisplay)}`);
  assert(nameDisplay.aiCardHasGeneralMainName, `Rendered AI player card should show the general name as the primary title: ${JSON.stringify(nameDisplay)}`);
  assert(nameDisplay.aiCardHasSeatMetadata, `Rendered AI player card should keep seat metadata without using it as the main name: ${JSON.stringify(nameDisplay)}`);
  assert(nameDisplay.miniPortraitUsesSeatOnlyAsSmallMarker, `Seat markers should be small supporting labels in mini portraits: ${JSON.stringify(nameDisplay)}`);
  assert(nameDisplay.battleLogUsesGeneralNames, `Battle log should use general names rather than AI-numbered labels: ${JSON.stringify(nameDisplay)}`);
  assert(!nameDisplay.leakedAINumber, `Rendered player UI should not leak AI-numbered names: ${JSON.stringify(nameDisplay)}`);

  const humanPlayUi = await api.humanPlayUiContractSummary();
  assert(humanPlayUi.initial.playContext && humanPlayUi.initial.actionCount >= 2, `Human play UI should enter a real play context with playable actions: ${JSON.stringify(humanPlayUi.initial)}`);
  assert(humanPlayUi.initial.handHtml.includes("card-target") && humanPlayUi.initial.handHtml.includes("选目标"), `Playable target cards should be visibly marked for direct click: ${humanPlayUi.initial.handHtml}`);
  assert(!humanPlayUi.initial.handHtml.includes("card-has-image") && !humanPlayUi.initial.handHtml.includes("card-art-image"), `Human hand cards should use the mockup text-card surface, not local card art classes: ${humanPlayUi.initial.handHtml}`);
  assert(!humanPlayUi.initial.handHtml.includes("assets/cards/official/"), `Human hand cards should not render official card-art URLs in the player-facing UI: ${humanPlayUi.initial.handHtml}`);
  assert(humanPlayUi.initial.handHtml.includes("card-tone-attack") && humanPlayUi.initial.handHtml.includes("card-tone-heal"), `Text cards should expose semantic color tone classes for at-a-glance reading: ${humanPlayUi.initial.handHtml}`);
  assert(humanPlayUi.initial.handHtml.includes("long-name") && humanPlayUi.initial.handHtml.includes("无懈可击"), `Long card names such as 无懈可击 should use the readable long-name layout: ${humanPlayUi.initial.handHtml}`);
  assert(humanPlayUi.initial.handHtml.includes("card-play-badge") && humanPlayUi.initial.handHtml.includes("点出"), `Directly playable cards should have a visible play badge: ${humanPlayUi.initial.handHtml}`);
  assert(humanPlayUi.initial.handHtml.includes("操作：点击此牌"), `Hand-card tooltips should explain click behavior: ${humanPlayUi.initial.handHtml}`);
  assert(humanPlayUi.initial.actionBarHtml.includes("结束出牌"), `Human play UI should keep end-phase controls visible before selecting a card: ${humanPlayUi.initial.actionBarHtml}`);
  assert(humanPlayUi.initial.actionBarHtml.includes("底部只显示主动技能和结束出牌等命令"), `Idle action bar tooltip should explain why only command buttons are shown: ${humanPlayUi.initial.actionBarHtml}`);
  assert(humanPlayUi.initial.handModeText.includes("出牌阶段"), `Hand area should show the current play-mode prompt: ${humanPlayUi.initial.handModeText}`);
  assert(humanPlayUi.initial.humanStatsHtml.includes("human-stat-equip") && humanPlayUi.initial.humanStatsHtml.includes("青龙偃月刀"), `Human personal seat should show equipped weapon status: ${humanPlayUi.initial.humanStatsHtml}`);
  assert(humanPlayUi.initial.humanStatsHtml.includes("human-stat-judge") && humanPlayUi.initial.humanStatsHtml.includes("乐不思蜀"), `Human personal seat should show judgement-zone cards: ${humanPlayUi.initial.humanStatsHtml}`);
  assert(humanPlayUi.initial.humanStatsHtml.includes("human-stat-chain") && humanPlayUi.initial.humanStatsText.includes("铁索"), `Human personal seat should show chain/linked state: ${humanPlayUi.initial.humanStatsHtml}`);
  assert(humanPlayUi.initial.handPanelClass.includes("hand-state-play") && humanPlayUi.initial.handModeHtml.includes("hand-mode-mark") && humanPlayUi.initial.handModeHtml.includes("hand-flow"), `Hand area should expose play state as a structured operation HUD: ${JSON.stringify(humanPlayUi.initial)}`);
  assert(["准备", "判定", "摸牌", "出牌", "弃牌", "结束"].every((label) => humanPlayUi.initial.tableStatusText.includes(label)) && humanPlayUi.initial.tableStatusHtml.includes("status-phase-step"), `Top table status should render the mockup-style phase capsule rail: ${humanPlayUi.initial.tableStatusText}`);
  assert(humanPlayUi.initial.hardIssues.length === 0, `Initial human play wait should not have non-human consistency issues: ${JSON.stringify(humanPlayUi.initial)}`);
  assert(humanPlayUi.afterClick.targetPick && humanPlayUi.afterClick.waitKind === "选目标", `Clicking a Slash hand card should enter target selection: ${JSON.stringify(humanPlayUi.afterClick)}`);
  assert(humanPlayUi.afterClick.selectedCardName === "杀", `Clicked card should remain selected while choosing targets: ${JSON.stringify(humanPlayUi.afterClick)}`);
  assert(humanPlayUi.afterClick.targetPick.validNames.includes("曹操"), `Target selection should expose legal target player cards: ${JSON.stringify(humanPlayUi.afterClick.targetPick)}`);
  assert(humanPlayUi.afterClick.handModeText.includes("选择目标"), `Hand area should switch to target-pick prompt after selecting a target card: ${humanPlayUi.afterClick.handModeText}`);
  assert(humanPlayUi.afterClick.handPanelClass.includes("hand-state-target") && humanPlayUi.afterClick.handModeHtml.includes("点目标") && humanPlayUi.afterClick.handModeHtml.includes("确认"), `Target selection should show the target step flow in the hand HUD: ${JSON.stringify(humanPlayUi.afterClick)}`);
  assert(humanPlayUi.afterClick.tableStatusHtml.includes("status-phase") && humanPlayUi.afterClick.tableStatusText.includes("出牌"), `Top table status should keep the play phase highlighted while target selection starts: ${humanPlayUi.afterClick.tableStatusText}`);
  assert(humanPlayUi.afterClick.actionBarHtml.includes("确认目标") && humanPlayUi.afterClick.actionBarHtml.includes("取消"), `Target selection should show confirm/cancel controls in the bottom action bar: ${humanPlayUi.afterClick.actionBarHtml}`);
  assert(humanPlayUi.afterClick.actionBarHtml.includes("请为【杀】指定目标") && humanPlayUi.afterClick.actionBarHtml.includes("0/1"), `Target-pick action hint should clearly describe the pending selection: ${humanPlayUi.afterClick.actionBarHtml}`);
  assert(!humanPlayUi.afterClick.handHtml.includes("data-tip="), `Target-pick hand cards should suppress hover tooltips so they do not cover target selection: ${humanPlayUi.afterClick.handHtml}`);
  assert(humanPlayUi.afterClick.boardHtml.includes("杀") && humanPlayUi.afterClick.boardHtml.includes("选择目标后确认使用"), `Center event should preview the selected direct-click card and next step: ${humanPlayUi.afterClick.boardHtml}`);
  assert(humanPlayUi.afterClick.boardHtml.includes("center-event-directed") && humanPlayUi.afterClick.boardHtml.includes("mini-portrait"), `Center preview should show a directed actor-to-target visual, not only text: ${humanPlayUi.afterClick.boardHtml}`);
  assert(humanPlayUi.afterClick.hardIssues.length === 0, `After direct-click target selection should not have non-human wait consistency issues: ${JSON.stringify(humanPlayUi.afterClick)}`);
  assert(humanPlayUi.afterCancel.playContext && !humanPlayUi.afterCancel.targetPick && humanPlayUi.afterCancel.playCardId == null, `Cancelling target selection should restore the play context cleanly: ${JSON.stringify(humanPlayUi.afterCancel)}`);

  const boardUi = api.boardUiContractSummary();
  for (const board of [boardUi.five, boardUi.eight]) {
    const expectedPlayers = board.mode === "5" ? 5 : 8;
    assert(board.boardClass.includes(`players-${expectedPlayers}`), `${board.mode}-player board should carry the matching layout class: ${JSON.stringify(board)}`);
    assert(board.playerCount === expectedPlayers, `${board.mode}-player board should render every player card: ${JSON.stringify(board)}`);
    assert(board.allSeatClassesPresent, `${board.mode}-player board should render every seat class p0..pN: ${JSON.stringify(board)}`);
    assert(board.hasHumanSeat, `${board.mode}-player board should keep the human seat visually identifiable: ${JSON.stringify(board)}`);
    assert(board.hasHumanPanelSeat, `${board.mode}-player board should render the bottom personal seat, not an empty frame: ${JSON.stringify(board)}`);
    assert(board.hasCurrentBadge && board.hasNextBadge, `${board.mode}-player board should show current actor and next-player markers: ${JSON.stringify(board)}`);
    assert(board.hasSeatFocusLayer, `${board.mode}-player board should render a seat-focus layer for strong actor/target highlights: ${JSON.stringify(board)}`);
    assert(board.hasRoleNotes && board.hasManualIdentityColors, `${board.mode}-player board should keep manual identity note controls and colors: ${JSON.stringify(board)}`);
    assert(board.hidesDebugRoleNoteLabels, `${board.mode}-player board should use compact identity tokens instead of debug-like 标反/标忠 labels: ${JSON.stringify(board)}`);
    assert(board.hasHandCounts, `${board.mode}-player board should expose public hand counts for all seats: ${JSON.stringify(board)}`);
    assert(board.hasPublicEquipChip && board.hasPublicJudgeChip && board.hasPublicStateChip, `${board.mode}-player board should show public equipment, judgement, chain/flip state chips: ${JSON.stringify(board)}`);
    assert(board.hasSkillTags && board.hidesDefaultReadBadge, `${board.mode}-player board should keep skills visible while moving AI read badges out of normal player cards: ${JSON.stringify(board)}`);
    assert(board.hasDirectedCenter && board.hasTurnCompass, `${board.mode}-player board should show directed center event and turn compass: ${JSON.stringify(board)}`);
    assert(board.hasTableHud, `${board.mode}-player board should show compact table state in the center header: ${JSON.stringify(board)}`);
    assert(board.hasTablePilesDock, `${board.mode}-player board should show physical deck/discard/judgement pile positions: ${JSON.stringify(board)}`);
    assert(board.hasLiveSpotlightLog, `${board.mode}-player board should show the live center event in battle log when history is empty: ${JSON.stringify(board)}`);
    assert(!board.leakedAINumber, `${board.mode}-player board should not leak AI-numbered display names: ${JSON.stringify(board)}`);
  }

  const results = [];
  const smokeScenarios = [
    { mode: "5", rosterMode: "strict" },
    { mode: "8", rosterMode: "strict" },
    { mode: "5", rosterMode: "all" },
    { mode: "8", rosterMode: "all" }
  ];
  for (const { mode, rosterMode } of smokeScenarios) {
    const result = await api.runSmokeTest({ mode, rosterMode, turns: 80, aiMode: "strategist" });
    results.push(result);
    if (result.issues.length) {
      throw new Error(`Mode ${mode}/${rosterMode} smoke test found wait issues: ${JSON.stringify(result.issues, null, 2)}`);
    }
    assert(result.rosterMode === rosterMode, `Mode ${mode}/${rosterMode}: smoke test should use the requested roster mode.`);
    if (result.gameOver) {
      assert(result.winner.includes("获胜"), `Mode ${mode}/${rosterMode}: finished games should record a winner in the smoke summary.`);
    }
    assert(!/AI\s+\d/.test(JSON.stringify(result)), `Mode ${mode}/${rosterMode} leaked AI-numbered player names in smoke output.`);
  }

  console.log(JSON.stringify({ ok: true, parserCases: parserCases.length, cardImages: cardImages.count, tooltipCards: tooltips.cardTooltips.length, layoutGuardrails, turnFlows, ruleRegressions, aiSupport, career, victory, identityReads, lordTargeting, readsPanel, eventVisuals, tempo, battleLog, nameDisplay, boardUi, results }, null, 2));
}

run().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exitCode = 1;
});
