import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, "..");
const outputDir = process.env.SGS_VISUAL_OUTPUT || path.join("/tmp", "sanguosha-visual-check");
const defaultChromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const chromePath = process.env.CHROME_PATH || defaultChromePath;
const playwrightModulePath = process.env.PLAYWRIGHT_MODULE_PATH;

function loadPlaywright() {
  try {
    return require("playwright");
  } catch (error) {
    if (playwrightModulePath) return require(playwrightModulePath);
    throw new Error(
      `Playwright is required for visual layout checks. Install it locally or set PLAYWRIGHT_MODULE_PATH. Original error: ${error.message}`
    );
  }
}

function fileUrl(query = "") {
  const url = pathToFileURL(path.join(root, "index.html")).href;
  return `${url}${query}`;
}

const viewports = [
  { name: "desktop-1280", width: 1280, height: 720 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844 }
];

async function collectLayout(page, viewport, stage) {
  const snapshot = await page.evaluate(({ viewport, stage }) => {
    const rect = (selector) => {
      const node = document.querySelector(selector);
      if (!node) return null;
      const box = node.getBoundingClientRect();
      return {
        selector,
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        top: box.top,
        right: box.right,
        bottom: box.bottom,
        left: box.left
      };
    };
    const allRects = (selector) => Array.from(document.querySelectorAll(selector)).map((node, index) => {
      const box = node.getBoundingClientRect();
      return {
        selector,
        index,
        id: Number(node.dataset.id ?? -1),
        seat: Number(node.dataset.seat ?? -1),
        className: node.className || "",
        text: (node.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80),
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        top: box.top,
        right: box.right,
        bottom: box.bottom,
        left: box.left
      };
    });
    const overlapArea = (a, b) => {
      if (!a || !b) return 0;
      const width = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
      const height = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
      return width * height;
    };
    const containsRect = (outer, inner, margin = 0) => Boolean(
      outer
      && inner
      && inner.left >= outer.left - margin
      && inner.top >= outer.top - margin
      && inner.right <= outer.right + margin
      && inner.bottom <= outer.bottom + margin
    );
    const overlapRect = (a, b) => {
      if (!a || !b) return null;
      const left = Math.max(a.left, b.left);
      const right = Math.min(a.right, b.right);
      const top = Math.max(a.top, b.top);
      const bottom = Math.min(a.bottom, b.bottom);
      if (right <= left || bottom <= top) return null;
      return { left, right, top, bottom, width: right - left, height: bottom - top };
    };
    const centerVisiblyCovers = (centerBox, playerBox) => {
      const overlap = overlapRect(centerBox, playerBox);
      if (!overlap || overlap.width * overlap.height < 360) return false;
      const x = overlap.left + overlap.width / 2;
      const y = overlap.top + overlap.height / 2;
      const topNode = document.elementFromPoint(x, y);
      const centerNode = document.querySelector(".center-mat");
      const playerNode = document.querySelectorAll(".player")[playerBox.index];
      return Boolean(topNode && centerNode?.contains(topNode) && !playerNode?.contains(topNode));
    };
    const inViewport = (box, margin = 1) => (
      box
      && box.left >= -margin
      && box.top >= -margin
      && box.right <= window.innerWidth + margin
      && box.bottom <= window.innerHeight + margin
    );
    const issues = [];
    const warnings = [];
    const game = rect("#game");
    const boardWrap = rect(".board-wrap");
    const board = rect("#board");
    const center = rect(".center-mat");
    const handPanel = rect(".hand-panel");
    const humanSeat = rect("#humanName");
    const hand = rect("#hand");
    const actionBar = rect("#actionBar");
    const sidePanel = rect(".side-panel");
    const log = rect("#log");
    const readsPanel = rect("#readsPanel");
    const prompt = rect("#prompt");
    const tooltip = rect("#tooltip:not(.hidden)");
    const identityPopover = rect("#identityPopover:not(.hidden)");
    const identityTrigger = rect(".player:not(.human) .role-note");
    const firstOtherPlayer = rect(".player:not(.human)");
    const endGameModal = rect("#endGameModal:not(.hidden)");
    const endGameCard = rect("#endGameCard");
    const endGameContent = rect("#endGameContent");
    const endGameCareerCallout = rect(".endgame-career-callout");
    const endGameActionRow = rect(".endgame-actions");
    const players = allRects(".player");
    const zoneLines = allRects(".player-zones .zone-line").filter((box) => box.width > 8 && box.height > 8);
    const cards = allRects("#hand .card");
    const logMessages = allRects(".log-message").filter((box) => box.width > 8 && box.height > 8);
    const actionButtons = allRects("#actionBar button");
    const actionHint = rect("#actionBar .action-hint-task");
    const actionHintMain = rect("#actionBar .action-task-main");
    const actionHintDetail = rect("#actionBar .action-task-detail");
    const targetButtons = allRects("#confirmTargets, #cancelTargets");
    const endGameActions = allRects("[data-endgame-action]");
    const endGameCareerTiles = allRects(".endgame-career-grid > div");
    const eventMarkers = allRects(".player .event-marker");
    const topbarControls = allRects(".topbar button, .topbar select");
    const confirmTargets = document.querySelector("#confirmTargets");
    const actionTaskMainText = (document.querySelector(".action-hint-task .action-task-main")?.textContent || "").replace(/\s+/g, " ").trim();
    const actionTaskMetaText = (document.querySelector(".action-hint-task .action-task-meta")?.textContent || "").replace(/\s+/g, " ").trim();
    const humanStatsText = (document.querySelector("#humanStats")?.textContent || "").replace(/\s+/g, " ").trim();
    const humanSeatText = (document.querySelector("#humanName")?.textContent || "").replace(/\s+/g, " ").trim();
    const centerText = (document.querySelector(".center-mat")?.textContent || "").replace(/\s+/g, " ").trim();
    const logText = (document.querySelector("#log")?.textContent || "").replace(/\s+/g, " ").trim();
    const readsText = (document.querySelector("#readsPanel")?.textContent || "").replace(/\s+/g, " ").trim();
    const boardText = (document.querySelector("#board")?.textContent || "").replace(/\s+/g, " ").trim();
    const endGameText = (document.querySelector("#endGameContent")?.textContent || "").replace(/\s+/g, " ").trim();
    const tooltipText = (document.querySelector("#tooltip:not(.hidden)")?.textContent || "").replace(/\s+/g, " ").trim();
    const identityPopoverText = (document.querySelector("#identityPopover:not(.hidden)")?.textContent || "").replace(/\s+/g, " ").trim();
    const identityPopoverNode = document.querySelector("#identityPopover");
    const identityPopoverStyle = identityPopoverNode ? getComputedStyle(identityPopoverNode) : null;
    const identityPopoverInBody = identityPopoverNode?.parentElement === document.body;
    const compactCenterText = centerText.replace(/\s+/g, "");
    const compactLogText = logText.replace(/\s+/g, "");
    const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
    const desktop = viewport.width >= 900;
    const logExpectedVisible = !stage.includes("log-collapsed") && !stage.includes("panel-collapsed") && !stage.includes("ai-decision") && !stage.includes("endgame");

    if (!game || game.height < 100) issues.push("game screen is not visible");
    if (desktop && scrollHeight > window.innerHeight + 8) issues.push(`desktop page has vertical scroll ${scrollHeight} > ${window.innerHeight}`);
    if (scrollWidth > window.innerWidth + 8) issues.push(`page has horizontal scroll ${scrollWidth} > ${window.innerWidth}`);
    if (topbarControls.some((box) => !inViewport(box, 2))) issues.push("topbar controls are outside viewport");
    if (!desktop && eventMarkers.some((box) => box.width > 70)) issues.push("mobile event marker is too wide and may cover the player card");
    if (eventMarkers.some((box) => !inViewport(box, 2))) issues.push("event marker is outside viewport");
    if (!handPanel || !inViewport(handPanel, 2)) issues.push("hand panel is not fully inside viewport");
    if (handPanel && desktop && handPanel.height > window.innerHeight * 0.32) issues.push(`hand panel is too tall: ${Math.round(handPanel.height)}px`);
    if (!actionBar || !inViewport(actionBar, 2)) issues.push("action bar is not fully inside viewport");
    if (handPanel && actionBar && overlapArea(handPanel, actionBar) < actionBar.width * actionBar.height * 0.96) issues.push("action bar is not contained by hand panel");
    if (boardWrap && handPanel && boardWrap.bottom > handPanel.top + 2) issues.push("board area overlaps the hand panel");
    if (!board || board.width < 200 || board.height < 200) issues.push("board is too small or missing");
    if (!center || center.height < 90) issues.push("center event panel is too small or missing");
    if (center && desktop && center.height > 340) issues.push(`center event panel is too tall: ${Math.round(center.height)}px`);
    if (center && !desktop && center.height > 310) issues.push(`mobile center event panel is too tall: ${Math.round(center.height)}px`);
    if (center && handPanel && overlapArea(center, handPanel) > 4) issues.push("center event overlaps hand panel");
    if (players.length && handPanel) {
      const covered = players.filter((box) => overlapArea(box, handPanel) > 20).map((box) => box.text);
      if (covered.length) issues.push(`player cards overlap hand panel: ${covered.join(" | ")}`);
    }
    for (let i = 0; i < players.length; i += 1) {
      for (let j = i + 1; j < players.length; j += 1) {
        const area = overlapArea(players[i], players[j]);
        if (area > 80) issues.push(`player cards overlap: ${players[i].text} / ${players[j].text}`);
      }
    }
    if (center && players.length) {
      const centerCovered = players
        .filter((box) => centerVisiblyCovers(center, box))
        .map((box) => box.text);
      if (centerCovered.length) warnings.push(`center event visibly covers player cards: ${centerCovered.join(" | ")}`);
    }
    if (cards.length && hand) {
      const cardTopLimit = handPanel?.top ?? hand.top;
      const actionBarOverlap = actionBar ? overlapRect(hand, actionBar) : null;
      const actionBarIsBelowHand = Boolean(
        actionBarOverlap
        && actionBarOverlap.width > Math.min(hand.width, actionBar.width) * 0.2
        && actionBar.top >= hand.top
      );
      const cardBottomLimit = actionBarIsBelowHand ? actionBar.top : handPanel?.bottom ?? hand.bottom;
      const hiddenCards = cards.filter((box) => box.bottom > cardBottomLimit + 2 || box.top < cardTopLimit - 2);
      if (hiddenCards.length) issues.push(`hand cards are vertically clipped: ${hiddenCards.map((box) => box.text).join(" | ")}`);
    }
    if (stage.includes("target") && targetButtons.length < 2) issues.push("target selection does not show confirm/cancel buttons");
    if (stage.includes("target") && targetButtons.some((box) => !inViewport(box, 2))) issues.push("target confirm/cancel buttons are outside viewport");
    if (stage.includes("target-selected") && confirmTargets?.disabled) issues.push("target confirm button is still disabled after selecting a target");
    if (/human-(initial|target|target-selected|after-cancel)/.test(stage) && (!actionTaskMainText || !actionTaskMetaText)) issues.push("human operation prompt is missing task-card main text or progress metadata");
    if (stage.includes("human-initial") && !actionTaskMetaText.includes("出牌阶段")) issues.push(`human play prompt should show the current task metadata: ${actionTaskMetaText}`);
    if (stage.includes("human-initial") && (!humanStatsText.includes("青龙偃月刀") || !humanStatsText.includes("乐不思蜀") || !humanStatsText.includes("铁索"))) issues.push(`human personal seat is missing public self states: ${humanStatsText}`);
    if (stage.includes("action-prompt-overflow")) {
      if (!actionBar || !actionHint || actionButtons.length < 6) issues.push("overflow prompt scenario did not render the expected task panel and buttons");
      const buttonsOutside = actionButtons.filter((box) => actionBar && !containsRect(actionBar, box, 2));
      if (buttonsOutside.length) issues.push(`overflow prompt buttons escaped the action panel: ${buttonsOutside.map((box) => box.text).join(" | ")}`);
      const textButtonOverlaps = actionButtons
        .filter((button) => overlapArea(button, actionHintMain) > 6 || overlapArea(button, actionHintDetail) > 6)
        .map((button) => button.text);
      if (textButtonOverlaps.length) issues.push(`overflow prompt buttons overlap task copy: ${textButtonOverlaps.join(" | ")}`);
      if (actionHintMain && actionHintMain.height < 16) issues.push(`overflow prompt title row is clipped: ${Math.round(actionHintMain.height)}px`);
      if (actionBar && actionBar.height < 96) issues.push(`overflow prompt panel is too short for multi-option choices: ${Math.round(actionBar.height)}px`);
    }
    if (stage.includes("board-eight-contract") && (!humanSeat || !humanSeatText.includes("赵云") || !humanSeatText.includes("主公") || !/\d+\s*\/\s*\d+/.test(humanSeatText))) issues.push(`contract board left personal seat is blank or incomplete: ${humanSeatText}`);
    if (/^(?<name>[\u3400-\u9fffA-Za-z0-9·]{1,8})\s+\k<name>\b/.test(humanSeatText)) issues.push(`bottom personal seat repeats the general name inside the portrait and label: ${humanSeatText}`);
    if (stage.includes("target") && !/\d+\/\d+/.test(actionTaskMetaText)) issues.push(`target prompt should show selected/required target progress metadata: ${actionTaskMetaText}`);
    if (stage.includes("after-cancel") && document.querySelector("#confirmTargets")) issues.push("target controls are still visible after cancelling target selection");
    if (stage.includes("after-cancel") && !document.querySelector("#endPhase")) issues.push("play controls did not return after cancelling target selection");
    if (stage.includes("after-confirm") && document.querySelector("#confirmTargets")) issues.push("target controls are still visible after confirming target selection");
    if (stage.includes("log-expanded") && desktop && !document.querySelector("#game")?.classList.contains("log-expanded")) issues.push("log expanded state class is missing");
    if (stage.includes("log-collapsed") && desktop && !document.querySelector("#game")?.classList.contains("log-collapsed")) issues.push("log collapsed state class is missing");
    if (stage.includes("panel-collapsed") && !document.querySelector("#game")?.classList.contains("panel-collapsed")) issues.push("side panel collapsed state class is missing");
    if (stage.includes("log-collapsed") && log && log.height > 2) issues.push(`collapsed battle log is still taking space: ${Math.round(log.height)}px`);
    if (stage.includes("log-expanded") && desktop && log && log.height < 260) issues.push(`expanded battle log rail is too short: ${Math.round(log.height)}px`);
    if (desktop && stage.includes("log-expanded") && logMessages.length >= 4) {
      const avgLogMessageHeight = logMessages.reduce((sum, box) => sum + box.height, 0) / logMessages.length;
      if (avgLogMessageHeight > 42) issues.push(`expanded battle log entries are too loose: ${Math.round(avgLogMessageHeight)}px average`);
    }
    if (desktop && logExpectedVisible && sidePanel && log && log.height < 200) warnings.push(`battle log rail is short: ${Math.round(log.height)}px`);
    if (prompt && prompt.height > 120) warnings.push(`prompt is unusually tall: ${Math.round(prompt.height)}px`);
    if (stage.includes("skill-gain")) {
      if (!centerText.includes("化身") || !centerText.includes("奇才")) issues.push("skill gain center event does not show 化身/奇才");
      if (!centerText.includes("获得技能") && !centerText.includes("锦囊距离限制放宽")) issues.push("skill gain center event does not explain the gained skill");
      if (!logText.includes("化身：奇才") || !logText.includes("锦囊距离限制放宽")) issues.push("skill gain battle log does not show the gained skill rule");
      if (!boardText.includes("奇才")) issues.push("skill gain player card does not show the gained skill tag");
    }
    if (stage.includes("delayed-nullify")) {
      if (!centerText.includes("乐不思蜀") || !centerText.includes("无懈可击")) issues.push("delayed nullify center event does not show 乐不思蜀/无懈可击");
      if (!centerText.includes("判定阶段")) issues.push("delayed nullify center event does not show judgement timing");
      if (!logText.includes("诸葛亮") || !logText.includes("乐不思蜀") || !logText.includes("判定阶段")) issues.push("delayed nullify battle log does not show responder, delayed trick, and judgement timing");
    }
    if (stage.includes("relation-event")) {
      if (!document.querySelector(".visual-relation-caption")) issues.push("relation event center visual does not render the who-affected-whom caption");
      if (!document.querySelector(".visual-relation-rescue")) issues.push("relation event center visual does not use the rescue relation styling");
      if (!centerText.includes("刘备") || !centerText.includes("救援") || !centerText.includes("曹操")) issues.push("relation event center text does not show who rescued whom");
      if (!logText.includes("刘备") || !logText.includes("救援") || !logText.includes("曹操") || !logText.includes("脱离濒死")) issues.push("relation event battle log does not show rescue and recovery");
    }
    if (stage.includes("death-reveal")) {
      if (!document.querySelector(".visual-death-reveal")) issues.push("death reveal center visual does not render the revealed-identity chip");
      if (!centerText.includes("曹操") || !centerText.includes("忠臣") || !centerText.includes("身份")) issues.push("death reveal center text does not show dead player and revealed role");
      if (!logText.includes("曹操") || !logText.includes("击杀") || !logText.includes("忠臣")) issues.push("death reveal battle log does not show killer, dead player, and role");
    }
    if (desktop && board && (stage.includes("started-5") || stage.includes("started-8") || stage.includes("board-eight-contract"))) {
      const visibleSeat = (id) => players.find((box) => box.id === id && box.width > 8 && box.height > 8);
      const boardMidX = board.left + board.width / 2;
      const boardMidY = board.top + board.height / 2;
      const onLeft = (box) => box && box.left < boardMidX - 20;
      const onRight = (box) => box && box.right > boardMidX + 20;
      const upper = (box) => box && box.top < boardMidY;
      const lower = (box) => box && box.bottom > boardMidY;
      if (stage.includes("started-5")) {
        const p1 = visibleSeat(1);
        const p2 = visibleSeat(2);
        const p3 = visibleSeat(3);
        const p4 = visibleSeat(4);
        if (!onRight(p1) || !lower(p1)) issues.push("5-player p1 is not in the lower-right next counter-clockwise seat from the human badge");
        if (!onRight(p2) || !upper(p2)) issues.push("5-player p2 is not in the upper-right counter-clockwise seat");
        if (!onLeft(p3) || !upper(p3)) issues.push("5-player p3 is not in the upper-left counter-clockwise seat");
        if (!onLeft(p4) || !lower(p4)) issues.push("5-player p4 is not in the lower-left previous seat from the human badge");
      }
      if (stage.includes("started-8") || stage.includes("board-eight-contract")) {
        const p1 = visibleSeat(1);
        const p2 = visibleSeat(2);
        const p3 = visibleSeat(3);
        const p5 = visibleSeat(5);
        const p6 = visibleSeat(6);
        const p7 = visibleSeat(7);
        if (!onRight(p1) || !lower(p1)) issues.push("8-player p1 is not in the lower-right next counter-clockwise seat from the human badge");
        if (!onRight(p2)) issues.push("8-player p2 is not on the right side of the counter-clockwise route");
        if (!onRight(p3) || !upper(p3)) issues.push("8-player p3 is not in the upper-right counter-clockwise seat");
        if (!onLeft(p5) || !upper(p5)) issues.push("8-player p5 is not in the upper-left counter-clockwise seat");
        if (!onLeft(p6)) issues.push("8-player p6 is not on the left side of the counter-clockwise route");
        if (!onLeft(p7) || !lower(p7)) issues.push("8-player p7 is not in the lower-left previous seat from the human badge");
      }
      if (!boardText.includes("逆时针") || !boardText.includes("下家")) issues.push("turn direction text should say counter-clockwise and identify the next player");
    }
    if (desktop && stage.includes("board-eight-contract")) {
      const hasSeatZoneText = boardText.includes("白银狮子") && boardText.includes("乐不思蜀") && boardText.includes("铁索") && boardText.includes("翻面");
      if (zoneLines.length < 3) issues.push(`public equipment/judgement/state rows are not visibly rendered on seats: ${zoneLines.length}`);
      if (!hasSeatZoneText) issues.push("public equipment/judgement/state labels are missing from the visible board text");
      if (logText.includes("暂无战报") || !logText.includes("曹操") || !logText.includes("杀") || !logText.includes("赵云")) issues.push(`contract board battle log should show the live spotlight event instead of an empty placeholder: ${logText}`);
    }
    if (stage.includes("judgement-reveal")) {
      if (!document.querySelector(".visual-judge-card")) issues.push("judgement reveal center event does not render the judgement-card visual");
      if (!document.querySelector(".judge-card-suit")) issues.push("judgement reveal center event does not render a prominent suit marker");
      if (!centerText.includes("判定牌") || !centerText.includes("雷击")) issues.push("judgement reveal center event does not show the judgement reason");
      if (!compactCenterText.includes("♠7") || !centerText.includes("杀") || !centerText.includes("黑色")) issues.push("judgement reveal center event does not show suit/rank/name/color clearly");
      if (!logText.includes("张角") || !logText.includes("雷击") || !compactLogText.includes("♠7杀")) issues.push("judgement reveal battle log does not show the revealed judgement card");
    }
    if (stage.includes("ai-decision")) {
      const readsVisible = Boolean(document.querySelector("#readsPanel") && !document.querySelector("#readsPanel")?.classList.contains("hidden"));
      if (!readsVisible) issues.push("AI decision reads panel is not visible");
      if (desktop && readsPanel && readsPanel.height < 240) issues.push(`AI decision reads panel is too short: ${Math.round(readsPanel.height)}px`);
      if (!readsText.includes("华佗") || !readsText.includes("青囊") || !readsText.includes("张飞")) issues.push("AI decision panel does not show actor, support skill, and target");
      if (!readsText.includes("配合分") || !readsText.includes("候选#") || !readsText.includes("评分")) issues.push("AI decision panel does not show candidate score and teamwork score");
      if (!readsText.includes("公平读数") || !readsText.includes("公开行为") || !readsText.includes("进攻主公")) issues.push("AI decision panel does not cite fair reads and public behavior evidence");
      if (!readsText.includes("公平边界") || !readsText.includes("暗身份未给 AI 直接读取")) issues.push("AI decision panel does not show fairness boundary");
      if (/开眼身份|公开：(?:反贼|忠臣|内奸)/.test(readsText)) issues.push("AI decision panel leaks hidden roles in fair mode");
    }
    if (stage.includes("endgame")) {
      if (!endGameModal || !endGameCard) issues.push("end-game modal is not visible");
      if (endGameCard && !inViewport(endGameCard, 2)) issues.push("end-game card is outside viewport");
      if (!endGameText.includes("胜利") && !endGameText.includes("失败")) issues.push("end-game modal does not show win/loss headline");
      if (!endGameText.includes("获胜阵营") || !endGameText.includes("身份揭示")) issues.push("end-game modal does not show result and revealed roles");
      if (!endGameText.includes("生涯进度") || !endGameText.includes("下个目标")) issues.push("end-game modal does not show career progress and next goal");
      if (endGameActions.length < 4) issues.push("end-game modal does not show all next-action buttons");
      if (endGameActions.some((box) => !inViewport(box, 2))) issues.push("end-game action buttons are outside viewport");
      if (!endGameText.includes("再来一局") || !endGameText.includes("回到首页")) issues.push("end-game modal does not offer restart/home actions");
      if (stage.includes("bottom")) {
        if (endGameContent && endGameCard && !containsRect(endGameCard, endGameContent, 2)) issues.push("end-game scroll container is clipped by the card");
        if (!endGameCareerCallout || !inViewport(endGameCareerCallout, 2)) issues.push("end-game career section is not visible at scroll bottom");
        if (endGameCareerTiles.some((box) => !inViewport(box, 2))) issues.push("end-game career tiles are clipped at scroll bottom");
        if (!endGameActionRow || !inViewport(endGameActionRow, 2)) issues.push("end-game action row is not visible at scroll bottom");
        if (endGameCard && endGameActionRow && endGameActionRow.bottom > endGameCard.bottom + 2) issues.push("end-game action row escapes the card at scroll bottom");
      }
    }
    if (stage.includes("identity-popover")) {
      if (!identityPopover) issues.push("identity mark popover is not visible");
      if (identityPopover && !inViewport(identityPopover, 2)) issues.push("identity mark popover is outside the viewport");
      if (identityPopoverStyle?.position !== "fixed") issues.push(`identity mark popover should be fixed, got ${identityPopoverStyle?.position}`);
      if (!identityPopoverInBody) issues.push("identity mark popover should render at the document body level");
      if (!identityPopoverText.includes("标记身份") || !identityPopoverText.includes("仅用于你的推断") || !identityPopoverText.includes("清除")) issues.push(`identity mark popover copy/options are incomplete: ${identityPopoverText}`);
      if (identityPopover && firstOtherPlayer && overlapArea(identityPopover, firstOtherPlayer) > 12) issues.push("identity mark popover overlaps the player card instead of floating outside it");
      if (identityPopover && identityTrigger && overlapArea(identityPopover, identityTrigger) > 4) issues.push("identity mark popover covers its trigger button");
    }
    if (stage.includes("identity-selected")) {
      const marked = document.querySelector(".player.manual-note-rebel");
      if (!marked) issues.push("choosing an identity mark did not update the player card");
      if (identityPopover) issues.push("identity mark popover should close after choosing an option");
    }
    if (stage.includes("human-skill-tooltip")) {
      if (!tooltip) issues.push("self player skill tooltip is not visible");
      if (tooltip && !inViewport(tooltip, 2)) issues.push("self player skill tooltip is outside the viewport");
      if (!tooltipText.includes("技能") || !tooltipText.includes("龙胆")) issues.push(`self player skill tooltip should show skill text from the shared data source: ${tooltipText}`);
    }

    return {
      viewport,
      stage,
      scroll: { width: scrollWidth, height: scrollHeight },
      rects: { game, boardWrap, board, center, handPanel, humanSeat, hand, actionBar, actionHint, actionHintMain, actionHintDetail, sidePanel, log, readsPanel, prompt, tooltip, identityPopover, endGameModal, endGameCard, endGameContent, endGameCareerCallout, endGameActionRow },
      counts: {
        players: players.length,
        handCards: cards.length,
        actionButtons: actionButtons.length,
        targetButtons: targetButtons.length,
        endGameActions: endGameActions.length,
        eventMarkers: eventMarkers.length,
        topbarControls: topbarControls.length,
        seatZoneLines: zoneLines.length,
        logMessages: logMessages.length
      },
      boardClass: document.querySelector("#board")?.className || "",
      gameClass: document.querySelector("#game")?.className || "",
      texts: { centerText, logText, readsText, boardText, humanSeatText, endGameText, tooltipText, identityPopoverText },
      issues,
      warnings
    };
  }, { viewport, stage });
  const screenshot = path.join(outputDir, `${viewport.name}-${stage}.png`);
  await page.screenshot({ path: screenshot, fullPage: false });
  return { ...snapshot, screenshot };
}

