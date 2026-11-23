/* Kampung Bunian's gatekeeper, recoverable trials, and four boss attacks. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var W = LC.WorldScene.prototype, U = LC.UIScene.prototype, B = LC.BunianTrials;
  var keeper = { name: 'Penjaga Pintu', portrait: 'bunian_trial_keeper' };
  function line(text) { return { name: keeper.name, portrait: keeper.portrait, text: text }; }
  function lootText(id, n) { return n + ' ' + LC.ITEMS[id].name; }
  function statText(door) {
    return [door.hp && '+' + door.hp + ' max health', door.energy && '+' + door.energy + ' max energy'].filter(Boolean).join(' and ');
  }

  var create = W.create;
  W.create = function (data) {
    create.apply(this, arguments);
    if (data && data.bunianResult) {
      var self = this;
      this.time.delayedCall(420, function () { if (!self.leaving) self.ui.say([line(data.bunianResult)]); });
    }
  };
  var createKampong = W.createKampong, updateKampong = W.updateKampong;
  W.createKampong = function () {
    createKampong.apply(this, arguments);
    this.bunianTrial = null;
    if (this.A.trial) this.createBunianTrial(this.A.trial);
  };
  W.updateKampong = function (time, dt) {
    updateKampong.apply(this, arguments);
    if (this.bunianTrial && !this.leaving && !this.sleeping) this.updateBunianTrial(time, dt);
  };
  var objectAction = W.objectAction;
  W.objectAction = function (o) {
    var self = this;
    if (o.type === 'bunian_keeper') return { label: 'Talk to the gatekeeper', fn: function () { self.speakBunianKeeper(); } };
    if (o.type === 'bunian_trial_door') {
      var door = B.doors.find(function (d) { return d.id === o.trial; });
      return { label: 'Inspect the ' + door.name + ' door', fn: function () { self.inspectBunianDoor(door); } };
    }
    if (o.type === 'bunian_retreat') return { label: 'Retreat to Kampung Bunian', fn: function () { self.leaveBunianTrial(false); } };
    return objectAction.apply(this, arguments);
  };
  var getAction = W.getAction;
  W.getAction = function () {
    if (!this.bunianTrial) return getAction.apply(this, arguments);
    var self = this, f = this.facing(), object = this.objAt[f.ty] && this.objAt[f.ty][f.tx];
    if (object) return this.objectAction(object);
    var weapon = this.weaponOf(LC.State.selItem());
    if (weapon && this.hasEnemies()) return { label: 'Swing the ' + weapon.name, swing: true, fn: function () { self.attack(); } };
    return null;
  };
  var nearby = W.friendsNear, receive = W.receiveGift;
  W.friendsNear = function () { return this.bunianTrial ? [] : nearby.apply(this, arguments); };
  W.receiveGift = function () { return this.bunianTrial ? 0 : receive.apply(this, arguments); };
  var goArea = W.goArea;
  W.goArea = function () {
    if (this.bunianTrial && this.S.quests.bunianTrialEntry && !this.leaving) return this.leaveBunianTrial(false);
    return goArea.apply(this, arguments);
  };
  var faint = W.faint;
  W.faint = function () {
    if (this.leaving) return;
    if (this.bunianTrial) return this.leaveBunianTrial(true);
    if (this.area === 'bunian') {
      this.S.hp = this.S.maxHp;
      this.goArea('bunian', this.tilePx(B.returnTo), 'up', { bunianResult: 'You’re safe. Take a breath before trying again.' });
      return;
    }
    return faint.apply(this, arguments);
  };
  var enemyDie = W.enemyDie;
  W.enemyDie = function (enemy) {
    var t = this.bunianTrial;
    if (!t || enemy.g.bunianTrial !== t.door.id) return enemyDie.apply(this, arguments);
    if (enemy.dead) return;
    this.removeStormEnemy(enemy);
    this.fx.sparkle.explode(enemy.def.boss ? 24 : 6, enemy.spr.x, enemy.spr.y - 12);
    if (enemy !== t.boss) return;
    this.finishBunianTrial(t);
  };

  Object.assign(W, {
    speakBunianKeeper: function () {
      var collected = this.collectBunianLoot();
      var lines = [line('Here, time stands still. Each door holds a band of minions and a boss. Bring a weapon and watch the ground before each special attack.'),
        line('Start at the blue door if you’re new to the trials. If you fall or retreat, I’ll bring you back with your bag intact, even the provisions you used.'),
        line('The first win at each door strengthens you permanently. Each win raises the level of its minions and boss and increases its prizes. Inspect a door to see the next round.')];
      if (collected.length) {
        LC.State.save();
        lines.unshift(line('I held these for you. Here are ' + collected.join(', ') + '.'));
      }
      var remaining = this.S.quests.bunianKeepsakes;
      if (remaining && Object.keys(remaining).length) {
        lines.push(line('Your bag is still full. Make space and speak to me again for ' + Object.keys(remaining).map(function (id) { return lootText(id, remaining[id]); }).join(', ') + '.'));
      }
      this.ui.say(lines);
    },
    inspectBunianDoor: function (door) {
      var self = this, round = B.round(this.S, door), boss = round.boss;
      this.ui.say([line(door.advice), line('Round ' + round.number + ' · ' + door.count + ' Lv ' + round.minion.level + ' minions, then ' + door.boss[0] + ' (Lv ' + boss.level + ', ' + boss.hp + ' HP, ' + boss.dmg + ' damage).'),
        line('Win this round for ' + round.kepeng + ' kepeng and ' + lootText(door.loot[0], round.items) +
          '.' + (round.number === 1 ? ' Your first win also grants ' + statText(door) + ' permanently.' : ''))], { choices: [
        { label: 'Enter the trial', fn: function () {
          B.enter(self.S); LC.State.save(); LC.Audio.sfx('gate'); self.goArea(door.area, undefined, 'up');
        } }, { label: 'Wait' }
      ] });
    },
    createBunianTrial: function (door) {
      var self = this;
      var t = this.bunianTrial = { door: door, round: B.round(this.S, door), phase: 'minions', timer: 0, marks: [], art: this.add.graphics().setDepth(1250) };
      t.minions = B.spawns.slice(0, door.count).map(function (p) { return self.spawnBunianTrialFoe(door.minionKind, p, door, t.round.minion); });
    },
    spawnBunianTrialFoe: function (kind, at, door, stats) {
      var e = this.spawnEnemy({ kind: kind, bunianTrial: door.id, zone: { x0: at.x, x1: at.x, y0: at.y, y1: at.y } }, true);
      e.def = Object.assign({}, e.def, stats);
      e.hp = stats.hp;
      var p = this.tilePx(at);
      e.spr.setPosition(p.x, p.y).setDepth(p.y).setAlpha(0);
      e.light.img.setTint(door.color);
      e.light.img.setPosition(p.x, p.y - 10);
      this.tweens.add({ targets: e.spr, alpha: 1, duration: 470 });
      this.fx.sparkle.explode(10, p.x, p.y - 12);
      return e;
    },
    updateBunianTrial: function (time, dt) {
      var t = this.bunianTrial;
      if (!this.ui.isBlocking() && !this.cutscene && !t.ending) {
        if (t.phase === 'minions' && t.minions.every(function (e) { return e.dead; })) {
          t.phase = 'summoning'; t.timer = 0.9;
          LC.Audio.sfx('gate');
          this.toast('The minions are down. ' + t.door.boss[0] + ' approaches.', 'ic_hp');
        } else if (t.phase === 'summoning') {
          t.timer -= dt;
          if (t.timer <= 0) {
            t.phase = 'boss'; t.timer = 2.0;
            t.boss = this.spawnBunianTrialFoe(t.door.bossKind, B.bossAt, t.door, t.round.boss);
          }
        } else if (t.phase === 'boss') this.updateBunianBoss(t, dt);
      }
      this.drawBunianTrial(t, time);
    },
    updateBunianBoss: function (t, dt) {
      var self = this;
      t.marks = t.marks.filter(function (m) {
        var before = m.left;
        m.left -= dt;
        if (before > 0 && m.left <= 0) self.bunianImpact(t, m);
        return m.left > -0.28;
      });
      if (this.leaving) return;
      t.timer -= dt;
      if (t.timer <= 0) {
        this.markBunianAttack(t);
        t.timer = t.boss.hp < t.boss.def.hp * 0.45 ? t.round.enragedCooldown : t.round.specialCooldown;
      }
    },
    markBunianAttack: function (t) {
      var p = this.player, e = t.boss, s = e.spr, x = p.x, y = p.y;
      switch (t.door.power) {
        case 'tide':
          t.marks.push({ x: 48, y: y - 11, w: 336, h: 22, left: 1.0 }, { x: x - 11, y: 48, w: 22, h: 255, left: 1.32 });
          break;
        case 'charge': {
          var d = Math.hypot(x - s.x, y - s.y) || 1;
          t.marks.push({ x: s.x, y: s.y, toX: Math.max(63, Math.min(369, s.x + (x - s.x) / d * 148)),
            toY: Math.max(63, Math.min(278, s.y + (y - s.y) / d * 148)), r: 16, left: 0.95 });
          e.windT = 0; e.strikeT = 0; e.restT = 1.0;
          break;
        }
        case 'runes':
          t.marks.push({ x: x, y: y, r: 24, left: 0.95 }, { x: x < 216 ? x + 38 : x - 38, y: y > 150 ? y - 24 : y + 24, r: 21, left: 1.28 });
          break;
        case 'haunt':
          t.marks.push({ x: s.x, y: s.y, r: 53, follows: true, left: 1.15 });
          break;
      }
      e.atkCd = Math.max(e.atkCd, 1.4);
      LC.Audio.sfx(t.door.power === 'charge' ? 'drum' : 'cast');
    },
    bunianImpact: function (t, mark) {
      var p = this.player, e = t.boss, s = e.spr, x = p.x, y = p.y, hit;
      if (mark.follows) { mark.x = s.x; mark.y = s.y; mark.follows = false; }
      if (mark.w) hit = x >= mark.x && x <= mark.x + mark.w && y >= mark.y && y <= mark.y + mark.h;
      else if (mark.toX !== undefined) {
        var dx = mark.toX - mark.x, dy = mark.toY - mark.y;
        var segment = Math.max(0, Math.min(1, ((x - mark.x) * dx + (y - mark.y) * dy) / (dx * dx + dy * dy || 1)));
        hit = Math.hypot(x - mark.x - segment * dx, y - mark.y - segment * dy) < mark.r;
        e.restT = 0.55;
        this.tweens.add({ targets: s, x: mark.toX, y: mark.toY, duration: 200, ease: 'Quad.easeOut' });
      } else hit = Math.hypot(x - mark.x, y - mark.y) < mark.r;
      var fx = t.door.power === 'tide' ? this.fx.drop : this.fx.sparkle;
      fx.explode(15, mark.x + (mark.w || 0) / 2, mark.y + (mark.h || 0) / 2);
      this.cameras.main.shake(170, 0.003);
      if (hit) this.playerHurt(e.def.dmg + 3, e);
    },
    drawBunianTrial: function (t, time) {
      var art = t.art, color = t.door.color;
      art.clear();
      if (t.phase === 'summoning') {
        var point = this.tilePx(B.bossAt), radius = 12 + (1 - t.timer) * 17;
        art.lineStyle(2, color, 0.9); art.strokeEllipse(point.x, point.y, radius * 2, radius);
      }
      if (t.boss && !t.boss.dead) {
        var s = t.boss.spr, y = s.y - s.height - 6;
        art.fillStyle(0x241d30, 0.88); art.fillRect(s.x - 17, y, 34, 5);
        art.fillStyle(color, 1); art.fillRect(s.x - 16, y + 1, 32 * t.boss.hp / t.boss.def.hp, 3);
      }
      t.marks.forEach(function (m) {
        var x = m.follows ? t.boss.spr.x : m.x, y = m.follows ? t.boss.spr.y : m.y;
        var alpha = m.left > 0 ? 0.2 + (Math.sin(time / 75) + 1) * 0.1 : 0.76;
        art.fillStyle(color, alpha); art.lineStyle(1, color, 0.9);
        if (m.w) { art.fillRect(x, y, m.w, m.h); art.strokeRect(x, y, m.w, m.h); }
        else if (m.toX !== undefined) { art.lineStyle(m.r * 2, color, alpha); art.lineBetween(x, y, m.toX, m.toY); }
        else { art.fillCircle(x, y, m.r); art.strokeCircle(x, y, m.r); }
      });
    },
    collectBunianLoot: function () {
      var stash = this.S.quests.bunianKeepsakes, delivered = [];
      Object.keys(stash || {}).forEach(function (id) {
        var take = Math.min(stash[id], LC.State.room(id));
        if (!take) return;
        LC.State.add(id, take);
        stash[id] -= take;
        if (!stash[id]) delete stash[id];
        delivered.push(lootText(id, take));
      });
      return delivered;
    },
    finishBunianTrial: function (t) {
      var self = this, S = this.S, q = S.quests, door = t.door, round = t.round;
      if (t.ending) return;
      t.ending = true;
      t.marks = [];
      q.bunianClears = q.bunianClears || {};
      q.bunianClears[door.id] = round.number;
      q.bunianKeepsakes = q.bunianKeepsakes || {};
      var id = door.loot[0];
      q.bunianKeepsakes[id] = (q.bunianKeepsakes[id] || 0) + round.items;
      this.collectBunianLoot();
      var pending = !!q.bunianKeepsakes[id];
      S.kepeng += round.kepeng;
      S.stats.earned = (S.stats.earned || 0) + round.kepeng;
      if (LC.C12.step(S) >= LC.C12.end) this.stormBonus();
      delete q.bunianTrialEntry;
      LC.State.recalc();
      S.hp = S.maxHp; S.area = 'bunian';
      LC.State.save();
      LC.Audio.sfx('stage');
      this.cameras.main.flash(330, 195, 230, 213);
      this.time.delayedCall(520, function () {
        var reward = round.kepeng + ' kepeng and ' + lootText(id, round.items);
        self.backToBunian(door.boss[0] + ' is beaten. You earned ' + reward + '.' +
          (round.number === 1 ? ' You also gained ' + statText(door) + ' permanently.' : '') +
          (pending ? ' I’ll hold your remaining prize until your bag has room.' : ''));
      });
    },
    leaveBunianTrial: function (defeated) {
      if (this.bunianTrial.ending) return;
      this.bunianTrial.ending = true;
      B.restore(this.S);
      LC.State.recalc();
      this.S.hp = this.S.maxHp;
      LC.State.save();
      this.backToBunian(defeated ? 'You fell in the trial, so I brought you back. Your health and provisions are restored. Try again whenever you’re ready.' : 'You’re back safely. Your health and provisions are restored. The door will be here when you’re ready.');
    },
    backToBunian: function (message) {
      LC.Audio.setBattle(false);
      this.goArea('bunian', this.tilePx(B.returnTo), 'up', { bunianResult: message });
    }
  });

  var goal = U.goalText;
  U.goalText = function () {
    var t = this.world && this.world.bunianTrial;
    if (!t) return goal.apply(this, arguments);
    if (t.ending) return 'Returning to Kampung Bunian';
    var round = 'Round ' + t.round.number + ' · ';
    if (t.phase === 'minions') return round + 'Defeat the minions (' + t.minions.filter(function (e) { return e.dead; }).length + ' / ' + t.minions.length + ')';
    return round + 'Defeat ' + t.door.boss[0];
  };
  var stats = U.statRows;
  U.statRows = function () {
    var rows = stats.apply(this, arguments), s = this.S;
    if (!s.visited.bunian) return rows;
    var bonus = B.bonuses(s), won = B.doors.filter(function (d) { return B.clearCount(s, d); }).length;
    rows.push({ icon: 'bunian_magic_door', label: 'Bunian trials', right: won + ' / 4',
      sub: 'Permanent trial bonuses: +' + bonus.hp + ' max health and +' + bonus.energy + ' max energy.' });
    return rows;
  };
})(window.LC);
