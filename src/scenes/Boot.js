/* Boot: paint every texture, build animations, wait (briefly) for the pixel font. */
window.LC = window.LC || {};
LC.BootScene = class extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    LC.bus = this.game.events;
    var t = this.add.text(480, 320, 'Painting the kampung...', { fontFamily: 'monospace', fontSize: '20px', color: '#e8cf86' }).setOrigin(0.5);

    LC.Art.generate(this);
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
    ['down', 'up', 'side'].forEach(function (d) {
      if (!a.exists('walk_' + d)) a.create({ key: 'walk_' + d, frames: [{ key: 'pl_' + d + '_1' }, { key: 'pl_' + d + '_0' }, { key: 'pl_' + d + '_2' }, { key: 'pl_' + d + '_0' }], frameRate: 8, repeat: -1 });
    });
    if (!a.exists('kerbau_walk')) a.create({ key: 'kerbau_walk', frames: [{ key: 'kerbau_0' }, { key: 'kerbau_1' }], frameRate: 3, repeat: -1 });
    if (!a.exists('chicken_walk')) a.create({ key: 'chicken_walk', frames: [{ key: 'chicken_0' }, { key: 'chicken_2' }], frameRate: 6, repeat: -1 });
    if (!a.exists('chicken_peck')) a.create({ key: 'chicken_peck', frames: [{ key: 'chicken_0' }, { key: 'chicken_1' }, { key: 'chicken_0' }, { key: 'chicken_0' }], frameRate: 4, repeat: -1 });
    if (!a.exists('ani_idle')) a.create({ key: 'ani_idle', frames: [{ key: 'npc_ani_0', duration: 2600 }, { key: 'npc_ani_1', duration: 140 }], repeat: -1 });
  }
};