async function collectSetupLayout(page, viewport, stage = "setup") {
  const snapshot = await page.evaluate(({ viewport, stage }) => {
    const rect = (selector) => {
      const node = document.querySelector(selector);
      if (!node) return null;
      const box = node.getBoundingClientRect();
      return {
        selector,
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        top: box.top,
        right: box.right,
        bottom: box.bottom,
        left: box.left
      };
    };
    const inViewport = (box, margin = 1) => (
      box
      && box.left >= -margin
      && box.top >= -margin
      && box.right <= window.innerWidth + margin
      && box.bottom <= window.innerHeight + margin
    );
    const intersectsViewport = (box) => (
      box
      && box.right > 0
      && box.bottom > 0
      && box.left < window.innerWidth
      && box.top < window.innerHeight
    );
    const isVisibleNode = (node) => {
      if (!node || node.closest("details:not([open])")) return false;
      const style = getComputedStyle(node);
      const box = node.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && box.width > 1 && box.height > 1 && intersectsViewport({
        left: box.left,
        right: box.right,
        top: box.top,
        bottom: box.bottom
      });
    };
    const issues = [];
    const warnings = [];
    const setup = rect("#setup:not(.hidden)");
    const game = rect("#game:not(.hidden)");
    const switcher = rect(".screen-switch");
    const brand = rect(".brand");
    const start = rect("#startGame");
    const continueButton = rect("#continueGame");
    const actions = rect(".launcher-actions");
    const setupHero = rect(".setup-hero");
    const panel = rect(".setup-main-panel");
    const record = rect(".setup-record-card");
    const summary = rect("#setupMatchSummary");
    const generalEntry = rect("#generalPickerOpen");
    const modeSegment = rect("#modeSegment");
    const aiSegment = rect("#aiSegment");
    const rosterSegment = rect("#rosterSegment");
    const setupNode = document.querySelector("#setup");
    const visibleNativeSelects = Array.from(document.querySelectorAll("select"))
      .filter((node) => !node.classList.contains("native-hidden") && isVisibleNode(node))
      .map((node) => node.id || node.name || "select");
    const pageScrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
    const setupScroll = {
      scrollHeight: setupNode?.scrollHeight || 0,
      clientHeight: setupNode?.clientHeight || 0,
      overflowY: setupNode ? getComputedStyle(setupNode).overflowY : ""
    };
    const setupText = (setupNode?.textContent || "").replace(/\s+/g, " ").trim();
    const continueText = (document.querySelector("#continueGame")?.textContent || "").replace(/\s+/g, " ").trim();
    const continueDisabled = Boolean(document.querySelector("#continueGame")?.disabled);
    const continueReady = Boolean(document.querySelector("#continueGame")?.classList.contains("is-ready"));
    const desktop = viewport.width >= 900;

    if (!setup || setup.height < 100) issues.push("setup launcher is not visible");
    if (game) issues.push("game screen should stay hidden on launcher");
    if (!start || !inViewport(start, 2)) issues.push("start game CTA is not fully visible in the first viewport");
    if (!continueButton || !intersectsViewport(continueButton)) issues.push("continue game affordance is not visible");
    if (!actions || !intersectsViewport(actions)) issues.push("launcher action buttons are not visible");
    if (!brand || !intersectsViewport(brand)) issues.push("launcher brand is not visible");
    if (!panel || !intersectsViewport(panel)) issues.push("new-game setup panel is not visible");
    if (desktop && panel && !inViewport(panel, 2)) issues.push("desktop new-game setup panel is clipped in the first viewport");
    if (!generalEntry || generalEntry.width < 120 || generalEntry.height < 60) issues.push("general picker entry is missing or too small");
    if (desktop && !intersectsViewport(generalEntry)) issues.push("desktop general picker entry is not visible");
    if (!modeSegment || !aiSegment || !rosterSegment) issues.push("launcher segmented controls are missing");
    if (desktop && (!record || !inViewport(record, 2))) issues.push("desktop career record card is not visible");
    if (desktop && (!summary || !inViewport(summary, 2))) issues.push("desktop match summary is not visible");
    if (!desktop && setupScroll.scrollHeight <= setupScroll.clientHeight + 120) warnings.push("mobile setup does not expose enough scrollable setup content");
    if (!desktop && setupScroll.overflowY !== "auto" && setupScroll.overflowY !== "scroll") issues.push("mobile setup screen is not an independent scroll area");
    if (pageScrollWidth > window.innerWidth + 8) issues.push(`launcher has horizontal scroll ${pageScrollWidth} > ${window.innerWidth}`);
    if (visibleNativeSelects.length) issues.push(`native select controls are visible on launcher: ${visibleNativeSelects.join(", ")}`);
    if (!setupText.includes("单机三国杀") || !setupText.includes("开始新局") || !setupText.includes("新局设置")) issues.push("launcher missing core player-facing copy");
    if (stage.includes("resume")) {
      if (continueDisabled) issues.push("resume launcher continue button is disabled despite a saved match");
      if (!continueReady) issues.push("resume launcher continue button is missing the ready state");
      if (!continueText.includes("第 4 轮") || !continueText.includes("五人身份局") || !continueText.includes("曹操行动")) issues.push(`resume launcher does not explain saved match state: ${continueText}`);
    }
    if (switcher && !inViewport(switcher, 2)) warnings.push("launcher page switch is outside viewport");

    return {
      viewport,
      stage,
      scroll: { width: pageScrollWidth, height: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) },
      setupScroll,
      rects: { setup, switcher, brand, start, continueButton, actions, setupHero, panel, record, summary, generalEntry, modeSegment, aiSegment, rosterSegment },
      counts: { visibleNativeSelects: visibleNativeSelects.length },
      texts: { setupText: setupText.slice(0, 700), continueText },
      issues,
      warnings
    };
  }, { viewport, stage });
  const screenshot = path.join(outputDir, `${viewport.name}-${stage}.png`);
  await page.screenshot({ path: screenshot, fullPage: false });
  return { ...snapshot, screenshot };
}

