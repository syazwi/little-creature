/* Little Creature — the people and the spirits of the land (v1.3).
 *
 * VILLAGERS live in Kampung Tepian. Each has a job, a shop or a service, and a request each day.
 * Friendship grows when you chat (once a day) and help with requests; at 3, 6 and 10 hearts they give a gift.
 * Four of them return to the kampung only after a house is raised for them on an empty plot.
 *
 * SPIRITS come from folk traditions across Southeast Asia, drawn with affection as gentle neighbours.
 * Grant a spirit's wish to befriend it: it then blesses the farm, and one at a time it can follow you around. */
window.LC = window.LC || {};
(function (LC) {
  'use strict';

  // look: skin, shirt, shirt shade, bottom, bottom shade, hair, hat
  LC.VILLAGERS = {
    penghulu: {
      name: 'Tok Penghulu', role: 'Village head', post: { x: 8, y: 8 },
      look: { skin: '#b9825a', shirt: '#2f5f8f', shirt2: '#24486c', bottom: '#7a2e3a', bottom2: '#5a1e2a', hair: '#d8d4cc', hat: 'songkok', beard: '#e8e4dc' },
      intro: [
        'Assalamualaikum, young one! You must be Nenek\'s grandchild. I am the Penghulu, the head of Kampung Tepian.',
        'The monsoon floods washed away half our houses. Many families went to stay with relatives in the town.',
        'If you help us raise new houses on the empty plots, our neighbours will come home. We build together here: gotong-royong!',
        'Tukang Leong the carpenter will show you how. And the kenduri (village feast) always needs good cooking!'
      ],
      chat: ['When the whole kampung builds together, a house goes up in a single night.', 'Your Nenek fed half this village during the floods of \'79.', 'A kampung is not its houses. It is its people.', 'Have you met Pak Mat at the jetty? Best fisherman on the river.'],
      tasks: [['nasi_lemak', 1, 2], ['kuih_pandan', 1, 2], ['pisang_goreng', 1, 3], ['nasi', 2, 4], ['ikan_bakar', 1, 2], ['bubur_ubi', 1, 2]],
      taskText: 'for the kenduri',
      gifts: { 3: ['canang', 2], 6: ['kepeng', 300], 10: ['mutiara', 2] }
    },
    mat: {
      name: 'Pak Mat', role: 'Fisherman', post: { x: 26, y: 24 },
      look: { skin: '#9a6440', shirt: '#d9d0b4', shirt2: '#b8ae90', bottom: '#3e5fa8', bottom2: '#2c4583', hair: '#3a2a20', hat: 'terendak' },
      intro: [
        'Heh! A new face at my jetty. I am Pak Mat. Forty years I have fished this river.',
        'Here, take my old joran (fishing rod). Hold it, face any water and press USE to cast.',
        'Wait for the bobber to dip, then strike! Then reel when the marker is in the green. Easy... after forty years. Hahaha!',
        'Every water has its own fish. River, forest pool, the sea... I buy fish too, and I pay better than Mak Ani!'
      ],
      chat: ['Keli bite best at night. Sotong too: they love the lantern light.', 'The kelah lives only in clean forest water. Treat the forest well.', 'Ikan emas in the mountain lake? Catch one and you are blessed for a year!', 'When the sea is calm, the Naga is watching. Be respectful out there.'],
      tasks: [['ikan_tilapia', 2, 3], ['ikan_keli', 2, 3], ['udang', 1, 2], ['ikan_kembung', 2, 3], ['ikan_puyu', 2, 4], ['sotong', 1, 2]],
      taskText: 'for the night market', shop: ['joran'], buys: { cat: 'fish', mult: 1.25 },
      gifts: { 3: ['ikan_bakar', 2], 6: ['kepeng', 250], 10: ['ikan_emas', 1] }
    },
    leong: {
      name: 'Tukang Leong', role: 'Carpenter', post: { x: 23, y: 7 },
      look: { skin: '#d6a77a', shirt: '#e0e0d8', shirt2: '#bdbdb4', bottom: '#4a4a52', bottom2: '#36363d', hair: '#1e1a18', hat: 'headband' },
      intro: [
        'Ah, the new farmer! Leong, carpenter. My father built half the houses here, and the flood took them back.',
        'See the empty plots with the string and stakes? Bring me materials and kepeng, then use the plot, and the whole kampung will raise the house overnight.',
        'Kayu (wood) from the forest, atap (thatch) from the nipa palms on the island, batu (stone) from the mountain, tanah liat (clay) from the dunes.',
        'Too far for now? I sell materials too. A bit expensive, lah... but builders must eat!'
      ],
      chat: ['A good stilt house keeps you dry in the monsoon and cool in the dry season.', 'We don\'t use nails in the old way. Just pegs and good timber.', 'Every finished house gets a red ribbon and a feast. Very important!', 'Nipa thatch lasts five years if you cure it well.'],
      tasks: [['kayu', 4, 8], ['batu', 3, 6], ['rotan', 2, 4], ['atap', 3, 6]],
      taskText: 'for repairs', shop: ['kayu', 'atap', 'batu', 'tanah_liat'],
      gifts: { 3: ['kayu', 10], 6: ['batu', 10], 10: ['kepeng', 500] }
    },
    siti: {
      name: 'Cik Siti', role: 'Herbalist', movesIn: true,
      look: { skin: '#c9905e', shirt: '#7bb07a', shirt2: '#5a8a5a', bottom: '#5a3a6a', bottom2: '#40284d', hair: '#2a1a14', hat: 'tudung', hatColor: '#e8c8d8' },
      intro: [
        'Terima kasih! What a lovely house. I am Siti. I make jamu and remedies from forest plants.',
        'Bring me herbs and mushrooms from Hutan Rimba and I will teach you their names.',
        'My jamu is bitter, but one cup gives you the energy of a kerbau. Truly!'
      ],
      chat: ['Kunyit (turmeric) for the skin, serai (lemongrass) for the tummy.', 'Never pick the last mushroom. Leave some for the forest.', 'The Orang Bunian love fresh flowers. So I hear...', 'Jamu recipes are passed from grandmother to granddaughter.'],
      tasks: [['herba', 2, 3], ['cendawan', 2, 4], ['pandan', 2, 3], ['rotan', 1, 2]],
      taskText: 'for her remedies', shop: ['jamu'], buys: { items: ['herba', 'cendawan', 'pandan', 'rotan'], mult: 1.25 },
      gifts: { 3: ['jamu', 2], 6: ['sup_cendawan', 2], 10: ['mutiara', 1] }
    },
    lai: {
      name: 'Auntie Lai', role: 'Tea planter', movesIn: true,
      look: { skin: '#e2b48a', shirt: '#d64545', shirt2: '#a83232', bottom: '#2a2a35', bottom2: '#1c1c24', hair: '#555060', hat: 'bun' },
      intro: [
        'Wah, so nice! My family grew tea on Gunung Kabus for three generations. Call me Auntie Lai.',
        'Bring me tea leaves and strawberries from the highlands. Up there the mist does the watering for you!',
        'Come, come. Have some teh O. No sugar? Aiyo, of course with sugar!'
      ],
      chat: ['Pluck only two leaves and a bud. That is the secret.', 'Highland strawberries are sweet because the nights are cold.', 'In the mountains you can wear a jacket. Imagine!', 'Tea tastes best when you share it.'],
      tasks: [['daun_teh', 3, 6], ['strawberi', 2, 4], ['teh_o', 1, 2], ['batu', 2, 3]],
      taskText: 'for her tea stall', shop: ['teh_o'], buys: { items: ['daun_teh', 'strawberi'], mult: 1.25 },
      gifts: { 3: ['teh_o', 3], 6: ['kepeng', 300], 10: ['ikan_emas', 1] }
    },
    dewi: {
      name: 'Mbak Dewi', role: 'Batik artist', movesIn: true,
      look: { skin: '#b97f52', shirt: '#2e5ea8', shirt2: '#e9b949', bottom: '#8a5a2b', bottom2: '#6b4423', hair: '#1e140e', hat: 'flower' },
      intro: [
        'Selamat! I am Dewi, from Java. I paint batik with hot wax and natural dyes.',
        'Marigold makes yellow, melati keeps the cloth fragrant, and clay makes my pots. Seashells become buttons!',
        'I also fold canang, garlands and krathong. Spirits do appreciate a pretty offering.'
      ],
      chat: ['Each batik pattern has a meaning. Parang means strength.', 'A krathong floated at night carries your worries down the river.', 'The canting pen must be warm, but never too hot.', 'In Bali, canang are offered every single morning.'],
      tasks: [['marigold', 2, 4], ['melati', 2, 3], ['kerang', 3, 5], ['tanah_liat', 2, 4]],
      taskText: 'for her dyes and crafts', shop: ['canang', 'malai', 'krathong'], buys: { items: ['kerang', 'marigold', 'melati', 'tanah_liat'], mult: 1.25 },
      gifts: { 3: ['krathong', 2], 6: ['canang', 4], 10: ['kepeng', 600] }
    },
    mai: {
      name: 'Kak Mai', role: 'Fruit trader', movesIn: true,
      look: { skin: '#e0b088', shirt: '#f2f0e6', shirt2: '#d4d0c2', bottom: '#2f2f3a', bottom2: '#20202a', hair: '#1a1210', hat: 'nonla' },
      intro: [
        'Xin chao! Hello! I am Mai. My family sells fruit all along the coast, from Phan Thiet to Melaka.',
        'Dragon fruit from the dunes, durian from the forest, mangoes, coconuts... bring them, I buy them all!',
        'And if you need fruit, I sell some too. Fresh, fresh!'
      ],
      chat: ['Dragon fruit flowers bloom only at night. Like magic.', 'Durian: you love it or you run from it. No in-between!', 'A good mango smells sweet at the stem.', 'One day I will open a fruit stall at the night market.'],
      tasks: [['buah_naga', 2, 3], ['kelapa', 2, 4], ['durian', 1, 2], ['mangga', 2, 3], ['pisang', 3, 5]],
      taskText: 'for her fruit stall', shop: ['durian', 'buah_naga'], buys: { items: ['pisang', 'kelapa', 'mangga', 'durian', 'buah_naga', 'strawberi'], mult: 1.25 },
      gifts: { 3: ['buah_naga', 3], 6: ['pengat_durian', 2], 10: ['kepeng', 600] }
    }
  };
  LC.MOVE_IN = ['siti', 'lai', 'dewi', 'mai'];
  // where each plot's villager stands (in front of the house)
  LC.PLOT_POSTS = { plotA: { x: 29, y: 7 }, plotB: { x: 36, y: 7 }, plotC: { x: 6, y: 13 }, plotD: { x: 13, y: 13 } };

  // ------------------------------------------------------------------ spirits of the land
  LC.SPIRITS = {
    semangat: {
      name: 'Semangat Padi', title: 'the soul of the rice', area: 'farm', x: 35, y: 17,
      lore: 'Malay farmers once spoke softly to the rice, so its gentle soul, the semangat padi, would not take fright and leave the field.',
      meet: 'A tiny golden glow is resting on the bund between the rice plots. It hums like wind through ripe grain.',
      wish: { padi: 5, marigold: 1 }, wishText: 'It looks hungrily at the empty paddy... it wishes for 5 padi and a marigold, to know this field is loved.',
      thanks: 'The Semangat Padi spins with joy. From now on, every rice harvest gives 2 extra padi.',
      blessing: '+2 padi from every rice harvest', color: 0xffe08a
    },
    bunian: {
      name: 'Orang Bunian', title: 'the hidden folk of the forest', area: 'forest', x: 20, y: 17,
      lore: 'In Malay tales the Orang Bunian are hidden people of the deep forest: shy, kind and fond of good manners.',
      meet: 'Leaves rustle with no wind. A small green figure in a leaf hat peeks out from behind a fern!',
      wish: { cendawan: 3, kuih_pandan: 1 }, wishText: 'The little one points at the mushrooms, then at your bag... it wishes for 3 cendawan and a kuih pandan.',
      thanks: 'The Bunian bows politely. Each morning it will leave forest gifts on your doorstep.',
      blessing: 'Leaves 2 forest gifts on your doorstep each morning', color: 0x9be15d
    },
    naga: {
      name: 'Naga Kecil', title: 'a young river serpent', area: 'island', x: 40, y: 17,
      lore: 'Along the Mekong, the naga are serpent spirits of the water who guard rivers, rain and hidden pearls.',
      meet: 'Something blue and gold coils in the shallows. A young naga lifts its crested head and blinks at you.',
      wish: { ikan_kembung: 2, sotong: 1, kerang: 3 }, wishText: 'It sniffs your fishing rod and shell basket... it wishes for 2 ikan kembung, 1 sotong and 3 kerang.',
      thanks: 'The naga swirls the water into rainbows. Fish now bite faster, the reeling zone is wider, and rare fish come more often.',
      blessing: 'Faster bites, easier reeling, more rare fish', color: 0x6fd6e8
    },
    kenyalang: {
      name: 'Kenyalang', title: 'the hornbill messenger', area: 'mountain', x: 36, y: 15,
      lore: 'For the Iban people of Borneo, the rhinoceros hornbill, the kenyalang, carries messages between our world and the spirit world.',
      meet: 'A great black-and-white hornbill with a glowing orange casque is perched on the rocks. Its wingbeats sound like rushing wind.',
      wish: { strawberi: 3, mangga: 2 }, wishText: 'The kenyalang clacks its big beak at your fruit... it wishes for 3 strawberi and 2 mangga.',
      thanks: 'The kenyalang spreads its wings over you. You feel light as a feather: +30 max energy.',
      blessing: '+30 max energy', color: 0xffa040
    },
    nuno: {
      name: 'Nuno sa Punso', title: 'the old one of the mound', area: 'desert', x: 22, y: 18,
      lore: 'In the Philippines, people passing an anthill say "tabi-tabi po" (excuse me, please) so they don\'t disturb the nuno who lives inside.',
      meet: 'A tiny old man with a very long white beard sits on a mound of red sand, frowning at you.',
      wish: { buah_naga: 2, nasi: 1, colok: 1 }, wishText: 'The nuno taps his walking stick... he wishes for 2 buah naga, a bowl of nasi and a stick of colok. Respect your elders!',
      thanks: 'The nuno nods (almost smiling). The soil remembers his blessing: unwatered crops still have a 50% chance to grow overnight.',
      blessing: 'Unwatered crops still have a 50% chance to grow', color: 0xe8b07a, polite: true
    }
  };
  LC.SPIRIT_ORDER = ['semangat', 'bunian', 'naga', 'kenyalang', 'nuno'];
})(window.LC);
