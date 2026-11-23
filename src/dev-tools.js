/* Developer-only panel for chapter jumping and gameplay autoplay. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var State = LC.State, story = LC.DevStory, chapters = story.chapters, autoplay = LC.DevAutoplay, run = false;
  var total = chapters.reduce(function (n, chapter) { return n + chapter.steps.length; }, 0);
  var panel = document.createElement('details');
  panel.id = 'lc-dev-tools'; panel.open = true;
  panel.innerHTML = '<summary>Developer Tools</summary>' +
    '<div class="lc-dev-fields"><label>Chapter <select id="lc-dev-chapter"></select></label>' +
    '<label>Travel speed <select id="lc-dev-speed"><option value="1">1×</option><option value="2" selected>2×</option><option value="4">4×</option></select></label></div>' +
    '<div class="lc-dev-actions"><button type="button" id="lc-dev-jump" disabled>Jump to chapter</button>' +
    '<button type="button" id="lc-dev-auto" disabled>Start autoplay</button></div>' +
    '<progress id="lc-dev-progress" aria-label="Story progress" hidden></progress>' +
    '<output id="lc-dev-status" role="status">Loading game…</output>' +
    '<p>Play Chapters 1–' + chapters.length + ' in Slot ' + story.slot + '. Autoplay supplies ingredients, speeds up early bonding, and uses quest travel. Stop at any time to take over.</p>';
  var style = document.createElement('style');
  style.textContent = '#lc-dev-tools{position:fixed;z-index:15;top:max(8px,env(safe-area-inset-top));left:50%;transform:translateX(-50%);' +
    'width:min(390px,calc(100vw - 22px));max-height:calc(100dvh - 20px);overflow:auto;box-sizing:border-box;color:#fff0d5;background:#241c34;' +
    'border:1px solid #b49055;border-radius:9px;padding:9px 12px;font:14px/1.35 system-ui,sans-serif;box-shadow:0 5px 18px #0008}' +
    '#lc-dev-tools:not([open]){left:max(11px,env(safe-area-inset-left));transform:none;width:max-content;max-width:calc(100vw - 22px)}#lc-dev-tools summary{cursor:pointer;color:#ffd98e;font-weight:650}' +
    '#lc-dev-tools .lc-dev-fields{display:grid;grid-template-columns:minmax(0,1fr) 91px;gap:9px;margin-top:9px}' +
    '#lc-dev-tools select,#lc-dev-tools button{box-sizing:border-box;min-height:34px;border:1px solid #807099;border-radius:5px;' +
    'background:#35284c;color:inherit;padding:4px 8px;font:inherit}#lc-dev-tools select{display:block;width:100%}' +
    '#lc-dev-tools :focus-visible{outline:2px solid #f9d489;outline-offset:2px}#lc-dev-tools button:not(:disabled){cursor:pointer}' +
    '#lc-dev-tools button:disabled{opacity:.5}#lc-dev-auto:not(:disabled){background:#654a2d;border-color:#b49055}' +
    '#lc-dev-tools .lc-dev-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:9px}' +
    '#lc-dev-status{display:block;margin-top:8px;min-height:1.35em}#lc-dev-tools progress{width:100%;margin:7px 0 0;accent-color:#efc17a}' +
    '#lc-dev-tools p{font-size:12px;color:#d6c5db;margin:7px 0 0}';
  document.head.appendChild(style);
  document.body.appendChild(panel);
  var chapterSelect = panel.querySelector('#lc-dev-chapter'), speed = panel.querySelector('#lc-dev-speed');
  var progress = panel.querySelector('#lc-dev-progress'), status = panel.querySelector('#lc-dev-status');
  var jumpButton = panel.querySelector('#lc-dev-jump'), autoButton = panel.querySelector('#lc-dev-auto');
  progress.max = total;
  chapters.forEach(function (chapter, i) { chapterSelect.add(new Option(chapter.n + ' · ' + chapter.name, i)); });
  chapterSelect.value = chapters.findIndex(function (chapter) { return autoplay.supports(chapter.n); });
  ['keydown', 'keyup', 'keypress'].forEach(function (type) {
    panel.addEventListener(type, function (event) { event.stopPropagation(); });
  });

  var title = LC.TitleScene.prototype, titleCreate = title.create;
  title.create = function () {
    titleCreate.apply(this, arguments);
    if (run) autoplay.stop('Autoplay stopped at the title screen.');
    jumpButton.disabled = autoButton.disabled = false;
    if (!run && status.textContent === 'Loading game…') status.textContent = 'Choose a chapter to test.';
  };
  var createUI = LC.UIScene.prototype.create;
  LC.UIScene.prototype.create = function () {
    createUI.apply(this, arguments);
    jumpButton.disabled = run; autoButton.disabled = false;
  };

  function available() {
    var scenes = LC.game && LC.game.scene;
    if (!scenes || !scenes.isActive('Title') && !scenes.isActive('World')) return false;
    if (LC.Net.active() || LC.Lobby.isOpen) { status.textContent = 'Leave co-op to use a developer checkpoint.'; return false; }
    if (scenes.isActive('Title') && scenes.getScene('Title').starting) return false;
    var world = scenes.getScene('World');
    return !scenes.isActive('World') || !world.leaving && !world.sleeping;
  }
  function stopWorld() {
    var scenes = LC.game.scene;
    if (scenes.isActive('UI')) { scenes.getScene('UI').closeModal(); scenes.stop('UI'); }
    scenes.stop('World');
  }
  function play(chapter) {
    var scenes = LC.game.scene, data = story.entry(State.s, chapter ? chapter.n : 0);
    scenes.stop('Title');
    LC.Audio.init();
    scenes.start('World', data);
  }
  function fresh(index) {
    if (LC.game.scene.isActive('World')) State.save();
    stopWorld();
    var chapter = chapters[index], s = story.checkpoint(chapter.n);
    story.entry(s, chapter.n);
    State.save();
    return s;
  }
  function jump() {
    if (!available()) return;
    try {
      var index = +chapterSelect.value, chapter = chapters[index];
      fresh(index);
      progress.hidden = true;
      status.textContent = 'Playing Chapter ' + chapter.n + ' · ' + chapter.name;
      play(chapter); panel.open = false;
    } catch (error) { handleFailure(error); }
  }
  function start() {
    if (!available()) return;
    var i = +chapterSelect.value, chapter = chapters[i];
    if (!autoplay.supports(chapter.n)) { status.textContent = 'Chapter ' + chapter.n + ' is available for manual play.'; return; }
    try {
      var active = LC.game.scene.isActive('World') && State.slot === story.slot &&
        (!State.s.quests.ch2 ? chapters[0] : LC.CHAPTER_LIST.find(function (item) { return (State.s.quests[item.key] || 0) < item.end; })) === chapter;
      if (!active) { fresh(i); play(chapter); }
      run = jumpButton.disabled = chapterSelect.disabled = true;
      autoButton.textContent = 'Stop and play';
      progress.hidden = false;
      status.textContent = 'Starting Chapter ' + chapter.n + '…';
      autoplay.start(function () { return Number(speed.value); }, showProgress, finish);
    } catch (error) { handleFailure(error); }
  }
  function showProgress(n, step, action) {
    var label = 'Chapter ' + n + ' · ' + action;
    if (status.textContent !== label) status.textContent = label;
    var chapter = String(chapters.findIndex(function (ch) { return ch.n === n; }));
    if (chapterSelect.value !== chapter) chapterSelect.value = chapter;
    var passed = chapters.slice(0, +chapter).reduce(function (count, ch) { return count + ch.steps.length; }, step);
    if (progress.value !== passed) progress.value = passed;
  }
  function finish(message) {
    run = false;
    jumpButton.disabled = chapterSelect.disabled = false;
    autoButton.textContent = 'Start autoplay';
    status.textContent = message;
    if (message === 'Story complete.') progress.value = total;
    State.save();
  }
  function handleFailure(error) {
    if (run) autoplay.stop('Autoplay stopped.');
    var scenes = LC.game.scene;
    if (!scenes.isActive('Title') && !scenes.isActive('World')) scenes.start('Title');
    status.textContent = 'Developer checkpoint failed. ' + error.message;
    console.error(error);
  }
  jumpButton.addEventListener('click', jump);
  autoButton.addEventListener('click', function () { if (run) autoplay.stop('Autoplay stopped. You have control.'); else start(); });
})(window.LC);