async function renderSetupLanding(page, viewport) {
  await page.goto(fileUrl(), { waitUntil: "load" });
  await page.evaluate(() => localStorage.removeItem("sgs-singleplayer-match-v1"));
  await page.reload({ waitUntil: "load" });
  await page.waitForSelector("#setup:not(.hidden)");
  await page.mouse.move(2, 2);
  return collectSetupLayout(page, viewport);
}

async function renderResumeSetupLanding(page, viewport) {
  await page.goto(fileUrl(), { waitUntil: "load" });
  await page.evaluate(() => localStorage.removeItem("sgs-singleplayer-match-v1"));
  await page.reload({ waitUntil: "load" });
  await page.waitForFunction(() => Boolean(window.__SGS_TEST_API?.prepareResumeLauncherVisualScenario));
  await page.evaluate(() => window.__SGS_TEST_API.prepareResumeLauncherVisualScenario());
  await page.waitForSelector("#setup:not(.hidden)");
  await page.waitForFunction(() => document.querySelector("#continueGame")?.classList.contains("is-ready"));
  await page.mouse.move(2, 2);
  return collectSetupLayout(page, viewport, "setup-resume");
}

async function renderHumanScenario(page, viewport) {
  await page.goto(fileUrl("?scenario=human-play-ui"), { waitUntil: "load" });
  await page.waitForSelector("#game:not(.hidden)");
  const initial = await collectLayout(page, viewport, "human-initial");
  await page.click("#hand .card-target");
  await page.waitForSelector("#confirmTargets");
  await page.mouse.move(2, 2);
  const target = await collectLayout(page, viewport, "human-target");
  await page.click("#cancelTargets");
  await page.waitForFunction(() => !document.querySelector("#confirmTargets") && Boolean(document.querySelector("#endPhase")));
  await page.mouse.move(2, 2);
  const afterCancel = await collectLayout(page, viewport, "human-after-cancel");
  await page.click("#hand .card-target");
  await page.waitForSelector("#confirmTargets");
  await page.click(".player.targetable");
  await page.waitForSelector(".player.selected-target");
  await page.mouse.move(2, 2);
  const targetSelected = await collectLayout(page, viewport, "human-target-selected");
  await page.click("#confirmTargets");
  await page.waitForFunction(() => !document.querySelector("#confirmTargets") && !document.querySelector(".player.selected-target"));
  await page.mouse.move(2, 2);
  const afterConfirm = await collectLayout(page, viewport, "human-after-confirm");
  return [initial, target, afterCancel, targetSelected, afterConfirm];
}

