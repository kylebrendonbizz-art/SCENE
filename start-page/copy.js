/* SCENE start page copy for uiux9. Written by the writer, no logic. uiux9 reads window.SCENE_START_COPY.
   Strings with ${name} / ${handle} / ${city} / ${friend} are literal tokens (single-quoted, NOT template literals).
   uiux9 should swap them in, e.g. s.replace(/\$\{(\w+)\}/g,(m,k)=>vars[k]??m). */
window.SCENE_START_COPY = {
  /* ===== uiux9 keys: exact names from /workspace/motion/handoff/uiux9/COPY_FOR_WRITER.md (plain text, within max lengths) ===== */
  tagline: 'Nobody knows you. Give it a week.',
  hero_cta: 'Start your era',
  hero_sub: 'Fictional celebrity life sim · free · offline-safe',

  chip_dm_name: 'Your bestie',
  chip_dm_text: 'wait is this your account?? 👀',
  chip_likes: '12.4K likes',
  chip_likes_sub: 'on your first post',
  chip_news_src: 'Pop Base',
  chip_news_text: 'New face is taking over everyone’s feed',
  chip_follow: '+2,318 followers',

  step_label_1: 'You',
  step_label_2: 'Identity',
  step_label_3: 'Lane',
  step_label_4: 'Your person',
  step1_title: 'Who’s the new face?',
  step1_helper: 'Name and @handle. This is your profile card.',
  step2_title: 'How should SCENE refer to you?',
  step2_helper: 'Your people, comments and headlines go by this.',
  step3_title: 'Choose your lane',
  step3_helper: 'Your lane sets your gigs and who clocks you first.',
  card_preview_label: 'Live preview',

  btn_next: 'Next',
  btn_back: 'Back',

  city_label: 'Starting city',
  city_la_vibe: 'Studio lots, Silver Lake shows, big meetings.',

  friend_sabrina: 'roasts the caption, fixes it',
  friend_charli: 'allergic to boring',
  friend_tatemcrae: 'rehearsal legs, big heart',
  friend_sydney: 'scripts, sets, zero downtime',
  friend_timothee: 'film nerd, never press-trained',
  friend_zendaya: 'calm, sharp, never spills',
  friend_hailey: 'clocks the fit, skips drama',
  friend_kendall: 'dry texts, airport era',
  friend_kylie: 'spots a launch in one second',
  friend_doja: 'chaotic genius, will troll you',
  friend_kim: 'reads the room before you do',

  err_name: 'Give us a name first.',
  err_handle: 'You need an @ to exist here.',
  err_pronouns: 'Pick Male, Female or They / Them so SCENE gets you right.',

  /* ===== Extra writer keys (nested, no conflicts with the uiux9 keys above; use if wanted) ===== */
  hero: {
    taglines: [
      'Your era starts on this screen.',
      'Zero followers. Main character energy.',
      'Nobody knows you. Give it a week.'
    ],
    subline: 'Post it, DM them, book the job. The world keeps moving, and it remembers you.',
    cta: 'Start your era',
    continueSave: 'Pick up where you left off',
    fictionNote: 'Fictional entertainment sim. Public figures and brands aren’t affiliated with SCENE.'
  },

  steps: {
    name: {
      eyebrow: '01 · NAME',
      title: 'What do they call you?',
      helper: 'Your real one, your stage one, whatever goes on the poster.',
      placeholder: 'Your name',
      next: 'That’s me'
    },
    handle: {
      eyebrow: '02 · HANDLE',
      title: 'Claim your @',
      helper: 'Short and easy to tag. It shows up on everything you post.',
      placeholder: 'yourhandle',
      next: 'Lock it in',
      preview: {
        nameFallback: 'Future icon',
        handleFallback: '@yourhandle',
        stats: '82 followers · 0 fame',
        badge: 'NEW ACCOUNT',
        available: '@${handle} is all yours'
      }
    },
    city: {
      eyebrow: '03 · CITY',
      title: 'Where’s home base?',
      helper: 'Your first rooms, shoots and gigs happen here. You can fly out later.',
      placeholder: 'Pick a city',
      next: 'Book it',
      selected: 'Home base: ${city}'
    },
    friend: {
      eyebrow: '04 · YOUR PERSON',
      title: 'Who already has your number?',
      helper: 'One person who knows you before the internet does. They follow you, DM you and remember everything.',
      placeholder: 'Search people…',
      next: 'Text them back',
      suggested: 'suggested for you',
      empty: 'Nobody by that name here.',
      selected: '${friend} already knows you.'
    }
  },

  /* Real cities from public/v224/living-world-v48.js:34-41 (CITY48). Keys are exact in-game names. */
  cities: {
    'Los Angeles':  { tag: 'HOME · INDUSTRY',   blurb: 'Studio lots by day, Silver Lake showcases by night. Everyone’s one meeting away.' },
    'New York':     { tag: 'PRESS · FASHION',   blurb: 'Brooklyn studios, SoHo launches, and press that never sleeps.' },
    'Cape Town':    { tag: 'COAST · SHOOTS',    blurb: 'Sea Point shoots, Camps Bay sunsets, golden hour on repeat.' },
    'Johannesburg': { tag: 'MUSIC · MEDIA',     blurb: 'Braamfontein venues and Sandton media rooms. The sound starts here.' },
    'London':       { tag: 'MUSIC · PRESS',     blurb: 'Camden gigs, Shoreditch studios, and the tabloids are always watching.' },
    'Paris':        { tag: 'FASHION · LUXURY',  blurb: 'Le Marais studios and Saint-Germain dinners. Dress like it matters.' },
    'Dubai':        { tag: 'LUXURY · EVENTS',   blurb: 'Downtown launches and Marina nights. Go big or don’t bother.' },
    'Tokyo':        { tag: 'FASHION · CULTURE', blurb: 'Harajuku shoots and Shibuya studios. The trends start here first.' }
  },

  /* Starter story ring: the career-featured picks from public/v224/gameplay-flow-v148.js:30 plus Kim (custom opener, :45).
     Hooks match each character's in-game persona (character-integrity-v135.js) and opener DM. */
  friends: {
    kim:       'Reads the room faster than anyone, and wants to see your first post before the internet does.',
    sabrina:   'Will roast your caption, then help fix it. Text her before you overthink.',
    charli:    'Hates boring. Loves a club, a hook and a hot take. Don’t post anything mid.',
    tatemcrae: 'Rehearsal legs, big heart. She’s already asking what you’re doing first.',
    sydney:    'Scripts, set life, a packed schedule, and she still made time to text you.',
    timothee:  'Film nerd, a little restless, never press-trained. Text him before he disappears for three weeks.',
    zendaya:   'Calm, sharp and private. Gives real career advice and never spills.',
    hailey:    'Clocks the fit, the branding and the boundaries. Text her before everyone starts watching.',
    kendall:   'Dry, low-key, always at an airport. Texts short, means it.',
    kylie:     'Spots a launch, a look or a bad angle in a second. Already asking what you’re posting.',
    doja:      'Chaotic, contrarian, a genius about visuals. She’ll troll you, then make it better.',
    fallback:  'Already in your corner, ${name}. Text them before you overthink it.'
  },
  friendsAllNote: 'Everyone in SCENE is pickable. Search to find your person.',

  bubbles: [
    { type: 'dm',   text: 'wait is this your account?? 👀' },
    { type: 'dm',   text: 'text me before you post anything' },
    { type: 'dm',   text: 'ok who styled you 😭' },
    { type: 'like', text: '♥ 1,284' },
    { type: 'like', text: '♥ 12.4K' },
    { type: 'like', text: '+82 followers' },
    { type: 'pop',  text: 'POP BASE: Who is the new face everyone’s reposting?' },
    { type: 'pop',  text: 'POP BASE: A mystery rooftop set is taking over feeds' },
    { type: 'pop',  text: 'POP BASE: Fans think a surprise collab is coming' }
  ],

  errors: {
    nameEmpty:     'Give us a name first.',
    handleEmpty:   'You need an @ to exist here.',
    handleTaken:   '@${handle} already belongs to someone famous. Make it yours.',
    handleInvalid: 'Letters, numbers and underscores only. No spaces.',
    handleLength:  'Keep it 3–20 characters.',
    cityEmpty:     'Pick a home base.',
    friendEmpty:   'Choose your person first.'
  },

  enter: {
    line: 'You’re live, ${name}. Everybody’s about to find out.',
    button: 'Enter SCENE',
    loading: 'Going live…'
  }
};
