/* SCENE writer-celeb-posts.js — hand-written, offline own-life feed lines for every celebrity in `celebs`.
   Base: decec6d. Load AFTER every v224 script (append to the end of v224Scripts in src/main.ts).
   No AI, no network, no paid services. Lines are evergreen persona lines: studio days, set life, travel moods,
   fans, food, work. No dated events, releases, relationships or numbers.
   Keyed by display name (stable across ids); ids are a fallback. */
(()=>{
'use strict';
if(globalThis.SCENE_WRITER_CELEB_POSTS)return;
const L=s=>s.split('\n').map(x=>x.trim()).filter(Boolean);
const OWN={};
/* ---------- core cast ---------- */
OWN['Kim Kardashian']=L(`approved the samples at midnight. the right ones always show up late.
fittings, then a call, then another fitting. I love this part.
the kids picked the playlist in the car. I did not get a vote.
I will always choose the cleaner version of the idea.
a quiet Sunday at home is the real luxury.
studying tonight. the flashcards are winning.
neutral tones, loud intentions.
glam took two hours. the photo took four seconds.
the tailor and I disagree about one inch of hem. I'm winning.
law notes on one side of the desk, swatches on the other.
packed three outfits for one dinner. wore the first one.
fitting room mirrors tell the truth eventually.
the kids reorganised my closet. by colour, apparently.`);
OWN['Ariana Grande']=L(`vocal warmups in the kitchen again, sorry neighbours 🤍
stacked harmonies until my headphones gave up
the ponytail is up which means we are working
rehearsal days are my favourite days. no notes. okay some notes.
tea, honey, a cozy sweater and a very long voice memo
thank you for always being so gentle with me 🤍
a little moon tonight. made me happy.
back in the booth, singing the same three words very differently
recorded a harmony so high the dog left the room 🤍
crew gift bags are done. there are way too many candles in them
soft sweater, loud headphones, quiet afternoon
rewrote one ad-lib until it felt like a whisper
watched a scary movie alone and regretted it immediately`);
OWN['Taylor Swift']=L(`Wrote a bridge on the back of a receipt. Do not ask which store.
The cats have taken over the couch, the studio, and possibly the lease.
Baking for the crew today. The cookies are, objectively, a group effort.
There is a voice memo on my phone that is just me humming at 2am.
Some songs arrive all at once and some make you wait for them.
Rehearsal ran long. Nobody complained. That is the job when you love it.
Easter eggs? In this economy? (yes)
Thank you for listening closely. I notice when you do.
The notebook is full again. Starting a new one feels like a holiday.
Rearranged the setlist on a napkin at dinner. The napkin is now a document.
The band learned a new ending today and nobody is allowed to tell anyone.
Long walk, longer voice memo.
Re-reading old diaries. Past me was very dramatic. Correctly.`);
OWN['Beyoncé']=L(`Rehearsal until it feels effortless.
Details matter. All of them.
Grateful for my team. We build it together.
Family first. Then the stage.
Some work is meant to be felt, not explained.
Lights, wardrobe, choreography, again.
Hive, I see you. Thank you.
Watching the playback frame by frame.
Every light cue, checked twice.
Quiet morning. Big day.
The dancers carried the room today.
Prepared. Then prepared again.`);
OWN['Rihanna']=L(`the shade was supposed to arrive monday. it arrived today. we celebrating
lab day with the Fenty team. we smelled everything twice
y'all keep asking about music. I keep hearing you lol
sunday is for family and a big plate of food
Barbados in my heart, always
sorry I'm late, I was busy being on time somewhere else
lip gloss popping, mood unbothered
sketching new pieces on hotel stationery again
my mama called to check on me and I got told off a little
beach day. phone in the bag, not coming out
the swatch on my wrist is the one. don't argue
cooking rice and peas like I'm feeding the entire island`);
OWN['Miley Cyrus']=L(`Voice is raspy, heart is full. Studio day.
Wearing the boots to the grocery store because why not.
My dogs judge my outfits harder than any critic.
Sang a song in the car so loud I scared myself.
Hippie at heart, rocker in the booth.
If the band is laughing, the take is good.
Took a long drive with no destination. Recommend.
Found a vintage jacket with someone's initials stitched inside. Keeping the mystery.
Studio candles lit, phone face down, voice ready.
My mom sent me a voicemail that's mostly her laughing. Saved forever.
Learned a new song on the old guitar. It complained the entire time.
Bare feet on the studio floor. It's how I sing best.`);
OWN['Lady Gaga']=L(`Little Monsters, the piano is open tonight.
A rehearsal where nobody holds back is my favourite kind.
Today's look was built from three costumes and one dream.
Haus Labs swatches all over my hands. Worth it.
Kindness is punk. I mean that.
Sat at the piano until the song told me the truth.
On set with the wig and the mood.
The piano bench is my office today.
Wardrobe and I built a collar out of rehearsal tape. It's staying.
Wrote three verses in my notebook and crossed out every adjective.
Rehearsing in heels so the stage feels easy.
My dog sat through the vocal session and only judged me twice.`);
OWN['Nicki Minaj']=L(`The pen is so warm right now it is almost rude.
Barbz, behave. I am watching the comments.
Pink everything. Non-negotiable.
Recording vocals in five different voices before lunch.
Queen of Rap thoughts on a tuesday afternoon.
Studio snacks are not a game. Someone ate my chips.
Respect the craft, then talk.
Rewrote one bar until the beat apologised.
Wig fitting this morning. We chose glitter and danger.
Studio rule: no phones in the booth. That includes me. Mostly.
Read the Barbz comments before bed. Some of y'all are lawyers.
Ad-libs recorded. Neighbours notified.`);
OWN['Cardi B']=L(`I went to the studio to record one verse and recorded SEVEN 😭
Bronx made me loud and I'm keeping it
cooking dinner and screaming at the TV at the same time
I'm not arguing with y'all today. I have nails to get done
my kids think I'm the funniest person alive. they're right
okurrr. that's the post.
gym was disrespectful today but I went
I tried to make a healthy smoothie and it tasted like a lawn 😭
nail tech said hold still. I physically cannot
studio with the windows down because the AC broke. we suffering for art
my mom called mid-verse and I picked up. priorities
wore heels to the grocery store and regretted it by aisle two`);
OWN['Kylie Jenner']=L(`swatch day. every brown looks the same and also completely different
the lip combo of the week is a secret for about 24 hours
mom life and meetings in the same afternoon
glam in the car on the way to glam
packaging samples everywhere. my house is a warehouse
soft lighting, softer mood
kylie cosmetics team made my whole day
lip liner on in the car, one hand, no mirror. experience
picking shades is my favourite meeting of the week
pink velour today. comfy and dramatic
testing formulas on my arm until there's no arm left
early bedtime. I'm not even sorry`);
OWN['Kendall Jenner']=L(`call time 5am. somehow made coffee before it.
horse girl weekend. phone in the barn.
off duty. extremely off duty.
another fitting, another very patient tailor
quiet hotel room after a loud show
tequila sunset with my favourite people
runway nerves never fully leave and I kind of like that
packed light for once. forgot a coat. learning
the barn cat follows me everywhere now
fittings ran long so I napped on a rack of coats
sunset hike with no phone signal. bliss
reading on a long flight is the only quiet I get`);
OWN['Khloé Kardashian']=L(`Gym at 6am. I hate it until I love it.
Good American fittings today and I am obsessed with the denim.
My kids are the best part of my day, every day.
Cooking for the family tonight. Nobody is allowed to critique.
Kindness only on my timeline, please and thank you.
Leg day is real and I am feeling every second.
Hugs to everyone having a hard week. 🤍
Denim fittings until I can't feel my legs. Worth it.
Made breakfast for everyone and the kitchen looks like a crime scene.
Rest day. My trainer doesn't need to know about the cookies.
The kids built a fort in the living room and I'm not allowed in.
Long walk with a podcast and zero texts answered.`);
OWN['Kourtney Kardashian']=L(`Morning ritual: sunlight, water, quiet.
Poosh team meeting with a lot of matcha.
Clean dinner, messy kitchen, happy house.
Slow living is my love language.
Barefoot in the garden. Highly recommend.
Kids made me a card. I am keeping it forever.
Wellness is boring and that's the point.
Lemon water, sunlight and a book I've meant to finish for months.
Planted herbs today. Talking to them. They seem fine.
The kids voted for pancakes. I made them healthy. They noticed.
A slow lunch outside fixes most things.
No screens after dinner. Hardest rule in the house.`);
OWN['Kris Jenner']=L(`Meetings all day and I loved every single one.
You're doing amazing, sweetie. Yes, you.
Family dinner on Sunday is not optional.
I have three phones and they are all ringing.
Proud mom moment number one million.
A good plan, a good outfit and a good assistant. That's the secret.
Grandma duty today. Best job I've ever had.
Colour-coded the calendar again. The calendar is winning.
Lunch meeting turned into a dinner meeting. Even better.
The grandkids want a sleepover. Cancel everything.
Every contract signed before noon. Now lunch.
My assistant has an assistant. Respect the team.`);
OWN['Selena Gomez']=L(`Rare Beauty team day. Blush everywhere. Very happy.
Cooking something new tonight. Pray for the kitchen.
On set with the guys again and we laughed through every take.
Taking a little social media break after this. Be kind to yourselves.
Studio late. Wrote something honest.
Mental health check-in: drink water, call a friend, rest.
Grateful for the people who love me loudly.
Baked cookies for the cast and burned exactly one tray.
Blush on my cheeks, blush on my sleeve, blush everywhere.
Quiet night. Candles, a cooking show, my dogs.
Wrote down what I'm grateful for and ran out of page.
Late grocery run in slippers. Nobody recognised me, or they were nice about it.`);
OWN['Justin Bieber']=L(`studio till the sun came up. worth it
skateboard, coffee, hoodie, repeat
grateful for today. that's it that's the post
jesus, family, music. in that order
rehearsing with the band, feels like home
hockey on tv, feet up
beliebers been riding forever. love you
late night jam with the band, phones down
learned a new skate trick. fell twice. landed it
praying, writing, eating cereal at midnight
the drummer keeps speeding up and honestly I love it
coffee and piano before anybody's awake`);
OWN['Shawn Mendes']=L(`guitar in the hotel room again. the neighbours are getting a free show
ran by the water this morning. head is clear
wrote a chorus I'm actually excited about
Canadian winters make the best writing weather
learning a new chord shape and failing beautifully
grateful for every person who sings it back
a little nervous before soundcheck still. good sign
voice memo app is now mostly hums
made pasta with a hotel kettle. don't try this
the crew serenaded a stranger at dinner and it was beautiful
long soundcheck, short night, big smile
rewrote the bridge on the plane and the person next to me noticed`);
OWN['Hailey Bieber']=L(`lab day. sampled every balm we've ever made.
my morning routine has three steps and they are all lip balm
quiet dinner, early night, perfect
packing for a trip with way too many neutrals
skin first, glam second
picked the dog-friendly café again
the matching sweatsuit is a uniform at this point
pilates class humbled me again
the dog has a bigger closet than I should admit
matcha, sweatsuit, sunglasses, errands
early skincare, late dinner, no plans
found the perfect white tee. not telling you where`);
OWN['Billie Eilish']=L(`made a song in a bedroom again. tradition
finneas played me something and I got weirdly emotional
wearing the biggest shirt I own. comfortable. thriving.
plant based snacks only on this tour bus thank you
I have changed my hair colour in my head three times today
stage is my favourite place and also the scariest
the hoodie has pockets for snacks. that is my whole rider
slept forever and still woke up tired
the vocal is a whisper and that's on purpose
found a weird synth sound in a preset folder and now it's my favourite thing
the spider in my room has a name now
touring makes every hotel blanket the best blanket I've ever had`);
OWN['Sabrina Carpenter']=L(`rehearsal in heels. my calves have filed a complaint
sparkles found in places sparkles should not be
espresso first. personality second
wrote a lyric so petty I had to put my phone down
the bangs are behaving today. no further questions
please clap for the dancers, they deserve it
a short dress and a long day
my hair has a better stylist than my life has a planner
practised a dance break in a hotel corridor and a man clapped
glitter count on the tour bus: unlimited
an outfit change so fast it should be an olympic event
wrote a line so specific my friends gasped`);
OWN['Olivia Rodrigo']=L(`wrote in my diary and accidentally wrote a song
guitar's out of tune and so am i honestly
purple nail polish touch-ups before soundcheck
vintage store haul. no regrets. some regrets.
screaming the bridge in the car is a love language
thank you for singing it back louder than me
journaling at the airport like it's my job
found an old notebook and stole a line from younger me
glitter on the guitar strap again
soundcheck scream test: passed
thrifted a cardigan with someone else's name tag inside
pancakes at midnight after the show`);
OWN['Dua Lipa']=L(`Dance rehearsal from noon. Legs are confused.
Packing for somewhere sunny with a very ambitious book list.
Book club pick is ready. Very excited to hear what you think.
Studio with the girls, disco ball optional but present.
Londoner at heart, wherever I wake up.
A late dinner with friends is my favourite thing in the world.
Warming up with the band. They make me better.
Rehearsal playlist on shuffle and every song is a dare.
New book, new city, same espresso order.
Choreographer said 'one more time' five times.
Dinner with friends ran into dessert, then into breakfast.
Studio day. We found the bassline before lunch.`);
OWN['Doja Cat']=L(`I drew on my face with eyeliner and now it's a whole look
the beat had a weird noise and I wrote the song about the noise
reading comments like they're my bedtime story
cat mode. do not perceive me.
rehearsal was 40% choreography 60% laughing
I made a meme and then I made it a lyric
I am in my villain era but like, a chill villain
painted my nails three colours and called it a concept
the dog barked on beat so he's getting a feature
put on a costume for zero reason and recorded the best take of the week
made a beat with a fork and a water glass. it slaps
I'm not saying I'm a cat but I did nap in the sun for an hour`);
OWN['SZA']=L(`wrote 30 songs and I hate 29 of them. classic
in my garden with the plants who never judge me
crystals on the console, incense in the booth
anxiety said no, the hook said yes
TDE fam, the studio smells like candles and snacks
overthinking a lyric for three hours straight. healthy.
sorry for being late. my brain was on airplane mode
talked to my plants for an hour. they had notes
wrote a verse in my car in the parking lot. didn't go in
rescheduled the session because the mood wasn't right. trust it
comfy socks, big headphones, honest songs
deleted a voice memo and spent an hour trying to remember it`);
OWN['The Weeknd']=L(`Night drive through the city. Writing in my head.
Synths on, lights off.
XO, always.
Toronto in my bones, wherever I am.
The darker the room, the better the vocal.
Mixing until the sun says go home.
Thank you for staying up with me.
City lights through the studio window. Back to work.
The vocal finally sat right at dawn.
Long drive, no radio. Just thinking.
Synth patch saved. Nobody touch it.
The best ideas show up after midnight.`);
OWN['Drake']=L(`studio at 3am just how I like it
toronto weather got me writing sad again
the 6 stays winning, that's not a debate
OVO fam at the house, food on the table
gym then booth, no in between
sometimes you gotta read the comments and laugh
heart on my sleeve, hoodie on my head
late dinner with the guys, phones face down
studio fridge stocked, ideas stocked
played the new one in the car three times before I said anything
rain on the window, pen on the pad
basketball in the morning, booth at night`);
OWN['Bruno Mars']=L(`The band showed up in matching suits and I have never been prouder.
Spent four hours on one drum fill. It is perfect now.
Hawaii state of mind, wherever I am.
Rehearsal is where the magic gets its shoes on.
Silk shirts and good intentions.
If the horn section isn't smiling, we go again.
Cooked for the crew. They said it was "fine". Rude.
Tuned my guitar for an hour and played one perfect chord.
Band practice became a dance-off. Everyone lost.
New suit fitting. The tailor understands me.
Cooked breakfast for the band. They asked for seconds. Finally.
If the bass player is nodding, the song is ready.`);
OWN['Harry Styles']=L(`hello. been writing. a lot.
pearls and a cup of tea
treat people with kindness, yes still
running in the rain, very British of me
a new jumper from a charity shop, couldn't be happier
the band and I had a very long lunch. productive.
thank you for being so lovely at the show
painted my nails before the train. a little smudged. fine
knitting on the tour bus. very slow scarf
cup of tea, bit of rain, long walk
the band laughed through soundcheck. good omen
read a book cover to cover on the plane. recommend reading`);
OWN['Bad Bunny']=L(`desayuno con mi familia y después al estudio
sin dormir, con café, haciendo música
uñas pintadas, gafas puestas, listo
a little reggaeton, a little rock, a little whatever I want
el público cantó más fuerte que yo anoche
playa, café y música. perfecto
nunca cambies por nadie
el estudio huele a café y a ideas nuevas
probando sonidos raros hasta que uno me hizo reír
camisa nueva, ritmo viejo, todo bien
un día lento en la playa antes de volver a trabajar`);
OWN['Jennifer Lopez']=L(`Rehearsal day. My dancers are the hardest-working people I know.
Hydrated, moisturized, ready for set.
From the Bronx and I never forget it.
JLo Beauty lab day and the team outdid themselves.
Sunday morning pancakes with the kids.
A good workout before work makes the whole day better.
Wardrobe brought out the gold and I said yes.
Rehearsal in sneakers, show in heels. That's the deal.
Cardio before coffee. Don't recommend. Did it anyway.
My dancers taught me a new move today and I almost had it.
Dinner at home with the music up and the kids judging my dancing.
Fitting for a gown with a train longer than my hallway.`);
OWN['Shakira']=L(`Estudio, café y mis hijos. Día perfecto.
The hips are rehearsing even when I'm not.
Barranquilla siempre.
Wrote a melody on the piano in Spanish and English.
Belly dance warmups before every show. Non-negotiable.
Gracias a mis fans, siempre conmigo.
A little rock, a little cumbia, a little everything in today's session.
Ensayo largo, corazón contento.
Wrote a chorus while walking on the beach. The waves helped.
My boys taught me a new video game. I lost every round.
Percussion day in the studio. My hands are tired and happy.
Café colombiano and a blank notebook.`);
OWN['Zendaya']=L(`Early call time. The coffee is doing its best.
Grateful for every crew member who makes the day work.
Fitting day with my stylist. We do not miss.
Quiet weekend at home with a book.
Bay Area kid at heart.
Reading the script again just to feel it again.
Grateful. Tired. Happy.
Read the scene out loud to my dog. He had notes.
Twelve hours on set, one long bath after.
My stylist and I found the shoes. Everything else follows.
Watching an old film on a quiet night.
Early call. Sunrise from the trailer was worth it.`);
OWN['Timothée Chalamet']=L(`on set and freezing. character building.
the scarf is load-bearing today
ate a whole bodega sandwich in the car to set
reading the book the movie is based on, for the third time
new york streets, old new york feelings
the crew showed up with bagels. legends
a long take that finally landed
new scarf. same scarf energy
rehearsed the scene in an empty hallway and the echo helped
ate cereal at midnight in full costume. no regrets
the director gave one note and it changed everything
subway ride to set, headphones in, character on`);
OWN['Pedro Pascal']=L(`Long day on set and the crew still made me laugh.
I will never stop thanking the people who hold the boom mics.
Coffee in one hand, script in the other, smile in between.
Took a nap in a trailer. Ten out of ten.
Every new character is a little scary. That's good.
Chilean family dinner energy wherever I go.
Just here to make you feel slightly better about your day.
Hugged the catering team. They feed my soul and my body.
Script notes in three colours of pen. Organised chaos.
Wore a very soft sweater to a very hard scene.
Called my sister between setups. She was not impressed by my costume.
Fell asleep in the makeup chair. Nobody mentioned it. Kind people.`);
OWN['Sydney Sweeney']=L(`car project weekend. hands covered in grease and very happy
early call, wig cap on, coffee in hand
reading three scripts on the plane, all very different
producing is a whole new kind of tired and I love it
family dinner at home. no cameras.
the stunt team is the best part of every set
rewatching my old tapes to see what I'd change
rebuilt a carburettor this weekend. still smells like gasoline
table read today. everyone was so good it scared me
the dogs got into the wardrobe trailer. chaos
producer meetings in the morning, set in the afternoon
fishing trip with my family. caught nothing. perfect day`);
OWN['Margot Robbie']=L(`Producer brain and actor brain on the same day. Exhausting. Love it.
Aussie at heart, so the tea is strong.
The cast dinner went until the restaurant kicked us out.
New script on the desk. Highlighters ready.
Surf before work. Best decision of the week.
Wardrobe fittings are a sport and I'm in training.
Proud of everyone at LuckyChap today.
Read three scripts in the bath. All a bit wet now.
Cast table read. Laughed until the producers looked worried.
Packed a suitcase that was mostly books.
Surfboard waxed, script highlighted, ready for anything.
Morning coffee on the porch with my scene notes.`);
OWN['Jennifer Aniston']=L(`Morning yoga, then coffee, then the day can begin.
Back on set and it feels like coming home.
My dogs have decided I work for them.
Reading lines with a glass of water and a very serious face.
Skincare is a quiet ritual. Love that part.
Laughing so hard in a take we had to reset.
Grateful for this crew. Every single one of them.
A long walk with the dogs and a very good podcast.
Table read laughter is the best sound in the world.
Hair and makeup at dawn. Bless this team.
Made a salad that was actually good. Small wins.
Rewatched dailies and laughed at my own blooper.`);
OWN['Britney Spears']=L(`dancing in my kitchen again 💃
picked flowers on my walk, they make me smile
spinning in a new dress just because
put the music on loud and did a full routine for the dogs
pink lemonade and a long walk
some days you just want a quiet beach
sending love to my fans, always
baked cupcakes and ate the frosting first
new playlist, new dance, same kitchen
the sunset tonight looked like a painting 🌅
wore my sparkly shoes just to walk the dogs
rearranged my flowers three times and now they're perfect`);
OWN['Charli XCX']=L(`club till 6 then studio at 2. living the dream?
wrote a song about a text I didn't send
the 4am cab ride home is the most underrated hour
synths louder pls
sunglasses inside because I said so
my calendar is messy and so am I
green tea, black sunglasses, no plans before midnight
made a beat that sounds like a car alarm in love
afterparty in a kitchen, as is tradition
studio rule: if it's too tasteful we start over
lost my sunglasses, found better sunglasses
texting myself lyrics at 5am in a cab`);
OWN['Chappell Roan']=L(`wig on. drag makeup on. let's go to work
missouri girl in a glitter crisis
rehearsing the choreo in my living room and knocking things over
the femmes in the front row are the reason
camp is a lifestyle not a phase
cowboy hat with rhinestones at the grocery store. no regrets
please be kind at the shows. to each other and to me
new wig fitting. she's tall and she's dramatic
rhinestone cleanup on aisle me
rehearsed the choreo in a parking lot. security joined in
drag queens did my makeup and I'll never recover
missouri sweet tea in a tour bus cooler`);
OWN['Tate McRae']=L(`rehearsed the routine 40 times today. legs = gone
calgary girl in a big city
stretching in the hotel hallway again
wrote a verse on the tour bus between cities
dance is my first language
ice bath. hate it. need it.
choreo + vocals at the same time is a sport
rehearsal blisters, rehearsal pride
wrote in my notes app on a red-eye flight
the hotel gym at midnight is my favourite place lol
learning a new routine and my brain is on fire
hockey game on the hotel tv between rehearsals`);
/* ---------- rising acts (people-ladder-v128 roster) ---------- */
OWN['Searows']=L(`recorded a guitar part so quietly the mic barely heard it. perfect
small venue tonight. bring a jacket, it's going to be soft and sad
wrote under a blanket with the window cracked open
a cold cup of tea and an unfinished song. standard evening
finger-picking until the calluses came back
thank you for being so quiet during the slow ones. it means a lot`);
OWN['Gia Ford']=L(`black boots, dark lipstick, desert road in my head
recorded the vocal in one take and refused to do another
a good song should feel like a movie you walked into late
the band and I agreed on nothing and the track is brilliant
tour van playlist is all western soundtracks and nobody is complaining
wrote a lyric on a train napkin. keeping the napkin`);
OWN['Hannah Jadagu']=L(`made a beat on my laptop on the floor of my room again
bedroom studio, real feelings
layering my own harmonies until it sounds like a choir of me
guitar pedals arrived. productivity is over
soundcheck went quick so we got snacks. huge win
writing about the weird middle part of growing up`);
OWN['Squirrel Flower']=L(`wrote a song about the weather and it was really about everything else
loud guitar, quiet heart
stormy afternoon, perfect for tracking
drove through the woods with the demo on repeat
feedback is my favourite instrument some days
thank you to whoever brought hand warmers to the show`);
OWN['Anna B Savage']=L(`wrote something very honest and then had to lie down
clarinet in the studio today, don't ask, it worked
I overshare in songs so I can be normal at dinner
long walk, big thoughts, small notebook
the quiet bits of the set are my favourite now
thank you for listening to the uncomfortable ones`);
OWN['Katy J Pearson']=L(`Bristol rain and a warm studio. lovely
wrote a chorus that sounds like a summer fete
the band made tea for the engineer. best band
charity shop find of the week: a very questionable waistcoat
folk songs with a disco heart, that's the plan
singalong at the end of the set made me cry a bit`);
OWN['Lime Garden']=L(`band practice turned into a dance party again
four of us, one van, too many snacks
seaside town energy wherever we go
new riff in rehearsal, everyone screamed
someone left the setlist in a café. we winged it
thank you for moshing politely last night`);
OWN['English Teacher']=L(`long rehearsal, longer argument about one chord. we won. all of us
wrote the lyric on a bus in Leeds. typical
the bassline arrived first and we followed it
sound guy did a perfect job, someone buy him a pint
a gig in a room with a sticky floor, as god intended
spoken word over guitars. still our favourite trick`);
OWN['Blondshell']=L(`loud guitars for loud feelings
recorded the scream on the first take, sorry to my throat
tour laundry day. glamorous
writing about the stuff I used to hide
a basement show is still the best show
thank you for yelling the lyrics back, genuinely healing`);
OWN['Nieve Ella']=L(`guitar out, windows down, demo loud
wrote a song in my bedroom and played it to my mum first
first coffee, first chorus, first mistake
packed my guitar before my toothbrush, priorities
the crowd sang the bridge back and I lost it
practising guitar solos in the dressing room like a teenager`);
OWN['Matilda Mann']=L(`little London flat, little guitar, big feelings
wrote a love song for a pigeon outside my window. kind of
tea gone cold again while I finished a verse
acoustic session in a bookshop and I was very happy
the soft songs are always the scariest to play live
thank you for coming to the quiet shows`);
OWN['Orla Gartland']=L(`guitar strings changed, fingers sore, no regrets
Dublin accent comes back the second I'm tired
producing my own stuff means I argue with myself a lot
studio day with friends = best kind of studio day
wrote a song about being overly self aware. very self aware of that
the crowd harmonised in the quiet part. goosebumps`);
OWN['Dodie']=L(`ukulele out. existential crisis in.
cozy jumper, cold tea, new song
being sad in a major key is my brand
taking a little break from the internet to look after myself 💛
the strings section made me cry in rehearsal
you are all so lovely, thank you for singing along`);
OWN['Lauren Aquilina']=L(`writing session for someone else today, can't say who, can say it slaps
piano, notebook, three cups of coffee
the hook came in the last ten minutes of the session as always
melody first, words later, panic in between
sometimes you write a song you can't give away
a little studio candle and a big chorus`);
OWN['Nina Nesbitt']=L(`Scottish weather, perfect writing weather
piano in the corner of the flat is getting a workout
wrote a chorus that sounds like a road trip
singing in the shower counts as vocal practice
little acoustic show tonight, so excited
thanks for all the lovely messages lately`);
OWN['Laurel']=L(`late night in the studio, synths and wine-dark moods
I produce in my pyjamas. no shame
recording vocals in the hallway for the echo
wrote a song about the sea and it got very dramatic
small room, big reverb
mixing until my ears give up`);
OWN['Orion Sun']=L(`lo-fi mornings, warm keys, soft drums
wrote on the porch with the birds as backup
recorded on an old tape machine because it felt right
philly kid, slow jams
loop pedal and a good mood
thank you for vibing with the quiet ones`);
OWN['Arlo Parks']=L(`wrote a poem on the train that turned into a song
little observations, big feelings
books are my first instrument honestly
soft bass, soft light, soft heart
London walk with headphones and no destination
thank you for reading the lyrics closely`);
OWN['Nilüfer Yanya']=L(`guitar tone took all morning and it was worth it
London rain, saxophone, late dinner
wrote a riff that sounds like pacing around a room
studio with my sister and friends, lovely day
the weird chord is the right chord
packing pedals for tour like it's a puzzle`);
OWN['Bess Atwell']=L(`folk songs for slow afternoons
wrote by the window while it rained, very on brand
soft guitar, honest words
long drive to the gig with tea in a thermos
small crowd, big hearts
recorded the vocal close to the mic so it feels like a whisper`);
OWN['Rachel Chinouriri']=L(`South London to the studio, same playlist every time
wrote an indie song with a lot of feelings and a lot of guitar
mum came to the gig and sang louder than me
dancing around the dressing room before the show
little bit sad, little bit sunny, that's the record
thank you to everyone who sings the second verse`);
OWN['Jensen McRae']=L(`wrote a song in my notes app at a red light (safely)
lyrics first, guitar later, snacks always
writing funny songs about sad things is my cardio
piano at home and a very patient neighbour
I read every comment and I mean it
studio with friends is the best kind of therapy`);
OWN['Maya Hawke']=L(`set life in the day, songs at night
reading lines and writing lyrics in the same notebook
guitar in the trailer, obviously
new york city walk with a coffee and a lot of thoughts
a quiet show in a small room is my favourite thing
learning a scene and a chord at the same time`);
OWN['Lola Kirke']=L(`cowboy boots on set and off
country songs at night, character work by day
guitar on the tour bus, script in the backpack
a dive bar gig is my natural habitat
wrote a heartbreak song with a happy chorus
yeehaw but make it thoughtful`);
OWN['Talia Ryder']=L(`set day, sore feet, happy heart
rehearsing the scene in the hallway with my scene partner
dance training finally came in handy on set
new york coffee, early call, long day
grateful for this crew
reading the script on the subway like a main character`);
OWN['Lola Tung']=L(`back on set with the best cast and crew
summer energy in every scene, even when it's cold
stage training still saves me on long days
fan love is unreal, thank you thank you
learning the lines on the drive in
craft services snacks are my love language`);
OWN['Holly Humberstone']=L(`back in my childhood bedroom writing songs. full circle
fairy lights and a guitar. that's the studio
big sister energy in every lyric
recorded on a laptop at 2am and kept the noise
small town girl in a big tour bus
thank you for singing it with me`);
OWN['Maisie Peters']=L(`wrote a very petty song and I'm thrilled with it
guitar, glitter, gossip
writing with my best friends in a tiny room
tour diary: ate a whole bag of crisps in the van
brighton girl at heart
the crowd knew every word. I screamed`);
OWN['Griff']=L(`made the outfit, made the song, made a mess
producing my own vocals at 3am again
the synths are so big today
dancing alone in the studio, as one does
DIY or don't bother
thank you for the most beautiful show`);
OWN['Rina Sawayama']=L(`rehearsing the choreography and the attitude
pop, metal, ballad, all in one day
on set today, sorry fans, the music is still cooking
the glam team and I invented a new eyeliner shape today
dressing up for the studio because it helps
chosen family dinner tonight 💖`);
OWN['FLO']=L(`three-part harmony warmups in the car again
rehearsal day, the choreo is choreo-ing
girl group dinner = loud, happy, chaotic
matching outfits, different energies
R&B is a feeling and we feel it
thank you for always singing the high note with us`);
OWN['Ravyn Lenae']=L(`Chicago girl in the studio again
high notes in the morning hurt but they worked
soft R&B and a scented candle
dressing room playlist is all classic soul
recorded the harmonies in one sitting
thank you for vibing with me`);
OWN['Amber Mark']=L(`groove first, everything else later
bass line stuck in my head for three days
studio, plants, incense, happy
recorded in a big room for the echo
dance practice with the band is so fun
thank you for always pulling up`);
OWN['Joy Crookes']=L(`South London girl, soulful songs
writing with a cup of chai and a lot of feelings
studio with live strings today, absolutely lovely
dressing up for the gig like it's a wedding
small venue, big love
family dinner, big talk, best night`);
OWN['Celeste']=L(`soul music in a grey city
the band played it slower and it was perfect
voice warmups with a hot water and lemon
old jazz records on the turntable today
wrote in the dark again
thank you for listening so closely`);
OWN['Mahalia']=L(`Leicester girl in a London studio
writing a song about texts I shouldn't send
R&B night with the girls
guitar and a big laugh
soundcheck turned into a mini concert
thank you for always showing up for me`);
OWN['Nao']=L(`wonky funk forever
layered my voice until it sounded like a choir
dancing in the studio, can't stop won't stop
little synths, big feelings
soft light, warm bass, good day
thank you for singing the high bits`);
OWN['Tinashe']=L(`stretch, sing, sweat, repeat
choreo first, vocals second, rest never
independent and loving it
studio night, R&B and too many snacks
dancing in heels on concrete. pray for me
thank you for always riding with me`);
OWN['Victoria Monét']=L(`writing for myself today, which is a treat
choreo practice and a very sore back
R&B is my first love, always
studio day with great people
dressing room glam, golden lights
thank you for growing with me`);
OWN['Remi Wolf']=L(`neon outfits, neon song
recorded a vocal while lying on the floor. it slaps
funk, chaos, love
the band is so good it's unfair
painted my nails mid-session
thank you for dancing like nobody's watching`);
OWN['Dora Jar']=L(`dreamy little song, dreamy little day
recorded in a forest cabin for the birdsong
weird sounds are my favourite sounds
spent the morning making beats with spoons
singing like a sleepy ghost
thank you for listening to the strange ones`);
OWN['Samia']=L(`wrote a song in the car park before soundcheck
indie songs, honest words
long drive between shows, good playlist
bandmates are my family on the road
quiet bit in the set, everyone sang anyway
thank you for coming out tonight`);
OWN['Lizzy McAlpine']=L(`jazz chords, folk heart
wrote a song at the piano and forgot to eat
the sad ones are the happiest to write
guitar in the hotel room, quiet voice
the crowd went silent in the quiet part. magic
thank you for listening so carefully`);
OWN['ROLE MODEL']=L(`indie pop and a lot of feelings
studio sessions with friends till late
wrote a love song on a napkin
tour van naps are elite
the crowd screamed the chorus back, insane
thank you for being so kind at the shows`);
OWN['Omar Apollo']=L(`studio candles, slow jams
wrote in Spanish and English today
falsetto day, sorry neighbours
Indiana kid, big dreams
dancing at soundcheck because why not
thank you for always showing up`);
OWN['Conan Gray']=L(`wrote a sad pop song in my car, as tradition demands
small town texas kid, big pop dreams
cardigan, iced coffee, existential dread
tour bus naps and very strong opinions about snacks
vlogging used to be my diary, now the songs are
thank you for crying with me at the shows`);
OWN['Wallows']=L(`band practice turned into a jam turned into a song
three of us, one van, many opinions
LA sun, guitars, good friends
the drummer ate all the snacks. again
indie rock forever
thank you for jumping during the fast ones`);
OWN['Clairo']=L(`bedroom studio sunlight
soft songs for quiet mornings
recorded the guitar on an old tape machine
long walk, good coffee, new idea
the band and I had pancakes after soundcheck
thank you for listening to the slow ones`);
OWN['Beabadoobee']=L(`90s rock forever and ever
guitar pedals everywhere in the flat
wrote a song in my bedroom with the door locked, again
tour bus noodles at midnight
filipino family dinner, loud and lovely
thank you for screaming the riffs back`);
OWN['Faye Webster']=L(`yo-yo practice between takes
pedal steel makes everything feel like a sunset
Atlanta forever
quiet songs, dry jokes
recorded the vocal lying on the couch
thank you for being so chill at the shows`);
OWN['Ethel Cain']=L(`southern gothic weather today
long songs, long drives
recorded in a church for the reverb
wrote a hymn that isn't a hymn
quiet house, loud thoughts
thank you for sitting with the slow ones`);
OWN['Troye Sivan']=L(`dancing in the studio till 3am
pop songs for the girls and the gays
Aussie sun, LA sun, all the sun
choreo rehearsal and a very sweaty tshirt
wrote a song about a summer night
glitter on the tour bus seats forever`);
OWN['Reneé Rapp']=L(`vocal warmups in the car, sorry to the drivers next to me
broadway kid forever
writing loud songs about quiet feelings
on set by day, studio by night
being unhinged in a healthy way
thank you for screaming the high notes back`);
OWN['Dove Cameron']=L(`dark pop and a good eyeliner
on set again, wig and all
wrote a song about being a little bit of a villain
vocal warmups in the trailer
studio day with my favourite people
thank you for the love, always`);
OWN['Sofia Wylie']=L(`dance rehearsal before set, legs are jelly
on set with the best cast
grateful for this crew every day
learning choreo and lines at the same time
cozy night with a good book
thank you for all the love`);
OWN['Sofia Carson']=L(`on set by day, in the studio by night
Latina pride, always 💛
vocal warmups and an early call
grateful for the fans, always
dressing up like it's a premiere even on a tuesday
family dinner, best dinner`);
OWN['Joshua Bassett']=L(`guitar in the trailer between takes
wrote a song on set, don't tell the director
acting and music in one day, tired but happy
long drive with the windows down
studio candles and a lot of feelings
thank you for listening`);
OWN['Kit Connor']=L(`British weather, British tea, on set
learning lines on the train
the crew made the long night feel short
reading a new script and getting excited
quiet weekend with family
thank you for the kind messages`);
OWN['Joe Locke']=L(`the cast group chat is unhinged and I love it
tea, scripts, a lot of nerves
stage training saves me every time
your letters are on my trailer wall
reading the scene again in the trailer
Isle of Man to here, still pinching myself`);
OWN['Gavin Casalegno']=L(`summer weather on set, even in a hoodie
beach walk before call time, best start to the day
the crew is family at this point
learning lines on the beach
grateful for every single message
quiet night, good food`);
OWN['Gigi Hadid']=L(`cooking for friends tonight, very proud of the sauce
fitting day, long rack, happy
early call, coffee in hand
school run then a fitting. multitasking queen
the farm is my favourite place
runway nerves still, after all this time`);
OWN['Bella Hadid']=L(`5am glam, still half asleep
horses and quiet mornings, my happy place
fitting room photos, long day
off duty. hoodie. sunglasses.
grateful to every person on the team
runway walk practice in the hotel hallway`);
OWN['Naomi Campbell']=L(`The walk is a lifestyle.
Wiping down the plane seat, as always. Hygiene is fashion.
Fittings all day, grateful for the designers.
London girl, global life.
Mentoring the new girls is my favourite part of this job.
Rest is a luxury. Taking it tonight.`);
OWN['Adut Akech']=L(`call time early, heart full
fittings all day, grateful
walking for the designers I dreamed of
family first, always
quiet hotel night after a loud show
sending love to everyone who wrote to me this week`);
/* ---------- universe: screen ---------- */
OWN['Angelina Jolie']=L(`Long day behind the camera. Directing teaches patience.
The kids chose dinner tonight. It was a democratic disaster.
Reading late with tea and a lot of notes in the margins.
Grateful for the crew who make the hard days lighter.
Field visits remind me what matters.
Quiet morning, strong coffee, a script full of questions.`);
OWN['Brad Pitt']=L(`Long day on set. Good crew. Good coffee.
Spent the afternoon in the workshop. Wood doesn't argue back.
Producing means a lot of meetings. Still worth it.
Old car, open road, no rush.
The stunt team pulled off something wild today.
Reading scripts on the porch.`);
OWN['Tom Holland']=L(`stunt rehearsal again. body says no, heart says yes
got the dog out for a walk before call time
did a backflip in the trailer. don't tell production
golf on a day off, still terrible at it
London tea, London rain, very happy
the crew sang happy birthday to a grip and I cried a bit`);
OWN['Anne Hathaway']=L(`Morning run, then table read. Feeling very prepared, possibly overprepared.
Singing in the car between scenes. The driver is a saint.
The costume department deserves an award every single day.
Coffee in one hand, script in the other, enthusiasm everywhere.
Taking a quiet weekend to read and recharge.
A little musical theatre in my heart, always.`);
OWN['Liam Hemsworth']=L(`early surf, late night on set
Aussie at heart, wherever the call sheet says
gym before work, then a long day of stunts
low key weekend with the dogs
trying to cook something that isn't toast
good crew makes long days short`);
OWN['Chris Hemsworth']=L(`Training session before set. The legs have filed a complaint.
Surf this morning, fight scene this afternoon. Balance.
The kids made me breakfast. It was mostly cereal and love.
Ice bath. Never gets easier.
Byron sunshine is the best recovery there is.
Spent the day hanging off a harness. Living the dream, mostly.`);
OWN['Florence Pugh']=L(`cooked an enormous pasta for the cast. they were too polite to say no
wearing a very bold outfit to get a very small coffee
long day on set, covered in fake blood again
London kitchen, loud music, wine for the sauce
the crew is the best part of every job
learning an accent and talking in it at breakfast`);
OWN['Jenna Ortega']=L(`another very dark scene, another very good day
reading horror novels between takes for research, obviously
deadpan face, chaotic brain
long night shoot, black coffee
the crew gave me a tiny cake and I almost smiled on camera
dance rehearsal was a lot of awkward flailing and I loved it`);
OWN['Jacob Elordi']=L(`long day on set, long walk after
reading on the plane, phone off
Aussie sun in my head even in the cold
the fitting took longer than the scene
quiet dinner, early night
the grips carried the whole night, legends`);
OWN['Emma Stone']=L(`Overprepared for the scene, underprepared for lunch.
Laughed so hard in the take we had to start again.
Producing meeting, then a fitting, then a nap if I'm lucky.
Reading a script that made me very nervous in a good way.
Cozy night with a good book.
The crew pranked me today and I deserved it.`);
OWN['Ryan Gosling']=L(`Long day on set. Short caption.
The piano is out of tune and so am I.
Learned a new skill for the role. Will never use it again. Love it.
Cereal at midnight is a director's cut.
Deadpan on set, crying at a dog commercial at home.
Thank you to the crew. They carried me today.`);
OWN['Leonardo DiCaprio']=L(`Protecting the planet starts with paying attention.
Long day on set. Grateful for the crew.
Reading about the oceans tonight. Everyone should.
Old movies on a Sunday.
Producing something I really believe in.
Nature first. Always.`);
OWN['Scarlett Johansson']=L(`Stunt rehearsal in the morning, skincare in the evening.
The Outset team had a very good day.
Producing is a whole new muscle and I'm building it.
Learned a very complicated move for one shot. Nailed it on take nine.
The fight scene finally clicked.
New York walk with a coffee, very happy.`);
OWN['Viola Davis']=L(`The work is the reward. Back on set.
Reading the script again and finding something new.
Stage training never leaves you.
Grateful for every person who made today possible.
Family dinner, quiet house, deep breath.
Telling stories that matter is the whole point.`);
OWN['Anya Taylor-Joy']=L(`another day in a corset. character building
dancing in the trailer between takes
reading the script out loud to myself in different voices
fitting day and I feel like a painting
big eyes, bigger coffee
grateful for this wild job`);
OWN['Austin Butler']=L(`Deep in prep. Voice is doing something new.
Reading everything I can find about this character.
Long rehearsal, long walk home.
Gym, script, sleep, repeat.
The crew is the real story.
Grateful for this work.`);
OWN['Paul Mescal']=L(`gaelic football on the telly, very happy man
rehearsal room, coffee, nerves
short shorts weather, unfortunately
London walk, good book, quiet pint
stage work keeps you honest
grateful for the crew`);
OWN['Cillian Murphy']=L(`Rehearsal. Quiet day.
Reading.
Long walk by the sea.
Back home. Back to the books.
Grateful for this crew.
Not much to say. Working.`);
OWN['Lupita Nyong’o']=L(`Fitting day and the colours are singing.
Reading a children's book I love on a quiet afternoon.
Stage training, screen work, same heart.
Grateful for the crew and the long days.
Family dinner, lots of laughing.
Kindness is the best accessory.`);
OWN['Jennifer Lawrence']=L(`Tripped on set again. Kept the take.
I just want to watch reality TV and eat snacks. Is that so much to ask.
Long day, good crew, terrible coffee.
Producing means being nervous in a new way.
My dog judges my career choices.
I said something in an interview and immediately regretted it. Normal Tuesday.`);
OWN['Emma Roberts']=L(`book club pick is in, very excited
the trailer has more books than snacks
cozy night in with the dog and a stack of books
fitting day, very happy
family dinner and a lot of laughing
the costume team made my whole week`);
OWN['Millie Bobby Brown']=L(`florence by mills team day, everyone smashed it
on set with the best people
my dogs think I'm a celebrity, I think they're celebrities
cozy night with a face mask and a movie
reading your messages under a blanket, so grateful
dancing in my trailer between takes`);
OWN['Hunter Schafer']=L(`sketching in the trailer between takes
fitting day, very happy with the shapes
quiet walk, good playlist
long night on set, black coffee
art first, always
painted something small on my day off`);
OWN['Lily Collins']=L(`Fitting day and the berets are back.
Reading a script with a cup of tea and a pencil behind my ear.
Grateful for this crew every single day.
Little café, little notebook, big ideas.
Long day on set, still smiling.
A walk with no phone is my favourite reset.`);
/* ---------- universe: fashion ---------- */
OWN['Tyra Banks']=L(`Smize check. Passed.
Teaching a posing workshop today. They were fierce.
Business meeting, then a photo shoot, then ice cream. Balance.
Confidence is the best outfit.
Walking in heels on cobblestones is an Olympic sport.
Grateful for every model who ever trusted me.`);
OWN['Cara Delevingne']=L(`eyebrows on, attitude on
did a silly dance in the fitting room, the stylist joined in
on set by day, runway by night
london chaos, good friends
pulled faces in every behind-the-scenes photo, sorry team
grateful for this wild life`);
OWN['Irina Shayk']=L(`Early call, black coffee, big hair.
Fitting day with my favourite designers.
Mom life and a call sheet.
Quiet weekend in the city.
Grateful for every photographer who pushes me.
Long show, happy heart.`);
OWN['Winnie Harlow']=L(`fitting day, glowing
Toronto girl wherever I am
the walk is in the hips and the heart
skincare night, very serious business
dancing in the dressing room before the show
grateful for every single person who shows up`);
OWN['Emily Ratajkowski']=L(`writing again, notebook and coffee
mom life and a fitting in the same afternoon
reading on a train, very happy
podcast recording day, lots of thoughts
fitting day with a lot of black
quiet dinner with friends`);
OWN['Karlie Kloss']=L(`coding camp girls are the future, watch them
early run before the fitting
cookies in the oven, as tradition demands
long day on set, happy heart
stretching before the show, very serious athlete energy
grateful for my team`);
OWN['Ashley Graham']=L(`Recording the podcast today and laughing too much.
Every body is a runway body.
Mom life plus a call sheet plus a very large coffee.
Fitting day and I feel amazing.
Hosting duties tonight, so excited.
Grateful for every single person who sends me kind messages.`);
OWN['Precious Lee']=L(`Fitting day and the shapes are everything.
Runway nerves, still. I love that.
Early call, big glam.
Grateful for every designer who made room.
Quiet hotel night after a loud show.
Confidence is the uniform.`);
OWN['Paloma Elsesser']=L(`fitting day, warm and happy
reading on the subway to the shoot
black coffee, big hair
the hair team made magic out of humidity
the walk is a conversation
long day, good people`);
OWN['Anok Yai']=L(`Call time early, glow on.
Fitting day with the best team.
The walk is the whole story.
Family first, always.
Quiet night after a loud show.
Grateful for the designers I dreamed of.`);
OWN['Alex Consani']=L(`runway in the morning, a very long video in the evening
fitting day = fashion week cardio
the walk is a personality trait
my phone is 90% mirror selfies right now
grateful for every single designer who books me
someone please tell me how to sit in this outfit`);
OWN['Amelia Gray']=L(`fitting day, very blonde, very tired
the walk is a mood
cozy night, oversized hoodie
backstage selfie with the whole crew, everyone blinked
early call and a very strong coffee
runway nerves, still`);
OWN['Jourdan Dunn']=L(`London girl, global runway
fitting day with my favourite team
mom life and a call sheet
the walk never leaves you
grateful for every designer who believed
quiet night with family`);
OWN['Linda Evangelista']=L(`Fittings with old friends. It never gets old.
The best photographers make you braver.
Quiet morning, coffee, a good book.
Grateful for every person who built this industry with me.
Family dinner is my favourite reset.
Style is attitude. Always was.`);
OWN['Cindy Crawford']=L(`Morning workout, then a fitting. Classic.
Meaningful Beauty team day, proud of them.
Family dinner and a lot of laughing.
Quiet weekend at the beach.
Grateful for every photographer who taught me something.
Some looks are timeless. So is coffee.`);
OWN['Kaia Gerber']=L(`book club pick is ready, very excited
fitting day, long rack
reading on set between takes
cozy night with a stack of books
grateful for this team
early call, black coffee`);
OWN['Iman']=L(`Beauty is a conversation, not a rule.
Fittings with the designers I love.
Quiet morning, strong tea.
Mentoring the new generation is the best part of this work.
Grateful for every person who made room.
Elegance is a habit.`);
/* ---------- universe: creators ---------- */
OWN['MrBeast']=L(`filming day 4 of a video that was supposed to take 2
the crew hasn't slept and neither have I. it's going to be worth it
taste testing new Feastables flavours, very serious science
the thumbnail meeting took longer than the shoot
if this video works I'll explain everything. if it doesn't, I won't
we built the set, then rebuilt the set, then rebuilt the set`);
OWN['Khaby Lame']=L(`🤷‍♂️
simple. always.
you can just open it with your hand. 🤷‍♂️
no words today. just the face.
why make it complicated? 🤷‍♂️
grazie for the love ❤️`);
OWN['Charli D’Amelio']=L(`learned a new dance in the kitchen, tripped on the dog bowl
dance studio all day, feet are gone
family dinner, lots of laughing
cozy night with a face mask
grateful for every single person who dances with me
rehearsal turned into a dance-off with my sister`);
OWN['Addison Rae']=L(`studio day, glitter everywhere
dance rehearsal, very sweaty, very happy
pop star thoughts at 2am
mirror selfie in a very sparkly outfit
louisiana girl in a big city
thank you for always dancing with me`);
OWN['Emma Chamberlain']=L(`made a coffee so strong I could hear colours
thrifted a jacket that smells like a library. love it
recording the podcast in bed, not sorry
I have had four different personalities today
filmed for 3 hours, will use 40 seconds
the fit is weird and I'm wearing it anyway`);
OWN['Logan Paul']=L(`podcast day, way too much energy
gym, then mic, then more gym
training session went crazy today
dad life and a call sheet
the hydration team is cooking something
grateful for the haters, they keep me motivated`);
OWN['Jake Paul']=L(`training camp day. 5am run. let's go
sparring went crazy today
gym, film, sleep, repeat
the haters keep me motivated
recovery day, ice bath, no talking
working harder than everybody who's talking`);
OWN['Bretman Rock']=L(`good morning to everyone except my haters
hawaii sunshine, beat face, no notes
did my makeup in the car again, ate
the plants in my house are thriving, unlike me
filming a video where I talk too much, as usual
I am that girl and I'm also that guy`);
OWN['Dixie D’Amelio']=L(`studio day, very proud of this one
family dinner, loud and lovely
cozy night with my sister
wrote a sad song and then laughed for an hour
listening to the demo in the car on repeat
vocal warmups in the car`);
OWN['Larray']=L(`hi it's me, the funniest person you know
filmed a skit and laughed through every single take
I am a menace and that's a fact
iced coffee, chaos, content
my friends said I'm too much. thank you
the outfit was a choice and I made it`);
OWN['Drew Afualo']=L(`laughing so hard I scared the dog
podcast day, the men are not okay
you will not catch me apologising for my laugh
Samoan family dinner, loud and lovely
read the comments, laughed, blocked, moved on
women supporting women, always`);
OWN['Alix Earle']=L(`get ready with me, the 9am edition
the bronzer is doing all the heavy lifting today
podcast recording, laughed too much
cozy night, face mask, reality TV
grateful for every single one of you
the outfit took 40 minutes, the photo took 4 seconds`);
OWN['Nara Smith']=L(`made bread from scratch, flour everywhere
a little dress, a big pot of soup
homemade cereal, because why not
the kids helped in the kitchen today, very messy
from scratch, always
gentle music, slow morning, warm oven`);
OWN['Wisdom Kaye']=L(`fit check: very loud, very me
thrifted a jacket that changed my whole week
styling three looks before breakfast
runway walk practice in the hallway
colour is a lifestyle
grateful for everyone who rocks with the looks`);
OWN['James Charles']=L(`hi sisters 💄
beat face for no reason, as usual
filmed a tutorial, ruined my shirt with foundation
the eyeliner wing is sharper than my comebacks
glam room, playlist on, coffee in hand
thank you for always supporting my art`);
OWN['Jacksepticeye']=L(`top of the mornin' to ya laddies
recorded for 6 hours, my voice is GONE
coffee number three and the gaming is going great
green hair, big heart
the community is the best thing about this job
playing a horror game again, pray for me`);
OWN['Markiplier']=L(`Recording today. Yelling may occur.
Editing until my eyes give up.
Wrote a weird little story and we're going to film it.
Gaming, coffee, and a very loud chair.
The community is the best part of this job.
Filmmaking is just organised chaos.`);
OWN['IShowSpeed']=L(`SIUUUUU 🔥
streamed for 8 hours and I'm not tired. LETS GO
backflip at the gym, almost died, worth it
ronaldo is the GOAT and I will not hear otherwise
the chat was crazy today 😭
I barked at a dog and the dog barked back`);
/* ---------- universe: music ---------- */
OWN['Ed Sheeran']=L(`loop pedal + one guitar + a very sweaty t-shirt
wrote a song in a pub, as you do
ketchup on everything, no regrets
studio with mates, cuppa in hand
suffolk walks, clear head
thank you for singing along every single night`);
OWN['Post Malone']=L(`guitar, a very good sandwich and nowhere to be
studio night with the boys
wrote a country song and a rap song in the same day
beer pong champion of the house
tattoo artist said one more and I said okay
thank you for always rocking with me`);
OWN['Lana Del Rey']=L(`A long drive through the canyon at golden hour.
Wrote a song on the porch.
Old Hollywood film on the couch, very happy.
Quiet house, loud thoughts.
The diner on the highway has the best coffee.
Thank you for listening to the slow ones.`);
OWN['Travis Scott']=L(`studio till sunrise, its lit
sound check ran long, the production is getting crazy
houston forever
working on something crazy
cactus energy all week
thank you for always pulling up, stay safe out there`);
OWN['Megan Thee Stallion']=L(`HOTTIES I see you 🔥
gym, studio, anime, repeat
houston girl forever
braids done, stage heels on, let's work
wrote a verse that's going to make y'all scream
my dogs think they're the boss and they're right`);
OWN['Usher']=L(`Rehearsal all day, the choreography is choreography-ing.
R&B forever.
Roller skating on a day off.
The band is so good it's unfair.
Grateful for every single fan.
Smooth vocals, smooth moves.`);
OWN['Alicia Keys']=L(`Piano at home, candles lit, writing.
No makeup, just me.
Producing for a friend today. Their best work yet.
Family dinner, lots of music.
New York in my heart, always.
Grateful for every single person who sings along.`);
OWN['Sam Smith']=L(`vocal warmups with a hot lemon and a lot of feelings
studio candles and a big ballad
dressing up for the studio because why not
queer joy forever
the string players are angels, I'm not crying you are
thank you for always singing with me`);
OWN['Tyler, the Creator']=L(`rode my bike to the studio today. nice
colour palette for the week: very specific
wrote a song about a car I like
golf hat, golf mood
made a beat, ate a snack, made another beat
thank you for always tapping in`);
OWN['Lorde']=L(`long walk by the water. thinking.
new zealand forever.
reading in the sun, writing at night.
quiet times are good times.
the band and I had a very long dinner.
thank you for being patient with me.`);
OWN['ROSALÍA']=L(`flamenco in the morning, reggaetón at night
uñas listas, estudio listo
Barcelona en el corazón
experimentando con sonidos nuevos
palmas, voz y mucho corazón esta noche
moto, maquillaje y mucho ritmo`);
OWN['Karol G']=L(`Medellín en el corazón 💗
estudio hasta tarde, como siempre
bichota mood
gracias a mis fans, siempre conmigo
ensayo de coreografía, piernas muertas
reggaetón para el alma`);
OWN['Benson Boone']=L(`backflip at rehearsal, landed it, everyone screamed
piano at home, big notes
the high note is getting higher every night
wrote a song about a girl and a car
thank you for singing along so loud
practising the flip on a trampoline like a grown man`);
OWN['Gracie Abrams']=L(`wrote in my journal and it turned into a song
cozy cardigan, cold tea
little guitar, big feelings
tour bus naps are elite
the crowd sang the quiet part and I cried
thank you for being so kind`);
OWN['Burna Boy']=L(`Afrobeats to the world 🌍
Lagos energy, always
late studio session with the gang
Port Harcourt to the world
the band is too clean
gratitude for every single fan`);
OWN['Tems']=L(`Lagos girl in a big world
studio day, soft voice, big heart
wrote a song about the sky
grateful for every single fan
quiet morning, strong tea
the band made me cry in rehearsal`);
OWN['Tyla']=L(`amapiano forever 💃
Joburg girl, global stage
rehearsal till midnight, legs are gone
studio day, so excited
the dancers are so talented
thank you for dancing with me`);
OWN['Peso Pluma']=L(`corridos para el mundo 🇲🇽
estudio hasta tarde
gracias por cantar conmigo
la gente no para
mexico en el corazón
puro trabajo, puro corazón`);
OWN['Jungkook']=L(`ARMY 💜 thinking of you today
practice room until late
vocal warmups and a lot of snacks
gym day, very sore
cooking ramen at midnight
thank you for always being there 💜`);
OWN['LISA']=L(`BLINKs 🖤💗 I see you
dance practice till late
Thailand forever in my heart
fitting day, so excited
my cats are the boss of this house
thank you for always being there`);
/* ---------- id-keyed extras (same display name appears twice in the roster) ---------- */
const OWN_ID={};
OWN_ID['scene-u-aniston']=L(`Table read today. Laughed at my own lines, which is never a good sign.
A long lunch with old friends is the best kind of therapy.
Hair day. It's always a hair day.
Walked the dogs, made a smoothie, felt like a responsible adult.
New scene partner, great energy, very nervous in a good way.
Sunday night: tea, blanket, a very old sitcom on TV.`);

/* ---------- category fallbacks: used when a celeb's own lines run out, or for anyone not listed ---------- */
const CAT={};
CAT.musician=L(`soundcheck took two minutes and the snack run took forty
three versions of the same chorus and I like the first one best
my voice memos are 80% humming and 20% me saying "wait"
the drummer found a groove and we followed it for an hour
a song finally told me what it's about
headphones on, world off
setlist written on my hand again
tuned the guitar, untuned my sleep schedule
the bridge is fixed. I am a new person
studio couch nap, then one more take
that thing where the mix finally sounds like the room in your head
wrote a lyric on the back of a boarding pass
the harmonies stacked up and gave me chills
ears ringing from rehearsal in the best way
someone left the reverb on max and honestly? keep it
the engineer said "one more" and meant six more
soft song, loud feelings
there's a melody stuck in my head and it's mine, finally
learning my own song all over again for the live version
vocal rest day. typing only.
the band laughed through the whole run-through. that's the good sign
put the demo on in the car to see if it holds up. it holds up
tea with honey, scarf on, warming up
new pedal, new problems, new sounds
the crowd sang it back louder than I sang it
back of the van, laptop open, editing a verse
practising the hard part slow until it's easy fast
the backing vocals are carrying my entire week
writer's block cured by a long walk and a sandwich
opened an old notebook and found a whole chorus
a quiet night after a loud show is my favourite thing
the green room has better snacks than my kitchen
three hours on one word. it's the right word now
dancing around the studio when nobody's watching (someone was watching)
monitors too loud, heart too full
packed the merch myself tonight. very hands-on artist
playing it acoustic changed everything
I hum when I'm nervous, so the whole hallway knows
tour laundry is the least glamorous part of the dream
listened back and smiled. good day
the song is done. I'll change it tomorrow
grateful for everyone who listens with their whole chest`);
CAT.actor=L(`call time before sunrise. the coffee knows.
the scene looked simple on paper. it was not simple.
wardrobe fitting took longer than the actual scene
learning lines in the car, mouthing them at red lights
one hallway, five different locations. movie magic
the crew turned a car park into a palace overnight
spent the day crying on cue. now I want soup
table read went long because we kept laughing
the stunt double is my hero
reading the script one more time before bed
the director said "one more for safety" and we did eleven
on set nap in a camping chair, ten out of ten
makeup chair at 5am is where I make friends
wrapped the scene, hugged the crew, went home
character shoes are breaking me in, not the other way round
the accent is stuck. I ordered breakfast in it
rehearsal in a tiny room with very big feelings
the boom operator deserves a raise and a nap
the set smells like sawdust and coffee
craft services had the good crisps today
rain machine on, umbrella off, freezing
night shoot. vampire schedule.
the trailer is my home this month
improvised a line and the director kept it
the crew made a cake for a camera assistant's birthday
reading three scripts on a long flight
voice notes to myself about the character at 2am
a fight scene where the hardest part was not laughing
squinting at a tennis ball pretending it's something terrifying
first day nerves, every single time
the script supervisor caught my mistake before anyone else did
the costume weighs more than me
quiet day between shoots. reading in the park
learned a whole new skill for one scene
dialogue coach saved my life today
long lens, small moment, big feeling
the camera team is doing something gorgeous with light
wrapped at midnight, too wired to sleep
the call sheet is my horoscope
grateful for the people behind the camera
watched the dailies and only cringed twice`);
CAT.model=L(`call time 5am. face is still in bed.
fitting number four and we're back to look one
the shoes won. I lost.
the photographer said "don't move" and I sneezed
hair and makeup took three hours, the shot took three seconds
backstage is chaos and I love it
eating a sandwich in a couture gown very carefully
practised the walk in the hotel corridor at midnight
wind machine on. eyes watering. serving.
quiet hotel room after the loudest show
the stylist is a genius and I am just a hanger with opinions
flats in the bag, heels on the feet, pain in the soul
off duty: hoodie, sunglasses, no plans
the camera roll is 90% mirrors this week
three cities in five days, no idea what day it is
the backstage snack table is a lifeline
fittings are a sport and I'm in training
a good photographer makes you braver
tried on a dress that weighs as much as a suitcase
the lighting team made everyone look like a painting
pins everywhere. do not hug me.
sleeping on the plane in full glam
taking the makeup off is the best part of the night
model off duty means pyjamas at 7pm
the shoot was outside in the cold and we pretended it was summer
silly faces between shots. the outtakes are better
grateful for the hair and makeup team
the dress made the walk for me
coffee in one hand, call sheet in the other
the whole team clapped after the last shot
learning to pose with a very confused dog
water, sleep, sunscreen. that's the secret
editorial day: everything is very serious and also very funny
long day of standing very still
packing for fashion week like it's a puzzle
the designer fixed the hem with tape. iconic
bare face, big sunglasses, airport run
first look of the show, heart racing
walked into a fitting and walked out a different person
grateful for every single photographer who pushes me`);
CAT.athlete=L(`5am training. the alarm was rude.
recovery day: ice bath, stretching, no talking
legs are gone. the session was worth it
film study then gym then sleep
the coach said "again" and we went again
game face on
grateful for the team. we do it together
early run before the city wakes up
meal prep sunday, very serious business
the physio is my best friend this week
another rep, another lesson
quiet hotel room, big game tomorrow
travel day: headphones, hoodie, hydration
sore everywhere, happy everywhere
small improvements every single day
the fans tonight were unreal
stretching on the floor of the airport. dignified.
tape on, boots laced, ready
watching footage at midnight looking for one thing
rest is part of the training
the youth camp kids were amazing today
two sessions today. the second one hurt more
protein shake, nap, repeat
the locker room playlist is a democracy
cold tub, warm heart
the hard days make the good ones
thank you to everyone who came out
training in the rain because the schedule said so
discipline is just doing it on the days you don't want to
team dinner, loud and happy
new boots, breaking them in
visualisation session before bed
the coach gave me a nod. that's the whole review
trying a new recovery thing. verdict pending
early night. no excuses.
home crowd energy is something else
learning from every loss
travel, train, rest, compete
the work is the work
grateful for this body and everything it does
locked in`);
CAT.influencer=L(`filmed for three hours, will use forty seconds
the ring light and I are not speaking today
opened the comments, closed the comments
get ready with me, the chaotic edition
my drafts folder needs a lawyer
posted it before I could overthink it
the algorithm and I are currently on a break
the outfit took longer than the video
trying a trend three days late, as usual
iced coffee is part of my personality
thank you for being the best community on the internet
editing until the sun comes up, again
did a q&a and everyone asked about my dog
brand meeting in pyjama bottoms, camera on from the waist up
my camera roll is a crime scene of retakes
storytime coming because something very weird happened
the light was perfect for exactly four minutes
I said "quick video" and lost my whole afternoon
vlog day: everything that could go wrong did, so it's great content
haul coming soon, my bank account is upset
cozy night: face mask, snacks, unread messages
woke up to so many lovely comments, thank you
filmed in three outfits, posted the fourth
reading your comments with a cup of tea
apartment is a set now. there are tripods everywhere
the bloopers are better than the video
answering DMs like it's my full time job
podcast recording, we went off topic immediately
I tested the product so you don't have to
sunday reset: clean room, clean feed
did the dance, fell over, kept it in
the comments section is the real content
taking a little offline day, back tomorrow
packing for a trip with way too many outfits
rewatched my first video and screamed
collab day with my favourite people
the new set-up looks so good, I'm in love
I love you guys, genuinely
honestly just posting because I miss you
the plan today is snacks and silliness`);
CAT.comedian=L(`wrote a joke at 2am. it was funny at 2am.
tested new material tonight. the crowd was generous.
the open mic bus ride home is where the real jokes happen
a heckler gave me a new bit. thank you, sir.
long drive to the gig, notebook on my knee
the bit died, I'm alive
green room coffee is a crime
crowd work tonight was a gift
rewrote the closer six times
the tag got the bigger laugh than the joke
my mum heard the set and had notes
the silence after a joke is a teacher
small club, big laughs, perfect night
filmed a sketch, broke every take
the tour bus smells like crisps and ambition
writing in a café, laughing to myself like a weirdo
a good laugh is the best review
the opening act killed and now I'm nervous
improv night with friends, chaos
I bombed so you don't have to
the joke works in my head, we'll see on stage
late night diner, old comics, best stories
mic stand broke mid-joke, the crowd loved it
dressing room mirror pep talk
I accidentally made a whole bit about my landlord
the audience was so kind tonight
travel delays are just future material
wrote a new bit on the train
the punchline was in the second sentence all along
podcast taping, laughed for two hours
every bad gig is a good story eventually
the room was tiny and it was perfect
the callback landed and I nearly cried
someone's phone went off and became the best part of the show
the set is ten minutes and I've rewritten it a hundred times
grateful for every person who laughs out loud
read the joke to my dog, got no reaction, still doing it
the light at the back means wrap up. I did not wrap up
backstage snack review: the pretzels were mid
see you at the next show`);
CAT.media=L(`Our weekend reading list is up: the stories everyone is talking about.
The newsroom is busy tonight. More as it comes in.
Reporters are checking a few details before anything goes out.
Our photo desk picked its favourite red-carpet frames of the week.
A quiet day in entertainment. We don't trust it.
Fans are asking questions. We're asking better ones.
The editors' picks for this week's must-watch list are live.
Behind the scenes of today's cover shoot: lots of coffee, a little chaos.
Our music team has thoughts. Many thoughts.
Weekend box office talk is heating up in the newsroom.
The style desk is still discussing yesterday's looks.
New interview series coming soon. The guests are very good.
Timeline detectives, we see you. Please wait for confirmation.
Our team is on the ground. Stay tuned.
Every rumour gets checked before it gets a headline.
The archive team found something lovely from years ago.
Our critics disagree. That's the fun part.
Long newsroom night, good stories.
The podcast is back with a very honest conversation.
Our photographers have been everywhere this week.
What we're listening to on the office speaker today.
The culture desk is putting together something special.
We heard you: more behind-the-scenes coverage is coming.
The fashion desk has opinions about sleeves.
A reminder: verified reports only. Speculation stays in the group chat.
The comments under our last post were a whole debate.
The next issue is at the printers. The team is relieved.
Small story today, big conversation tomorrow.
Our list editors are arguing about rankings again.
New video series: celebrities answering very simple questions.
We're watching the timeline so you don't have to.
Interview transcripts are long. The good quotes are worth it.
Our weekend team just got in. Coffee is brewing.
Fact-checking is our love language.
Reader mail today was very kind. Thank you.
The newsroom group chat is unusually quiet. Suspicious.
A new playlist from our music desk is up.
Our style team picked the week's best street looks.
Calm before the next big story.
Thanks for reading, watching and correcting us when we need it.`);
/* ---------- roster at decec6d: id -> display name the lines were written for ---------- */
const ROSTER={"kim":"Kim Kardashian","ariana":"Ariana Grande","taylor":"Taylor Swift","beyonce":"Beyoncé","rihanna":"Rihanna","miley":"Miley Cyrus","gaga":"Lady Gaga","nicki":"Nicki Minaj","cardi":"Cardi B","kylie":"Kylie Jenner","kendall":"Kendall Jenner","khloe":"Khloé Kardashian","kourtney":"Kourtney Kardashian","kris":"Kris Jenner","selena":"Selena Gomez","justin":"Justin Bieber","shawn":"Shawn Mendes","hailey":"Hailey Bieber","billie":"Billie Eilish","sabrina":"Sabrina Carpenter","olivia":"Olivia Rodrigo","dua":"Dua Lipa","doja":"Doja Cat","sza":"SZA","weeknd":"The Weeknd","drake":"Drake","bruno":"Bruno Mars","harry":"Harry Styles","badbunny":"Bad Bunny","jlo":"Jennifer Lopez","shakira":"Shakira","zendaya":"Zendaya","timothee":"Timothée Chalamet","pedro":"Pedro Pascal","sydney":"Sydney Sweeney","margot":"Margot Robbie","jenniferaniston":"Jennifer Aniston","britney":"Britney Spears","charli":"Charli XCX","chappell":"Chappell Roan","tatemcrae":"Tate McRae","scene-rising-01":"Searows","scene-rising-02":"Gia Ford","scene-rising-03":"Hannah Jadagu","scene-rising-04":"Squirrel Flower","scene-rising-05":"Anna B Savage","scene-rising-06":"Katy J Pearson","scene-rising-07":"Lime Garden","scene-rising-08":"English Teacher","scene-rising-09":"Blondshell","scene-rising-10":"Nieve Ella","scene-rising-11":"Matilda Mann","scene-rising-12":"Orla Gartland","scene-rising-13":"Dodie","scene-rising-14":"Lauren Aquilina","scene-rising-15":"Nina Nesbitt","scene-rising-16":"Laurel","scene-rising-17":"Orion Sun","scene-rising-18":"Arlo Parks","scene-rising-19":"Nilüfer Yanya","scene-rising-20":"Bess Atwell","scene-rising-21":"Rachel Chinouriri","scene-rising-22":"Jensen McRae","scene-rising-23":"Maya Hawke","scene-rising-24":"Lola Kirke","scene-rising-25":"Talia Ryder","scene-rising-26":"Lola Tung","scene-rising-27":"Holly Humberstone","scene-rising-28":"Maisie Peters","scene-rising-29":"Griff","scene-rising-30":"Rina Sawayama","scene-rising-31":"FLO","scene-rising-32":"Ravyn Lenae","scene-rising-33":"Amber Mark","scene-rising-34":"Joy Crookes","scene-rising-35":"Celeste","scene-rising-36":"Mahalia","scene-rising-37":"Nao","scene-rising-38":"Tinashe","scene-rising-39":"Victoria Monét","scene-rising-40":"Remi Wolf","scene-rising-41":"Dora Jar","scene-rising-42":"Samia","scene-rising-43":"Lizzy McAlpine","scene-rising-44":"ROLE MODEL","scene-rising-45":"Omar Apollo","scene-rising-46":"Conan Gray","scene-rising-47":"Wallows","scene-rising-48":"Clairo","scene-rising-49":"Beabadoobee","scene-rising-50":"Faye Webster","scene-rising-51":"Ethel Cain","scene-rising-52":"Troye Sivan","scene-rising-53":"Reneé Rapp","scene-rising-54":"Dove Cameron","scene-rising-55":"Sofia Wylie","scene-rising-56":"Sofia Carson","scene-rising-57":"Joshua Bassett","scene-rising-58":"Kit Connor","scene-rising-59":"Joe Locke","scene-rising-60":"Gavin Casalegno","scene-rising-61":"Gigi Hadid","scene-rising-62":"Bella Hadid","scene-rising-63":"Naomi Campbell","scene-rising-64":"Adut Akech","scene-u-angelina":"Angelina Jolie","scene-u-brad":"Brad Pitt","scene-u-aniston":"Jennifer Aniston","scene-u-tomholland":"Tom Holland","scene-u-annehathaway":"Anne Hathaway","scene-u-liamhemsworth":"Liam Hemsworth","scene-u-chrishemsworth":"Chris Hemsworth","scene-u-florencepugh":"Florence Pugh","scene-u-jennaortega":"Jenna Ortega","scene-u-jacobelordi":"Jacob Elordi","scene-u-emmastone":"Emma Stone","scene-u-ryangosling":"Ryan Gosling","scene-u-leonardo":"Leonardo DiCaprio","scene-u-scarlett":"Scarlett Johansson","scene-u-viola":"Viola Davis","scene-u-anya":"Anya Taylor-Joy","scene-u-austinbutler":"Austin Butler","scene-u-paulmescal":"Paul Mescal","scene-u-cillian":"Cillian Murphy","scene-u-lupita":"Lupita Nyong’o","scene-u-jenlaw":"Jennifer Lawrence","scene-u-emmaroberts":"Emma Roberts","scene-u-milliebobby":"Millie Bobby Brown","scene-u-hunter":"Hunter Schafer","scene-u-lilycollins":"Lily Collins","scene-u-tyra":"Tyra Banks","scene-u-cara":"Cara Delevingne","scene-u-irina":"Irina Shayk","scene-u-winnie":"Winnie Harlow","scene-u-emrata":"Emily Ratajkowski","scene-u-karlie":"Karlie Kloss","scene-u-ashleygraham":"Ashley Graham","scene-u-preciouslee":"Precious Lee","scene-u-paloma":"Paloma Elsesser","scene-u-anok":"Anok Yai","scene-u-alexconsani":"Alex Consani","scene-u-ameliagray":"Amelia Gray","scene-u-jourdandunn":"Jourdan Dunn","scene-u-lindaevangelista":"Linda Evangelista","scene-u-cindycrawford":"Cindy Crawford","scene-u-kaia":"Kaia Gerber","scene-u-iman":"Iman","scene-u-mrbeast":"MrBeast","scene-u-khaby":"Khaby Lame","scene-u-charlidamelio":"Charli D’Amelio","scene-u-addisonrae":"Addison Rae","scene-u-emmachamberlain":"Emma Chamberlain","scene-u-loganpaul":"Logan Paul","scene-u-jakepaul":"Jake Paul","scene-u-bretman":"Bretman Rock","scene-u-dixie":"Dixie D’Amelio","scene-u-larray":"Larray","scene-u-drewafualo":"Drew Afualo","scene-u-alixearle":"Alix Earle","scene-u-nara":"Nara Smith","scene-u-wisdom":"Wisdom Kaye","scene-u-jamescharles":"James Charles","scene-u-jacksepticeye":"Jacksepticeye","scene-u-markiplier":"Markiplier","scene-u-ishowspeed":"IShowSpeed","scene-u-ed":"Ed Sheeran","scene-u-postmalone":"Post Malone","scene-u-lana":"Lana Del Rey","scene-u-travisscott":"Travis Scott","scene-u-megan":"Megan Thee Stallion","scene-u-usher":"Usher","scene-u-aliciakeys":"Alicia Keys","scene-u-samsmith":"Sam Smith","scene-u-tyler":"Tyler, the Creator","scene-u-lorde":"Lorde","scene-u-rosalia":"ROSALÍA","scene-u-karolg":"Karol G","scene-u-benson":"Benson Boone","scene-u-gracie":"Gracie Abrams","scene-u-burna":"Burna Boy","scene-u-tems":"Tems","scene-u-tyla":"Tyla","scene-u-peso":"Peso Pluma","scene-u-jungkook":"Jungkook","scene-u-lisa":"LISA"};
/* ---------- engine ---------- */
const STORE_KEY='scene-writer-celeb-posts-v1',VERSION=1;
const norm=s=>String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’'`]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const OWN_N={};for(const k of Object.keys(OWN))OWN_N[norm(k)]=OWN[k];
const SUFFIX_RE=/\s·\s[0-9a-z]{1,4}$/;
let S={v:VERSION,seen:{},cat:{}};
try{const raw=JSON.parse(localStorage.getItem(STORE_KEY)||'null');if(raw&&raw.v===VERSION&&raw.seen&&raw.cat)S=raw}catch{}
let saveTimer=0;
function persist(){try{localStorage.setItem(STORE_KEY,JSON.stringify(S))}catch{}}
function persistSoon(){if(saveTimer)return;saveTimer=setTimeout(()=>{saveTimer=0;persist()},250)}
function rnd(n){return Math.floor(Math.random()*n)}
function categoryOf(a){
 if(!a)return'influencer';if(a.type==='media')return'media';
 const role=String(a.role||'').toLowerCase(),first=role.split('·')[0]||role;
 const test=t=>/comedian|comedy|stand-?up/.test(t)?'comedian':/athlete|boxer|footballer|soccer|basketball|tennis|f1|driver|sprinter|swimmer|gymnast|fighter|wrestler|golfer|cricketer|player/.test(t)?'athlete':/singer|rapper|band|group|songwriter|musician|\bdj\b|producer|vocalist/.test(t)?'musician':/actor|actress|filmmaker|director/.test(t)?'actor':/model/.test(t)?'model':/creator|influencer|streamer|youtuber|personality|host|entrepreneur|beauty/.test(t)?'influencer':'';
 return test(first)||test(role)||test(String(a.bio||'').toLowerCase().slice(0,160))||'influencer';
}
/* PERSONA lines worth keeping alongside ours: hand-written ones (not GENERIC_POSTS, not shared template lines) */
let sharedCache=null;
function sharedLines(){
 if(sharedCache)return sharedCache;const count=new Map();
 try{for(const a of celebs){for(const t of new Set((PERSONA[a.id]?.posts)||[]))count.set(t,(count.get(t)||0)+1)}}catch{}
 sharedCache=new Set([...count].filter(([,n])=>n>1).map(([t])=>t));
 try{for(const g of GENERIC_POSTS)sharedCache.add(g)}catch{}
 return sharedCache;
}
const REAL_PERSONA=new Map();/* filled only while worldPost() runs with stand-in PERSONA entries */
function legacyLines(a){
 let posts=[];try{posts=(REAL_PERSONA.has(a.id)?REAL_PERSONA.get(a.id)?.posts:PERSONA[a.id]?.posts)||[]}catch{}
 const shared=sharedLines();return posts.filter(t=>typeof t==='string'&&t.trim()&&!shared.has(t)&&!SUFFIX_RE.test(t));
}
function ownLinesFor(a){
 if(!a||a.type!=='celeb'||a.custom)return[];
 const rosterName=ROSTER[a.id];
 /* a renamed celeb (celebrity editor) is no longer the person these lines were written for */
 if(rosterName&&norm(rosterName)!==norm(a.name))return[];
 const own=OWN_ID[a.id]||OWN_N[norm(rosterName||a.name)]||[];
 return [...new Set([...own,...legacyLines(a)])];
}
function visibleTexts(authorId){
 const all=new Set(),mine=new Set();
 try{for(const p of (state.posts||[]).slice(0,220)){const t=String(p.text||'');all.add(t);if(p.authorId===authorId)mine.add(t)}}catch{}
 return{all,mine};
}
function touch(list,line,cap){const i=list.indexOf(line);if(i>=0)list.splice(i,1);list.push(line);while(list.length>cap)list.shift()}
function next(a){
 const cat=categoryOf(a),catBank=CAT[cat]||CAT.influencer,own=ownLinesFor(a),key=a?.id||'?';
 const seen=S.seen[key]||(S.seen[key]=[]),catSeen=S.cat[cat]||(S.cat[cat]=[]),vis=visibleTexts(key);
 const freshOwn=own.filter(l=>!seen.includes(l)&&!vis.mine.has(l));
 const freshCat=catBank.filter(l=>!catSeen.includes(l)&&!seen.includes(l)&&!vis.all.has(l));
 let line='',from='own';
 if(freshOwn.length&&(!freshCat.length||Math.random()>.1))line=freshOwn[rnd(freshOwn.length)];
 else if(freshCat.length){line=freshCat[rnd(freshCat.length)];from='cat'}
 else{
  /* everything has been seen: recycle the least-recently-used line (never-used-by-this-celeb first, then oldest),
     skipping anything currently on screen */
  const vis1=l=>own.includes(l)?vis.mine.has(l):vis.all.has(l);
  let pool=[...new Set([...own,...catBank])].filter(l=>!vis1(l));if(!pool.length)pool=[...new Set([...own,...catBank])];
  const age=l=>{const i=seen.indexOf(l);return i<0?-1:i},gage=l=>{const i=catSeen.indexOf(l);return i<0?-1:i};
  pool.sort((x,y)=>age(x)-age(y)||gage(x)-gage(y));line=pool[0];
  from=own.includes(line)?'own':'cat';
 }
 touch(seen,line,own.length+catBank.length);
 if(from==='cat')touch(catSeen,line,catBank.length);
 persistSoon();
 return line;
}
function nextMedia(a){
 let base=[];try{base=MEDIA_LINES||[]}catch{}
 const bank=[...new Set([...base,...CAT.media])],key='media:'+(a?.id||'?'),seen=S.seen[key]||(S.seen[key]=[]),vis=visibleTexts(a?.id);
 const fresh=bank.filter(l=>!seen.includes(l)&&!vis.all.has(l));
 const line=fresh.length?fresh[rnd(fresh.length)]:(seen.find(l=>!vis.all.has(l))||bank[0]);
 touch(seen,line,bank.length);persistSoon();return line;
}

/* ---------- uniqueLine: same contract, but never a suffix — recycle the oldest-used option instead ---------- */
const baseUniqueLine=typeof uniqueLine==='function'?uniqueLine:null;
if(baseUniqueLine){
 try{/* drop ledger entries that only exist because of the old ' · abc' suffix fallback */
  for(const sig of [...USED_NPC_LINES])if(SUFFIX_RE.test(sig))USED_NPC_LINES.delete(sig);
 }catch{}
 uniqueLine=function(key,lines,context=''){
  const options=[...new Set((lines||[]).filter(Boolean).map(String))];
  if(!options.length)return'okay';
  const start=Math.abs(hash(key+context+now()))%options.length,prefix=`${key}|`;
  const store=()=>{if(USED_NPC_LINES.size>1400)USED_NPC_LINES.delete(USED_NPC_LINES.values().next().value);try{localStorage.setItem(UNIQUE_LINES_KEY,JSON.stringify([...USED_NPC_LINES]))}catch{}};
  for(let i=0;i<options.length;i++){const text=options[(start+i)%options.length],sig=prefix+text.toLowerCase();if(!USED_NPC_LINES.has(sig)){USED_NPC_LINES.add(sig);store();return text}}
  const byLow=new Map(options.map(t=>[t.toLowerCase(),t]));let oldest='';
  for(const sig of USED_NPC_LINES){if(sig.startsWith(prefix)&&byLow.has(sig.slice(prefix.length))){oldest=sig;break}}
  const text=oldest?byLow.get(oldest.slice(prefix.length)):options[start],sig=prefix+text.toLowerCase();
  USED_NPC_LINES.delete(sig);USED_NPC_LINES.add(sig);store();return text;
 };
}

/* ---------- feed sources for celeb own-life posts ---------- */
/* living-world-v48's celebPost48 is private to its IIFE, so it cannot be reassigned from outside. It reads
   PERSONA[a.id].posts, so for the duration of one worldPost() call every non-custom celeb gets a stand-in
   PERSONA entry whose `posts` getter hands out ONE picker line (only consumed if that celeb is actually read).
   The real PERSONA entries are put back in `finally`. */
let inWorldPost=false;
function withPickerPersona(fn){
 if(inWorldPost||typeof PERSONA==='undefined'||!Array.isArray(celebs))return fn();
 inWorldPost=true;
 const saved=[];
 for(const a of celebs){
  if(!a||a.type!=='celeb'||a.custom||a.customTopics)continue;
  const had=Object.prototype.hasOwnProperty.call(PERSONA,a.id),prev=PERSONA[a.id];let memo=null;
  const stand=Object.assign(Object.create(null),prev||{});
  Object.defineProperty(stand,'posts',{enumerable:true,configurable:true,get(){if(!memo)memo=[next(a)];return memo}});
  saved.push([a.id,had,prev]);REAL_PERSONA.set(a.id,prev);PERSONA[a.id]=stand;
 }
 try{return fn()}finally{for(const [id,had,prev] of saved){if(had)PERSONA[id]=prev;else delete PERSONA[id]}REAL_PERSONA.clear();inWorldPost=false}
}
/* some v224 modules (e.g. scene-public-character-v225) re-wrap worldPost/mkPost after load; keep ours outermost */
const MARK='__writerCelebPosts';
function wrapMkPost(){
 if(typeof mkPost!=='function'||mkPost[MARK])return;
 const base=mkPost,w=function(a,minutes=0,text='',opts={}){
  if(!text&&a){if(a.type==='celeb'&&!a.custom)text=next(a);else if(a.type==='media')text=nextMedia(a)}
  return base.call(this,a,minutes,text,opts);
 };w[MARK]=true;mkPost=w;
}
function wrapWorldPost(){
 if(typeof worldPost!=='function'||worldPost[MARK])return;
 const base=worldPost,w=function(...args){return withPickerPersona(()=>base.apply(this,args))};w[MARK]=true;worldPost=w;
}
function ensureWrapped(){try{wrapMkPost();wrapWorldPost()}catch{}}
ensureWrapped();setTimeout(ensureWrapped,0);setTimeout(ensureWrapped,1500);setInterval(ensureWrapped,4000);
const baseHistory=typeof historyPosts==='function'?historyPosts:null;
if(baseHistory){
 historyPosts=function(a){
  if(!a||a.type!=='celeb'||a.custom||typeof PERSONA==='undefined')return baseHistory(a);
  const missing=[];for(let i=0;i<8;i++){if(!(state.posts||[]).some(p=>p.id==='hist'+a.id+i))missing.push(i)}
  if(!missing.length)return baseHistory(a);
  const had=Object.prototype.hasOwnProperty.call(PERSONA,a.id),prev=PERSONA[a.id],bank=new Array(8).fill('');
  for(const i of missing)bank[i]=next(a);
  for(let i=0;i<8;i++)if(!bank[i])bank[i]=bank[missing[0]];
  PERSONA[a.id]={...(prev||{}),posts:bank};
  try{return baseHistory(a)}finally{if(had)PERSONA[a.id]=prev;else delete PERSONA[a.id]}
 };
}

/* ---------- clean old ' · abc' suffixes already sitting in a save ---------- */
function cleanSuffixes(){
 let n=0;const fix=o=>{if(o&&typeof o.text==='string'&&SUFFIX_RE.test(o.text)){o.text=o.text.replace(SUFFIX_RE,'');n++}};
 const walk=list=>{for(const c of list||[]){fix(c);walk(c.replies)}};
 try{for(const p of state.posts||[]){fix(p);walk(p.comments)}if(n&&typeof save==='function')save()}catch{}
 return n;
}
sharedLines();/* computed once at load, before any stand-in PERSONA entry exists */
const cleaned=cleanSuffixes();

globalThis.SCENE_WRITER_CELEB_POSTS={
 version:'writer-celeb-posts-1',
 next,nextMedia,categoryOf,ownLinesFor,cleanSuffixes,cleaned,withPickerPersona,ensureWrapped,
 stats(){const ids=(celebs||[]).map(a=>a.id);return{celebs:ids.length,withOwn:(celebs||[]).filter(a=>ownLinesFor(a).length>=6).length,ownLines:Object.values(OWN).reduce((n,l)=>n+l.length,0)+Object.values(OWN_ID).reduce((n,l)=>n+l.length,0),categories:Object.fromEntries(Object.entries(CAT).map(([k,v])=>[k,v.length]))}},
 reset(){S={v:VERSION,seen:{},cat:{}};persist()},
 _store:()=>S,_own:OWN,_cat:CAT
};
})();
