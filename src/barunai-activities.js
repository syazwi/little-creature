/* Barunai's smithy recipes and Kampong Ayer's perahu race. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';

  var weapons = {
    keris_besi: { name: 'Keris Pandai Besi', dmg: 3, reach: 19, cd: 0.29, sell: 270, desc: 'A light keris with a short, quick swing.' },
    pedang_barunai: { name: 'Pedang Barunai', dmg: 4, reach: 26, cd: 0.48, sell: 390, desc: 'A broad blade with a strong, sweeping strike.' },
    tombak_belian: { name: 'Tombak Belian', dmg: 3, reach: 32, cd: 0.54, sell: 350, desc: 'A long ironwood spear that keeps foes at a distance.' }
  };
  Object.keys(weapons).forEach(function (id) {
    LC.ITEMS[id] = Object.assign({ id: id, icon: 'i_' + id, kind: 'weapon' }, weapons[id]);
  });
  LC.BESI_RECIPES = [
    { id: 'tongkat', cost: { rotan: 4 }, kepeng: 20 },
    { id: 'parang', cost: { kayu: 2, batu: 6 }, kepeng: 125 },
    { id: 'keris_besi', cost: { parang: 1, batu: 8, belian: 1 }, kepeng: 450 },
    { id: 'pedang_barunai', cost: { parang: 1, batu: 12, belian: 2 }, kepeng: 700 },
    { id: 'tombak_belian', cost: { parang: 1, batu: 6, belian: 4 }, kepeng: 550 }
  ];

  var CREW_SIZE = 5, LENGTH = 100, STROKE_PERIOD = 1.2;
  var crew = {
    sari: { power: 2, timing: 2 }, berbai: { power: 1, timing: 3 }, semaun: { power: 3, timing: 1 },
    alak: { power: 2, timing: 2 }, lajak: { power: 1, timing: 3 }, juru: { power: 3, timing: 1 },
    kemala: { power: 1, timing: 3 }, kilau: { power: 2, timing: 2 }, dayang_barunai: { power: 1, timing: 3 },
    senuai: { power: 2, timing: 2 }, jerambak: { power: 3, timing: 1 }
  };
  var rivals = [
    { name: 'Nyi Roro Kidul', portrait: 'npc_ratukidul_0', color: 0x86edaf, pace: 6.88 },
    { name: 'Poseidon', portrait: 'npc_poseidon_0', color: 0x7ddaff, pace: 6.72 },
    { name: 'Nek Lampir', portrait: 'npc_lampir_0', color: 0xdcb3f3, pace: 6.42 },
    { name: 'Naga Ibu', portrait: 'nagaibu_face', color: 0xffb58c, pace: 7.05 }
  ];

  function savedRace(s) {
    return s.quests.perahuRace || (s.quests.perahuRace = { crew: [], wins: 0, best: 0, paidDay: 0 });
  }
  function totals(ids) {
    return ids.reduce(function (team, id) {
      team.power += crew[id].power; team.timing += crew[id].timing;
      return team;
    }, { power: 0, timing: 0 });
  }
  function phase(race) {
    return Math.max(0, race.time) / STROKE_PERIOD % 1;
  }
  function beat(race) { return Math.floor(race.time / STROKE_PERIOD); }

  LC.PerahuRace = {
    size: CREW_SIZE, length: LENGTH, crew: crew, rivals: rivals, prizes: [1400, 650, 300],
    saved: savedRace, totals: totals, phase: phase, beat: beat,
    invite: function (s, id) {
      var list = savedRace(s).crew;
      if (!Object.prototype.hasOwnProperty.call(crew, id) || list.length >= CREW_SIZE || list.includes(id)) return false;
      list.push(id);
      return true;
    },
    create: function (ids, portrait) {
      var team = totals(ids);
      var boats = [{ name: 'Your crew', portrait: portrait, color: 0xffdb72, pace: 4.1 + team.power * 0.045 }].concat(rivals);
      return { time: -3, stroke: -1, kick: 0, window: 0.12 + team.timing * 0.006, perfect: 0.045 + team.timing * 0.002,
        power: team.power, boats: boats.map(function (b) { return Object.assign({ distance: 0, finish: null }, b); }) };
    },
    row: function (race) {
      if (race.time < 0 || race.boats[0].finish !== null) return null;
      var stroke = beat(race);
      if (race.stroke === stroke) return null;
      race.stroke = stroke;
      var error = Math.abs(phase(race) - 0.5);
      if (error > race.window) return 'miss';
      var perfect = error <= race.perfect;
      race.kick += (perfect ? 4.6 : 3) + race.power * 0.1;
      return perfect ? 'perfect' : 'good';
    },
    advance: function (race, dt) {
      var start = Math.max(0, race.time);
      race.time += dt;
      var elapsed = Math.max(0, race.time) - start;
      if (!elapsed) return;
      var kick = Math.min(race.kick, elapsed * 16);
      race.kick -= kick;
      race.boats.forEach(function (boat, i) {
        if (boat.finish !== null) return;
        var surge = i === 0 ? kick : Math.sin(race.time * 1.6 + i * 1.4) * 0.85 * elapsed;
        var distance = boat.pace * elapsed + surge;
        if (boat.distance + distance >= LENGTH) {
          boat.finish = start + elapsed * (LENGTH - boat.distance) / distance;
          boat.distance = LENGTH;
        } else boat.distance += distance;
      });
    },
    result: function (s, race) {
      if (race.completed) return race.completed;
      if (race.boats.some(function (b) { return b.finish === null; })) return null;
      var record = savedRace(s), time = race.boats[0].finish;
      var place = race.boats.filter(function (b) { return b.finish < time; }).length + 1;
      var prize = record.paidDay === s.day ? 0 : this.prizes[place - 1] || 0;
      if (prize) { s.kepeng += prize; s.stats.earned += prize; record.paidDay = s.day; }
      if (place === 1) record.wins++;
      if (!record.best || time < record.best) record.best = time;
      return race.completed = { place: place, time: time, prize: prize };
    }
  };
})(window.LC);
