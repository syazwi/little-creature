/* Little Creature — v1.5 data: seasons and seasonal crops, fruit-season trees, farm animals, storage chests,
 * the weekly Pesta (kite fighting, top spinning, the Serama show), strength and combat, the Bunian's hidden
 * village with the keris in the stone, and Lombong Puaka, the haunted gold mine under Gunung Kabus. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';
  function addItems(map) { Object.keys(map).forEach(function (id) { var it = map[id]; it.id = id; it.icon = it.icon || 'i_' + id; LC.ITEMS[id] = it; }); }

  // ================================================================ seasons (7 days each, a 28-day year)
  LC.SEASON_DAYS = 7;
  LC.SEASONS = [
    { id: 'menanam', name: 'Musim Menanam', short: 'Planting season', icon: 'ic_s_menanam', color: '#9be15d',
      desc: 'The first rains soften the soil. Seeds are 20% cheaper at the warung. Jagung and kangkung grow now.' },
    { id: 'buah', name: 'Musim Buah-buahan', short: 'Fruit season', icon: 'ic_s_buah', color: '#f2c94c',
      desc: 'Rambutan, manggis, duku and cempedak ripen in the farm orchard, and every fruit tree gives an extra fruit. Nanas (pineapple) grows now.' },
    { id: 'kemarau', name: 'Musim Kemarau', short: 'Dry season', icon: 'ic_s_kemarau', color: '#ff9a5a',
      desc: 'Hot, dry winds: kite weather! Wau prizes at the Pesta are doubled. Tembikai (watermelon) and jagung love the heat.' },
    { id: 'tengkujuh', name: 'Musim Tengkujuh', short: 'Monsoon', icon: 'ic_s_tengkujuh', color: '#8fd3ff',
      desc: 'Rain every day waters the whole field for you, and river fish bite faster. Kangkung grows now.' }
  ];
  LC.seasonOf = function (day) { return LC.SEASONS[Math.floor((day - 1) / LC.SEASON_DAYS) % LC.SEASONS.length]; };

  // ================================================================ items
  addItems({
    // seasonal seeds and crops
    seed_jagung:   { name: 'Jagung Seeds', kind: 'seed', crop: 'jagung', price: 14, desc: 'Sweet corn. 4 days. Grows in Musim Menanam and Musim Kemarau.' },
    seed_tembikai: { name: 'Tembikai Seeds', kind: 'seed', crop: 'tembikai', price: 30, desc: 'Watermelon. 5 days. Grows only in the heat of Musim Kemarau.' },
    seed_kangkung: { name: 'Kangkung Cuttings', kind: 'seed', crop: 'kangkung', price: 8, desc: 'Water spinach. 2 days. Grows in Musim Tengkujuh and Musim Menanam.' },
    seed_nanas:    { name: 'Nanas Crown', kind: 'seed', crop: 'nanas', price: 35, desc: 'Pineapple. 5 days. Grows in Musim Buah-buahan.' },
    jagung:   { name: 'Jagung', kind: 'crop', sell: 30, food: { full: 12, joy: 4 }, desc: 'Sweet corn on the cob.' },
    tembikai: { name: 'Tembikai', kind: 'crop', sell: 95, food: { full: 10, joy: 14 }, desc: 'A heavy, striped watermelon. So cold and juicy!' },
    kangkung: { name: 'Kangkung', kind: 'crop', sell: 14, food: { full: 6, joy: 1 }, desc: 'Water spinach. Fried with belacan it is a classic.' },
    nanas:    { name: 'Nanas', kind: 'crop', sell: 80, food: { full: 8, joy: 10 }, desc: 'A golden pineapple, sweet and tangy.' },
    // fruit-season fruits
    rambutan: { name: 'Rambutan', kind: 'fruit', sell: 25, food: { full: 6, joy: 10 }, desc: 'Hairy red fruit with sweet white flesh. "Rambut" means hair!' },
    manggis:  { name: 'Manggis', kind: 'fruit', sell: 35, food: { full: 8, joy: 12 }, desc: 'Mangosteen, the queen of fruits. Purple outside, snowy inside.' },
    duku:     { name: 'Duku', kind: 'fruit', sell: 22, food: { full: 6, joy: 8 }, desc: 'Little round duku in bunches. Peel and pop!' },
    cempedak: { name: 'Cempedak', kind: 'fruit', sell: 45, food: { full: 14, joy: 8 }, desc: 'A cousin of the jackfruit, fragrant and golden.' },
    // farm animals give
    telur:      { name: 'Telur', kind: 'produce', price: 20, sell: 12, desc: 'A fresh egg from your hens. Cook it, or let a hen hatch it in the nest.' },
    telur_itik: { name: 'Telur Itik', kind: 'produce', price: 28, sell: 18, desc: 'A big duck egg. Perfect for telur masin, or for hatching.' },
    susu:       { name: 'Susu Kambing', kind: 'drink', sell: 30, food: { full: 8, joy: 6 }, desc: 'Fresh goat milk.' },
    dedak:      { name: 'Dedak', kind: 'feed', price: 6, sell: 2, desc: 'Rice-bran feed for your animals. Use it at the reban, or hold it and face an animal.' },
    sikat:      { name: 'Sikat', kind: 'tool', price: 40, desc: 'A soft grooming brush. Groom your Serama at the reban before a show.' },
    baja:       { name: 'Baja', kind: 'fert', price: 40, sell: 15, desc: 'Compost fertiliser. Face a growing crop and press USE: it grows one day at once.' },
    daging_ayam: { name: 'Daging Ayam', kind: 'meat', price: 30, sell: 15, desc: 'Chicken from the market, for cooking.' },
    // storage
    peti_kayu: { name: 'Peti Kayu', kind: 'chest', slots: 24, price: 150, sell: 60, desc: 'A wooden storage chest (24 stacks). Hold it, face an empty spot and press USE to place it.' },
    peti_ukir: { name: 'Peti Ukir', kind: 'chest', slots: 48, price: 600, sell: 250, desc: 'A big carved chest (48 stacks), with batik-motif woodwork.' },
    // new dishes and drinks
    telur_dadar:      { name: 'Telur Dadar', kind: 'dish', sell: 50, food: { full: 22, joy: 8 }, desc: 'A fluffy omelette with onion and chilli.' },
    nasi_goreng:      { name: 'Nasi Goreng', kind: 'dish', sell: 95, food: { full: 45, joy: 15 }, desc: 'Fried rice with egg and sambal. The midnight snack of champions.' },
    ayam_goreng:      { name: 'Ayam Goreng', kind: 'dish', sell: 110, food: { full: 45, joy: 18 }, desc: 'Crispy fried chicken with turmeric and lemongrass.' },
    kuih_bahulu:      { name: 'Kuih Bahulu', kind: 'dish', sell: 85, food: { full: 20, joy: 26 }, desc: 'Little golden egg sponge cakes, baked in a flower mould.' },
    telur_masin:      { name: 'Telur Masin', kind: 'dish', sell: 45, food: { full: 14, joy: 4 }, desc: 'Salted duck eggs, cured in clay and ash.' },
    teh_tarik:        { name: 'Teh Tarik', kind: 'drink', sell: 60, food: { full: 8, joy: 26 }, desc: '"Pulled" tea with milk, frothy from being poured high.' },
    jagung_rebus:     { name: 'Jagung Rebus', kind: 'dish', sell: 50, food: { full: 20, joy: 8 }, desc: 'Boiled sweet corn with butter and salt.' },
    jus_tembikai:     { name: 'Jus Tembikai', kind: 'drink', sell: 110, food: { full: 10, joy: 24 }, desc: 'Ice-cold watermelon juice.' },
    rojak:            { name: 'Rojak Buah', kind: 'dish', sell: 130, food: { full: 35, joy: 20 }, desc: 'Fruit salad in a sticky, spicy prawn-paste sauce.' },
    cempedak_goreng:  { name: 'Cempedak Goreng', kind: 'dish', sell: 100, food: { full: 30, joy: 18 }, desc: 'Cempedak fritters, crispy outside and custardy inside.' },
    kangkung_belacan: { name: 'Kangkung Belacan', kind: 'dish', sell: 60, food: { full: 24, joy: 6 }, desc: 'Water spinach stir-fried with shrimp paste and chilli.' },
    ais_kacang:       { name: 'Ais Kacang', kind: 'dish', price: 45, sell: 40, food: { full: 12, joy: 30 }, desc: 'Shaved ice with red beans, jelly, corn and rose syrup. Pelita squeals with joy.' },
    // Pesta gear and trophies
    wau:        { name: 'Wau', kind: 'gear', price: 120, sell: 40, desc: 'A paper-and-bamboo fighting kite. Enter the kite contest at the Pesta.' },
    wau_bulan:  { name: 'Wau Bulan', kind: 'gear', price: 450, sell: 150, desc: 'The moon kite of Kelantan, with a humming bow. Steadier in the wind (easier kite fights).' },
    gasing:     { name: 'Gasing', kind: 'gear', price: 80, sell: 25, desc: 'A spinning top of hard wood, with a long cord. Enter the gasing contest at the Pesta.' },
    gasing_uri: { name: 'Gasing Uri', kind: 'gear', price: 300, sell: 100, desc: 'A heavy, balanced top made for long spins. Spins about 12 seconds longer.' },
    piala_wau:    { name: 'Piala Wau', kind: 'treasure', sell: 200, desc: 'Champion of the kite fight! A little silver kite on a stand.' },
    piala_gasing: { name: 'Piala Gasing', kind: 'treasure', sell: 200, desc: 'Champion of the top spinning! A silver top that still turns.' },
    piala_serama: { name: 'Piala Serama', kind: 'treasure', sell: 200, desc: 'Champion of the Serama show! A tiny silver rooster.' },
    // weapons (combat) and the Bunian's gifts
    tongkat: { name: 'Tongkat Rotan', kind: 'weapon', dmg: 1, reach: 18, cd: 0.42, price: 60, sell: 20, desc: 'A sturdy rattan staff. Hold it and press USE to swing. Better than bare hands!' },
    parang:  { name: 'Parang', kind: 'weapon', dmg: 2, reach: 20, cd: 0.5, price: 350, sell: 120, desc: 'A farmer\'s machete, sharp and dependable. Twice as strong as a staff.' },
    keris:   { name: 'Keris Lok Tujuh', kind: 'weapon', dmg: 4, reach: 23, cd: 0.36, desc: 'The seven-waved keris from the stone in the Bunian kampung. It glows faintly, and shadows fear it.' },
    cermin_mata: { name: 'Cermin Mata Bunian', kind: 'wear', desc: 'Glasses of the hidden folk. Hold them and press USE (or G) to put them on: you will see what others cannot.' },
    madu_tualang: { name: 'Madu Tualang', kind: 'forage', sell: 60, food: { full: 6, joy: 16 }, desc: 'Wild honey from the giant tualang tree. Dark, rich and rare.' },
    jamu_kuat:    { name: 'Jamu Kuat', kind: 'drink', price: 120, sell: 40, strength: 5, food: { full: 2, joy: -4 }, desc: 'A fierce Bunian tonic. Eat it (X) for +5 strength (once a day).' },
    pelita_bunian: { name: 'Pelita Bunian', kind: 'offering', price: 150, glow: 60, joy: 15, bond: 12, sell: 60, desc: 'A little lamp of the hidden folk that never needs oil. Pelita is fascinated.' },
    buah_emas:    { name: 'Buah Emas', kind: 'fruit', price: 220, sell: 110, food: { full: 30, joy: 40 }, desc: 'A golden fruit from the Bunian orchards. It tastes like sunlight.' },
    // Lombong Puaka (the haunted gold mine)
    bijih_emas: { name: 'Bijih Emas', kind: 'treasure', sell: 60, desc: 'Gold ore from the old mine. Dang Melur in the hidden kampung pays best.' },
    emas:       { name: 'Emas', kind: 'treasure', sell: 300, desc: 'A real gold nugget! Heavy and warm in your hand.' },
    kristal:    { name: 'Kristal Gua', kind: 'treasure', sell: 140, desc: 'A violet cave crystal that glows in the dark.' },
    serpihan_bayang: { name: 'Serpihan Bayang', kind: 'junk', sell: 35, desc: 'A cold shard left behind by a shadow. It hums quietly.' },
    ikan_buta: { name: 'Ikan Buta', kind: 'fish', cat: 'fish', sell: 160, diff: 3, desc: 'A pale, blind cave fish from the underground pool. Very rare!' }
  });
  LC.LOVES = LC.LOVES.concat(['kuih_bahulu', 'teh_tarik', 'ais_kacang', 'buah_emas', 'manggis']);

  // ================================================================ crops, trees, recipes and crafts
  Object.assign(LC.CROPS, {
    jagung:   { name: 'Jagung', days: 4, item: 'jagung', count: 2, seasons: ['menanam', 'kemarau'] },
    tembikai: { name: 'Tembikai', days: 5, item: 'tembikai', count: 1, seasons: ['kemarau'] },
    kangkung: { name: 'Kangkung', days: 2, item: 'kangkung', count: 3, seasons: ['tengkujuh', 'menanam'] },
    nanas:    { name: 'Nanas', days: 5, item: 'nanas', count: 1, seasons: ['buah'] }
  });
  // fruit-season trees only bear fruit in Musim Buah-buahan
  Object.assign(LC.TREES, {
    rambutan: { fruit: 'rambutan', count: 3, regrow: 2, name: 'Rambutan tree', season: 'buah' },
    manggis:  { fruit: 'manggis', count: 2, regrow: 2, name: 'Manggis tree', season: 'buah' },
    duku:     { fruit: 'duku', count: 3, regrow: 2, name: 'Duku tree', season: 'buah' },
    cempedak: { fruit: 'cempedak', count: 1, regrow: 2, name: 'Cempedak tree', season: 'buah' }
  });
  LC.RECIPES = LC.RECIPES.concat([
    { out: 'telur_dadar', inp: { telur: 2 } },
    { out: 'nasi_goreng', inp: { padi: 1, telur: 1, cili: 1 } },
    { out: 'ayam_goreng', inp: { daging_ayam: 1, cili: 1 } },
    { out: 'kuih_bahulu', inp: { telur: 2, padi: 1 } },
    { out: 'telur_masin', inp: { telur_itik: 2 } },
    { out: 'teh_tarik', inp: { daun_teh: 1, susu: 1 } },
    { out: 'jagung_rebus', inp: { jagung: 1 } },
    { out: 'jus_tembikai', inp: { tembikai: 1 } },
    { out: 'rojak', inp: { nanas: 1, mangga: 1, cili: 1 } },
    { out: 'cempedak_goreng', inp: { cempedak: 1, padi: 1 } },
    { out: 'kangkung_belacan', inp: { kangkung: 2, cili: 1 } }
  ]);
  // made at the dapur's Craft tab
  LC.MAKES = [
    { out: 'peti_kayu', inp: { kayu: 10, rotan: 2 } },
    { out: 'peti_ukir', inp: { kayu: 20, batu: 4, kerang: 6 }, lvl: 10 },
    { out: 'tongkat', inp: { rotan: 4 } },
    { out: 'baja', inp: { cendawan: 1, kangkung: 2 } }
  ];
  // warung stock: seasonal seeds in their season, and Mak Ani's new stall from Pelita Lv 10
  LC.SHOP = LC.SHOP.concat(['dedak', 'daging_ayam', 'peti_kayu', 'telur', 'telur_itik']);   // (v2.3.2: eggs too)
  LC.SHOP_SEASON = { menanam: ['seed_jagung', 'seed_kangkung'], buah: ['seed_nanas'], kemarau: ['seed_jagung', 'seed_tembikai'], tengkujuh: ['seed_kangkung'] };
  LC.SHOP_LV10 = ['peti_ukir', 'baja', 'ais_kacang', 'malai', 'canang', 'krathong'];
  LC.LEVEL_REWARDS[9].unlock = 'lombong';
  LC.LEVEL_REWARDS[10] = { water: 10, warung: true, text: 'Your gembor now holds 30 waterings. And Mak Ani opens her new stall: chests, fertiliser, ais kacang and more, and she pays 10% more for everything you sell!' };

  // ================================================================ farm animals (shared, they live at Nenek's reban)
  // home: coop (birds, up to 10) or pen (goats, up to 4). produce every N days if fed. grows: chicks grow up.
  LC.ANIMALS = {
    ayam:        { name: 'Ayam Kampung', home: 'coop', price: 150, produce: 'telur', every: 1, tex: 'chicken', sfx: 'cluck', desc: 'A brown village hen. Lays an egg every day she is fed.' },
    itik:        { name: 'Itik', home: 'coop', price: 180, produce: 'telur_itik', every: 1, tex: 'itik', sfx: 'quack', desc: 'A white duck. Lays a big duck egg every day she is fed.' },
    serama:      { name: 'Ayam Serama', home: 'coop', price: 400, tex: 'serama', sfx: 'crow', contest: true, desc: 'The world\'s smallest, proudest chicken. Raise one with love and enter it in the Serama show.' },
    kambing:     { name: 'Kambing', home: 'pen', price: 500, produce: 'susu', every: 2, tex: 'kambing', sfx: 'bleat', desc: 'A friendly goat. Gives milk every two days when fed.' },
    anak_ayam:   { name: 'Anak Ayam', home: 'coop', grows: 'ayam', days: 3, tex: 'anak', sfx: 'cluck', desc: 'A fluffy chick. Grows into a hen in 3 days.' },
    anak_itik:   { name: 'Anak Itik', home: 'coop', grows: 'itik', days: 3, tex: 'anak', sfx: 'quack', desc: 'A fluffy duckling. Grows into a duck in 3 days.' },
    anak_serama: { name: 'Anak Serama', home: 'coop', grows: 'serama', days: 3, tex: 'anak', sfx: 'cluck', desc: 'A tiny Serama chick. Grows up proud in 3 days.' }
  };
  LC.ANIMAL_ROOM = { coop: 10, pen: 4 };
  // v2.3.2: selling a farm animal (it goes to a good home on another farm): half its price, a chick a little less,
  // and a well-loved animal fetches more
  LC.animalSellPrice = function (a) {
    var D = LC.ANIMALS[a.kind]; if (!D) return 0;
    var base = D.price ? D.price * 0.5 : ((LC.ANIMALS[D.grows] || {}).price || 100) * 0.3;
    return Math.round(base + (a.love || 0) * 2);
  };
  LC.ANIMAL_NAMES = ['Tompok', 'Comel', 'Bulat', 'Kiki', 'Gebu', 'Manja', 'Si Merah', 'Labu', 'Kuning', 'Bintang', 'Mochi', 'Pandan', 'Belang', 'Jambu', 'Cik Puteh', 'Ondeh', 'Bobo', 'Lenggang', 'Jebat', 'Cempaka'];
  LC.CHESTS = { peti_kayu: { slots: 24 }, peti_ukir: { slots: 48 } };

  // ================================================================ the Pesta (every Sabtu, 8 AM to 6 PM, on the kampung padang)
  LC.PESTA_OPEN = 8 * 60; LC.PESTA_CLOSE = 18 * 60;
  LC.CONTESTS = {
    wau:    { name: 'Wau Aduan', what: 'Kite fighting', icon: 'i_wau', gear: ['wau_bulan', 'wau'], trophy: 'piala_wau', rivals: ['Mat Lepat', 'Cik Nab', 'Tok Awang'],
              how: 'Tap to pull your kite string and keep the tension in the green as the wind shifts. Hold it there to cut your rival\'s string before they cut yours. Too tight and you lose ground!' },
    gasing: { name: 'Gasing Uri', what: 'Top spinning', icon: 'i_gasing', gear: ['gasing_uri', 'gasing'], trophy: 'piala_gasing', rivals: ['Ah Kow', 'Kak Yam', 'Pak Su'],
              how: 'Tap when the power meter is high to wind the cord, then tap when the marker is in the centre to throw. The top that spins longest wins.' },
    serama: { name: 'Ratu Serama', what: 'Serama show', icon: 'serama_0', animal: 'serama', trophy: 'piala_serama', rivals: ['Jaguh', 'Si Kecik', 'Raja Kokok'],
              how: 'Your Serama\'s love (pet and feed it daily) and grooming (sikat) count for half. Then tap when it strikes each pose: chest out, tail up, stand tall!' }
  };
  LC.CONTEST_ROUND_PRIZE = [25, 50];
  LC.CONTEST_FOOD = ['nasi_lemak', 'pulut_mangga', 'ais_kacang', 'kuih_bahulu', 'pengat_durian', 'rojak'];
  LC.CONTEST_RARE = ['mutiara', 'pinggan_lama', 'emas', 'buah_emas', 'kristal'];

  // ================================================================ strength and combat
  LC.STR_KERIS = 60;     // strength needed to draw the keris from the stone
  LC.STR_MAX = 100;
  LC.maxHpFor = function (str) { return 50 + Math.floor(str / 2); };
  LC.ENEMIES = {
    kelawar:  { name: 'Kelawar Hantu', hp: 2, speed: 52, dmg: 4, sight: 120, w: 5, erratic: true, drop: [['kepeng', 0.5, 3, 8]] },
    bayang:   { name: 'Bayang', hp: 3, speed: 30, dmg: 6, sight: 110, w: 5, drop: [['serpihan_bayang', 0.6, 1, 1]] },
    lipan:    { name: 'Lipan Gergasi', hp: 5, speed: 24, dmg: 8, sight: 90, w: 8, drop: [['bijih_emas', 0.4, 1, 2]] },
    penunggu: { name: 'Penunggu Lombong', hp: 24, speed: 15, dmg: 14, sight: 130, w: 9, boss: true, drop: [['emas', 1, 2, 3], ['kristal', 0.5, 1, 1]] }
  };

  // ================================================================ forage in the new places
  Object.assign(LC.FORAGE, {
    honey:     { name: 'Wild bees\' nest', verb: 'Collect wild honey (gently!)', item: 'madu_tualang', count: 1, regrow: 3, energy: 2 },
    goldvein:  { name: 'Gold seam', verb: 'Chip out the gold ore', item: 'bijih_emas', count: 2, regrow: 2, energy: 3, rare: ['emas', 0.18] },
    crystal:   { name: 'Crystal cluster', verb: 'Break off a crystal', item: 'kristal', count: 1, regrow: 3, energy: 2 },
    goldchest: { name: 'The miners\' strongbox', verb: 'Open the old strongbox', item: 'emas', count: 2, regrow: 4, energy: 1, rare: ['mutiara', 0.5] }
  });
  LC.FISHING.cave = [['ikan_buta', 26], ['ikan_keli', 34], ['bijih_emas', 10], ['selipar', 4]];
  LC.WATER_NAMES.cave = 'underground pool';

  // ================================================================ new neighbours
  Object.assign(LC.VILLAGERS, {
    lah: {
      name: 'Pak Lah', role: 'Poultry farmer', post: { x: 17, y: 13 },
      look: { skin: '#a8714a', shirt: '#e9e4d0', shirt2: '#c8c2ac', bottom: '#5a4a3a', bottom2: '#40342a', hair: '#3a3a3a', hat: 'kopiah', beard: '#6a6a6a' },
      intro: [
        'Assalamualaikum! Pak Lah. Chickens, ducks, goats... if it clucks, quacks or bleats, I know it.',
        'Your Nenek kept hens in that old reban behind her house. Empty now, kan? Here, take one of my best layers. Free! For Nenek.',
        'Feed your animals every day at the reban: dedak (rice bran) or a little padi. Fed hens lay eggs. Happy hens lay more, so pet them too!',
        'Put an egg in the nest and a hen will sit on it. Three nights later: a chick! That is how a farm grows.',
        'And every Sabtu, come to the Pesta. I judge the Serama show: the smallest, proudest chickens in the world!'
      ],
      chat: ['A Serama stands like a tiny soldier. Chest out, tail up!', 'Ducks are happiest near water. Like me after lunch.', 'Never skip feeding. Animals remember.', 'Goat milk teh tarik... you have not lived until you try it.'],
      tasks: [['telur', 2, 4], ['padi', 3, 5], ['jagung', 2, 3], ['kangkung', 2, 4], ['susu', 1, 2]],
      taskText: 'for his animals', shop: ['dedak', 'sikat'], animals: ['ayam', 'itik', 'serama', 'kambing'], buys: { items: ['telur', 'telur_itik', 'susu'], mult: 1.3 },
      gifts: { 3: ['dedak', 20], 6: ['kepeng', 300], 10: ['sikat', 1] }
    },
    wan: {
      name: 'Pak Wan', role: 'Kite and top maker', post: { x: 20, y: 20 },
      look: { skin: '#9a6440', shirt: '#2a2a6a', shirt2: '#1e1e4e', bottom: '#c8a040', bottom2: '#a07a28', hair: '#2a2a2a', hat: 'tanjak' },
      intro: [
        'Hah! Pak Wan, from Kelantan. I make wau and gasing, like my father, and his father before him.',
        'The wau bulan: the moon kite, the most beautiful kite in the world. When its bow hums in the wind, the whole sky listens.',
        'Every Sabtu there is a Pesta here on the padang: kite fighting, top spinning and the Serama show. Win three rounds to be champion!',
        'Buy a wau and a gasing from me, and practise any day at the pavilion. The dry season wind is the best for kites!'
      ],
      chat: ['A good gasing hums like a sleeping cat.', 'The string of a fighting kite is coated in glue and ground glass. Careful!', 'In Kelantan, even grandmothers fly kites.', 'Strength in the throw, gentleness in the release.'],
      tasks: [['rotan', 2, 4], ['kayu', 3, 5], ['atap', 2, 4], ['kerang', 2, 3]],
      taskText: 'for his workshop', shop: ['wau', 'gasing', 'wau_bulan', 'gasing_uri', 'tongkat'], shopNeeds: { wau_bulan: 3, gasing_uri: 3 },
      gifts: { 3: ['kepeng', 150], 6: ['gasing_uri', 1], 10: ['kepeng', 500] }
    },
    // ---- the hidden kampung of the Orang Bunian
    tokbatin: {
      name: 'Tok Batin', role: 'Elder of the hidden folk', area: 'bunian', post: { x: 24, y: 9 },
      look: { skin: '#e2c09a', shirt: '#2f7a4a', shirt2: '#e9c46a', bottom: '#e9c46a', bottom2: '#c4922f', hair: '#e8e4dc', hat: 'tanjak_gold', beard: '#f0ece4' },
      intro: [
        'So. A human child walks among us, seeing what should not be seen. The glasses suit you.',
        'I am Tok Batin, eldest of the Orang Bunian. Our kampung has stood here, between one leaf and the next, for longer than your rivers have had names.',
        'You were kind to our little cousin in the forest, so here you are welcome. Mind your manners, and take only what is given.',
        'Ah, you are looking at the keris in the stone. It waits for someone strong in body and kind in heart. Train, child, and come back when you are strong.'
      ],
      chat: ['A kind word costs nothing and is remembered for a hundred years.', 'The keris was left by a guardian who protected both our worlds.', 'Strength without kindness is only noise.', 'When humans hear music in an empty forest, it is our wedding feasts.'],
      tasks: [['melati', 3, 5], ['madu_tualang', 1, 2], ['kuih_pandan', 1, 2], ['canang', 1, 1]],
      taskText: 'for the elders', gifts: { 3: ['pelita_bunian', 2], 6: ['buah_emas', 2], 10: ['kepeng', 800] }
    },
    melur: {
      name: 'Dang Melur', role: 'Keeper of rare goods', area: 'bunian', post: { x: 11, y: 18 },
      look: { skin: '#e8c4a0', shirt: '#3f9a5a', shirt2: '#2f7a4a', bottom: '#e9c46a', bottom2: '#c4922f', hair: '#1e140e', hat: 'flower' },
      intro: [
        'Welcome, welcome, seeing-one. I am Dang Melur. I keep the rare things: lamps that need no oil, fruit that tastes of sunlight, tonics that make you strong.',
        'And I buy treasures. Gold from the old mine under the mountain, cave crystals, pearls, wild honey. Better than any human trader!',
        'The mine? Hmm. Shadows live there now. Bring something sharp, and do not stay too long.'
      ],
      chat: ['Gold remembers the hands that held it.', 'Our lamps burn on kindness. Strange but true.', 'Jamu kuat: one cup a day, no more. Unless you want to lift a kerbau.', 'A buah emas takes a hundred years to grow. Eat it slowly.'],
      tasks: [['herba', 2, 4], ['madu_tualang', 1, 2], ['kristal', 1, 1], ['mutiara', 1, 1]],
      taskText: 'for her shop', shop: ['buah_emas', 'pelita_bunian', 'jamu_kuat'], buys: { items: ['emas', 'bijih_emas', 'kristal', 'mutiara', 'madu_tualang', 'serpihan_bayang', 'pinggan_lama'], mult: 1.4 },
      gifts: { 3: ['jamu_kuat', 2], 6: ['kristal', 2], 10: ['emas', 3] }
    },
    kesuma: {
      name: 'Kesuma', role: 'Silat master', area: 'bunian', post: { x: 32, y: 13 },
      look: { skin: '#d6a77a', shirt: '#1e1e24', shirt2: '#14141a', bottom: '#1e1e24', bottom2: '#14141a', hair: '#1a1210', hat: 'tanjak_red' },
      intro: [
        'Hm. You walk like a farmer. Strong legs, no balance. I am Kesuma, guardian of the keris and teacher of silat.',
        'Silat is the art of the body and the heart. Train with me once a day and you will grow strong.',
        'When you are strong enough, the keris will come out of the stone for you. Only then. And the shadows in the old mine will learn to fear you.'
      ],
      chat: ['Bend like the padi in the wind. Never break.', 'A true warrior hopes never to fight.', 'Breathe in through the nose. Out through the mouth. Again!', 'The shadows in the mine are only sorrow with teeth. Do not be afraid of them.'],
      tasks: [['nasi_lemak', 1, 2], ['ikan_bakar', 1, 2], ['jamu', 1, 1], ['serpihan_bayang', 2, 3]],
      taskText: 'for training', train: true, gifts: { 3: ['jamu_kuat', 2], 6: ['parang', 1], 10: ['kepeng', 700] }
    },
    bayu: {
      name: 'Si Bayu', role: 'Bunian child', area: 'bunian', post: { x: 17, y: 23 },
      look: { skin: '#e8c4a0', shirt: '#9be15d', shirt2: '#6aa84f', bottom: '#5a7a3a', bottom2: '#40582a', hair: '#3a2a20', hat: 'leaf' },
      intro: [
        'A human! A real one! Can you really not see us without the glasses? Hehe, that is so funny.',
        'I am Bayu. I am two hundred years old, which is very young for a Bunian. Do you have any sweets?'
      ],
      chat: ['I hid in your Nenek\'s banana trees once. She left kuih out for me!', 'The fireflies here are my friends. They glow when I sing.', 'Tok Batin says I must not tease humans. I only tease a little.', 'Rambutan! Rambutan! Do you have rambutan?'],
      tasks: [['rambutan', 2, 4], ['strawberi', 2, 3], ['air_merah', 1, 2], ['kerang', 2, 4], ['ais_kacang', 1, 1]],
      taskText: 'for a snack', gifts: { 3: ['madu_tualang', 2], 6: ['buah_emas', 1], 10: ['kepeng', 400] }
    }
  });
  LC.VILLAGERS.leong.shop = LC.VILLAGERS.leong.shop.concat(['parang']);

  // the Bunian's request (after you befriend the little one in the forest): the reward is the glasses
  LC.BUNIAN_QUEST = { madu_tualang: 3, pengat_durian: 1, melati: 4 };

  Object.assign(LC.TEXT, {
    pesta_off: 'The Pesta pavilion, hung with flags and kites. The next Pesta is on Sabtu, from 8 AM to 6 PM.',
    lift: 'A batu angkat: a smooth, heavy training stone. Kampung youths lift it to show their strength.',
    coop_empty: 'Nenek\'s old reban (coop). Pak Lah in the kampung sells hens, ducks, Serama and goats.',
    portal_locked: 'An old mine shaft, boarded up and wrapped in chains. Cold air breathes out between the planks... The way opens when Pelita reaches Lv 9.',
    portal: 'Lombong Puaka: the cursed old gold mine. The miners left in a hurry a hundred years ago, and the shadows moved in. Cold air sighs from the dark. Do you dare go down?',
    keris_weak: 'A keris with seven waves in its blade, sunk to the hilt in a mossy stone. You grip the handle and pull with all your might... it does not move a hair.',
    lombong_sign: 'LOMBONG EMAS (closed 1931). DANGER. The shadows do not like light. Turn back.',
    gerai_closed: 'An empty stall frame next to the warung. Mak Ani dreams of expanding one day. (Pelita Lv 10)'
  });
})(window.LC);