async function renderActionPromptOverflowScenario(page, viewport) {
  await page.goto(fileUrl(), { waitUntil: "load" });
  await page.waitForFunction(() => Boolean(window.__SGS_TEST_API?.prepareActionPromptOverflowScenario));
  await page.evaluate(() => {
    window.__SGS_TEST_API.prepareActionPromptOverflowScenario();
  });
  await page.waitForSelector("#game:not(.hidden)");
  await page.mouse.move(2, 2);
  return collectLayout(page, viewport, "action-prompt-overflow");
}

async function renderFloatingUiScenario(page, viewport) {
  await page.goto(fileUrl("?scenario=human-play-ui"), { waitUntil: "load" });
  await page.waitForSelector("#game:not(.hidden)");
  await page.waitForSelector(".player:not(.human) .role-note");
  await page.hover(".player:not(.human) .role-note");
  await page.waitForSelector("#identityPopover:not(.hidden)");
  const popover = await collectLayout(page, viewport, "identity-popover");
  await page.click('#identityPopover [data-note-value="rebel"]');
  await page.waitForFunction(() => Boolean(document.querySelector(".player.manual-note-rebel")));
  await page.mouse.move(2, 2);
  const selected = await collectLayout(page, viewport, "identity-selected");
  await page.hover("#humanName");
  await page.waitForSelector("#tooltip:not(.hidden)");
  const selfSkill = await collectLayout(page, viewport, "human-skill-tooltip");
  return [popover, selected, selfSkill];
}

