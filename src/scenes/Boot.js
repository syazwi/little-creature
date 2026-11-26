/* Boot: paint every texture, build animations, wait (briefly) for the pixel font. */
window.LC = window.LC || {};
LC.BootScene = class extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    LC.bus = this.game.events;
    var t = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Painting the kampung...', { fontFamily: 'monospace', fontSize: '20px', color: '#e8cf86' }).setOrigin(0.5);

    var sheet = new Image(), self = this;
    sheet.onload = function () { self.prepareArt(t, sheet); };
    sheet.onerror = function () { self.prepareArt(t, null); };
    sheet.src = LC.Art.sunnysideImage;
  }

  prepareArt(t, sheet) {
    LC.Art.generate(this, sheet);
    this.createAnims();

    var self = this, done = false;
    function go() { if (done) return; done = true; t.destroy(); self.scene.start('Title'); }
    if (document.fonts && document.fonts.load) {
      Promise.race([
        Promise.all([document.fonts.load('20px "Pixelify Sans"'), document.fonts.load('700 20px "Pixelify Sans"')]),
        new Promise(function (r) { setTimeout(r, 2500); })
      ]).then(go, go);
    } else go();
  }

  createAnims() {
    var a = this.anims;
    for (var c = 0; c < 4; c++) {
      var pk = LC.Art.plKey(c), wk = LC.Art.walkKey(c);
      ['down', 'up', 'side'].forEach(function (d) {
        if (!a.exists(wk + '_' + d)) a.create({ key: wk + '_' + d, frames: [{ key: pk + '_' + d + '_1' }, { key: pk + '_' + d + '_0' }, { key: pk + '_' + d + '_2' }, { key: pk + '_' + d + '_0' }], frameRate: 8, repeat: -1 });
      });
    }
    if (!a.exists('kerbau_walk')) a.create({ key: 'kerbau_walk', frames: [{ key: 'kerbau_0' }, { key: 'kerbau_1' }], frameRate: 3, repeat: -1 });
    if (!a.exists('chicken_walk')) a.create({ key: 'chicken_walk', frames: [{ key: 'chicken_0' }, { key: 'chicken_2' }], frameRate: 6, repeat: -1 });
    if (!a.exists('chicken_peck')) a.create({ key: 'chicken_peck', frames: [{ key: 'chicken_0' }, { key: 'chicken_1' }, { key: 'chicken_0' }, { key: 'chicken_0' }], frameRate: 4, repeat: -1 });
    ['ikan_kecil', 'ubur'].forEach(function (k) {
      if (!a.exists(k + '_swim')) a.create({ key: k + '_swim', frames: [{ key: k + '_0' }, { key: k + '_1' }], frameRate: k === 'ubur' ? 2 : 5, repeat: -1 });
    });
    ['kancil', 'ketam', 'penyu', 'biawak'].forEach(function (k) {
      if (!a.exists(k + '_walk')) a.create({ key: k + '_walk', frames: [{ key: k + '_0' }, { key: k + '_1' }], frameRate: k === 'penyu' ? 2 : 6, repeat: -1 });
    });
    Object.keys(LC.VILLAGERS).forEach(function (vid) {
      if (!a.exists('npc_' + vid + '_idle')) a.create({ key: 'npc_' + vid + '_idle', frames: [{ key: 'npc_' + vid + '_0', duration: 2400 + Math.floor(Math.random() * 1200) }, { key: 'npc_' + vid + '_1', duration: 140 }], repeat: -1 });
    });
    // v1.5: farm animals, the shadows of the mine, the spinning gasing
    ['serama', 'itik'].forEach(function (k) {
      if (!a.exists(k + '_walk')) a.create({ key: k + '_walk', frames: [{ key: k + '_0' }, { key: k + '_2' }], frameRate: 6, repeat: -1 });
      if (!a.exists(k + '_peck')) a.create({ key: k + '_peck', frames: [{ key: k + '_0' }, { key: k + '_1' }, { key: k + '_0' }, { key: k + '_0' }], frameRate: 4, repeat: -1 });
    });
    ['kambing', 'anak', 'kelawar', 'bayang', 'lipan', 'penunggu', 'gasing'].forEach(function (k) {
      if (!a.exists(k + '_walk')) a.create({ key: k + '_walk', frames: [{ key: k + '_0' }, { key: k + '_1' }], frameRate: k === 'kelawar' ? 10 : k === 'gasing' ? 14 : k === 'penunggu' ? 3 : 6, repeat: -1 });
    });
    if (!a.exists('ani_idle')) a.create({ key: 'ani_idle', frames: [{ key: 'npc_ani_0', duration: 2600 }, { key: 'npc_ani_1', duration: 140 }], repeat: -1 });
  }
};
