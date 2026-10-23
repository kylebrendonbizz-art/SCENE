/* SCENE writer-comments.js — hand-written, offline comment library + no-repeat picker.
   Base: 52609d4. Load AFTER every v224 script (last entry of v224Scripts in src/main.ts).
   No AI, no network, no paid services. Slots are only filled with facts the game already has:
   {snip} = a short quote of the post text, {author} = the post author's name, {handle} = the player's @handle
   (only on posts by/about the player), {place} = a city literally named in the post, {person} = a celebrity
   (or the player) literally named in the post. Lines whose slot has no real value are skipped, never faked. */
(()=>{
'use strict';
if(globalThis.SCENE_WRITER_COMMENTS)return;
const B={};
/* ---- PHOTO + CAPTION ---- */
B.photocap={
stan:`the caption AND the photo?? pick one to kill me with
“{snip}” with this picture is actually so unfair
okay the caption is cute but i'm staring at the photo
this pairing of caption and picture is elite behaviour
not you posting a photo like this and calling it “{snip}”
i was fine until the caption hit
who wrote this caption because give them a raise
the photo said everything and the caption still showed up to work
my lock screen has been updated thank you for your service
i'm screaming at the caption under THIS
posting this with “{snip}” is genuinely evil
the way the caption makes the photo ten times better`,
casual:`cute pic and the caption is kind of funny
“{snip}” is such a mood for this picture
okay this is a nice one
the lighting in this is really good
good photo, caption made me laugh a little
not me zooming in on the background
this is a very pretty picture honestly
caption fits the photo perfectly lol
this one came out really nice
okay i like the colours in this
“{snip}” is so real
the caption is doing exactly what it needs to`,
skeptic:`the caption and the photo are telling two different stories
“{snip}” does not match the face you're making here
i don't believe this was a candid for a second
this was the fortieth take and we all know it
the caption is way too casual for how posed this is
i feel like the caption was written after the photo got approved
cute but this is clearly a planned post
“{snip}” sure. and the tripod set itself up
the photo is doing the heavy lifting, the caption is coasting
i'm not convinced this caption is about the picture at all
this has been in drafts for a while i can tell
very natural photo said nobody`,
dry:`a photo and a sentence. truly the full package
“{snip}” is one way to caption that
the caption is aggressively unbothered
ah yes, a picture, with words under it
someone was paid to make this look accidental
“{snip}” and then just a face. legendary
caption: low effort. photo: high effort. balance
the photo is carrying the caption like a group project
i respect a caption that refuses to explain itself
the background is working harder than anyone here
this caption has the energy of a closing door
nothing says spontaneous like perfect lighting`,
kind:`this is such a lovely picture of you
you look really happy here and it shows
the caption made me smile honestly
“{snip}” is sweet, the photo is sweeter
this feels very you in the best way
okay you look so good in this
love seeing you post like this
this is a really nice one, hope the day was too
the photo is beautiful and the caption is so you
glad you posted this one
you look comfortable here and that's the best part
such a soft post, i like it`,
chaotic:`“{snip}” I AM ON THE FLOOR
WHY IS THE CAPTION LIKE THAT 😭
THE PHOTO??? THE CAPTION??? I CAN'T DO BOTH
i read the caption out loud on the bus
excuse me ma'am this is a public app
NOT THE CAPTION UNDER THIS PICTURE
i'm screenshotting before anyone deletes anything
my phone almost fell on my face
i saw the photo then i saw the caption and now i'm unwell
who allowed this caption to exist
this post just made me drop my snack
I NEED A MINUTE BEFORE I SCROLL PAST THIS`,
culture:`the caption is underselling the picture on purpose and it works
“{snip}” over a photo like this is a very specific internet voice
this is how you post when you know people screenshot captions
the low-key caption with the high-effort photo is the formula now
captions like “{snip}” always end up quoted somewhere else
the contrast between the image and the words is the whole post
this is the kind of caption people reuse as a reaction
photo-first, caption-second posting is back and i'm glad
the caption gives the picture a whole personality
this is very “post it and let the comments explain it”
casual caption, serious picture, classic move
the caption is basically a wink`,
detective:`zooming in on the reflection rn
“{snip}” and the photo was taken where exactly
the caption is a clue i just don't know to what yet
there is something in the background and i will find it
okay who took this picture though
checking the lighting to figure out what time this was
the caption says one thing but the hand placement says another
that's not the same room as the last post i'm pretty sure
saving this for when the context drops
whose jacket is that on the chair
“{snip}” is too specific to be random
the shadow on the left is somebody and i want to know who`,
industry:`the caption keeps it human while the photo does the brand work
this reads like a post a team had zero notes on
good balance, the caption gives people something to repeat
photos like this travel further when the caption stays short
“{snip}” is an easy caption to quote, that's smart
the edit on this is clean without looking overdone
this is the kind of post that keeps people coming back to the page
whoever is picking these photos has a good eye
the caption makes it feel like a real moment, not a campaign
solid post, nothing in it you'd want to delete later
the framing is doing a lot for the profile`,
lurker:`the caption 😭
okay this one
“{snip}” lol
pretty
saved
oh this is nice
👀
ok the photo
caption got me
cute post
mood
nice one`,
hater:`the caption is trying way too hard
“{snip}” was not the right caption for this
the photo is fine i guess
we're really posting anything now huh
you could've just posted the photo without the caption
this caption is giving notes app at 2am
i've seen this exact post from five other people
the filter is doing a lot of work here
okay and? it's a photo
mid caption, decent photo`,
funny:`the caption is the photo's emotional support animal
“{snip}” is going in my group chat with no context
me pretending to understand the caption so i can keep looking at the photo
the photo was eating and the caption said leave some for me
caption written by the intrusive thoughts
this is what my camera roll wishes it looked like
the photo has a better life than me
“{snip}” is my new answer to every question
i'm putting this caption on a t shirt nobody asked for
caption so casual it should be wearing slippers`,
support:`you look great, ignore anyone saying otherwise
this post made my feed better honestly
love the caption, love the photo, keep posting
we're so lucky you post like this
proud of you for sharing more of yourself
“{snip}” and you look amazing, that's it that's the comment
always happy when you pop up on my feed
this is the energy, keep it coming
more of this please
you deserve to feel this good in every photo`};

/* ---- PHOTO ONLY ---- */
B.photo={
stan:`no caption needed honestly the photo is the caption
okayyy face card never declines
the photo just walked in and fixed my mood
this is going straight in my camera roll
why does this look like a magazine cover
i was not prepared for this on a weekday
the angle the light the everything
you really just posted this with no warning
okay i'm normal about this i promise 😭
the lack of caption is a power move and it worked
this picture has no business being this good
my screen is better because of this`,
casual:`nice photo
okay this is a really good picture
the lighting is so nice here
love this one
where was this taken? looks pretty
this came out so clean
okay the colours are lovely
good pic honestly
this looks like a nice day
the colour grading in this is so good
nice one, no caption needed
this is a cool shot`,
skeptic:`no caption is a choice and i don't trust it
this was definitely shot by a professional
okay but why post with zero context
a photo with nothing under it usually means something's coming
this isn't a random pic, the framing is too good
i don't buy that this is just a casual post
the editing is doing more than people want to admit
posting without a caption so we do the talking, smart
this was planned down to the angle
no caption means they want the comments to write it`,
dry:`a photo. no words. very mysterious
the caption is on vacation
silence, but make it high resolution
i see we're doing the no-caption thing today
this picture is louder than any caption
posted a photo and left the building
the background is minding its business
no caption, just a face and possibly a lawyer
the photo has entered the chat without introducing itself
this is what confidence looks like i assume`,
kind:`you look so happy here
this is such a lovely picture
okay you look really good
glad you shared this one
this photo feels warm somehow
you deserve a day as nice as this photo looks
love this for you
such a nice shot, hope you're doing well
this is really pretty
you look relaxed and it suits you`,
chaotic:`NO CAPTION??? YOU'RE GOING TO DO THIS WITH NO CAPTION??
the photo jumped out at me i fear
I SCREAMED IN A QUIET ROOM
i dropped my phone and it was worth it
the audacity of posting this without warning
ma'am this is a timeline not a museum
somebody hold my hand
why did this photo make me want to move cities
I CANNOT HANDLE IMAGES LIKE THIS ON A TUESDAY OR ANY DAY
i've looked at this too many times already`,
culture:`no-caption posting is a flex that only works with a photo like this
letting the picture speak is very in right now
the silent post always gets the loudest comments
this is the kind of photo people repost with their own caption
no words means everyone projects their own story onto it
captionless photos are basically an open invitation for theories
the composition feels like a deliberate mood shift
this would work as a profile picture or a poster, that's range
the photo says more about the current era than a caption could
posting without explanation is half the appeal now`,
detective:`zooming in on the background like it owes me money
okay where is this. i recognise that window
the reflection in the glass has someone in it i swear
checking the shadows for the time of day
whose hand is that at the edge of the frame
no caption is a clue in itself
that's not the same place as last time
the lighting says golden hour, the outfit says event
saving this and comparing it to the last few posts
who took this. that's the real question
there's a second person in this photo and you can't convince me otherwise`,
industry:`clean shot, this is what a strong feed looks like
whoever's shooting for you is doing a great job
a photo like this does more than a long caption ever would
this is the kind of image that gets picked up and shared
the edit is subtle which is exactly right
good choice not to over-explain it
consistent look across the page, that matters more than people think
this is portfolio material honestly
strong image, easy to remember
this kind of post keeps the page looking intentional`,
lurker:`👀
oh
pretty
wow
saved
okay this
nice
😮‍💨
the photo
hm. yes
ok wow
cute`,
hater:`it's giving filter
the editing is a little much
this is a normal photo, calm down everyone
another selfie, groundbreaking
i don't get the hype here
this is just a picture of a person
the angle is hiding something
okay but what's the point of this post`,
funny:`me looking at this and then at my front camera 💀
the photo has a better skincare routine than me
my phone camera could never, it would just give up
this photo pays rent, my photos ask for a loan
the background has more personality than my whole week
i tried to take a photo like this once and the photo said no
the lighting understood the assignment and graded it too
i showed this to my mirror as a reference
no caption because the photo said “i'll handle it”
this is why my camera roll is mostly screenshots`,
support:`you look amazing, that's the whole comment
always rooting for you, love this
this made my day honestly
keep posting like this, you deserve to feel good
you're glowing here
we love to see you happy
such a great photo of you
more of you on my feed please`};

/* ---- CAMPAIGN / FITTING / SHOOT (replaces the old 5-line group) ---- */
B.campaign={
stan:`the shoot isn't even out and i'm already obsessed
please tell me we get behind the scenes from this
fitting pics are my favourite genre of post
the final images are going to end me i can feel it
on set content is the best content, keep it coming
i need every frame from this day
a shoot day post?? i'm seated
the wardrobe alone is going to be iconic
i'd stand in that call time line with you
if the fitting looks like this the campaign is going to be insane
you on set is exactly where you belong
the second this drops i'm making it my wallpaper`,
casual:`ooh a shoot day, that's exciting
fitting days look so long but so fun
good luck on set today
this looks like a busy day
how long do shoots like this usually take
the clothes rack in the back is everything
hope they fed you on set
can't wait to see the final pics
okay this is a cool day at work
i love seeing the process behind photos
fittings always look so chaotic in a fun way
have fun at the shoot`,
skeptic:`a shoot day post with no details is a teaser and we all know it
they'll say it's “just a fitting” until the announcement
the way nobody is saying what this is for
this is a planned leak if i've ever seen one
behind the scenes posts are just marketing with better lighting
a fitting post means the deal's already signed
i'll believe it's a big campaign when i see the final images
they always show the rack and never the label, interesting
this is too polished to be an accidental bts post
so we're just not going to say who it's for`,
dry:`standing still for hours: the glamorous part
fashion is mostly safety pins and waiting
the garment bag is the real star of this post
a fitting: where clothes go to be pinned aggressively
call time posts always look like a hostage situation
somebody's steaming that outfit like their life depends on it
the chair behind you is off limits, that's the rule
modelling is ninety percent “don't move” and ten percent lunch
the clothes have a better schedule than me
i see the rack. the rack sees me. we understand each other`,
kind:`hope the shoot goes really well today
you look so calm for such a long day
good luck, i'm sure it'll look amazing
make sure you eat something between looks
this is such a fun milestone to see
hope everyone on set is lovely to you
proud of you for booking this
fitting days are long, hope you get to rest after
you look great already and it's just the fitting
hope you're enjoying it and not just surviving it`,
chaotic:`DO NOT SIT DOWN IN THAT OUTFIT
someone guard the garment bag with their life
SHOOT DAY??? WHY WASN'T I INFORMED
i would simply fall over in that call time
THE RACK IN THE BACK IS CALLING MY NAME
if anything creases i'm going to cry for you
put me in the bts video i'll hold the reflector
WHAT ARE WE SHOOTING I NEED TO KNOW
the stylist is going to see this post and panic
i'm stressed and i'm not even on set`,
culture:`fitting posts became their own genre and i'm here for it
showing the process instead of just the final image is the move now
bts content does half the promo work before anything drops
the shoot-day post builds the anticipation the campaign needs
everyone wants the unglamorous side of the glamorous job now
posting the fitting first lets the audience feel early
this is how a rollout starts without announcing anything
the garment bag photo is the new teaser trailer
showing the work makes the final images land harder
people love feeling like they were there before it was public`,
detective:`zooming in on the tags on that rack
okay the photographer's equipment in the corner is a clue
who else is on set, i see an extra pair of shoes
the garment bag has a logo and it's blurred, interesting
checking which studio has those walls
same lighting as a shoot i saw last month, hmm
there's a call sheet on the table and i'm squinting
whose assistant is that in the reflection
the rack has at least three looks, so it's a big one
the timing of this post lines up with something, i'm sure of it`,
industry:`fittings are where the real work happens, good to see
a smooth fitting usually means a smooth shoot
the team behind this clearly prepped well
this kind of booking leads to the next one if it goes right
wardrobe continuity on a shoot like this is no joke
being easy to work with on set gets you rebooked, simple as
the bts content is a nice bonus for whoever booked this
long shoot days are where reputations get built
this is a real job with real hours and it shows
whoever is styling you knows what they're doing`,
lurker:`shoot day 👀
the rack
ooh
fitting pics
bts pls
on set!!
good luck
the garment bag
👀👀
ok work
nice
camera ready`,
hater:`a photoshoot. wow. never been done
we get it, you have a job
it's just a fitting, why the announcement
everyone's a model now apparently
another bts post, groundbreaking
can't wait to forget this campaign
the outfit on the rack looks better than the final will`,
funny:`me at my fitting: standing in a changing room questioning everything
the safety pins holding this outfit together deserve credit
i'd last ten minutes before sitting on something i shouldn't
my version of a fitting is trying on my one good jacket
the reflector holder is the real mvp
i would sneeze on the white outfit immediately
being told “don't move” for six hours would break me
the snacks on set better be elite for this call time
imagine being the steamer, working the hardest and getting no credit`,
support:`this is huge and you earned every bit of it
you deserve every booking you get
can't wait to see you shine in this
you're going to kill it today
this is your era and we're here for it
rooting for you on set today
you belong in rooms like this
the final pictures are going to be stunning, no doubt`};

/* ---- CAREER / BRAND / MEETING / JOB ---- */
B.career={
stan:`booked and busy and we love to see it
okay the career glow up is real
i need to know everything about this
this is the start of something i can feel it
the way you're just quietly winning
somebody's having a good year
i'm so excited for whatever this turns into
you making moves is my favourite storyline
remember us when you're huge
the work is working
this is the news i was refreshing for
i've been saying this would happen`,
casual:`congrats on the work stuff
that sounds exciting
good luck with it
okay nice, sounds like a good day
hope it goes well
that's cool honestly
nice, work is moving
oh this sounds like a big deal
good for you
nice to see things picking up
love a productive day
sounds fun actually`,
skeptic:`“opportunity” is doing a lot of work in this sentence
i'll wait for the actual announcement
this is either huge or nothing, no in between
everyone posts like this before it falls through
vague career posts are my least favourite genre
so what's the job though
there's no way this isn't a teaser
i've seen this kind of post before, they're never what we think
until it's confirmed it's a meeting
okay but is it actually signed`,
dry:`a meeting occurred. the internet is in shambles
the calendar is filling up, alert the press
someone has emails to answer
“work” is such a mysterious word when celebrities use it
employment, but make it cryptic
the inbox must be terrifying right now
productivity has been achieved
we're all very proud of this unnamed thing
nothing says career like a vague sentence
a job, somewhere, apparently`,
kind:`so happy things are moving for you
you've worked hard, this is deserved
hope this turns into everything you want
congrats, that's really exciting
good luck, you've got this
love seeing you get the opportunities
hope the people you work with are good to you
take care of yourself in the busy part too
this is such a good step
rooting for this to go well`,
chaotic:`BOOKED??? BUSY??? MULTIPLYING???
WHAT IS THE JOB I NEED TO KNOW
okay i'm stressed for you and also so happy
you can't post this and not tell us more
somebody give this person a raise immediately
I'M LOSING MY MIND OVER A VAGUE CAREER POST
the way i screamed at work
they're moving and i'm not ready
SECRET PROJECT ALERT
i will riot if this isn't announced soon`,
culture:`small career moments always look bigger in hindsight
this is the part of the story nobody notices until later
vague work posts are how rollouts start now
people care more about the climb than the destination these days
this is the before part of a before-and-after
sharing the process instead of the result is the new normal
quiet progress posts always age well
everyone wants to be early to someone's rise
this is how a name starts showing up in more places
work posts like this make the later announcement hit harder`,
detective:`whose office is that in the background
okay who was in that meeting though
the timing of this lines up with something
there's a badge on the desk and i'm squinting
noting this one for when the announcement drops
same building as a post from someone else last week, interesting
the calendar behind you is blurry on purpose
who else posted about a meeting today
there's a reason this is vague and i'll find it
saving the screenshot, this will matter later`,
industry:`the room you're in matters more than the headline right now
this is how a team decides whether to keep investing
repeat bookings tell you more than one big moment
the meeting is the job before the job
the people who saw this are more important than the post itself
good sign when the opportunities start coming to you
this is the kind of step that compounds
keep the circle small and the work consistent
a clean career post that doesn't overshare, smart
deals take forever, glad something's moving`,
lurker:`work 👀
ooh
nice
big moves
👀
congrats
okay career
busy busy
!!
oh nice
we love work
ok!!`,
hater:`a meeting isn't a career
so we're celebrating emails now
everyone has a job, relax
this could have been a private text
vague posting about work is so annoying
i'll care when there's something to see
call me when it's real`,
funny:`me announcing i replied to one email
my career news is that i found a pen
the way i'd post this after answering a single phone call
my linkedin could never be this mysterious
the calendar is fuller than my fridge
somewhere a publicist just said “don't post that” too late
i also had a meeting today. it was with my bed
i want a job where i can post vague sentences and get paid`,
support:`this is just the start and i'm calling it now
you deserve every door that opens
keep going, it's working
we see the work and we're proud
this is your moment, enjoy it
rooting for you every step of the way
you've earned this, don't let anyone say otherwise
can't wait to see where this takes you`};
/* ---- MUSIC ---- */
B.music={
stan:`DROP IT. that's the comment
i'm already seated for whatever this is
if this is a snippet tease i'm going to need the full song
the studio posts are always the calm before the storm
my playlist has a gap that only this song can fill
i haven't even heard it and it's my song of the year
the vocals are going to be insane i just know
please let this be the era
studio you is my favourite you
i'll stream it on every device i own
not the music hint while i'm at work
i need this song in my ears immediately`,
casual:`ooh new music?
can't wait to hear it
sounds like a fun session
hope it turns out good
i'd listen to this
okay what kind of song is it
studio days look so cozy
music post, love that
looking forward to this
hope the session went well
nice, been wanting new stuff
ooh what genre are we going for`,
skeptic:`musicians post like this for months before anything drops
“working on music” could mean literally anything
i'll believe it's coming when there's a date
the studio photo is the oldest tease in the book
we've been here before, no song for ages
count of “music soon” hints so far: three
okay but is it actually finished
a mic in the photo doesn't mean a release
call me when it's on streaming
not getting excited until there's a cover`,
dry:`a studio has been entered. the timeline braces
songs are never finished, just temporarily abandoned
music is coming. eventually. allegedly
the mixing board is doing all the talking
another session, another “almost done”
the producer is tired and i can sense it
one chord was played and the fans mobilised
hearing about a song is my favourite way to not hear a song
the headphones in this pic have seen things
the studio lighting is a mood, the release date isn't`,
kind:`hope you're enjoying making it
take all the time you need with it
can't wait to hear what you've been working on
music people deserve sleep too, rest up
excited for you, this sounds special
hope it's something you're really proud of
love that you're making things you care about
the studio looks like a happy place for you
wishing the session goes smoothly
whatever it sounds like, i'm proud of you`,
chaotic:`SONG???? WHERE???? WHEN????
if this is a tease i'm suing emotionally
I NEED TEN SECONDS OF IT PLEASE
i'm going to listen on repeat until my neighbours move
the bridge better be insane
GIVE ME THE SNIPPET OR GIVE ME DEATH
the studio light is making me crazy
i'm about to start manifesting a release
I HAVE BEEN WAITING MY WHOLE LIFE FOR THIS (since this morning)
LET ME IN THE STUDIO I'LL BE QUIET`,
culture:`the studio post is basically the first single now
music fans will turn one photo into a rollout theory
the era starts the moment someone posts a mic
people want the process now, not just the release
teasing the session builds more hype than a surprise drop
everyone's going to map this onto a whole storyline
the music conversation moves faster than the music
sharing the work in progress makes the release feel shared
this is how you get people invested before a single note
a quiet studio post always gets louder over time`,
detective:`checking the screen behind you for a track name
who else is in that studio though
there's a second pair of headphones on the desk
the lyric sheet is blurry but i'm trying
that's a different studio from last time i think
the waveform on screen looks long, maybe a full song
someone's shadow is on the wall, a collaborator?
zooming in on the session file name
the timestamp on this post is suspicious
i need the credits the second this drops`,
industry:`the collaborators matter more than the caption here
studio time is expensive, so this is serious
the credits will tell the real story
a consistent studio presence is a good sign
how this gets rolled out matters as much as the song
the right feature could change everything
watch who shows up in the credits
studio sessions are where careers quietly change
a good demo opens rooms a press release can't
this is the boring part that makes the exciting part possible`,
lurker:`song?
👀
music!!
ooh
studio
drop it
🎧
soon?
okay music
the session 👀
yes
listening`,
hater:`another studio photo, no song
we need music not mic pictures
i'll believe it when it charts
the last thing wasn't that good tbh
studio posts are the new “coming soon”
okay but can they actually sing
nobody asked for a teaser`,
funny:`me in the shower thinking i'm also in a studio
the mixing board has more buttons than my brain has thoughts
studio pics are just people staring at screens dramatically
i also make music. it's called humming in the kitchen
producer said “one more take” and that was the last we heard of them
the headphones are worth more than my car
i need studio lighting in my bedroom so i can be mysterious
the snack wrappers on the desk are the real bts`,
support:`can't wait to hear your voice on this
you've grown so much as an artist
whatever you make, we're here for it
we'll be streaming the second it's out
the hours you put into the music show in every note
your music always gets me through things
you deserve all the ears on this
keep making what you love`};

/* ---- ROMANCE / SOFT LAUNCH ---- */
B.romance={
stan:`a SOFT LAUNCH?? i'm not breathing
i'll protect this relationship with my life
whoever this is, they're lucky
okay this is the cutest thing on my feed
you look so happy and that's what matters
i'm emotionally invested in someone i can't even see
the way i gasped
my heart can't take this before lunch
please be happy forever
not me crying over a hand in a photo
this is the content i signed up for
i ship it and i don't even know who it is`,
casual:`aww cute
okay this is sweet
someone's in love lol
ooh who's that
cute pic of you two
this is adorable
young love, very cute
nice to see you happy
okay i'm a little jealous
love this for you
sweet post
aww this made me smile`,
skeptic:`soft launches are just PR with a filter
i'll believe it when they post a face
this is definitely for attention
how convenient that this is right before a release
we've seen this exact soft launch three times before
not believing anything without a full photo
they always hard launch right after a project
a hand isn't a relationship
everyone's dating someone when there's something to promote
this is a stunt and i'll say it`,
dry:`a hand has been posted. the internet is in crisis
love is in the air and so are the theories
a mysterious elbow, truly romantic
soft launch: the art of showing nothing on purpose
so we're doing romance now, okay
the investigation unit has been deployed
this will be the topic of my group chat until further notice
someone is going to zoom in on that ring finger
nothing says love like a cropped photo
two coffee cups. the evidence is overwhelming`,
kind:`you look so happy, i'm glad
love is a beautiful thing, enjoy it
hope they treat you right
this is so sweet, congrats
being happy looks good on you
i love this for you two
wishing you both the best
you deserve someone who makes you smile like this
cherish it, this is lovely
so happy for you honestly`,
chaotic:`WHO IS THAT. WHO IS THE HAND
I SCREAMED IN PUBLIC
SOFT LAUNCH??? I'M CALLING EVERYONE I KNOW
the hand in the corner has ruined my life
i'm planning the wedding already sorry
NOT A SECOND COFFEE CUP 😭
i'm investigating, i'm crying, i'm happy
someone get this person a lawyer and a bouquet
I NEED A NAME AND A STAR SIGN
the soft launch has hard launched my anxiety`,
culture:`the soft launch is basically a cultural ritual now
everyone knows a cropped photo is a statement
privacy and teasing at the same time is the modern way
this is how relationships go public now, piece by piece
people will build a whole timeline off this one photo
the internet loves a mystery more than an answer
this is the first chapter people will quote later
romance posts always take over the comment section
the hint is the point, not the reveal
this will be dissected more than any announcement`,
detective:`zooming in on the watch on that wrist
whose jacket is that, i've seen it before
the reflection in the window has a face, i'm sure
checking who else posted from the same place
the hand has a ring and i'm taking notes
the second plate on the table says everything
same background as someone else's story, i swear
time to compare tattoos across the entire internet
the timing lines up with something, i'm on it
okay who has a jacket in that exact colour`,
industry:`keeping a relationship private is smart for longevity
how you handle this publicly matters a lot
some people go public too fast and regret it
the soft launch protects both people, good move
relationships change how the public sees you, carefully does it
every couple post becomes part of the brand
staying vague is the right call here
it's smart to let people be happy without explaining
the public will want more, you don't owe it
good to keep the focus on your life, not the speculation`,
lurker:`👀👀
who
aww
ooh
cute
the hand
🤭
oh??
love
soft launch?
hmm 👀
sweet`,
hater:`nobody cares who you're dating
this is so cringe
we did not need this
another soft launch, how original
give it a month
posting this for attention, obviously
the relationship is the release promo`,
funny:`me soft launching my pillow
the only thing i'm soft launching is a nap
i also have a hand. where's my soft launch
my love life is a loading screen
the second cup of coffee is carrying this post
me zooming in like i'm a forensic scientist
i'm soft launching my new phone case later
this is the only relationship i'll be in this year (as a viewer)`,
support:`you deserve all the love in the world
so happy you found someone
protect your peace, we're happy for you
love looks good on you
wishing you nothing but happiness
we support you no matter what
this makes me so happy for you
you're glowing and it's beautiful`};

/* ---- TRAVEL ---- */
B.travel={
stan:`travel content is my favourite content
please post everything from this trip
{place} has never looked better
okay i'm living through your camera roll now
the airport fit is going to be iconic
safe travels, but also post more
i'd follow you to {place} honestly
you in {place} is a whole new era
if there's no photo dump after this i riot
travelling looks so good on you
okay jealous but happy for you
the view is unreal`,
casual:`have a good trip
ooh where are you going
safe travels
okay jealous lol
looks like a nice trip
{place} is so pretty
enjoy the trip
travel day, nice
hope the flight was easy
looks fun, enjoy
nice, where are you staying
okay this looks relaxing`,
skeptic:`work trip disguised as a vacation
{place} out of nowhere? something's up
they never travel just for fun
the timing of this trip is very convenient
there's a reason they're in {place} and it's not tourism
okay but who else is there
travel posts usually mean an announcement
a random airport post never means nothing
they're definitely meeting someone there
this is a business trip, i'll stake my reputation on it`,
dry:`a plane has been boarded. history in the making
the airport lounge is doing a lot of work here
travel, but make it content
{place} has entered the chat
jet lag is about to be very real
the suitcase has seen more than any of us
an airport selfie, peak culture
the departure board in the background is the real star
someone's inbox is going unanswered for a week
going somewhere. vaguely`,
kind:`have the best time
safe travels, look after yourself
hope you get some rest while you're away
enjoy {place}, it's beautiful
hope this trip is everything you need
take lots of photos and enjoy it
travel safe and have fun
hope the jet lag is kind to you
you deserve a trip like this
enjoy every second of it`,
chaotic:`{place}??? TAKE ME WITH YOU
I'M PACKING MY BAG RIGHT NOW
THE AIRPORT??? WHERE ARE YOU GOING???
i'm hiding in your suitcase, don't check
if you don't post the view i'm emailing someone
the departure board is speaking to me
i'm booking a flight with money i don't have
WHY AM I NOT IN {place} RIGHT NOW
travel posts make me want to quit everything
somebody hold my passport before i do something`,
culture:`travel posts are basically the new magazine spread
everyone wants the trip without the work trip parts
location changes the whole story around someone
posting from {place} puts you in a different conversation
the airport has become a runway for celebrities
travel content does a lot of quiet work for a profile
people love a glimpse of how others travel
the trip post sets the tone for the next few weeks
moving between cities is part of the image now
showing the destination makes it feel like a chapter`,
detective:`checking the flight board in the background
who else landed in {place} today though
that's not the usual terminal, interesting
the luggage tag is turned around on purpose
the hotel window gives away the area, i'm looking
who else posted from {place} this week
the reflection in the window has a second person
same airport, same day as someone else? hmm
the boarding pass is blurred but the gate isn't
noting the location and waiting`,
industry:`work travel usually means the calendar is expanding
a new city is a new audience
being seen in {place} matters for the bigger picture
travel can open doors that staying home can't
this kind of trip usually comes before something
new markets mean new rooms and new people
the press in {place} is a different world
being on the move is a good sign career-wise
a smart trip can change the next few months
showing up in person still matters a lot`,
lurker:`✈️
where to?
ooh
nice
{place} 👀
safe travels
travel!!
the view
jealous
pretty
okay trip
👀`,
hater:`must be nice to travel all the time
we get it, you're travelling
another airport selfie
some of us have to work
nobody asked where you are
the travel content is getting repetitive`,
funny:`me travelling to my kitchen for snacks
my passport is crying in a drawer
the closest i'll get to {place} is this post
my airport experience is losing my headphones at security
i'm going on a trip too. to the shops
the suitcase is more cultured than me
i'd miss my flight just by being in the wrong terminal
jet lag but make it emotional`,
support:`you deserve this break
enjoy every moment, you've earned it
so happy to see you travelling and happy
look after yourself out there
can't wait to see the pictures
you look so happy, it's lovely
have fun, we'll be here when you're back
travelling looks great on you`};

/* ---- SAD / TIRED / VULNERABLE ---- */
B.sad={
stan:`we're not going anywhere, ever
please look after yourself, we need you
sending all the love i have
you don't have to be okay all the time
whatever it is, we're with you
take the time you need, we'll wait
it's okay to have hard days
i hope tomorrow is softer for you
you mean so much to so many people
we're not going anywhere
rest is allowed, take it
holding you in my heart today`,
casual:`hope you're okay
sending a cup of tea through the screen
take care of yourself
rough days happen, hope it gets better
hang in there
feel better soon
hope you can get some rest
that sounds hard, sorry
here if you need anything
hope the week gets easier
look after yourself
sending a hug`,
skeptic:`i hope this is real and not a sad post for engagement
genuinely asking, is everything actually okay
these posts worry me because no one ever says what's wrong
i hope the people around them are actually checking in
vague sad posts always make the comments speculate
i hope this isn't a sign of something bigger
people should give them space, not theories
i just hope someone close to them sees this
it's okay to not share, but i hope they're supported
the internet turns everything into a story, let them be`,
dry:`some days are like this and that's fine
the week has been very long for everyone it seems
being a person is a lot sometimes
the tired is real and so is the comment section's concern
honestly, relatable
the universe owes you a good day
a rough day, posted. hope it helps
everyone's a little tired lately
soup and bed. that's my advice
life is a lot. it's okay`,
kind:`you're allowed to rest
hope you have someone to talk to today
sending you so much warmth
it's okay to not be okay
be gentle with yourself
i hope you find a bit of peace tonight
you deserve kindness, especially from yourself
hoping you feel lighter soon
take a breath, it's okay
you're not alone in feeling this`,
chaotic:`i'm sending you a virtual soup
someone hug this person immediately
WHO HURT YOU I JUST WANT TO TALK
i'm ready to fight your bad day
i'm putting you in my prayers and my group chat
i'll send a meme to fix this
everyone be nice to them today or else
i'm wrapping you in a blanket through the screen
giving you my emotional support snack
this post made me want to call my mum`,
culture:`it's good seeing people be honest about bad days
the internet is kinder when people are real
vulnerable posts remind everyone there's a person behind the account
it's refreshing to see someone not pretend everything's perfect
being honest about hard days helps more people than you think
these posts always bring out the best in a comment section
real feelings online are rare, this matters
the pressure to always post wins is exhausting
seeing someone admit they're tired is weirdly comforting
this is why people feel connected to them`,
detective:`i hope whatever it is gets sorted
not investigating this one, just sending love
okay i won't ask, just hope you're alright
whatever's going on, take care
sometimes things don't need explaining
i'll keep my theories to myself on this one
just checking in, nothing more
hoping it's just a long day and nothing more
take your time before you share anything
no questions asked, ever`,
industry:`a break is never a setback
it's okay to step back for a bit
the work will still be there when you're ready
burnout is real, rest is part of the job
no career is worth losing yourself
the people that matter will understand a pause
protecting your energy is smart
the schedule can wait, your health can't
take the time, it pays off later
everyone in this business needs a reset sometimes`,
lurker:`🤍
hugs
take care
❤️
sending love
rest
still following, still rooting
okay 🤍
hope you're good
feel better
💛
hang in there`,
funny:`not to make this about me but same
i'm sending you the energy of a fresh pillow
my emotional support playlist is available upon request
just know my day was also weird if that helps
i'd bring you snacks if i could
recommending one nap and zero emails`,
support:`we love you, take care of yourself
you're doing better than you think
proud of you for sharing this
this page will always have your back
you're not alone in this
take care, you matter so much
sending strength your way
we've got your back, always`};
/* ---- HAPPY / WIN ---- */
B.happy={
stan:`WE WON. i say we because i'm emotionally involved
this is the best news on my timeline all week
crying happy tears at my desk
you deserve every good thing coming your way
the good news era has officially started
i could burst, honestly
told everyone this would happen
the happiness in this post is contagious
this is the energy we needed
okay i'm celebrating for you tonight
it's your time and i'm so glad
winning looks so good on you`,
casual:`congrats, that's awesome
love this energy
glad you're having a good day
nice, happy for you
okay this is lovely news
this made me smile
congrats honestly
only nice things in these comments, please
love to see it
that's so great
good news is the best news
yay for you`,
skeptic:`happy for them but what exactly happened
good news is great, i'd love the details
this is either huge or a tease
okay but what are we celebrating exactly
love the energy, need more info
when the details come out i'll be more excited
i'll be happy once i know what this is
something good happened and nobody's saying what
excited but cautious
vague happy posts are still vague`,
dry:`a good day has been achieved. noted in the history books
happiness detected on the timeline, rare sighting
someone's winning and i'm just watching
good things happen sometimes, apparently
joy, but make it a post
the serotonin is radiating off my screen
we love a rare win in this economy
one good day posted, the rest of us carry on
victory has been declared. details unknown
this is what success looks like from my sofa`,
kind:`so so happy for you
you deserve this, truly
love seeing you this happy
this is wonderful, congratulations
enjoy every bit of this moment
the joy in this is lovely
you've earned this, celebrate it
this made my day better too
wishing you more days like this
so glad things are going well`,
chaotic:`I'M SCREAMING FOR YOU
WE'RE SO BACK
throwing confetti in my kitchen
I JUST JUMPED OFF MY BED
somebody pop the champagne i'll bring cups
THIS IS THE BEST DAY OF MY LIFE AND I'M NOT EVEN INVOLVED
i'm doing a happy dance in public
I KNEW IT I KNEW IT I KNEW IT
someone give this person a parade
i'm crying, i'm screaming, i'm proud`,
culture:`good news posts land differently when you've watched the climb
people love a win they feel part of
a win shared openly gets everyone rooting louder
this is the kind of moment people screenshot and remember
the internet needs more genuine joy honestly
celebrating out loud is part of the story now
wins like this change how people talk about someone
the comments are the best part of a good news post
seeing someone happy without irony is refreshing
this is a turning point people will reference later`,
detective:`okay what's the win though, i'm taking notes
something happened and i'm going to find out what
the timing of this happy post is interesting
happy post right after a quiet week, noted
whatever it is, it's big enough to post about
who else is celebrating today, i'm connecting dots
the smile says it's more than a good day
saving this for when the announcement drops
this is the reaction before the reveal, i can tell
i'm checking every account for the matching post`,
industry:`wins like this build momentum
this is how good years start
a public win changes how people approach you
celebrate it, then keep the pace
good news compounds when you keep showing up
success after hard work always lands better
this is the result of a lot of unseen effort
the people watching will remember this moment
momentum like this is worth protecting
this is a strong signal for what's next`,
lurker:`yay
🎉
congrats
!!!
yes!!
love this
ooh
happy for you
wow
🥳
nice!!
yesss`,
hater:`okay we get it you won
good for you i guess
the bragging is a lot
we'll see how long this lasts
a little humility wouldn't hurt
cool. anyway`,
funny:`me celebrating finding two matching socks
my wins are mostly remembering my password
i'm going to steal this energy for my monday
the joy is so loud i can hear it through my phone
i'm happy for you in the way i'm happy for a dog i see on the street
this is the most excited i've been about someone else's day`,
support:`you deserve every bit of this happiness
watching you get here has been the best part of this app
this is only the beginning
you worked so hard for this
nobody deserves it more
enjoy it, you earned it
cheering for you always
this is your moment, soak it in`};

/* ---- MONEY / FLEX ---- */
B.money={
stan:`the economy could never touch you
okay rich and famous era unlocked
the flex is so casual i love it
you deserve nice things
spend it all, you earned it
okay financially iconic
this is what success looks like
the money is working, so are you
we love a well-dressed bank account
treat yourself, always
i'd let you manage my money honestly
the flex game is strong today`,
casual:`nice, treat yourself
ooh that's fancy
okay must be nice lol
that looks expensive
good for you honestly
fancy fancy
nice buy
enjoy it
okay i'm jealous
love a little treat
that looks fun
spend wisely lol`,
skeptic:`is this a sponsored post or a real purchase
not everyone can afford this, read the room
flexing is a choice
i bet this was gifted
okay but who's actually paying
money posts never age well
this is a lot to post publicly
probably a brand deal in disguise
i'd love to know the real story behind this
the receipts would tell a different story`,
dry:`a purchase has been made. the economy trembles
capitalism, but aesthetic
the bank account has spoken
somewhere a financial advisor is sighing
money: spent. mood: immaculate
this is how the other half lives
my wallet felt that through the screen
i see the price tag in my mind
a flex, delivered with confidence
spending money is a hobby now and i respect it`,
kind:`you deserve to enjoy what you've worked for
glad you're treating yourself
enjoy it, you earned it
nice to see you doing well
hope this brings you joy
you work hard, enjoy the rewards
looks lovely, enjoy
glad things are going well for you
treat yourself more often
this is lovely, enjoy every bit`,
chaotic:`THE MONEY???? THE FLEX????
i'm checking my bank account in shame
SOMEONE TAKE MY CARD AWAY BEFORE I COPY THIS
i'd sell my car to live like this for a day
the flex has entered my bloodstream
I'M BROKE AND INSPIRED
how do i become your accountant
I'M SCREAMING AT THE RECEIPT IN MY MIND
spend some on me i'm right here
this post just cost me money somehow`,
culture:`money posts are tricky, the internet has opinions
flexing has become its own genre online
people love aspirational posts until they don't
showing wealth is always a conversation starter
luxury content is getting more casual and more common
the way people react to money says a lot about them
this kind of post divides a comment section fast
aspirational posting is still the backbone of the internet
celebrity money posts always spark a debate
the casual flex is the most powerful kind`,
detective:`zooming in on the bag in the corner
checking the shop name on the receipt
okay but where was this bought
that's not the first expensive thing this week, noted
the store bag has a logo and i'm trying to read it
something tells me this was a gift
the background is a hotel, i'm sure of it
who else bought the same thing, hmm
there's a price tag sticking out and i see it
this purchase lines up with a deal i suspect`,
industry:`spending visibly is a statement about status
money posts can change public perception quickly
careful with flex posts, they can come back around
good to invest in yourself
smart spending is part of building a brand
a luxury moment can help or hurt depending on timing
the audience responds to authenticity more than flex
financial success should be enjoyed, just carefully
this kind of post works if it feels genuine
money posts are a strategy whether people admit it or not`,
lurker:`💰
ooh
fancy
nice
wow
👀
okay rich
must be nice
💸
the flex
treat yourself
ok wow`,
hater:`okay we get it you have money
nobody needed to see this
the flex is so tacky
read the room please
money can't buy taste
another rich person flex, yawn
we're in a cost of living crisis`,
funny:`me flexing my last meal deal
my bank account just sent me a crying emoji
my version of a flex is free parking
i can't even afford to look at this post
i'm going to frame this and call it a savings goal
my wallet saw this and left the chat
this purchase has more value than my whole wardrobe
i'll be flexing a slightly nicer coffee tomorrow`,
support:`you deserve every good thing you buy
enjoy the fruits of your hard work
we love seeing you thrive
treat yourself always, you deserve it
your success is so deserved
glad things are going so well
enjoy it all, you earned every bit
nothing but happiness for you`};

/* ---- FASHION ---- */
B.fashion={
stan:`THE LOOK. that's it that's the comment
the outfit is ending careers
stylist deserves a raise and a holiday
you could wear a bin bag and still eat
the fit check i didn't know i needed
this outfit is going in my mood board forever
okay best dressed, no discussion
the way this outfit fits is unreal
fashion week could never
i'd wear this every day if i could pull it off
you understood the assignment and wrote the textbook
this look is iconic already`,
casual:`love the outfit
okay this look is nice
cute fit
the colour suits you
where's that from?
nice style
okay the shoes
love this look on you
good outfit choice
looks comfy and cute
this is a great fit
nice combo`,
skeptic:`this outfit is definitely gifted
stylists choose everything, let's be honest
the fit is fine, the hype is a lot
okay but would you wear this in real life
this looks like an ad without the label
pretty sure this is a brand deal
the fashion is good, the posing is too much
a nice look but nothing new
cute, but i've seen this trend everywhere
this was picked by a team, not a person`,
dry:`clothes: worn. discourse: activated
the stylist has entered the chat
an outfit has been posted, fashion week is cancelled
somebody tailored this and i hope they're thanked
the shoes are doing more work than i do
this outfit has a more interesting life than me
fashion, but make it a moment
the fabric is working harder than the caption
the outfit has opinions
okay, a look. a definite look`,
kind:`you look amazing in this
this colour is lovely on you
such a beautiful look
you always dress so well
this outfit suits you perfectly
you look so confident and it shows
love your style so much
okay you look stunning
this is such a nice look
you wear it well`,
chaotic:`THE OUTFIT??? I'M CALLING THE POLICE
i would simply die in that look
I'M STEALING THIS ENTIRE FIT
the shoes just kicked me in the heart
somebody call fashion week, they're late
I'M SHAKING AT THE SILHOUETTE
the outfit has rearranged my brain
give me the jacket or give me nothing
THE ACCESSORIES ARE SPEAKING TO ME
i'm going to dress like this to buy milk`,
culture:`fashion is half the conversation now
one good look can introduce someone to a new crowd
styling choices like this end up on mood boards everywhere
this look is going to be referenced for a while
fashion posts move faster than any other content
the outfit says more than a caption could
a strong look shifts how people see you
fashion people are definitely saving this one
this feels very of the moment
the styling is part of the storytelling now`,
detective:`zooming in on the tag on the collar
who's the designer though, i need it
okay i've seen that jacket somewhere before
the shoes are from a collection i'm trying to place
checking every fashion account for this look
the stylist's handwriting is all over this fit
whose closet did this come from
the bag in the corner is a clue
okay is this vintage or new, i'm investigating
somebody tag the stylist please`,
industry:`fashion can be the fastest route into a new audience
stylist relationships matter more than people think
a strong look gets you noticed by the right people
consistency in style builds an image
this is how you get on best dressed lists
a good fit opens fashion doors
the styling is very intentional and it works
one good outfit can change the conversation
fashion moments travel further than most posts
this look could start a partnership`,
lurker:`the fit
👀
okay look
cute
the shoes!!
wow
stylish
ok the outfit
nice
fashion 👀
✨
yes`,
hater:`the outfit is a no from me
who styled this
this look isn't it
fashion has fallen
it's giving costume
the fit is confusing
nobody asked for this trend to come back`,
funny:`me in my hoodie looking at this like a museum piece
my outfit today was whatever was on the chair
the shoes alone are worth more than my rent
i'd trip in those within one step
my stylist is my mum and she says no
i tried to dress like this once and my mirror filed a complaint
the outfit has better confidence than i do
the fit is serving and i'm still in pyjamas`,
support:`you look incredible, always
your style is everything
nobody wears it like you
you're glowing in this
this look is so you
best dressed always
the confidence is unmatched
keep serving looks like this`};

/* ---- DRAMA ---- */
B.drama={
stan:`we stand by you no matter what
the haters will never win
i'm not saying anything, i'm just here supporting
whatever happened, you're right
protect them at all costs
the comment section is not ready for this
the timeline is shaking
i'm ready to defend you on every platform
okay i'm loyal till the end
they're not saying names but we know
i've got popcorn and a lawyer
this is getting good`,
casual:`oh no what's going on
okay this is messy
wait what happened
hope it gets sorted
oof
this sounds intense
hope everyone's okay
the drama never ends
okay i'm curious now
yikes
drama day huh
okay i'm not getting involved`,
skeptic:`there's always two sides
i need receipts before picking a side
this smells like a publicity stunt
everyone's acting like they know the whole story
drama right before a release, very convenient
i'll wait for the full picture
people are jumping to conclusions fast
nobody actually knows what happened
this feels very planned
i don't trust anyone in this situation`,
dry:`and the timeline has chosen violence today
drama has been served, extra spicy
somebody's publicist is having a long day
the comment section is now a courtroom
popcorn sales just went up
the receipts are being prepared, i assume
another day, another situation
the internet loves this more than it should
we're all just spectators here
messy, but make it public`,
kind:`i hope everyone involved is okay
drama is never fun for the people in it
hope it gets resolved peacefully
people are human, let's be kind
hope you're doing alright through this
it's okay to step away from all this
deep breath, everyone in these comments
hope this doesn't affect you too much
take care of yourself through this
i hope there's an apology soon, for everyone's sake`,
chaotic:`OH WE'RE FIGHTING TODAY???
I'M SEATED, I'M PREPARED, I'M HYDRATED
the timeline is on fire and i brought marshmallows
I NEED THE WHOLE STORY IMMEDIATELY
somebody screenshot everything before it's deleted
THE DRAMA. THE AUDACITY. THE SPEED
i'm running to every group chat i have
i'm not involved but i'm screaming
they're throwing hands in the comments and i'm here for it
I'M LOGGING OFF. JUST KIDDING I'M STAYING`,
culture:`drama online has its own timeline
the internet will turn this into a documentary eventually
public disagreements always get bigger than they started
this is going to be referenced for weeks
the way drama spreads is wild
everyone picks a side in seconds
this is the kind of moment that defines a public image
fan wars always escalate faster than the original thing
the drama cycle is speeding up
this will be a meme by tomorrow`,
detective:`checking who unfollowed who
the timing of this is too perfect
who posted first, i need a timeline
the screenshots are going to come out soon
i'm comparing every post from this week
someone's deleting tweets right now i bet
the vague post is about someone specific
i've already found two accounts involved
the likes on this say a lot
somebody is going to drop receipts, i can feel it`,
industry:`public drama always costs something
how you handle this matters more than the drama itself
the team behind this is definitely in meetings right now
silence can be smarter than a statement
drama can sink or boost a career depending on the response
handling this calmly is the best move
this is a pr crisis waiting to happen
best to let it blow over
the response will matter more than the incident
a quiet apology goes further than a loud defence`,
lurker:`👀
oh no
oop
🍿
yikes
hmm
okay drama
messy
the tea
👀👀
oof
interesting`,
hater:`this is embarrassing for everyone
can't stand this drama
nobody's surprised
they always do this
the drama is so manufactured
this is what you get
another meltdown`,
funny:`me reading this like it's my favourite show
grabbing popcorn for the next three business days
my group chat has convened an emergency meeting
the comment section is better than any reality show
i'm not involved but i'm emotionally invested
this is my cardio for the day
someone's notes app apology is being drafted as we speak
the fbi could never investigate this fast`,
support:`we've got your back always
don't let the noise get to you
you're stronger than this
we know who you really are
ignore the negativity, you're doing great
standing by you through all of it
protect your peace
we love you no matter what`};
/* ---- CELEBRITY POSTING ABOUT THEIR OWN LIFE ---- */
B.celeb={
stan:`{author} posting like a normal person is my favourite thing
the way {author} just pops up and ruins my day in the best way
okay {author} is in a posting mood and i'm here for it
{author} could post a grocery list and i'd frame it
when {author} posts i drop everything
“{snip}” i'll be thinking about this all day
okay {author} has been so active lately and i love it
{author} being unserious online is my serotonin
every time {author} posts i get a little bit healthier
i love when {author} just talks to us like this
not {author} posting this with zero warning
{author} said “{snip}” and walked away like it was nothing`,
casual:`oh hi {author}
“{snip}” lol same honestly
nice to see {author} posting
this is a very {author} post
love when celebrities post normal stuff
okay {author} is having a day
{author} is so funny sometimes
i didn't expect this from {author} but okay
this is cute
okay relatable {author}
{author} posting at random is so real
fair enough honestly`,
skeptic:`{author} never posts without a reason
“{snip}” sounds like the start of an announcement
this is a pr team posting as {author}, i'm sure
{author} has something coming, this is the warm up
nothing {author} posts is random
okay but why now {author}
the timing of this {author} post is interesting
i'm not reading into it. okay i'm reading into it
a casual post from {author} is never casual
{author}'s team definitely approved this`,
dry:`{author} has posted a sentence. the world reacts
“{snip}”. very profound, {author}
{author} sharing a thought with millions of people, as one does
breaking news: {author} has a life
{author} posting like they have no publicist today
a rare unfiltered moment, allegedly
this is the {author} content we deserve
{author} said “{snip}” like it's a normal thing to say
{author} is just like us, except completely different
“{snip}” is going on my wall, ironically`,
kind:`hope you're having a nice day {author}
love seeing {author} happy and relaxed
this is such a sweet thing to share
{author} seems really at peace lately
it's nice when {author} shares little things
sending love your way {author}
“{snip}” is lovely
hope {author} is taking care of themselves
this feels so genuine, i like it
nice to see this side of {author}`,
chaotic:`{author} WHY WOULD YOU POST THIS AND LEAVE
“{snip}” I'M SCREAMING
I'M LOSING IT OVER A {author} POST AGAIN
{author} is going to be the reason i get fired
the way {author} just DROPS things
WHO GAVE {author} THE PASSWORD TODAY
okay {author} is in chaos mode and i'm living
I'M SCREENSHOTTING THIS BEFORE THEIR TEAM SEES IT
{author} said “{snip}” and expected us to be normal
i read this out loud to my whole family`,
culture:`{author} posting casually is part of the image now
celebrity posts like this feel more human than any interview
“{snip}” is going to be a reaction meme by tonight
{author} knows exactly how a throwaway line travels
the casual celebrity post is a whole genre and {author} is good at it
people connect more with these than with campaigns
{author} sharing ordinary moments keeps the fanbase close
this is very much the current era of celebrity posting
the off-the-cuff post does more for {author} than a press tour
everyone's going to quote “{snip}” for a week`,
detective:`“{snip}” is a clue, i'm sure of it
okay {author} is hinting at something, who's with me
checking what else {author} posted today
the background of this post is interesting
{author} posting at this hour means something
comparing this to {author}'s last few posts
who else posted something similar today
“{snip}” could be about someone specific
{author} is never this vague without a reason
saving this one, it'll make sense later`,
industry:`{author} keeps the audience close with posts like this
a casual post between bigger moments is a smart rhythm
{author}'s team lets them be themselves online, good call
this kind of post keeps engagement steady between projects
low-effort posts from big names often outperform campaigns
{author} knows the audience wants personality
posts like this keep {author} in conversation without trying
the relaxed tone suggests things are going well behind the scenes
consistency like this is underrated
staying visible without overexposing is an art and {author} gets it`,
lurker:`{author} 👀
lol
hi {author}
ok {author}
😭
oh
relatable
👀
okay!!
same
real
lmao`,
hater:`{author} posting again, wow
who cares {author}
this is so random {author}
okay and?
{author} trying to stay relevant
nobody asked {author}
we're really reacting to this?`,
funny:`{author} posting this while i'm at work is a hate crime
me pretending {author} posted this just for me
{author} and i are basically the same person except for everything
“{snip}” is what i'll say at my next family dinner
{author}'s life sounds exhausting and i want it
i'm going to say “{snip}” to my boss tomorrow
{author} said it, so it's a law now
my parents would never understand this {author} post`,
support:`love you {author}, always
{author} deserves the world
so glad you're doing well {author}
{author} posting on a weekday is a gift to everyone
{author} is the reason i open this app before breakfast
keep being you {author}
{author} supremacy, as always
{author}, every post lately has landed and i keep count`};

/* ---- MEDIA OUTLET POST ---- */
B.media={
stan:`{person} supremacy, as always
leave {person} alone they're thriving
i love when {author} posts about {person}
{person} being everywhere today is my favourite thing
this headline is the best thing i've read all day
{person} living their life and the press can't cope
they really can't stop talking about {person}
okay i'm proud of {person} for this
the news cycle is just {person} and i'm not complaining
this is why {person} is the moment`,
casual:`oh interesting
okay i didn't know this
huh, didn't see that coming
this is news to me
{person} again? lol
okay that's kind of cool
interesting headline
wait really?
that's random
okay noted`,
skeptic:`{author} posting this with no source is wild
who confirmed this though
this headline is doing a lot of work
i'll wait for {person} to say something
“sources say” is not a source
{author} would post anything for clicks
the wording on this is very careful
this feels like speculation dressed as news
i'd like a quote, not a feeling
not believing anything until it's confirmed`,
dry:`{author} has once again discovered a person existing
headline: posted. facts: pending
{person} went outside and it's news
journalism, but make it gossip
the newsroom is very bored today
{author} writing about {person} like it's breaking news
a sentence has been reported
they really said “sources” and moved on
another day, another {person} headline
the press has entered the chat`,
kind:`hope {person} is doing okay with all the attention
let {person} live their life in peace
i hope the coverage is fair
{person} deserves privacy sometimes
hope this is good news for them
wishing {person} the best with all of this
it's nice when the news is positive
hope everyone involved is doing well
press can be so much, hope they're okay
i hope this is a happy story`,
chaotic:`{author} WHY ARE YOU LIKE THIS
I CAME HERE FOR {person} CONTENT AND I GOT IT
the headline jumped out at me
I'M SCREAMING AT THIS HEADLINE
somebody give {author} a raise for this
{person} AGAIN??? I LOVE IT
this headline is going to be in my dreams
I'M SPREADING THIS TO EVERY GROUP CHAT
{author} just woke up the whole timeline
the press is unhinged today and i'm here for it`,
culture:`the way {author} frames {person} says a lot
headlines like this shape the narrative before anyone speaks
the media cycle around {person} is fascinating
this is how a story gets built from a single detail
watch how the framing changes by tomorrow
{author} knows exactly what gets people clicking
coverage like this can change how people see someone fast
the press always finds the angle that sells
this is a perfect example of the speculation economy
media posts like this end up being cited in threads for weeks`,
detective:`where was this taken though, i need a location
who else was with {person}
checking {person}'s recent posts to connect the dots
the photo in the article has someone in the background
{author} must have a source close to {person}
the timing lines up with something, i'm sure
i'm cross-referencing with every fan account
okay this connects to the last {person} headline
someone screenshot this before it's edited
the details in this are very specific`,
industry:`press coverage like this is a double-edged sword
{person}'s team is definitely aware of this
media attention at this level changes the strategy
the response to this will be important
this is the kind of story that can boost or hurt
the press cycle can be managed if handled well
{author} covering this means it has traction
how {person} responds will shape the next week
this kind of coverage often precedes something bigger
media attention is a tool if you use it right`,
lurker:`👀
oh
hm
interesting
okay
wow
{person} 👀
oop
huh
what`,
hater:`{author} is a joke
who cares about this
this isn't news
{author} posts anything
clickbait again
another pointless headline
the press is obsessed`,
funny:`{author} would report me for breathing
my group chat had this information an hour ago
the headline has more drama than my whole life
{author} running out of things to write about again
i'm going to start citing {author} as a source in my essays
the reporters at {author} need a hobby
this headline would get me through a boring meeting
{person} sneezes and {author} writes a story`,
support:`{person} deserves better coverage than this
we love {person} no matter what the headlines say
protect {person} at all costs
{person} is doing amazing, ignore the noise
proud of {person} always
the headlines can't touch {person}
we see you {person}, keep shining
{person} supremacy forever`};

/* ---- GENERIC / NO CONTEXT ---- */
B.generic={
stan:`okay you posting at all is enough for me
the timeline is better when you're on it
“{snip}” is my new personality, sorry to everyone who knows me
{author} could post a receipt and i'd frame it
i check your page more than my emails
my favourite person posted, the day is saved
{author}, it's late, and this post is a gift i'm accepting
screenshotting this for the archive i definitely don't keep
this is going in the highlights reel of my week
{author} in {place} and i'm in my bedroom. unfair
not {person} showing up on my feed like this. i'm fine
turned my notifications on for exactly this reason
i would die for “{snip}” without knowing what it means
posting without warning should come with a seatbelt`,
casual:`“{snip}” lol okay
this showed up on my feed and i'm glad
haha this is random in a good way
honestly same
relatable, unfortunately
“{snip}” is real
{author} posting normal stuff is weirdly comforting
scrolled past, came back, liked it
this is nice to see between all the ads
{place} looks good from here
ha, {person} would say that
okay this one's cute
nice. that's my entire comment
read this on the bus and smiled at a stranger by accident`,
skeptic:`“{snip}” sounds like there's more to it
okay but what is this actually about
random posts are never random
i'm not reading into it. yet
{author} chose this exact moment to post. why
the vagueness is suspicious
sure, just a random thought, okay
the timing of this is interesting
mentioning {person} and then saying nothing else? hm
“{snip}” is carrying a lot of weight for one line
posted, then three minutes of silence. noted
this reads like a first draft of an announcement
why mention {place} and nothing else
if this is a coincidence i'm a pop star`,
dry:`a post has occurred
“{snip}”. riveting
another day, another sentence on the internet
“{snip}”, said with confidence and no explanation
very normal post, very normal app
i read it. i'm not sure why
{author} has entered words into a box. we clap
{place} mentioned. tourism board, take note
the comment section is about to become a seminar
brief. confident. unexplained. a triple threat
{person} gets a name-drop and the replies have dressed up for it
i give this post four stars and a shrug
somewhere a social media manager is very calm right now
a sentence was posted and nobody was harmed`,
kind:`hope you're having a good day
nice to see you posting
this made me smile on a rough morning
{author}, take a break after this one, you've earned it
always nice to see you on my feed
you seem in a good mood and it's catching
lovely to hear from you
“{snip}” is sweet
hope {place} is treating you well
drink some water, {author}, you've been busy
this is a gentle post and i needed gentle today
nice to see {person} mentioned so warmly
whatever today holds, this was a good start
taking this as my sign to call my mum`,
chaotic:`“{snip}” WHY DID THIS MAKE ME SCREAM
I'M IN A MEETING AND I GASPED
THE RANDOMNESS IS SENDING ME
i read this five times and i'm still not okay
NO BECAUSE WHY IS THIS SO FUNNY
i'm putting this on a billboard
{author} POSTED AND I DROPPED MY TOAST
{place}???? WHAT IS GOING ON OVER THERE
{person} IN THE CAPTION I'M ON THE FLOOR
SCREAMING INTO A CUSHION, BRB
my cat looked at me weird because i yelled at my phone
who let {author} post this unsupervised 😭
I SHOWED MY MUM AND NOW SHE'S A FAN
the timeline was asleep and this woke it up`,
culture:`“{snip}” has the energy of a future meme
random posts like this get quoted forever
the casual post is a lost art and you're reviving it
this reads like a tweet people screenshot in five years
this is the kind of thing that becomes a reaction image
“{snip}” is going to end up in someone's bio
{author} acting like a regular account is the smartest branding around
naming {person} in a throwaway post is how fandoms collide
{place} is having a moment online and this is part of it
the reply guys are already drafting their essays
big accounts posting tiny thoughts is its own genre and this is a strong entry
the comment section is where the real post lives
people will stitch this into a trend by tonight
one line, no image: the minimalist era is back`,
detective:`“{snip}” is a clue, i'm calling it
saving this for later, it'll make sense
okay i'm reading between the lines
the hour this was posted is interesting
who is “{snip}” about though
checking the last few posts for a pattern
the wording here is very deliberate
i'm connecting dots that might not exist
{author} doesn't post without a reason. what's the reason
why name {person} unless something is coming
{place} again. someone map these posts
screenshotted before an edit happens
count the words. too tidy to be random
silence for days and then this. noting it`,
industry:`posts like this keep the audience engaged between moments
a casual post is good for consistency
low-key posts can perform surprisingly well
{author}'s team clearly lets some posts be unplanned, smart
small posts build the connection big ones rely on
mentioning {person} puts this in front of a second audience
a {place} mention travels well with local press
the engagement on throwaway posts is real money now
posting between releases keeps the algorithm warm
this is how you stay visible without selling anything
a text post this short will get quoted more than any photo
consistency over perfection, good approach
the replies on this are free market research
brand-safe, human, quick. textbook`,
lurker:`lol
👀
real
😭
ha
brb, rereading
noted
same tbh
lmao ok
yep
okay 👀
bookmarked
👍
lurker approved`,
hater:`what is this even
okay and?
nobody asked
we're really posting anything now
{author} posts like the wifi is free
the bar is on the floor
mentioning {person} won't save this one
“{snip}”? that's it?
scrolled for this?
imagine having a team and posting this
{place} deserves better than this post
i've seen grocery receipts with more personality`,
funny:`“{snip}” is what i'll say when i forget my keys
this post has the energy of my 3am thoughts
i'm going to say “{snip}” at my next job interview
me reading this like it's a puzzle
i also have thoughts, i just keep them to myself
i don't know what this means but i agree
{author} posts like my dad discovering emojis
my plants heard this read aloud. they're thinking
if {person} sees this i'm moving to {place}
my diary will be hearing about “{snip}”
this is my sign to quit my job and become a caption
i laughed so hard the bus driver looked at me
adding this to my list of reasons to stay off the app. it's a short list
showing this to my nan and letting her decode it`,
support:`love seeing you post
you always brighten my feed
{author}, post whatever you want, we'll keep reading
always happy to see you here
never stop posting
every post from {author} gets a like from me, no matter what
hope {place} gives you the welcome you deserve
this account has been a good corner of the internet lately
{person} mentioned and you made it sweet
liking this from my lunch break with a full heart
this page is my comfort scroll
you're doing it your way and it shows
a quiet post from {author} still makes my day
never change the way you caption things`};
/* ---- top-ups: every core personality gets 12+ lines per topic ---- */
const T=(topic,voice,txt)=>{B[topic][voice]=(B[topic][voice]||'')+'\n'+txt};
T('photocap','industry',`the caption sounds like a person, which is the whole trick`);
T('photocap','hater',`the caption is longer than the effort in the photo
this caption has been workshopped to death`);
T('photocap','funny',`the caption is the photo's hype man and it's doing overtime
“{snip}” is what i'll whisper to my reflection tomorrow`);
T('photocap','support',`you never miss, photo or caption
the caption is so you and i love that`);
T('photo','skeptic',`a no-caption post right now is a choice and i see it
the photo is too good to be a random tuesday upload`);
T('photo','dry',`a whole photo and not one word. respect
the picture said hello so the caption didn't have to`);
T('photo','kind',`this made me smile for no reason
you look so at ease here, it's lovely`);
T('photo','chaotic',`I'M FINE. I'M NORMAL. (i am not)
why does this photo have the power to ruin my week`);
T('photo','culture',`this is the kind of photo that becomes the new default picture of you
the captionless upload is the confident version of posting`);
T('photo','detective',`okay what's out of frame though`);
T('photo','industry',`this is an image people will use when they write about you
strong photo, no notes`);
T('photo','hater',`could've added a caption at least
the comments are more interesting than the photo`);
T('photo','support',`always so happy to see your face
you look amazing, as usual`);
T('campaign','skeptic',`a campaign post with no name attached is a teaser, i know how this works
the “just a fitting” posts always turn into something bigger`);
T('campaign','dry',`the steamer is the hardest working person on that set
hours of pinning for one perfect frame. fashion`);
T('campaign','kind',`hope the team on set is looking after you
you're going to look so good in the final images`);
T('campaign','chaotic',`IF THE CAMPAIGN DOESN'T DROP SOON I'M MOVING ON SET
somebody tell the photographer i said hi and also please hurry`);
T('campaign','culture',`fittings are the new trailers, people treat them like announcements
everybody screenshots the fitting and compares it to the final`);
T('campaign','detective',`who's the photographer, i need the credit when this drops
if there's a logo anywhere in this i will find it`);
T('campaign','industry',`a campaign booking says someone on a brand team believes in you
how this shoot goes decides what gets booked next`);
T('campaign','hater',`fittings aren't content
it's a photoshoot not a moon landing`);
T('campaign','funny',`the outfit has a stunt double and it's the steamer
i'd be the one person who spills coffee on the sample`);
T('campaign','support',`you belong on every set
we're so ready to see the final pictures`);
T('career','skeptic',`a “big opportunity” post with no details is my least favourite tease
so is this booked or just being talked about`);
T('career','dry',`career news with zero information, my favourite kind
the inbox is winning, the person is surviving`);
T('career','kind',`hope this opens a lot of good doors
you deserve to be in rooms that see you`);
T('career','chaotic',`THE CAREER IS CAREERING
i'm refreshing your page until you announce this`);
T('career','culture',`the “before” posts always become the favourite posts later
people love watching someone get their first real break`);
T('career','detective',`is that the same building as someone else's post or am i reaching
timeline check: this is the post before the announcement`);
T('career','industry',`keep the details quiet until it's signed, smart
the follow-through matters more than the booking itself`);
T('career','hater',`a meeting isn't news`);
T('career','funny',`career news from me: i finally unsubscribed from emails
the vague career post is the celebrity version of “we need to talk”`);
T('career','support',`you've been putting in the work and it shows
whatever this is, you're going to smash it`);
T('music','skeptic',`i've learned not to get excited until there's a link
“music soon” energy without a date is a trap`);
T('music','dry',`a song exists somewhere and that's all we're allowed to know
the snippet is in witness protection`);
T('music','kind',`hope making it feels as good as hearing it will
whatever direction you go, i'll listen with an open mind`);
T('music','chaotic',`I'LL LEARN EVERY WORD BEFORE IT'S EVEN OUT
this is the closest i've come to fainting over audio i haven't heard`);
T('music','culture',`the guessing game is part of the release now
fans will build a whole era around one studio caption`);
T('music','detective',`i need the credits the second this is out
okay who's in the studio with you, that's the question`);
T('music','industry',`a release plan matters as much as the song
get the right people hearing it early and the rest follows`);
T('music','hater',`i'll judge it when i hear it, not before`);
T('music','funny',`my music career is singing the wrong lyrics confidently
i'll be playing this so loud my neighbours become fans`);
T('music','support',`your voice deserves every stream
whatever you're making, we're ready`);
T('romance','skeptic',`every soft launch looks exactly like this, just saying
watch this turn out to be right before a release`);
T('romance','dry',`two people, one post, a thousand detectives
love: confirmed. identity: classified`);
T('romance','kind',`it's lovely seeing you this happy
love that you have someone, you deserve it`);
T('romance','chaotic',`I'M NOT OKAY. WHO IS IT
somebody check on me, i saw the word love`);
T('romance','culture',`the comment section is now a dating show
romance posts are the fastest way to get the whole internet talking`);
T('romance','detective',`is that a ring?? taking notes
i swear i've seen this background on someone else's story`);
T('romance','industry',`keeping it private is the smartest thing you can do
let people guess, you don't owe a press release`);
T('romance','hater',`this will be deleted in a month`);
T('romance','funny',`my only relationship is with my phone and it's toxic
i'm happy for you and also going to be single forever`);
T('romance','support',`protect this happiness, we're cheering for you
nothing but love for you two`);
T('travel','skeptic',`people don't just post airports, something's happening
this “trip” has a schedule, i guarantee it`);
T('travel','dry',`a passport has been used. the timeline adjusts
packing light is a myth and this suitcase knows it`);
T('travel','kind',`hope you get a little time to yourself out there
travel safe and come back rested`);
T('travel','chaotic',`I'M AT THE GATE (I'M IN MY BED)
someone tell me the hotel so i can not show up there`);
T('travel','culture',`the location reveal is basically a plot point now
where you post from changes how people read the post`);
T('travel','detective',`checking which cities had events this week
noting the location and waiting for the next post`);
T('travel','industry',`being seen in person still opens the best doors
new city, new people, that's how it grows`);
T('travel','hater',`just say you're on holiday`);
T('travel','funny',`my travel itinerary: bed, couch, fridge, repeat
i've been to {place} once. in a dream`);
T('travel','support',`have the most amazing time
you deserve every bit of this trip`);
T('sad','skeptic',`i hope the people close to you are actually checking in
whatever's going on, you don't owe anyone details`);
T('sad','dry',`some weeks are just long. this sounds like one
the bar today is drink water and lie down. that's enough`);
T('sad','kind',`you don't have to explain anything, just look after you
sending the softest thoughts your way`);
T('sad','chaotic',`i'm sending a blanket, a snack and a dog through the screen
i'll fight the week for you, just say the word`);
T('sad','culture',`people forget public figures have off days too
it says a lot that the comments are this gentle`);
T('sad','detective',`no theories today, just care
not asking questions, just here`);
T('sad','industry',`rest now, everything else can be rescheduled
taking a breath is part of doing this long term`);
T('sad','funny',`i'm prescribing one nap, a snack and no notifications`);
T('sad','support',`you're not alone, we've got you
it's okay, rest, we'll be here`);
T('happy','skeptic',`okay i'm happy but i want the details
something good happened and i need to know what`);
T('happy','dry',`a good day, documented. rare footage
happiness has entered the timeline. please remain calm`);
T('happy','kind',`this is the kind of news that makes my day
you deserve days like this, often`);
T('happy','chaotic',`I'M CELEBRATING AND I DON'T EVEN KNOW WHAT WE WON
SOMEBODY RING THE BELL`);
T('happy','culture',`watching someone's good news spread through the replies is the best part of the app
the comments on a good news post are a whole mood`);
T('happy','detective',`a happy post out of nowhere, noted
okay something happened and i'll find out what`);
T('happy','industry',`good news travels, enjoy it and keep building
the right people notice a win like this`);
T('happy','hater',`calm down it's not that serious`);
T('happy','funny',`i'm taking credit for this, i liked your last post
my biggest win this week was a parking spot`);
T('happy','support',`we're celebrating with you
so happy for you, you deserve it`);
T('money','skeptic',`this definitely wasn't paid for, i'd bet on it
posting a purchase is always a statement`);
T('money','dry',`the wallet has left the chat
a transaction has occurred. society trembles`);
T('money','kind',`happy you get to enjoy things like this
you deserve a treat, honestly`);
T('money','chaotic',`I'M GOING TO SPEND MONEY I DON'T HAVE BECAUSE OF THIS
my bank app just closed itself in fear`);
T('money','culture',`the comment section on a money post always turns into a debate
flex posts say a lot about where someone thinks they are`);
T('money','detective',`adding this to the spending timeline i keep in my head
okay but who's paying, that's the real question`);
T('money','industry',`a flex can help an image or hurt it, timing is everything
enjoy it, just don't let it become the whole brand`);
T('money','support',`you worked for this, enjoy every bit`);
T('fashion','skeptic',`this outfit was chosen by a whole team, let's be real
nice look but i've seen it on three mood boards already`);
T('fashion','dry',`the outfit is more confident than any of us
fashion, as a concept, has been achieved`);
T('fashion','kind',`your style keeps getting better
you look so comfortable in this, it's lovely`);
T('fashion','chaotic',`I'M PRINTING THIS AND TAKING IT TO A TAILOR
THE FIT CHECK HAS CHECKED ME`);
T('fashion','culture',`this look is going to be copied, give it a week
the styling says more than any caption could`);
T('fashion','detective',`the stylist on this deserves to be named and i want the name
somebody tag the stylist, i'm begging`);
T('fashion','industry',`a look like this gets the right people paying attention
consistent style is what makes people remember a name`);
T('fashion','hater',`the stylist should be fired`);
T('fashion','funny',`my fashion sense is “whatever's clean”
the outfit has better posture than me`);
T('fashion','support',`you always look incredible`);
T('drama','skeptic',`nobody saying names means everyone's about to guess wrong
the internet's version of this story is already different from the real one`);
T('drama','dry',`the timeline has picked a fight with itself again
messy, as is tradition`);
T('drama','kind',`hope everyone gets some peace after this
no one deserves the pile-on, whoever they are`);
T('drama','chaotic',`I'M REFRESHING THIS EVERY TEN SECONDS
somebody start a thread before i lose track`);
T('drama','culture',`the way everyone already has a side is fascinating
the response is going to be bigger than the original post`);
T('drama','detective',`i'm already going through who liked what
someone is going to post a screenshot, i'd bet on it`);
T('drama','industry',`there's definitely a team meeting about this right now
saying less is almost always the better move here`);
T('drama','hater',`this was always going to happen`);
T('drama','funny',`i haven't been this invested since my group chat fought about pizza toppings
my popcorn has popcorn now`);
T('drama','support',`whatever happened, we're with you`);
T('celeb','stan',`{author} posting today was not on my bingo card and i'm thrilled`);
T('celeb','skeptic',`a random post from {author}? there's a reason
{author} doesn't post sentences for no reason`);
T('celeb','dry',`{author} has typed words and pressed post. historic
another day, another {author} sentence for us to decode`);
T('celeb','kind',`it's sweet when {author} just talks to people
{author} seems genuinely happy and that's nice to see`);
T('celeb','chaotic',`{author} PLEASE I HAVE A JOB
I'M SCREAMING, {author} IS POSTING AGAIN`);
T('celeb','culture',`{author}'s throwaway posts get quoted more than their interviews
the casual {author} post is a whole genre and it works`);
T('celeb','detective',`{author} posting this right now is not a coincidence
reading “{snip}” six times looking for the hidden meaning`);
T('celeb','industry',`{author} keeps the timeline warm between projects, textbook
posts like this keep {author} feeling close without overexposure`);
T('celeb','hater',`{author} needs a hobby`);
T('celeb','funny',`me reading {author}'s post like it's addressed to me personally
{author} said “{snip}” and i'm putting it on a mug`);
T('celeb','support',`{author} can do no wrong in my eyes`);
T('media','stan',`{person} could not care less about this headline and that's why we love them
this is just {person} being iconic again, nothing new`);
T('media','casual',`huh, okay
didn't expect to read this today`);
T('media','skeptic',`a headline isn't a confirmation
i'd like to hear it from {person}, not {author}`);
T('media','dry',`{author} writing headlines in their sleep at this point
breaking: a celebrity did a thing`);
T('media','kind',`hope {person} is okay with all of this out there
i'd rather this be good news for {person}`);
T('media','chaotic',`{author} REALLY SAID THAT HUH
I'M FORWARDING THIS TO EVERYONE I'VE EVER MET`);
T('media','culture',`whoever writes {author}'s headlines knows exactly what they're doing
the speculation in the replies is the real story now`);
T('media','detective',`does {author} actually have a source or is this a feeling
cross-checking this with {person}'s last few posts`);
T('media','industry',`{person}'s team is going to have to decide whether to respond
coverage like this is a signal that interest is building`);
T('media','lurker',`hmm 👀
oh??`);
T('media','hater',`{author} will post literally anything`);
T('media','funny',`{author} would report on my lunch if i was famous
the headline has more twists than my week`);
T('media','support',`{person} deserves good press only`);
T('generic','skeptic',`this sounds like the first half of something
if this isn't a hint it's a very good impression of one`);
T('generic','dry',`this is a post. on the internet. as is tradition
one sentence, a thousand interpretations`);
T('generic','kind',`always nice when you pop up
hope whatever you're doing today is good`);
T('generic','chaotic',`I READ THIS WRONG THREE TIMES AND IT GOT BETTER EACH TIME
I'M SCREENSHOTTING THIS FOR NO REASON`);
T('generic','culture',`posts like this are why people still use this app
the casual sentence is a dying art and you're keeping it alive`);
T('generic','detective',`the wording is too specific to be random
i'm filing this under “will make sense later”`);
T('generic','industry',`little posts like this keep people checking in
being yourself online is the strategy, honestly`);
T('generic','hater',`the bar keeps getting lower`);
T('generic','funny',`i'm going to quote this in arguments i'm not part of
this is the internet equivalent of a wave from across the street`);
T('generic','support',`post whatever you want, we're here`);
/* fixes: lines that implied facts the game does not have, or that legacy repair regexes delete */
const FIX=[['the garment bag has a logo and it\'s blurred, interesting','is that a logo on the garment bag or am i seeing things'],['same lighting as a shoot i saw last month, hmm','comparing this lighting to every studio i know'],['the rack has at least three looks, so it\'s a big one','counting the looks on that rack like it\'s my job'],['there\'s a call sheet on the table and i\'m squinting','is that a call sheet on the table 👀'],['same building as a post from someone else last week, interesting','okay whose building is this'],['there\'s a badge on the desk and i\'m squinting','is that a lanyard on the desk 👀'],['we\'ve seen this exact soft launch three times before','soft launches always start exactly like this'],['how convenient that this is right before a release','romance post, then a release, every time'],['the hand has a ring and i\'m taking notes','checking every finger in this photo'],['same background as someone else\'s story, i swear','okay whose window is that'],['the second plate on the table says everything','is that a second plate on the table 👀'],['we\'ve been here before, no song for ages','studio posts without a release date are my villain origin story'],['this is the third “music soon” vibe i\'ve seen','“working on music” is the longest sentence in pop'],['there\'s a second pair of headphones on the desk','is that a second pair of headphones on the desk 👀'],['that\'s not the first expensive thing this week, noted','noting this purchase for my records'],['i\'ve already found two accounts involved','i'+'\'m checking who liked this already'],['okay {author} has been so active lately and i love it','{author} in a posting mood is my favourite weather'],['very normal post, very normal app','extremely normal app. extremely normal post'.replace('normal post','casual sentence')],['happy post right after a quiet week, noted','a sudden happy post is always a clue'],['the last thing wasn\'t that good tbh','prove me wrong i guess'],['the shoes are from a collection i\'m trying to place','i know those shoes from somewhere and it\'s going to bother me']];
for(const vs of Object.values(B))for(const v of Object.keys(vs))for(const [a,b] of FIX)vs[v]=vs[v].split('\n').map(l=>l.trim()===a?b:l).join('\n');
/* ================= engine ================= */
const VERSION='writer-comments-1';
const VOICES=['stan','casual','skeptic','dry','kind','chaotic','culture','detective','industry','lurker','hater','funny','support'];
// Each NPC keeps its own personality; some of the time it speaks in a related "alt" voice so hater/funny/support also show up.
const ALT={stan:'support',kind:'support',skeptic:'hater',dry:'funny',chaotic:'funny',casual:'funny',culture:'dry',detective:'funny',industry:'skeptic',lurker:'casual',hater:'skeptic',funny:'chaotic',support:'kind'};
const ALT_RATE=.28,RECENT_N=700,KEY_PREFIX='w|';
const LINES={};for(const [topic,voices] of Object.entries(B)){LINES[topic]={};for(const [voice,txt] of Object.entries(voices)){LINES[topic][voice]=[...new Set(String(txt).split('\n').map(s=>s.trim()).filter(Boolean))]}}
const h32=s=>{let x=2166136261;s=String(s);for(let i=0;i<s.length;i++){x^=s.charCodeAt(i);x=Math.imul(x,16777619)}return x>>>0};
const rnd=n=>Math.floor(Math.random()*n);
const nowMs=()=>Date.now();
const norm0=s=>String(s||'').toLowerCase().replace(/@[a-z0-9_.]+/g,'@u').replace(/[“”"'’‘!?.,:;()…\-]/g,' ').replace(/[\u{1F000}-\u{1FFFF}\u2600-\u27BF\uFE0F\u200D]/gu,' ').replace(/\s+/g,' ').trim();
const norm=s=>norm0(s)||String(s||'').trim().toLowerCase();
// Lines that describe what is IN a picture are only used when the post really has a picture.
const VISUAL=/\b(background|zoom\w*|reflection|photo|photos|picture|pic|pics|frame|shadow|lighting|corner|desk|table|rack|jacket|the view|selfie|the hand|a hand|wrist|window|screen behind|on screen|receipt|price tag|this fit|the fit|fit check|outfit|the look|this look|that look|you look|they look|looks (?:good|great|amazing|so|like|fun|lovely|relaxing|expensive|fancy|comfy)|shoes|face card|camera|filter|angle|the edit|the smile|glowing|the bag|garment bag|store bag|the tag|tags|collar|a ring|the ring|finger|the watch|the walls|the hair|posing|posed|tripod|colours?|styling|the clothes|this one came out|fabric|closet|silhouette|accessories|tailored|wear it|wearing|stylish|best dressed)\b/;
const SUFFIX=/\s·\s[a-z0-9]{1,4}$/i;

/* ---------- facts the post really contains ---------- */
const PLACES=[['cape town','Cape Town'],['johannesburg','Johannesburg'],['joburg','Joburg'],['jozi','Jozi'],['durban','Durban'],['london','London'],['paris','Paris'],['new york','New York'],['nyc','NYC'],['los angeles','Los Angeles'],['dubai','Dubai'],['tokyo','Tokyo'],['seoul','Seoul'],['milan','Milan'],['berlin','Berlin'],['miami','Miami'],['nashville','Nashville'],['atlanta','Atlanta'],['chicago','Chicago'],['toronto','Toronto'],['sydney','Sydney'],['lagos','Lagos'],['nairobi','Nairobi'],['mexico city','Mexico City'],['rome','Rome'],['barcelona','Barcelona'],['ibiza','Ibiza'],['amsterdam','Amsterdam'],['lisbon','Lisbon'],['mykonos','Mykonos'],['bali','Bali'],['las vegas','Las Vegas'],['vegas','Vegas'],['malibu','Malibu']];
const ALIASES=[['kim','Kim Kardashian'],['kris','Kris Jenner'],['kylie','Kylie Jenner'],['kendall','Kendall Jenner'],['khloé','Khloé Kardashian'],['khloe','Khloé Kardashian'],['kourtney','Kourtney Kardashian'],['rihanna','Rihanna'],['beyoncé','Beyoncé'],['beyonce','Beyoncé'],['ariana','Ariana Grande'],['taylor','Taylor Swift'],['sabrina','Sabrina Carpenter'],['tate','Tate McRae'],['zendaya','Zendaya']];
const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const first=name=>{const n=String(name||'').trim();if(!n)return'';const parts=n.split(/\s+/);return parts.length>1&&!/^(the|dj|lil|pop|e!|tmz)$/i.test(parts[0])?parts[0]:n};
function authorOf(p){
 if(p?.authorId==='player')return{kind:'player',name:state.player?.name||''};
 const a=typeof byId==='function'?byId(p?.authorId):null;
 if(a)return{kind:a.type==='media'?'media':a.type==='celeb'?'celeb':'fan',name:a.name||'',id:a.id};
 if(p?.npcAuthor)return{kind:'npc',name:p.npcAuthor.name||''};
 return{kind:'other',name:''};
}
function snippetOf(text){
 let t=String(text||'').replace(/https?:\/\/\S+/g,'').replace(/\s+/g,' ').trim();if(!t)return'';
 const clause=t.split(/(?<=[.!?])\s+|\s[—–-]\s/)[0]||t;t=clause.length>=6?clause:t;
 if(t.length>40){const cut=t.slice(0,40);t=cut.slice(0,Math.max(cut.lastIndexOf(' '),18)).trim()}
 t=t.replace(/[\s,;:.!?…]+$/,'').replace(/[“”"]/g,'');
 return t.length>=4&&t.split(' ').length>=2&&t.length<=40?t:'';
}
function analyze(p){
 const text=String(p?.text||'').replace(/\s+/g,' ').trim(),low=text.toLowerCase(),author=authorOf(p),handle=String(state.player?.handle||'').toLowerCase(),pname=String(state.player?.name||'').trim();
 const aboutPlayer=author.kind==='player'||(handle&&low.includes('@'+handle))||(pname.length>2&&low.includes(pname.toLowerCase()));
 let place='';for(const [k,v] of PLACES){if(new RegExp(`\\b${esc(k)}\\b`).test(low)){place=v;break}}
 if(!place&&/\bLA\b/.test(text))place='LA';
 const people=[];const add=n=>{if(n&&!people.includes(n)&&first(n)!==first(author.name))people.push(n)};
 for(const a of (typeof celebs!=='undefined'?celebs:[])){const nm=String(a.name||'').toLowerCase(),hd=String(a.handle||'').toLowerCase();if((nm.length>2&&low.includes(nm))||(hd&&low.includes('@'+hd)))add(a.name)}
 for(const [k,v] of ALIASES)if(new RegExp(`\\b${esc(k)}\\b`).test(low))add(v);
 if(author.kind!=='player'&&pname.length>2&&low.includes(pname.toLowerCase()))add(pname);
 return{text,low,author,aboutPlayer,photo:Boolean(p?.media),place,person:people[0]?first(people[0]):'',snip:snippetOf(text),topics:contentTopics(low,place)};
}
function contentTopics(low,place){
 const t=[];const has=(k,re)=>{if(re.test(low)&&!t.includes(k))t.push(k)};
 has('campaign',/\b(campaign|fitting|fittings|photoshoot|shoot day|shoot|on set|call time|garment bags?|first frame|wardrobe|lookbook|editorial|crease|bts)\b/);
 has('music',/\b(song|songs|single|album|record|track|chorus|verse|snippet|music video|studio|demo|mixing|mastering|session|producer|beat|ep|streams?|streaming|chart|charts|tour|concert|setlist|soundcheck|performance|performed|onstage|listen)\b/);
 has('romance',/\b(date night|kiss|crush|relationship|boyfriend|girlfriend|soft.?launch|romance|dating|my person|in love|valentine|anniversary)\b/);
 has('sad',/\b(tired|sad|cry|crying|cried|rough|bad day|miserable|stressed|overwhelmed|lonely|exhausted|burnt out|burned out|hard week|not okay|heartbroken|anxious|drained)\b/);
 has('drama',/\b(fight|shade|feud|liar|lies|receipts|drama|backlash|beef|exposed|rumou?rs?|deny|denied|unfollow(?:ed)?|subtweet|clap back|messy|apology|statement|allegation|defamatory)\b/);
 has('money',/\b(money|paid|payday|expensive|bought|shopping|rich|cash|invoice|budget|cost|afford|splurge|price|cheaper)\b/);
 has('fashion',/\b(dress|look|outfit|fashion|stylist|runway|designer|fit check|shoes|heels|jacket|makeup|hair|nails|beauty|style|styled|vogue)\b/);
 if(place||/\b(airport|flight|flew|landed|travel|travelling|traveling|hotel|jet ?lag|passport|trip|vacation|holiday|arrivals|departures)\b/.test(low))t.push('travel');
 has('happy',/\b(happy|excited|best day|amazing|won|win|grateful|proud|blessed|finally|celebrat\w*|good day|good news|congrats|#1|number one)\b/);
 has('career',/\b(opportunity|opportunities|job|career|meeting|audition|callback|deal|brand|booking|booked|contract|role|client|brief|industry|signed|offer|interview|gig|appearance|episode|filming|work|project|office)\b/);
 return t;
}
function topicPlan(m){
 const c=m.topics,plan=[];const add=(t,w)=>{if(t&&LINES[t]&&!plan.some(x=>x[0]===t))plan.push([t,w])};
 if(m.author.kind==='media'){add('media',3);if(c[0]&&c[0]!=='career')add(c[0],.8);add('generic',.25)}
 else if(m.author.kind==='celeb'){add(c[0],2.2);add('celeb',c[0]?1.5:3);if(m.photo)add(m.text?'photocap':'photo',1.1);add(c[1],.7);add('generic',.4)}
 else if(m.photo&&!m.text){add('photo',3);add('fashion',.6)}
 else{add(c[0],3);if(c[0]==='campaign')add('career',.35);add(c[1],1);if(m.photo)add('photocap',c[0]?1.3:2.6);add('generic',c[0]?.5:2.4)}
 return plan;
}

/* ---------- save-wide memory (shares the existing USED_NPC_LINES set + key) ---------- */
function used(){try{return USED_NPC_LINES}catch{return(globalThis.__writerUsed=globalThis.__writerUsed||new Set())}}
function persist(){try{localStorage.setItem(typeof UNIQUE_LINES_KEY!=='undefined'?UNIQUE_LINES_KEY:'status-used-npc-lines-v1',JSON.stringify([...used()]))}catch{}}
let persistTimer=0;const persistSoon=()=>{clearTimeout(persistTimer);persistTimer=setTimeout(persist,250)};
function recentOrder(){const m=new Map();let i=0;for(const s of used())if(s.startsWith(KEY_PREFIX))m.set(s,i++);return m}
function markUsed(key){const u=used(),sig=KEY_PREFIX+key;u.delete(sig);u.add(sig);let n=0;for(const s of u)if(s.startsWith(KEY_PREFIX))n++;if(n>RECENT_N){for(const s of u){if(s.startsWith(KEY_PREFIX)){u.delete(s);if(--n<=RECENT_N)break}}}while(u.size>1400){const old=u.values().next().value;u.delete(old)}persistSoon()}

/* ---------- picker ---------- */
function fill(line,m){
 if(/\{snip\}/.test(line)&&!m.snip)return'';if(/\{author\}/.test(line)&&!m.authorName)return'';if(/\{handle\}/.test(line)&&!(m.aboutPlayer&&state.player?.handle))return'';
 if(/\{place\}/.test(line)&&!m.place)return'';if(/\{person\}/.test(line)&&!m.person)return'';
 return line.replace(/\{snip\}/g,m.snip).replace(/\{author\}/g,m.authorName).replace(/\{handle\}/g,'@'+(state.player?.handle||'')).replace(/\{place\}/g,m.place).replace(/\{person\}/g,m.person);
}
function postTexts(p){const out=new Set();const walk=l=>{for(const c of l||[]){if(c?.text)out.add(norm(String(c.text).replace(SUFFIX,'')));if(c?.replies?.length)walk(c.replies)}};walk(p?.comments);return out}
function tooClose(p,text){try{return Boolean(globalThis.SCENE_COMMENT189?.threadTooClose?.(p,text))}catch{return false}}
function candidates(topic,voice,m,p,inPost){
 if(topic==='fashion'&&!m.photo&&!['skeptic','dry','culture','industry','detective','funny','hater'].includes(voice))return[];
 const out=[];for(const tpl of LINES[topic]?.[voice]||[]){if(!m.photo&&topic!=='photo'&&topic!=='photocap'&&VISUAL.test(tpl))continue;const text=fill(tpl,m);if(!text)continue;const k=norm(text);if(!k||inPost.has(k)||inPost.has(norm(tpl)))continue;out.push({tpl,text,key:norm(tpl),topic,voice})}return out;
}
function weightedTopic(plan){const total=plan.reduce((s,x)=>s+x[1],0);let r=Math.random()*total;for(const [t,w] of plan){if((r-=w)<=0)return t}return plan[0]?.[0]||'generic'}
function voiceFor(n){const own=VOICES.includes(n?.personality)?n.personality:'casual';return Math.random()<ALT_RATE?ALT[own]||own:own}
function choose(p,n,opts={}){
 const m=analyze(p);m.authorName=m.author.kind==='celeb'||m.author.kind==='media'?first(m.author.name):'';
 const plan=topicPlan(m),inPost=postTexts(p),order=recentOrder(),own=VOICES.includes(n?.personality)?n.personality:'casual',voice=opts.voice||voiceFor(n),topic=weightedTopic(plan);
 const vOrder=[voice,own,ALT[own]].filter((v,i,a)=>v&&a.indexOf(v)===i);
 const tOrder=[topic,...plan.map(x=>x[0]).filter(t=>t!==topic)];
 const fresh=list=>list.filter(c=>!order.has(KEY_PREFIX+c.key)&&!tooClose(p,c.text));
 const lru=list=>{const ok=list.filter(c=>!tooClose(p,c.text));ok.sort((a,b)=>(order.get(KEY_PREFIX+a.key)??-1)-(order.get(KEY_PREFIX+b.key)??-1));return ok[0]||null};
 const tries=[];for(const v of vOrder)tries.push([topic,v]);for(const t of tOrder.slice(1))for(const v of vOrder)tries.push([t,v]);
 // 1) a line this save has not shown recently, in the post's own topic + this person's voice first
 for(const [t,v] of tries){const f=fresh(candidates(t,v,m,p,inPost));if(f.length)return{...f[rnd(f.length)],m}}
 // 2) everything recent: recycle the least-recently-used line (never a suffix)
 for(const [t,v] of tries){const c=lru(candidates(t,v,m,p,inPost));if(c)return{...c,m}}
 // 3) any voice in the planned topics
 for(const t of tOrder)for(const v of VOICES){const f=fresh(candidates(t,v,m,p,inPost));if(f.length)return{...f[rnd(f.length)],m}}
 return null;
}
function cadence(n,text){
 const cad=n?.cadence||'lowercase';let out=text;
 if(cad==='proper'&&/^[a-z]/.test(out)&&out!==out.toUpperCase()){out=out.charAt(0).toUpperCase()+out.slice(1);out=out.replace(/\bi(?=$|\s|'|’|,)/g,'I');if(/[a-z]$/i.test(out))out+='.'}
 else if(cad==='no-punctuation')out=out.replace(/[.!?]+$/,'');
 return out;
}
const produced=new Set();
function lineFor(n,p,opts={}){
 try{const c=choose(p,n,opts);if(!c)return'';markUsed(c.key);const text=cadence(n,c.text);produced.add(norm(text));if(produced.size>600)produced.delete(produced.values().next().value);STATS.lines++;STATS.byTopic[c.topic]=(STATS.byTopic[c.topic]||0)+1;STATS.byVoice[c.voice]=(STATS.byVoice[c.voice]||0)+1;lastPick={topic:c.topic,voice:c.voice};return text}catch(e){STATS.errors++;console.warn('writer-comments',e);return''}
}
let lastPick={topic:'',voice:''};const STATS={lines:0,errors:0,byTopic:{},byVoice:{}};
function pickNpc(p){
 const all=(typeof NORMAL_NPCS!=='undefined'?NORMAL_NPCS:[]).filter(n=>n&&n.handle);if(!all.length)return null;
 const usedH=new Set((p?.comments||[]).map(c=>String(c.handle||'').toLowerCase()).filter(Boolean)),recentTypes=(p?.comments||[]).slice(-2).map(c=>(all.find(n=>n.id===c.npcId)||{}).personality);
 let best=null;for(let i=0;i<40;i++){const n=all[rnd(all.length)];if(usedH.has(String(n.handle).toLowerCase()))continue;best=n;if(!recentTypes.includes(n.personality))break}
 return best||all[rnd(all.length)];
}
function makeComment(p){
 if(!p)return null;p.comments=Array.isArray(p.comments)?p.comments:[];
 for(let i=0;i<4;i++){const n=pickNpc(p);if(!n)return null;const text=lineFor(n,p);if(!text)continue;
  return{id:'writer-'+nowMs()+'-'+Math.random().toString(36).slice(2,8),fan:true,npcId:n.id,name:n.name,handle:n.handle,avatar:n.avatar||(typeof fanAvatar==='function'?fanAvatar(n.handle):''),text,createdAt:nowMs()-(300+rnd(60000)),likes:rnd(Math.max(4,Math.floor((state.player?.fame||0)/4)+4)),replies:[],sceneVoice159:true,writer:1,writerTopic:lastPick.topic,writerVoice:lastPick.voice}}
 return null;
}

/* ---------- wiring ---------- */
const baseContextual=typeof contextualFanComment==='function'?contextualFanComment:null;
contextualFanComment=function(p){const c=makeComment(p);if(c)return c;return null};
fanComment=function(){return contextualFanComment({id:'writer-generic-'+nowMs(),text:'',comments:[]})};
// FAN_BANKS: same keys, real lines instead of 5 each (only slot-free lines, since app.js callers have no post).
try{for(const k of Object.keys(FAN_BANKS)){if(k==='bot')continue;const v=k;const pool=[...(LINES.generic[v]||[]),...(LINES.happy[v]||[]),...(LINES.photo[v]||[])].filter(s=>!/\{/.test(s));if(pool.length)FAN_BANKS[k]=pool}}catch{}
// NOTE: uniqueLine() itself is left alone (another package owns its suffix fix). Comment picking never calls it.
// One-time cleanup of saved COMMENTS/REPLIES that already end in a " · abc" suffix (post texts, stories and the
// uniqueLine ledger are left to the uniqueLine package).
function migrate(){
 if(!state?.posts||state.writerComments1)return;let changed=0;
 for(const p of state.posts){
  const seen=new Set();const fix=list=>(list||[]).filter(c=>{if(!c)return false;if(SUFFIX.test(String(c.text||''))){c.text=String(c.text).replace(SUFFIX,'');changed++}const k=norm(c.text);if(c.authorId!=='player'&&!c.verified&&k&&seen.has(k)){const n=(typeof NORMAL_NPCS!=='undefined'?NORMAL_NPCS:[]).find(x=>x.id===c.npcId||x.handle===c.handle);const fresh=n?lineFor(n,{...p,comments:[...seen].map(t=>({text:t}))}):'';if(!fresh){changed++;return false}c.text=fresh;changed++}seen.add(norm(c.text));if(c.replies)c.replies=fix(c.replies);return true});
  if(Array.isArray(p.comments))p.comments=fix(p.comments)}
 state.writerComments1=true;persist();if(typeof save==='function')save();return changed;
}
// Safety net: if the scene-director hook (writer-comments.diff) is NOT merged, the director still writes
// its own fixed-bank comments onto fresh posts. Re-voice only those fresh, reply-less director comments.
function sweep(){
 if(globalThis.__SCENE_WRITER_HOOKED__)return 0;let n=0;
 for(const p of (state?.posts||[]).slice(0,25)){for(const c of p.comments||[]){if(!c||c.writer||c.special230||!(c.sceneAi159||c.sceneVoice159)||c.replies?.length||c.authorId||nowMs()-(c.createdAt||0)>15*60000)continue;if(produced.has(norm(c.text))){c.writer=1;continue}const npc=(typeof NORMAL_NPCS!=='undefined'?NORMAL_NPCS:[]).find(x=>x.id===c.npcId);if(!npc)continue;const text=lineFor(npc,{...p,comments:(p.comments||[]).filter(x=>x!==c)});if(text){c.text=text;c.writer=1;n++}}}
 return n;
}
if(typeof save==='function'){const baseSave=save;let inSave=false;save=function(){if(!inSave){inSave=true;try{sweep()}catch{}inSave=false}return baseSave.apply(this,arguments)}}
try{migrate()}catch(e){console.warn('writer-comments migrate',e)}
const timer=setInterval(()=>{if(state?.player&&!state.writerComments1){try{migrate()}catch{}}if(state?.writerComments1)clearInterval(timer)},2000);

const counts=()=>{const o={};let total=0;for(const [t,vs] of Object.entries(LINES)){o[t]={};let s=0;for(const [v,l] of Object.entries(vs)){o[t][v]=l.length;s+=l.length}o[t].total=s;total+=s}o.total=total;return o};
globalThis.SCENE_WRITER_COMMENTS={version:VERSION,lineFor:(n,p)=>{globalThis.__SCENE_WRITER_HOOKED__=true;return lineFor(n,p)},make:makeComment,analyze,topicPlan,counts,stats:()=>JSON.parse(JSON.stringify(STATS)),lines:LINES,baseContextual};
})();