async function renderLogControlScenarios(page, viewport) {
  await page.goto(fileUrl("?scenario=human-play-ui"), { waitUntil: "load" });
  await page.waitForSelector("#game:not(.hidden)");
  const results = [];
  if (viewport.width >= 900) {
    await page.click("#logCollapse");
    await page.mouse.move(2, 2);
    results.push(await collectLayout(page, viewport, "log-collapsed"));
    await page.click("#logExpand");
    await page.mouse.move(2, 2);
    results.push(await collectLayout(page, viewport, "log-expanded"));
    await page.click("#sidePanelToggle");
    await page.mouse.move(2, 2);
    results.push(await collectLayout(page, viewport, "panel-collapsed"));
  }
  return results;
}

async function renderSkillGainScenario(page, viewport) {
  await page.goto(fileUrl("?scenario=skill-gain-ui"), { waitUntil: "load" });
  await page.waitForSelector("#game:not(.hidden)");
  await page.waitForFunction(() => document.querySelector(".center-mat")?.textContent.includes("奇才"));
  await page.mouse.move(2, 2);
  return collectLayout(page, viewport, "skill-gain");
}

async function renderDelayedNullifyScenario(page, viewport) {
  await page.goto(fileUrl("?scenario=delayed-nullify-ui"), { waitUntil: "load" });
  await page.waitForSelector("#game:not(.hidden)");
  await page.waitForFunction(() => document.querySelector(".center-mat")?.textContent.includes("乐不思蜀"));
  await page.mouse.move(2, 2);
  return collectLayout(page, viewport, "delayed-nullify");
}

