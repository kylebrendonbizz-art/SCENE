/* SCENE Writer: Career page copy for uiux10 (read by public/motion/uiux10.js, which loads this file from its own folder).
   Keys match /workspace/motion/handoff/uiux10/COPY_FOR_WRITER.md (flat, dotted keys), plus the career-copy2 keys below.
   Plain text only. Placeholders {n} {level} {rank} {day} {city} {energy} {pay} {currency} are left for uiux10 to fill.
   Any key missing here falls back to uiux10's own text, so every new key is optional. */
window.SCENE_CAREER_COPY = Object.assign(window.SCENE_CAREER_COPY || {}, {
  // Sticky header
  'header.level':        'Level {level}',
  'header.rank':         '{rank}',

  // Segmented control (≤10)
  'seg.overview':        'Career',
  'seg.travel':          'Travel',
  'seg.resources':       'Resources',
  'seg.skills':          'Skills',

  // Section 1: Next up
  'next.title':          'Next up',
  'next.kicker':         'YOUR MOVE',
  'next.button':         'Let’s go',
  'next.side':           'Also on your plate',
  'next.empty':          'All quiet for now. Post something or grab a booking.',
  'next.bookKicker':     'UP FOR GRABS',
  'next.bookButton':     'Grab it',
  'next.button.dm':      'Open the chat',
  'next.button.compose': 'Write the post',
  'next.button.event':   'See how it plays',

  // Section 2: Bookings
  'book.title':          'Bookings',
  'book.sub':            'Paid work in {city}',
  'book.payLabel':       'Pay',
  'book.pay':            '{pay} {currency}',
  'book.when':           'Right now',
  'book.energy':         '{energy} energy',
  'book.energyBeta':     'Zero energy',
  'book.button':         'Book it',
  'book.storyButton':    'Play it',
  'book.empty':          'Nothing on the table yet. Get your name out there.',
  'book.locked':         'Not yet',

  // Section 3: Your story so far
  'story.title':         'Your story so far',
  'story.chapter':       'Chapter {n} · {rank}',
  'story.next':          'Next rung: {rank}',
  'story.empty':         'Nothing here yet. Your first move starts it.',
  'story.more':          'See it all',
  'story.less':          'Show less',
  'story.kind.story':    'Story',
  'story.kind.job':      'Booking',
  'story.kind.travel':   'Trip',
  'story.kind.level':    'Level up',
  'story.kind.friend':   'New friend',
  'story.day':           'Day {day}',
  'story.dayNone':       'Earlier',
  'story.kind.dm':       'DMs',
  'story.kind.event':    'Moment',
  'story.kind.compose':  'Post',
  'story.kind.reaction': 'Reaction',
  'story.kind.career':   'Career move',

  // Screen-reader labels
  'aria.seg':            'Career sections',
  'aria.rail':           'Bookings, swipe for more',

  // More drawer
  'more.title':          'More',
  'more.skills':         'Skills & level',
  'more.skillsSub':      'Skill points ready: {n}',
  'more.travel':         'Travel',
  'more.travelSub':      'You’re in {city}',
  'more.resources':      'Resources',
  'more.resourcesSub':   'Energy, boosts & gifts',
  'back':                'Back to Career'
});
