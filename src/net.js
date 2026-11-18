/* Little Creature — co-op networking (PeerJS / WebRTC, star topology).
 *
 * The HOST owns the shared farm: it runs every LC.Sim op, keeps the clock and Pelita, and streams a
 * 10 Hz "tick" (time, Pelita, everyone's position) to the guests. GUESTS send their position and
 * op requests; their bag, kepeng and energy stay on their own device.
 * Matchmaking uses the free public PeerJS server; game traffic goes peer-to-peer
 * (PeerJS's public TURN relay is used when a direct connection is impossible).
 *
 *   guest -> host : hello{name,v} · pos{x,y,dir,mv,ar,cp,rd} · op{rid,op,a} · sleepy      (ar = area, cp = companion spirit, rd = riding)
 *   host -> guest : welcome{id,color,hostName,code,world} · reject{why} · tick{m,d,g,gs,p} · res{rid,res}
 *                   sync{op,a,by,parts} · toast{msg,icon} · event{ev,st} · sleepStart · dayStart{sum,world} · bye{why}
 */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  var PROTO = 3, MAX_PLAYERS = 4, PREFIX = 'littlecreature-';
  var ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var NAME_KEY = 'littleCreature.name';

  var N = LC.Net = {
    MAX: MAX_PLAYERS,
    role: null,            // null (single-player) | 'host' | 'guest'
    peer: null, code: '', myId: 'host', myName: '', myColor: 0, hostName: '',
    guests: {},            // host only: peerId -> { conn, name, color, x, y, dir, mv }
    others: {},            // everyone else as seen locally: id -> { name, color, x, y, dir, mv }
    hostConn: null, reqs: {}, rid: 0,
    on: {}                 // hooks set by the World scene
  };

  N.available = function () { return typeof window.Peer === 'function'; };
  N.isHost = function () { return N.role === 'host'; };
  N.isGuest = function () { return N.role === 'guest'; };
  N.active = function () { return N.role === 'guest' || (N.role === 'host' && Object.keys(N.guests).length > 0); };
  N.count = function () { return 1 + Object.keys(N.others).length; };
  N.emit = function (ev) { var f = N.on[ev]; if (f) { try { f.apply(null, Array.prototype.slice.call(arguments, 1)); } catch (e) { console.error(e); } } };
  N.savedName = function () { try { return localStorage.getItem(NAME_KEY) || ''; } catch (e) { return ''; } };
  N.saveName = function (n) { try { localStorage.setItem(NAME_KEY, n); } catch (e) { /* ignore */ } };
  N.cleanName = function (n) { return String(n || '').replace(/[^\w .'-]/g, '').trim().slice(0, 12); };

  function code5() { var s = ''; for (var i = 0; i < 5; i++) s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]; return s; }
  function netError(e) {
    switch (e && e.type) {
      case 'peer-unavailable': return 'No farm found with that code. Check it with your friend, and make sure they are still hosting.';
      case 'network': case 'socket-error': case 'socket-closed': case 'server-error':
        return 'Could not reach the invite server. Check your internet connection and try again.';
      case 'browser-incompatible': return 'This browser does not support multiplayer (WebRTC).';
      case 'unavailable-id': return 'That room code is busy. Please try again.';
      default: return 'Connection problem' + (e && e.type ? ' (' + e.type + ')' : '') + '. Please try again.';
    }
  }
  function safeSend(conn, msg) { try { if (conn && conn.open) conn.send(msg); } catch (e) { /* ignore */ } }

  // ================================================================ host
  N.host = function (name, ok, fail) {
    if (!N.available()) { fail('The multiplayer library failed to load.'); return; }
    N.leave();
    N.role = 'host'; N.myName = N.cleanName(name) || 'Farmer'; N.myId = 'host'; N.myColor = 0;
    N.guests = {}; N.others = {};
    var tries = 0;
    (function attempt() {
      N.code = code5();
      var p = N.peer = new Peer(PREFIX + N.code, { debug: 0 });
      var opened = false;
      p.on('open', function () { opened = true; ok(N.code); });
      p.on('connection', function (conn) {
        conn.on('data', function (m) { hostOnData(conn, m); });
        conn.on('close', function () { dropGuest(conn.peer); });
        conn.on('error', function () { dropGuest(conn.peer); });
      });
      p.on('error', function (e) {
        if (N.peer !== p) return;
        if (!opened) {
          if (e.type === 'unavailable-id' && tries++ < 4) { try { p.destroy(); } catch (x) { /* ignore */ } attempt(); return; }
          N.role = null; N.peer = null; try { p.destroy(); } catch (x) { /* ignore */ }
          fail(netError(e));
        }
      });
      p.on('disconnected', function () {   // lost the invite server (not the friends): try to get the code back
        if (N.peer === p && N.role === 'host') setTimeout(function () { try { if (!p.destroyed) p.reconnect(); } catch (x) { /* ignore */ } }, 2000);
      });
    })();
  };

  function hostOnData(conn, m) {
    if (!m || !m.t || N.role !== 'host') return;
    var id = conn.peer, g = N.guests[id];
    if (m.t === 'hello') {
      if (m.v !== PROTO) { safeSend(conn, { t: 'reject', why: 'Your game version is different from your friend\'s. Both of you need the latest Little Creature.' }); setTimeout(function () { conn.close(); }, 600); return; }
      if (Object.keys(N.guests).length >= MAX_PLAYERS - 1) { safeSend(conn, { t: 'reject', why: 'This farm is full (' + MAX_PLAYERS + ' players).' }); setTimeout(function () { conn.close(); }, 600); return; }
      var used = { 0: 1 }; Object.keys(N.guests).forEach(function (k) { used[N.guests[k].color] = 1; });
      var color = 1; while (used[color]) color++;
      var sp = N.on.spawn ? N.on.spawn(color) : { x: 72, y: 160 };
      g = N.guests[id] = { conn: conn, name: N.cleanName(m.name) || 'Friend', color: color, x: sp.x, y: sp.y, dir: 'down', mv: false, ar: 'farm', cp: null };
      N.others[id] = g;
      safeSend(conn, { t: 'welcome', id: id, color: color, hostName: N.myName, code: N.code, world: LC.State.snapshot(), v: PROTO });
      N.emit('toast', g.name + ' arrived at your farm!', 'ic_joy');
      N.broadcast({ t: 'toast', msg: g.name + ' arrived at the farm!', icon: 'ic_joy' }, id);
      return;
    }
    if (!g) return;
    switch (m.t) {
      case 'pos': g.x = m.x; g.y = m.y; g.dir = m.dir; g.mv = !!m.mv; g.ar = m.ar || 'farm'; g.cp = m.cp || null; g.rd = m.rd || null; break;
      case 'op':
        var res = null;
        try { res = N.on.op ? N.on.op(m.op, m.a || {}, id) : null; } catch (e) { console.error(e); }
        safeSend(conn, { t: 'res', rid: m.rid, res: res === undefined ? null : res });
        break;
      case 'sleepy': N.emit('toast', g.name + ' is sleepy. Sleep in the house to end the day for everyone.', 'ic_moon'); break;
    }
  }
  function dropGuest(id) {
    var g = N.guests[id];
    if (!g) return;
    delete N.guests[id]; delete N.others[id];
    N.emit('toast', g.name + ' went home.', 'ic_moon');
    N.broadcast({ t: 'toast', msg: g.name + ' went home.', icon: 'ic_moon' });
  }
  N.broadcast = function (msg, exceptId) {
    if (N.role !== 'host') return;
    Object.keys(N.guests).forEach(function (id) { if (id !== exceptId) safeSend(N.guests[id].conn, msg); });
  };
  N.hostTick = function (st) {
    if (N.role !== 'host' || !Object.keys(N.guests).length) return;
    var now = Date.now();
    if (now - (N.lastTick || 0) < 100) return;
    N.lastTick = now;
    var p = [{ id: 'host', n: N.myName, c: 0, x: st.me.x, y: st.me.y, dir: st.me.dir, mv: st.me.mv, ar: st.me.ar, cp: st.me.cp, rd: st.me.rd }];
    Object.keys(N.guests).forEach(function (id) { var g = N.guests[id]; p.push({ id: id, n: g.name, c: g.color, x: g.x, y: g.y, dir: g.dir, mv: g.mv, ar: g.ar, cp: g.cp, rd: g.rd }); });
    N.broadcast({ t: 'tick', m: st.m, d: st.d, g: st.g, gs: st.gs, p: p });
  };

  // ================================================================ guest
  N.join = function (code, name, ok, fail) {
    if (!N.available()) { fail('The multiplayer library failed to load.'); return; }
    N.leave();
    code = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (code.length !== 5) { fail('Room codes have 5 letters and numbers.'); return; }
    N.role = 'guest'; N.myName = N.cleanName(name) || 'Friend'; N.code = code; N.others = {};
    var done = false;
    function finish(err, data) {
      if (done) return; done = true; clearTimeout(timer);
      if (err) { N.leave(); fail(err); } else ok(data);
    }
    var timer = setTimeout(function () { finish('Could not reach that farm. Check the code, and make sure your friend is still hosting.'); }, 20000);
    var p = N.peer = new Peer(PREFIX + 'g' + Math.random().toString(36).slice(2, 10), { debug: 0 });
    p.on('open', function () {
      var c = N.hostConn = p.connect(PREFIX + code, { reliable: true, serialization: 'json' });
      c.on('open', function () { safeSend(c, { t: 'hello', name: N.myName, v: PROTO }); });
      c.on('data', function (m) {
        if (!m || !m.t) return;
        if (m.t === 'welcome') { N.myId = m.id; N.myColor = m.color; N.hostName = m.hostName; finish(null, m); return; }
        if (m.t === 'reject') { finish(m.why); return; }
        guestOnData(m);
      });
      c.on('close', function () {
        if (!done) { finish('The connection closed. Please try again.'); return; }
        if (N.role === 'guest' && N.hostConn === c) { N.leave(); N.emit('closed', 'Lost the connection to your friend\'s farm.'); }
      });
    });
    p.on('error', function (e) {
      if (N.peer !== p) return;
      if (!done) finish(netError(e));
      else if (e.type === 'peer-unavailable' || e.type === 'network') { N.leave(); N.emit('closed', 'Lost the connection to your friend\'s farm.'); }
    });
  };

  function guestOnData(m) {
    switch (m.t) {
      case 'tick':
        var o = {};
        (m.p || []).forEach(function (q) { if (q.id !== N.myId) o[q.id] = { name: q.n, color: q.c, x: q.x, y: q.y, dir: q.dir, mv: q.mv, ar: q.ar || 'farm', cp: q.cp || null, rd: q.rd || null }; });
        N.others = o;
        N.emit('tick', m);
        break;
      case 'res': var cb = N.reqs[m.rid]; delete N.reqs[m.rid]; if (cb) cb(m.res); break;
      case 'sync': N.emit('sync', m); break;
      case 'toast': N.emit('toast', m.msg, m.icon); break;
      case 'event': N.emit('event', m); break;
      case 'sleepStart': N.emit('sleepStart', m); break;
      case 'dayStart': N.emit('dayStart', m); break;
      case 'bye': var why = m.why; N.leave(); N.emit('closed', why || 'Your friend closed their farm.'); break;
    }
  }
  N.request = function (op, a, cb) {
    if (!N.hostConn || !N.hostConn.open) { cb(null); return; }
    var id = ++N.rid;
    N.reqs[id] = cb;
    safeSend(N.hostConn, { t: 'op', rid: id, op: op, a: a });
    setTimeout(function () { if (N.reqs[id]) { delete N.reqs[id]; cb(null); } }, 8000);
  };
  N.send = function (msg) { safeSend(N.hostConn, msg); };
  N.sendPos = function (x, y, dir, mv, ar, cp, force, rd) {
    if (N.role !== 'guest') return;
    var now = Date.now(), k = Math.round(x) + ',' + Math.round(y) + ',' + dir + ',' + (mv ? 1 : 0) + ',' + ar + ',' + cp + ',' + rd;
    if (!force && (now - (N.lastPos || 0) < 90 || (k === N.lastPosKey && now - N.lastPos < 1000))) return;
    N.lastPos = now; N.lastPosKey = k;
    safeSend(N.hostConn, { t: 'pos', x: Math.round(x), y: Math.round(y), dir: dir, mv: !!mv, ar: ar || 'farm', cp: cp || null, rd: rd || null });
  };

  // ================================================================ leave
  N.leave = function () {
    var p = N.peer;
    if (N.role === 'host') N.broadcast({ t: 'bye', why: N.myName + ' closed their farm.' });
    if (N.role === 'guest' && N.hostConn) { try { N.hostConn.close(); } catch (e) { /* ignore */ } }
    N.role = null; N.peer = null; N.guests = {}; N.others = {}; N.hostConn = null; N.reqs = {}; N.code = '';
    N.myColor = 0; N.myId = 'host';
    if (p) setTimeout(function () { try { p.destroy(); } catch (e) { /* ignore */ } }, 400);   // let 'bye' go out first
  };
  window.addEventListener('pagehide', function () { if (N.role) N.leave(); });
})(window.LC);