async function renderJudgementRevealScenario(page, viewport) {
  await page.goto(fileUrl("?scenario=judgement-reveal-ui"), { waitUntil: "load" });
  await page.waitForSelector("#game:not(.hidden)");
  await page.waitForSelector(".visual-judge-card");
  await page.mouse.move(2, 2);
  return collectLayout(page, viewport, "judgement-reveal");
}

async function renderRelationEventScenario(page, viewport) {
  await page.goto(fileUrl("?scenario=relation-event-ui"), { waitUntil: "load" });
  await page.waitForSelector("#game:not(.hidden)");
  await page.waitForSelector(".visual-relation-caption");
  await page.mouse.move(2, 2);
  return collectLayout(page, viewport, "relation-event");
}

async function renderDeathRevealScenario(page, viewport) {
  await page.goto(fileUrl("?scenario=death-reveal-ui"), { waitUntil: "load" });
  await page.waitForSelector("#game:not(.hidden)");
  await page.waitForSelector(".visual-death-reveal");
  await page.mouse.move(2, 2);
  return collectLayout(page, viewport, "death-reveal");
}

async function renderAIDecisionScenario(page, viewport) {
  await page.goto(fileUrl("?scenario=ai-decision-ui"), { waitUntil: "load" });
  await page.waitForSelector("#game:not(.hidden)");
  await page.waitForFunction(() => document.querySelector("#readsPanel")?.textContent.includes("配合分"));
  await page.mouse.move(2, 2);
  return collectLayout(page, viewport, "ai-decision");
}

