/* SCENE story captions (stories v229), hand-written by Writer. No AI, no network, no paid services.
   Contract: STORY_THEMES_FOR_WRITER.md / STORY_API_FOR_UIUX.md (logic-work/stories).
   - window.SCENE_STORY_CAPTIONS[captionKey] is a fn(story) => string (the API allows fn or array).
     It picks the poster's own voice bank when one exists (BY_CHAR[charId][key]), otherwise the
     shared bank (GENERIC[key]). Lines whose {slot} the story doesn't have are skipped, the pick is
     seeded by story.id (same story -> same line), and it returns '' only if nothing fits, which
     makes logic show the neutral placeholder. Every bank also has token-free lines, so that never happens.
   - Raw data stays readable for UI/QA at window.SCENE_STORY_CAPTION_BANK = {generic, byChar, ...}.
   - Merges: keys already in SCENE_STORY_CAPTIONS that this file doesn't cover are kept; for covered
     keys an earlier entry is used only as a fallback.
   Load anywhere (logic reads the bank on every lookup). Safe to load twice. */
(()=>{
'use strict';
const G=typeof window!=='undefined'?window:globalThis;
const L=s=>s.split('\n').map(x=>x.trim()).filter(Boolean);

/* ---------- shared bank: every theme key (lowercase, aesthetic, emoji sparingly) ---------- */
const GENERIC={
'story.jet_travel':L(`wheels up
wheels up to {city}
off to {city} ✈️
window seat, cloud view
somewhere over the clouds`),
'story.airport_run':L(`airport mode
gate snacks, no notes
boarding soon. {city} next
hoodie, sunglasses, passport
see you soon, {city} 🛫`),
'story.hotel_window':L(`view from the room
{city} from up here
room service and a window seat
curtains open, city on 🏨
quiet floor, loud city`),
'story.city_walk':L(`out for a walk
{city} on foot today
no plan, just walking
a slow loop around {place}
walked till the playlist ended 🏙️`),
'story.coffee_run':L(`coffee first
coffee run
iced, always
{city} coffee hits different ☕
first sip, then everything else`),
'story.golden_hour':L(`golden hour
the light right now
{city} doing that thing again 🌅
sun's out, phone out
a few minutes of perfect light`),
'story.beach_day':L(`salt air
sand everywhere, happy
{place} kind of day
ocean reset 🏖️
no signal, no problem`),
'story.dinner_out':L(`dinner
table for the whole team
dinner in {city} 🍝
{person} picked the place. good call
dessert was not optional`),
'story.car_ride':L(`on the move
passenger seat dj
{city} through the window
playlist on loop 🚗
{project} on repeat in the car`),
'story.hometown':L(`home
back in {city}
{city} raised me
always good to be home 🏡
same streets, new day`),
'story.home_cozy':L(`quiet night in
candles on, phone (mostly) off
blanket, tea, nowhere to be 🕯️
staying in tonight
soft night`),
'story.book_tea':L(`reading
tea's hot, book's good 📖
one more chapter
reading corner, no notifications
page-turner kind of night`),
'story.morning_skincare':L(`morning routine
skin first
slow morning, cold water
{brand} on the counter
morning steps, no rush 🧖`),
'story.workout':L(`done
sweat now, coffee after
{place} early
showed up. that's the win
legs say no, brain says yes 🏋️`),
'story.pilates':L(`stretch
reformer day
slow and shaky, in a good way
core is crying 🧘
long stretch, longer exhale`),
'story.run_club':L(`miles in
morning miles in {city}
easy pace, clear head 🏃
ran before the city woke up
good legs today`),
'story.cooking':L(`cooking
something's in the oven 🍳
kitchen helper today: {person}
recipe? vibes
dinner's almost ready`),
'story.pet_time':L(`my buddy
supervisor on duty 🐾
someone wants a walk
best co-worker
nap buddy`),
'story.outfit_check':L(`outfit check
today's fit 🪞
fit check at {place}
mirror, quick
dressed for the day ahead`),
'story.closet_pick':L(`picking the look
option one or option two
closet chaos, good results 👗
narrowing it down
everything on the floor, one winner`),
'story.fan_moment':L(`love you guys
{city}, you were loud 💌
reading every sign
thank you for waiting outside
you make this so fun`),
'story.family_baking':L(`baking day
cookies cooling 🍪
flour everywhere, worth it
baking with {person}
taste tester on duty`),
'story.family_day':L(`family day
slow day at home 🧸
the best kind of busy
family day with {person}
phones down, mostly`),
'story.sisters_dinner':L(`family dinner
everyone talking at once
dinner with {person} 🍽️
long table, full plates
saved a seat for {person}`),
'story.brand_swatches':L(`swatching
swatch day 🎨
{brand} swatches all over my arm
shades on shades
every shade, side by side`),
'story.brand_launch':L(`launch day
{brand} day 📦
it's out there now
proud of this team
boxes everywhere, hearts full`),
'story.brand_office':L(`meetings all day
{brand} hq today
big table, good ideas 🗂️
in with {person} all afternoon
notes on notes`),
'story.product_shot':L(`new in
{brand} on set 🧴
lighting it just right
shoot table vibes
close-up day`),
'story.snack_taste':L(`taste test
{brand} taste test 🍫
rating these very seriously
the team has opinions
one more bite for science`),
'story.glam_room':L(`glam
in the chair 💄
{person} working magic
glam in progress
almost ready`),
'story.studio_session':L(`in the studio
studio late 🎚️
in {city} with {person}
{project} sessions
headphones on, world off`),
'story.vocal_warmup':L(`warming up
scales before anything 🎤
tea, honey, warmups
sorry to the neighbours
voice is waking up`),
'story.writing_session':L(`writing
notebook out 📝
one line at a time
notes app is full again
still thinking about {project}`),
'story.piano_corner':L(`at the piano 🎹
found a chord i like
keys and coffee
playing {project} slow
late piano hours`),
'story.guitar_corner':L(`guitar
new strings, new song? 🎸
{project} on acoustic
fingers sore, heart full
tuning, retuning`),
'story.studio_booth':L(`booth
one more take 🎙️
red light on
{project} in the booth
punched in, again`),
'story.band_practice':L(`practice
loud room, good band 🥁
{person} counting us in
running it again
ears ringing`),
'story.tour_rehearsal':L(`rehearsals
run it back 🎛️
{city} rehearsal days
getting {project} ready
long day, good run`),
'story.soundcheck':L(`soundcheck
{city} soundcheck 🔊
empty arena, big echo
check, check
sounds right tonight`),
'story.backstage_prep':L(`almost showtime
{city}, almost 🚪
huddle with {person}
deep breath
backstage quiet before the loud`),
'story.stage_lights':L(`tonight
{city}, tonight 💡
lights up
you sang every word
{project} night`),
'story.setlist':L(`setlist
setlist's taped down 📋
{city} setlist
no peeking
{project} order, locked`),
'story.tour_bus':L(`next city
bus life 🚌
{city} next
bunk, snacks, headphones
highway hours`),
'story.van_load_in':L(`load in
{city} load-in 🚐
amps first
everyone carries something
van tetris champions`),
'story.merch_table':L(`merch
merch table's open 👕
come say hi in {city}
folding shirts with love
signing anything`),
'story.vinyl_listening':L(`listening back
needle down 💿
{project}, front to back
crackle and all
spinning it slow`),
'story.dance_rehearsal':L(`rehearsal
eight counts all day 🩰
{person} keeps us sharp
mirrors and sweat
again from the top`),
'story.sneaker_shot':L(`today's pair 👟
{brand} on foot
laced up
clean pair, long day
ground-level fit check`),
'story.set_trailer':L(`on set
trailer hours 🎬
{project} day
call time came fast
waiting to be called in`),
'story.script_read':L(`reading
pages with notes 📜
{project} pages
highlighter running low
reading it out loud`),
'story.between_takes':L(`between takes
reset 🎥
{project}, take who knows
waiting on lighting
quick break, back in`),
'story.costume_fitting':L(`fitting
pins everywhere 🧵
{project} fittings
standing very still
getting into it, piece by piece`),
'story.set_makeup':L(`in the chair 💺
early chair, quiet set
{project} face on
almost camera ready`),
'story.premiere_night':L(`premiere night
{project} night 🎟️
{city}, thank you
we made a thing
big screen, full heart`),
'story.press_day':L(`press day
{project} press 🎙️
{city} press day
same question, new answer
water, mic, go`),
'story.red_carpet':L(`tonight
carpet time ✨
{city}, tonight
heels and nerves
quick one before we go`),
'story.rehearsal_room':L(`rehearsal
table read energy 🎭
{project} rehearsals
running lines again
good room, good people`),
'story.runway_backstage':L(`show day
{city} show day 👠
hair, makeup, wait, repeat
backstage with {brand}
quiet before the walk`),
'story.fitting_room':L(`fittings
pins and patience 📏
{brand} fittings
one more adjustment
standing still is a skill`),
'story.campaign_shoot':L(`on set
{brand} shoot 📸
light's good
campaign day
one more frame`),
'story.fashion_week':L(`fashion week
{city} fashion week 🕶️
show to show
car, show, car
sunglasses on, always`),
'story.editorial_set':L(`shoot day
{brand} set 🖤
moody light today
black and white kind of day
frame by frame`),
'story.filming_setup':L(`filming
cameras rolling 📹
{project} filming
setting up the shot
take one of many`),
'story.editing_desk':L(`editing
timeline full 💻
cutting {project}
one more pass
late night export`),
'story.stream_setup':L(`going live soon
setting up the stream 🕹️
chat, get ready
mic check
live in a bit`),
'story.ring_light':L(`get ready with me
ring light on 💡
grwm with {brand}
quick routine
chatting while i get ready`),
'story.challenge_set':L(`building something big
{project} set going up 🏗️
crew's been here all day
this one's huge
{brand} on set`),
'story.football_watch':L(`match day
{city} match day ⚽
at {place} tonight
loud stadium, good night
scarf on`),
'story.courtside':L(`game night
courtside in {city} 🏀
{place} tonight
good seats, better game
loud building`),
'story.golf_day':L(`on the course
fairway, mostly ⛳
one good swing counts
quiet greens
chasing that one shot`),
'story.garage_project':L(`garage day
grease on my hands 🔧
one more bolt
slow progress, happy
toolbox open`),
'story.boxing_camp':L(`camp
gloves on 🥊
rounds done
camp days
quiet focus`),
'story.hangout_with_player':L(`good company
day out with {player} 🤝
{player} in {city}
good day with {player}
fun day`),
'story.hangout_place':L(`good day
{city} today 📍
out and about
around town
good day in {city}`),
'story.reshare_player_post':L(`saw this
{player} 🔁
"{postSnippet}"
love this, {player}
go see {playerHandle}`),
'story.gig_shoutout':L(`go see this
go see {player} 📣
{player} on {gig}. go
{gig} with {player}
proud of this one`),
'story.collab_day':L(`working on something
{project} with {player} 🤝
studio day with {player}
working session
something's cooking`)
};

/* ---------- own-voice banks (voice sheets + celeb-posts voice). Only themes the character uses. ---------- */
const BY_CHAR={
kylie:{
'story.jet_travel':L(`wheels up 🤍
okayyy {city}
jet snacks are a priority
packed three looks for one day`),
'story.brand_swatches':L(`swatch day 👀
{brand} swatches up my whole arm
lining them up in the good light
can't pick a favourite. not even trying`),
'story.glam_room':L(`glam day 🤍
in the chair doing nothing. love it
{person} is a genius
almost thereee`),
'story.family_baking':L(`cookie day 🍪
cookies cooling, hands off
flour everywhere and i don't even care
my little helper is in charge today 🤍`),
'story.closet_pick':L(`okayyy which one
closet is a disaster. worth it
three options, zero decisions`),
'story.brand_launch':L(`launch dayyy 😭
{brand} day 👀
thank you for showing up 🤍
boxes everywhere`),
'story.product_shot':L(`new in 👀
the packaging thooo
lit this for an hour. feed-worthy
{brand} on the shoot table`),
'story.golden_hour':L(`this light thooo
everything is feed-worthy right now
golden hour 🤍`),
'story.morning_skincare':L(`slow morning 🤍
skin first, coffee second
{brand} on my counter 👀`),
'story.family_day':L(`family day 🤍
slow day at home
the best kind of tired`),
'story.outfit_check':L(`okayyy this one
mirror, quick, before i change my mind
fit check 👀`),
'story.sisters_dinner':L(`family dinner 🤍
everyone talking at once 😭
dinner with {person}`),
'story.brand_office':L(`meetings all dayyy
{brand} hq. tell me the plan
samples everywhere 👀`)
},
kim:{
'story.brand_office':L(`meetings. then more meetings.
{brand} hq. approving samples.
back to back with {person}.`),
'story.glam_room':L(`glam.
in the chair with {person}.
glam takes the time it takes.`),
'story.jet_travel':L(`wheels up.
{city}.
quiet flight. lots of emails.`),
'story.family_day':L(`family day.
phones away. mostly.
home, all of us.`),
'story.closet_pick':L(`picking the look.
neutral, neutral, or neutral.
closet edit tonight.`),
'story.product_shot':L(`new in.
{brand}, up close.
shot it three ways. kept the cleanest.`),
'story.campaign_shoot':L(`on set.
{brand} shoot.
one more frame. then one more.`),
'story.sisters_dinner':L(`family dinner.
dinner with {person}.
everyone has an opinion 😂`),
'story.workout':L(`done.
early workout. no excuses.
{place}, before anyone else.`),
'story.golden_hour':L(`golden hour.
quiet minute before the next call.
the light right now.`),
'story.outfit_check':L(`outfit check.
today.
{place}, dressed for it.`),
'story.press_day':L(`press day.
{project} press.
{city}. mic on.`)
},
kendall:{
'story.runway_backstage':L(`show day lol
backstage in {city}
hair, makeup, wait. repeat lol`),
'story.campaign_shoot':L(`set life
{brand} shoot
one more. okay one more`),
'story.fitting_room':L(`fittings lol
standing very still lol
{brand} fitting, round two`),
'story.jet_travel':L(`off again lol
{city}
sleeping the whole way`),
'story.pilates':L(`pilates. hmm
reformer. humbled
slow and shaky lol`),
'story.golden_hour':L(`golden hour i guess lol
not bad
posting the candid one`),
'story.fashion_week':L(`fashion week lol
{city} fashion week
car, show, car, show`),
'story.outfit_check':L(`fit check lol
off duty
simple today`),
'story.editorial_set':L(`shoot day lol
{brand} set
moody today`),
'story.sisters_dinner':L(`family dinner lol
next to {person} at dinner
loud table lol`),
'story.beach_day':L(`salty hair, no plans
{place}
phone in the bag`),
'story.coffee_run':L(`coffee before words
iced. obviously
{city} coffee run`)
},
sabrina:{
'story.tour_rehearsal':L(`Rehearsals.
Running it until it looks easy.
{city} rehearsals. Very serious. Very sparkly.`),
'story.backstage_prep':L(`Almost showtime.
Hairspray levels: dangerous.
{city}, I'm almost ready 😇
Huddle with {person}. Then chaos.`),
'story.glam_room':L(`Glam o’clock.
{person} is performing miracles again.
Lashes on. Personality loading.`),
'story.soundcheck':L(`Soundcheck.
{city} soundcheck. The echo is GOOD.
Check, check. Very professional 🙂`),
'story.stage_lights':L(`Tonight.
{city}, tonight 😇
Be loud. That's the only rule.`),
'story.studio_session':L(`In the studio.
Studio with {person}. Dangerous.
Wrote something. Unfortunately it's good.`),
'story.closet_pick':L(`Wardrobe crisis. Fashionable.
Sparkles, or more sparkles.
Options were narrowed. Barely.`),
'story.writing_session':L(`Writing.
Notebook out. Feelings incoming.
One verse, three snacks, zero regrets.`),
'story.fan_moment':L(`Love you guys.
{city}, you were LOUD.
Saw every sign. Every single one 😭`),
'story.setlist':L(`Setlist.
Taped down. No, you can't see it 😇
{city} setlist locked. Next question.`),
'story.coffee_run':L(`Coffee first. Decisions later.
{city} coffee. Approved.
Iced. Extra shot. No notes.`),
'story.hotel_window':L(`View from the room.
{city} looking very cinematic tonight.
Room service and a window. Thriving.`)
},
charli:{
'story.studio_session':L(`studio til late lol
louder. ruder.
studio with {person}. it's chaos
making it uglier on purpose`),
'story.stage_lights':L(`tonight tonight tonight
{city} tonight 🖤
lights low volume high`),
'story.dinner_out':L(`dinner then who knows
dinner in {city}, late obviously
{person} ordered for the table. fair`),
'story.city_walk':L(`walking it off
{city} in sunglasses
walking to nowhere lol`),
'story.backstage_prep':L(`nearly on
{city} get loud
sweaty already lol`),
'story.tour_rehearsal':L(`rehearsal brain
running it louder
{city} rehearsal. legs fine. ears not`),
'story.outfit_check':L(`outfit is loud today
sunglasses stay on
too tasteful? no`),
'story.fashion_week':L(`fashion week brain
{city} fashion week. tired lol
show, cab, show`),
'story.studio_booth':L(`booth time
one more take. ruder
red light on lol`),
'story.car_ride':L(`in a cab again lol
{city} through a cab window
playlist too loud. perfect`)
},
doja:{
'story.studio_session':L(`studio gremlin hours
the beat is being weird. i respect it
{person} said make it weirder. done
studio. snacks. chaos. normal`),
'story.glam_room':L(`glam but make it strange
{person} is painting a face on my face
this is objectively ridiculous. continuing`),
'story.dance_rehearsal':L(`rehearsal, allegedly
eight counts are a social construct
{person} counted me in and i panicked lmao`),
'story.tour_rehearsal':L(`rehearsal chaos
{city} rehearsal. absolutely unserious
running it again 😭`),
'story.closet_pick':L(`closet roulette
the weird one. obviously
closet said no. ignoring it`),
'story.stream_setup':L(`going live. maybe
setting up the stream. no promises
chat behave 💀`),
'story.backstage_prep':L(`showtime-ish
{city} what do you mean we're on soon
deep breath. weird breath`),
'story.outfit_check':L(`outfit check i guess
is this a lot. yes
mirror said absolutely`),
'story.stage_lights':L(`tonight. unhinged
{city} tonight 😭
lights. screaming. good`),
'story.home_cozy':L(`indoor creature tonight
blanket burrito situation
staying in. society can wait`)
},
hailey:{
'story.product_shot':L(`new in, cuteee
{brand}, up close
cuteee packaging day`),
'story.morning_skincare':L(`skin day, slow day
skin first, always
{brand} on the counter 🤍`),
'story.brand_launch':L(`launch day, finally
{brand} day 🤍
so proud of this team`),
'story.pilates':L(`reformer kind of morning
reformer then coffee
slow and steady`),
'story.campaign_shoot':L(`on set, soft light
shooting {brand} today
soft light today 👀`),
'story.coffee_run':L(`matcha or coffee. coffee won
iced, honestly
quick {city} coffee stop`),
'story.outfit_check':L(`outfit check 🤍
neutral again lol
easy, comfy, done`),
'story.brand_office':L(`meeting day
{brand} hq
notes with {person}`),
'story.golden_hour':L(`golden hour, softly
okay wait this light
soft evening 🤍`),
'story.closet_pick':L(`closet edit
too many neutrals
okay this one`),
'story.fitting_room':L(`fitting day, cuteee
{brand} fittings 👀
pins and patience`)
},
sydney:{
'story.garage_project':L(`garage day!!
garage morning. hands covered
one more bolt and she runs!!
torque wrench therapy`),
'story.set_trailer':L(`on set!!
call time was brutal
{project} day, trailer coffee`),
'story.between_takes':L(`between takes, snacking
reset. snack. reset
{project}, waiting on lights`),
'story.press_day':L(`press day!!
{project} press in {city}
same question, fresh answer 🙂`),
'story.premiere_night':L(`premiere night!!
{project} night!!
thank you {city} 🙂`),
'story.campaign_shoot':L(`shoot day!!
{brand} shoot today
lighting check 🙂`),
'story.set_makeup':L(`makeup chair, coffee in hand
{project} look, loading
early chair, big coffee`),
'story.workout':L(`done!!
{place} before call time
sore in a good way`),
'story.golden_hour':L(`golden hour!!
porch light, best light
{city} sunset 🙂`),
'story.red_carpet':L(`carpet night!!
{city} tonight!!
deep breath, then the carpet`)
},
tatemcrae:{
'story.dance_rehearsal':L(`dance day
rehearsal legs
{person} said again. again it is
sorry lol one more`),
'story.tour_rehearsal':L(`rehearsal day. long one lol
{city} rehearsal. so tired 😭
running the show again`),
'story.soundcheck':L(`soundcheck lol
{city} soundcheck
mic check. ear check`),
'story.backstage_prep':L(`almost on, so nervous lol
hallway stretches, again
{city} let's go`),
'story.stage_lights':L(`show night
{city} let’s goooo
lights up lol`),
'story.studio_session':L(`studio day lol
studio with {person}
late one`),
'story.workout':L(`done done
{place}. legs are gone lol
sore already`),
'story.hometown':L(`home home
{city} girl, back home
home for a minute ❤️`),
'story.fan_moment':L(`love u guys so much
{city}, you were crazy 😭
reading every sign lol`),
'story.outfit_check':L(`fit check before rehearsal
comfy fit
mirror quick`)
},
timothee:{
'story.set_trailer':L(`On set.
Trailer hours — reading, snacking, pacing.
{project} day. Cold, happy.`),
'story.premiere_night':L(`Premiere night.
{project} night — thank you, man.
{city}… this is kind of incredible.`),
'story.press_day':L(`Press day — okay.
{project} press — I have like twelve answers.
{city}, mic on.`),
'story.courtside':L(`Game night.
Courtside in {city} — loud, perfect.
{place}. Not leaving early.`),
'story.script_read':L(`Reading.
{project} pages — notes in every margin.
Read it out loud twice. Then once more.`),
'story.between_takes':L(`Between takes.
Waiting on lights — the good kind of waiting.
{project}, take… some number 😂`),
'story.costume_fitting':L(`Fitting.
Standing very still. Trying.
{project} fittings — the coat is doing the work.`),
'story.red_carpet':L(`Tonight.
{city}, tonight.
Wait, okay. Here we go 😂`),
'story.city_walk':L(`Out for a walk.
{city} on foot — no plan.
Walking, thinking, walking.`),
'story.coffee_run':L(`Coffee first.
{city} coffee — man.
Corner-store coffee, best coffee.`)
},
zendaya:{
'story.set_trailer':L(`set day
trailer quiet 🤍
{project} day. early call`),
'story.premiere_night':L(`premiere night 🤍
{project} night. grateful 🤍
{city}, thank you for tonight`),
'story.press_day':L(`press day, calm
{project} press
{city}. water, mic, breathe`),
'story.red_carpet':L(`tonight, calmly
{city} tonight 🤍
calm before the carpet`),
'story.fitting_room':L(`fittings with the team
{brand}, fitted
pinned, steamed, ready`),
'story.between_takes':L(`between takes, breathing
quiet minute
{project}, resetting`),
'story.script_read':L(`quiet reading
{project}, page by page
slow read, careful notes`),
'story.costume_fitting':L(`fitting day
{project}, getting dressed
piece by piece`),
'story.set_makeup':L(`in the chair
{project} face
early chair 🤍`),
'story.closet_pick':L(`choosing quietly
the room decides the look
narrowed it to two`),
'story.golden_hour':L(`the light did that
quiet light 🤍
{city} sunset`),
'story.campaign_shoot':L(`campaign set 🤍
{brand}, frame by frame
one more frame, then home`)
}
};

/* ---------- own-voice banks, signature themes for the rest of the curated cast (others use GENERIC) ---------- */
const MORE={
khloe:{
'story.workout':L(`Gym early. Hated it, loved it.
Sweaty, happy, done.
{place} before the day starts 💪`),
'story.family_baking':L(`Baking day in this house 🍪
Flour on everything. Worth it.
My favourite little bakers at work`),
'story.brand_office':L(`Meetings all day and I'm smiling
{brand} office day with {person}
Fittings, notes, more notes`),
'story.home_cozy':L(`Cozy night. Positive vibes only.
Couch, blanket, quiet house
Staying in and loving it`)},
kourtney:{
'story.morning_skincare':L(`Morning ritual: water, sunlight, quiet.
Slow skin morning
{brand} and a little sunshine`),
'story.pilates':L(`Slow movement, long breaths.
Reformer, then matcha.
Stretching into the day`),
'story.book_tea':L(`Tea and a book. Slow living.
Reading in the garden
One chapter, then another`),
'story.cooking':L(`Clean dinner, messy kitchen.
Cooking with {person} tonight
Something green is happening`)},
kris:{
'story.brand_office':L(`Meetings all day and I love it.
Three phones, one desk.
{brand} with {person}. Big plans.`),
'story.sisters_dinner':L(`Family dinner is not optional.
Everyone at the table. Finally.
Dinner with {person} 🤍`),
'story.jet_travel':L(`Wheels up. Calls on.
{city}, here we come.
Packed in ten minutes. Professional.`),
'story.press_day':L(`Press day. Let's go.
{project} press in {city}.
Mic on, pearls on.`)},
ariana:{
'story.vocal_warmup':L(`warmups in the kitchen again 🤍
sorry neighbours
little scales, big tea`),
'story.studio_session':L(`stacking harmonies till late 🤍
{person} and me, one more harmony
the ponytail is up. we're working`),
'story.pet_time':L(`my little supervisor 🤍
cuddles before the studio
the softest coworker`),
'story.glam_room':L(`glam with {person} 🤍
almost ready, promise
wings on`)},
taylor:{
'story.writing_session':L(`Wrote a line on a napkin. Keeping the napkin.
Notebook open, tea going cold.
A song is happening. Please hold.`),
'story.piano_corner':L(`Piano, late, lamp on.
Found the chord I've been looking for.
Playing {project} slower than usual.`),
'story.pet_time':L(`The cats have claimed the couch.
My co-writers are asleep on the score.
Supervised by a very judgmental cat.`),
'story.cooking':L(`Baking for the crew. Group effort.
The kitchen is a disaster. Worth it.
Taste-tested by {person}. Approved.`),
'story.soundcheck':L(`Soundcheck in {city}. Hi, empty seats.
Checking every mic twice.
The echo in here is beautiful.`)},
beyonce:{
'story.tour_rehearsal':L(`Rehearsal until it feels effortless.
Again. Then again.
{city}. We're ready.`),
'story.stage_lights':L(`Tonight, we give everything.
{city}, I see you.
Lights, wardrobe, choreography.`),
'story.dance_rehearsal':L(`Every count matters.
Rehearsal with {person}. Details.
Full out.`),
'story.backstage_prep':L(`Almost time.
Grateful for this team.
Breathe. Focus. Go.`)},
rihanna:{
'story.brand_swatches':L(`swatchin all day lol
{brand} swatches on both arms
every shade a mood`),
'story.beach_day':L(`salt in my hair, no plans
{place}, unbothered
sun on, phone off`),
'story.glam_room':L(`glam with {person}, mood unbothered
lip done, everything else pending
running late, looking good tho`),
'story.studio_session':L(`y'all keep asking. i hear you lol
studio vibes, that's all i'm saying
with {person}. no comment`)},
selena:{
'story.cooking':L(`Cooking something new. Pray for the kitchen.
Kitchen chaos with {person}
Dinner's on. Mostly.`),
'story.brand_swatches':L(`Swatch day. Very happy.
{brand} swatches everywhere
Blush on my fingers again`),
'story.between_takes':L(`Laughing between every take
Reset. Giggle. Reset.
{project}, little break`),
'story.home_cozy':L(`Quiet night. Be kind to yourselves.
Blanket, candle, quiet
Taking it slow tonight 🤍`)},
justin:{
'story.studio_session':L(`studio till sunrise
grateful for this room
with {person}. feels good`),
'story.golf_day':L(`golf with the boys
one good swing, that's the post
peaceful out here`),
'story.sneaker_shot':L(`kicks on
{brand} on my feet
fresh pair, good day`),
'story.car_ride':L(`late drive, windows down
{city} at night
playlist on, mind off`)},
shawn:{
'story.guitar_corner':L(`guitar in the hotel room again
new chord shape, failing beautifully
{project} on acoustic tonight`),
'story.run_club':L(`ran by the water. head is clear
early miles around {city}, no headphones
slow run, big thoughts`),
'story.hometown':L(`home for a bit
{city} always resets me
back where it started`),
'story.writing_session':L(`wrote a chorus i'm excited about
notebook full of maybes
writing weather today`)},
billie:{
'story.studio_session':L(`made a song in a bedroom again
studio with {person}. weird and good
headphones on. gone`),
'story.pet_time':L(`my baby
best friend asleep on my leg
not moving for hours, sorry`),
'story.vinyl_listening':L(`needle down. lights off
{project} on the record player
listening back, very quietly`),
'story.outfit_check':L(`biggest shirt i own. thriving
comfortable is the look
fit check, basically a blanket`)},
olivia:{
'story.writing_session':L(`wrote in my diary and it became a song
notebook out, feelings out
journal pages everywhere`),
'story.guitar_corner':L(`guitar's out of tune and so am i
strumming on the floor
{project} but quieter`),
'story.coffee_run':L(`coffee and a notebook
iced coffee, messy hair
{city} coffee before rehearsal`),
'story.book_tea':L(`book, tea, rain
reading instead of writing. it's research
one more chapter i swear`)},
miley:{
'story.studio_booth':L(`Raspy voice, full heart. Booth day.
Red light on. Let's go.
{project} in the booth.`),
'story.pet_time':L(`My dogs judge my outfits.
Pack leader for the day.
Snuggle break.`),
'story.vocal_warmup':L(`Warming up the rasp.
Scales and tea.
Loud in the hallway again.`),
'story.car_ride':L(`Singing in the car way too loud.
Windows down, volume up.
{city} on the radio.`)},
gaga:{
'story.piano_corner':L(`The piano is open tonight.
At the piano, barefoot.
Playing {project} like it's the first time.`),
'story.brand_swatches':L(`Swatches all over my hands. Worth it.
{brand} swatch day.
Painting with every shade.`),
'story.stage_lights':L(`Tonight we don't hold back.
{city}, tonight.
The lights are ready. So am I.`),
'story.glam_room':L(`Building the look.
Glam with {person}.
Three costumes, one dream.`)},
nicki:{
'story.studio_booth':L(`The pen is warm today.
In the booth. Do not disturb.
{project} vocals. Five voices before lunch.`),
'story.glam_room':L(`Pink everything. Non-negotiable.
Glam with {person}. Perfection.
Barbie ready.`),
'story.closet_pick':L(`Picking the look. Queen decisions.
Pink or pinker.
Closet consultation in progress.`),
'story.fan_moment':L(`Barbz, I see you.
{city}, you showed UP for me.
Love you. Behave.`)},
cardi:{
'story.studio_booth':L(`came in for one verse and did SEVEN 😭
in the booth screaming
{project} in the booth, no breaks`),
'story.cooking':L(`cooking and yelling at the TV at the same time
dinner is ON
kitchen is a mess but it's DELICIOUS`),
'story.hometown':L(`home made me loud
{city} forever
back where it all started 😭`),
'story.glam_room':L(`nails getting done, don't talk to me
glam with {person}
almost ready i swear`)},
dua:{
'story.book_tea':L(`Book club pick is ready. Very excited.
Tea, a good book, a quiet room.
Reading in between everything.`),
'story.dance_rehearsal':L(`Dance rehearsal from noon. Legs confused.
Rehearsal with {person}. Again.
Sweaty and happy.`),
'story.hotel_window':L(`Waking up in {city}.
Room with a view and a book.
Curtains open, coffee on.`),
'story.city_walk':L(`Walking {city} with no plan.
Out for a stroll before rehearsal.
Long walk, good playlist.`)},
sza:{
'story.writing_session':L(`wrote a lot. hate most of it. classic
notebook, candles, feelings
one line that finally feels true`),
'story.home_cozy':L(`plants and a blanket. perfect
home with the plants who don't judge
candles lit, phone face down`),
'story.book_tea':L(`tea, garden, book
reading outside today
quiet pages`),
'story.studio_session':L(`crystals on the console, vibes in the booth
studio smells like candles and snacks
{person} in the room. good energy`)},
weeknd:{
'story.car_ride':L(`Night drive. Writing in my head.
{city} after dark.
Windows up. Synths on.`),
'story.studio_session':L(`Lights off. Synths on.
The darker the room, the better.
With {person}. Late.`),
'story.hotel_window':L(`{city} from the window.
Neon outside, quiet inside.
Room view. Nobody in this city sleeps.`),
'story.stage_lights':L(`{city}. Tonight.
Lights down. Here we go.
Red lights, full room.`)},
drake:{
'story.studio_session':L(`studio late, just how i like it
in with {person}. focused
weather got me writing again`),
'story.courtside':L(`courtside in {city}
{place} tonight. loud
good game, better seats`),
'story.hometown':L(`home. quiet for once
{city} stays winning
back home, food on the table`),
'story.studio_booth':L(`booth then gym, no in between
one more take
{project} in the booth, lights off`)},
bruno:{
'story.tour_rehearsal':L(`Rehearsal is where the magic gets its shoes on.
Band's tight tonight.
{city} rehearsal. Suits pressed.`),
'story.piano_corner':L(`Hit a chord and smiled.
Piano and a silk shirt.
Playing {project} for the room.`),
'story.dance_rehearsal':L(`The band learned the moves. Proud.
Footwork with {person}.
One more spin.`),
'story.outfit_check':L(`Silk shirt and good intentions.
Dressed to groove.
Fit check before the show.`)},
harry:{
'story.run_club':L(`running in the rain. very me
miles in {city}
slow run, cup of tea after`),
'story.city_walk':L(`a wander around {city}
walking, humming
found a little shop i liked`),
'story.guitar_corner':L(`guitar on the floor, tea on the side
{project}, quietly, on acoustic
strumming, nowhere to be`),
'story.fan_moment':L(`thank you, truly
{city}, that was lovely
treat each other kindly`)},
badbunny:{
'story.hometown':L(`en casa
{city} en el corazón
home, always`),
'story.beach_day':L(`playa y nada más
salt air, no phone
{place}, tranquilo`),
'story.stage_lights':L(`esta noche
{city}, tonight
lights up, let's go`),
'story.studio_session':L(`sin dormir, haciendo música
en el estudio con {person}
a little of everything tonight`)},
jlo:{
'story.dance_rehearsal':L(`My dancers are the hardest-working people I know.
Rehearsal with {person}. Full out.
Eight counts and a smile.`),
'story.workout':L(`Workout done. Feeling strong.
{place} early. Hydrated.
Up and moving.`),
'story.morning_skincare':L(`Hydrated. Moisturized. Ready.
{brand} morning.
Glow first, then go.`),
'story.set_trailer':L(`Ready for set.
{project} day. Let's work.
Trailer, coffee, lines.`)},
shakira:{
'story.dance_rehearsal':L(`The hips are rehearsing.
Ensayo con {person}.
Warmups first. Always.`),
'story.beach_day':L(`Mar y sol.
{place}, barefoot.
Salt air, clear mind.`),
'story.hometown':L(`Casa.
{city}, siempre.
Home in my heart.`),
'story.studio_session':L(`Estudio y café.
A melody in two languages.
With {person}, writing.`)},
pedro:{
'story.set_trailer':L(`Trailer nap. Ten out of ten.
Long day on set, good crew.
{project} day. Grateful.`),
'story.between_takes':L(`The crew made me laugh again.
Thank you, boom mic heroes.
{project}, waiting on the light.`),
'story.book_tea':L(`Reading in a quiet corner.
Tea and a very good book.
One chapter before bed.`),
'story.rehearsal_room':L(`Running lines with the cast.
Every character is a little scary. Good.
{project} rehearsal. Loving this room.`)},
margot:{
'story.beach_day':L(`Surf before work.
Salt water, strong tea.
{place}, early.`),
'story.script_read':L(`New script. Highlighters ready.
{project} pages, full of notes.
Producer brain and actor brain today.`),
'story.brand_office':L(`Producer hat on.
Meetings with {person}.
{brand} day at the office.`),
'story.coffee_run':L(`Coffee, strong.
{city} coffee run before set.
Caffeine and call sheets.`)},
chappell:{
'story.glam_room':L(`wig on. makeup on. let's go to work
glitter crisis in progress
glam with {person}. camp levels: high`),
'story.stage_lights':L(`tonight we get loud
{city}, tonight 💖
lights up, glitter down`),
'story.hometown':L(`home sweet home
{city} girl in a glitter crisis
back home, still sparkly`),
'story.fan_moment':L(`the front row is the reason
{city}, you looked AMAZING
saw every outfit. obsessed`)},
'scene-u-mrbeast':{
'story.challenge_set':L(`This set is ridiculous. In a good way.
Building something huge. More soon.
{project} set going up. The crew is insane.`),
'story.filming_setup':L(`Filming day. Supposed to take two days.
The crew hasn't slept. Worth it.
Rolling on {project}.`),
'story.editing_desk':L(`Editing until it's perfect.
Thumbnail meeting took longer than the shoot.
Cutting {project}. Again.`),
'story.snack_taste':L(`Taste testing. Very serious science.
{brand} taste test with the team.
Rating flavours. Strictly.`)},
'scene-u-ed':{
'story.guitar_corner':L(`one guitar, a loop pedal, a sweaty t-shirt
{project} on the acoustic
cuppa and a guitar`),
'story.cooking':L(`cooking for mates
ketchup on everything, no regrets
kitchen with {person}`),
'story.hometown':L(`home walks, clear head
back in {city}, kettle's on
home for a cuppa`),
'story.soundcheck':L(`soundcheck in {city}. just me and the pedal
looping in an empty room
checking the loop pedal twice`)},
'scene-u-tomholland':{
'story.set_trailer':L(`trailer backflip. don't tell production
{project} day. sore already
call time, let's go`),
'story.golf_day':L(`golf on a day off. still terrible
on the course, losing balls
one good shot, calling it a win`),
'story.pet_time':L(`dog walk before call time
my best mate
walkies`),
'story.workout':L(`stunt rehearsal. body says no
{place}, early
training day, very sore`)},
'scene-u-jungkook':{
'story.dance_rehearsal':L(`practice room until late
one more time from the top
practice with {person}`),
'story.vocal_warmup':L(`vocal warmups and snacks
humming in the hallway
warming up slowly`),
'story.cooking':L(`ramen at midnight
cooking something simple
kitchen time 🍜`),
'story.workout':L(`gym day, very sore
{place}, quiet morning
lifted, stretched, done`)},
'scene-u-lisa':{
'story.dance_rehearsal':L(`practice, practice
counts with {person}
sweaty but happy`),
'story.glam_room':L(`glam time
hair and makeup with {person}
almost ready ✨`),
'story.fashion_week':L(`fashion week in {city} ✨
show day, sunglasses on
front row feeling`),
'story.pet_time':L(`my babies
cat nap supervisor
cuddle break`)},
'scene-u-travisscott':{
'story.studio_session':L(`no sleep, studio till it's light out
working on something crazy
in with {person}, its lit`),
'story.sneaker_shot':L(`kicks
{brand} on the feet, fresh
fresh ones`),
'story.hometown':L(`home forever
{city}
back home`),
'story.stage_lights':L(`{city} tonight. rage
lights up, crowd up
its going down tonight`)},
'scene-u-megan':{
'story.workout':L(`gym first, then everything
{place}. sweating
leg day. pray for me`),
'story.studio_booth':L(`wrote a verse y'all gonna scream at
in the booth, focused
{project} vocals tonight`),
'story.hometown':L(`home girl forever
{city} raised a hottie
back home, eating good`),
'story.glam_room':L(`braids done, heels on
{person} on glam. hottie loading
almost ready, let's work 🔥`)},
'scene-u-ishowspeed':{
'story.football_watch':L(`MATCH DAY ⚽
{city} the stadium is SHAKING
at {place}. LET'S GO`),
'story.stream_setup':L(`CHAT I'M GOING LIVE SOON
setting up, chat get ready
live in a minute. no sleep`),
'story.workout':L(`gym time. no days off
{place}, going crazy
backflips after legs. bad idea`),
'story.fan_moment':L(`{city} YOU'RE CRAZY 😭
the fans showed up
y'all are the best fr`)}
};
for(const [id,bk] of Object.entries(MORE))BY_CHAR[id]=Object.assign(BY_CHAR[id]||{},bk);

/* ---------- picker (mirrors logic's fill + skip-missing-slot rules) ---------- */
const hash=s=>{let h=2166136261;s=String(s);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const usable=(lines,slots)=>(lines||[]).map(x=>String(x).replace(/\{(\w+)\}/g,(m,k)=>slots[k]!=null&&String(slots[k]).trim()!==''?String(slots[k]):'\u0000')).filter(x=>x.trim()&&!x.includes('\u0000'));
const prev=G.SCENE_STORY_CAPTIONS&&typeof G.SCENE_STORY_CAPTIONS==='object'?G.SCENE_STORY_CAPTIONS:{};
const PREV={};
const make=key=>{const fn=function(story){
 try{const s=story||{},slots=s.slots||{},own=BY_CHAR[s.charId]&&BY_CHAR[s.charId][key];
  let ok=usable(own,slots);if(!ok.length)ok=usable(GENERIC[key],slots);
  if(!ok.length){const p=PREV[key];if(typeof p==='function'){const v=p(s);return v?String(v):''}ok=usable(Array.isArray(p)?p:[],slots)}
  return ok.length?ok[hash(s.id||key)%ok.length]:''}catch(e){return ''}};
 fn.__writerStoryCaptions=true;fn.key=key;fn.lines=GENERIC[key];return fn};
const out=Object.assign({},prev);
for(const key of Object.keys(GENERIC)){const p=prev[key];if(p&&!(typeof p==='function'&&p.__writerStoryCaptions))PREV[key]=p;out[key]=make(key)}
G.SCENE_STORY_CAPTIONS=out;
G.SCENE_STORY_CAPTION_BANK={version:'writer-stories-v229-2',generic:GENERIC,byChar:BY_CHAR,maxRawChars:60,maxFilledChars:90};
try{if(typeof G.dispatchEvent==='function'&&typeof CustomEvent==='function')G.dispatchEvent(new CustomEvent('scene:story-captions-ready',{detail:{keys:Object.keys(GENERIC).length}}))}catch(e){}
})();