async function renderEndGameScenario(page, viewport) {
  await page.goto(fileUrl("?scenario=endgame-ui"), { waitUntil: "load" });
  await page.waitForSelector("#endGameModal:not(.hidden)");
  await page.waitForFunction(() => document.querySelector("#endGameContent")?.textContent.includes("身份揭示"));
  await page.mouse.move(2, 2);
  const results = [await collectLayout(page, viewport, "endgame")];
  await page.evaluate(() => {
    const content = document.querySelector("#endGameContent");
    if (content) content.scrollTop = content.scrollHeight;
  });
  await page.waitForTimeout(100);
  results.push(await collectLayout(page, viewport, "endgame-bottom"));
  return results;
}

async function renderSettingsScenario(page, viewport) {
  await page.goto(fileUrl("?scenario=human-play-ui"), { waitUntil: "load" });
  await page.waitForSelector("#game:not(.hidden)");
  await page.click("#settingsOpen");
  await page.waitForSelector("#settingsModal:not(.hidden)");
  await page.mouse.move(2, 2);
  const snapshot = await page.evaluate(({ viewport }) => {
    const rect = (selector) => {
      const node = document.querySelector(selector);
      if (!node) return null;
      const box = node.getBoundingClientRect();
      return {
        selector,
        left: box.left,
        top: box.top,
        right: box.right,
        bottom: box.bottom,
        width: box.width,
        height: box.height,
        text: (node.textContent || "").replace(/\s+/g, " ").trim().slice(0, 900)
      };
    };
    const inViewport = (box, margin = 1) => (
      box
      && box.left >= -margin
      && box.top >= -margin
      && box.right <= window.innerWidth + margin
      && box.bottom <= window.innerHeight + margin
    );
    const isVisible = (node) => {
      if (!node || node.closest("details:not([open])")) return false;
      const style = getComputedStyle(node);
      const box = node.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && box.width > 1 && box.height > 1;
    };
    const issues = [];
    const warnings = [];
    const modal = rect("#settingsModal:not(.hidden)");
    const card = rect(".settings-card");
    const content = rect("#settingsContent");
    const visibleNativeSelects = Array.from(document.querySelectorAll("select")).filter(isVisible).map((node) => node.id || "select");
    const visibleAdvancedButtons = Array.from(document.querySelectorAll(".settings-advanced-tools .settings-actions button")).filter(isVisible);
    const text = content?.text || "";
    const advancedText = document.querySelector(".settings-advanced-tools summary")?.textContent?.replace(/\s+/g, " ").trim() || "";
    const cardStyle = document.querySelector(".settings-card") ? getComputedStyle(document.querySelector(".settings-card")) : null;

    if (!modal || !card || !content) issues.push("settings modal is not visible");
    if (card && !inViewport(card, 2)) issues.push("settings card is outside viewport");
    if (visibleNativeSelects.length) issues.push(`settings modal leaks native select controls: ${visibleNativeSelects.join(", ")}`);
    if (!text.includes("牌局节奏") || !text.includes("牌桌显示") || !text.includes("本机保存")) issues.push("settings modal missing core player controls");
    if (!text.includes("超慢") || !text.includes("慢速") || !text.includes("正常") || !text.includes("快速")) issues.push("settings modal missing tempo options");
    if (!advancedText.includes("展开")) issues.push(`advanced helper summary should invite expansion, got: ${advancedText}`);
    if (visibleAdvancedButtons.length) issues.push("advanced helper actions are visible by default");
    if (cardStyle && cardStyle.overflowY !== "auto" && cardStyle.overflowY !== "scroll") warnings.push("settings card does not expose internal scrolling");
    if (document.documentElement.scrollWidth > window.innerWidth + 8) issues.push("settings modal introduces horizontal page scroll");

    return {
      viewport,
      stage: "settings",
      rects: { modal, card, content },
      counts: {
        visibleNativeSelects: visibleNativeSelects.length,
        visibleAdvancedButtons: visibleAdvancedButtons.length
      },
      texts: { text, advancedText },
      issues,
      warnings
    };
  }, { viewport });
  const screenshot = path.join(outputDir, `${viewport.name}-settings.png`);
  await page.screenshot({ path: screenshot, fullPage: false });
  return { ...snapshot, screenshot };
}

async function renderContractBoard(page, viewport) {
  await page.goto(fileUrl(), { waitUntil: "load" });
  await page.waitForFunction(() => Boolean(window.__SGS_TEST_API?.boardUiContractSummary));
  await page.evaluate(() => {
    window.__SGS_TEST_API.boardUiContractSummary();
    document.getElementById("setup")?.classList.add("hidden");
    document.getElementById("game")?.classList.remove("hidden");
  });
  await page.waitForSelector("#game:not(.hidden)");
  return collectLayout(page, viewport, "board-eight-contract");
}

async function renderStartedGame(page, viewport, mode) {
  await page.goto(fileUrl(), { waitUntil: "load" });
  await page.click(`[data-mode-value="${mode}"]`);
  await page.click("#startGame");
  await page.waitForSelector("#game:not(.hidden)");
  await page.waitForTimeout(50);
  return collectLayout(page, viewport, `started-${mode}`);
}

async function run() {
  fs.mkdirSync(outputDir, { recursive: true });
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch({
    headless: true,
    executablePath: chromePath
  });
  const results = [];
  try {
    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1 });
      page.on("pageerror", (error) => {
        results.push({ viewport, stage: "pageerror", issues: [error.message], warnings: [], screenshot: "" });
      });
      results.push(await renderSetupLanding(page, viewport));
      results.push(await renderResumeSetupLanding(page, viewport));
      results.push(...await renderHumanScenario(page, viewport));
      results.push(await renderActionPromptOverflowScenario(page, viewport));
      results.push(...await renderFloatingUiScenario(page, viewport));
      results.push(...await renderLogControlScenarios(page, viewport));
      results.push(await renderSkillGainScenario(page, viewport));
      results.push(await renderDelayedNullifyScenario(page, viewport));
      results.push(await renderJudgementRevealScenario(page, viewport));
      results.push(await renderRelationEventScenario(page, viewport));
      results.push(await renderDeathRevealScenario(page, viewport));
      results.push(await renderAIDecisionScenario(page, viewport));
      results.push(...await renderEndGameScenario(page, viewport));
      results.push(await renderSettingsScenario(page, viewport));
      results.push(await renderContractBoard(page, viewport));
      results.push(await renderStartedGame(page, viewport, "5"));
      results.push(await renderStartedGame(page, viewport, "8"));
      await page.close();
    }
  } finally {
    await browser.close();
  }
  const issues = results.flatMap((result) => result.issues.map((issue) => `${result.viewport.name}/${result.stage}: ${issue}`));
  const warnings = results.flatMap((result) => result.warnings.map((warning) => `${result.viewport.name}/${result.stage}: ${warning}`));
  console.log(JSON.stringify({
    ok: issues.length === 0,
    outputDir,
    chromePath,
    issues,
    warnings,
    results
  }, null, 2));
  if (issues.length) process.exitCode = 1;
}

run().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exitCode = 1;
});
