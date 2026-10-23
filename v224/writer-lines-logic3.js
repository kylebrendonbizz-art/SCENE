/* SCENE Writer: logic3 reply lines (data only, no logic). Hand-written offline templates; no AI, no network.
   Read by scene-logic-v226.js (one merge line after its G bank). Keys/placeholders follow CHANGES_LOGIC3.md:
   planDecline.{busy,travelling,booked} {p}{a} optional · planCounter.{time,place} {p}{a} · planWhen.{ask,propose} {day}/{DAY}
   favourSong/favourAccess/favourFollow (no slots) · askAbout.{known,deflect} {k}/{K} · inviteEvent.<tier> {e}{p}
   planAcceptDay (yes + the day) {activity}{place}{time}; OV.<id>.planAcceptDay = per-starter own lines (used first if the hook reads OV).
   Lines are lowercase base; styled() cases them per character. Curly apostrophes only. */
(()=>{'use strict';
const D={
 "G": {
  "planDecline": {
   "busy": [
    "can’t, i’m slammed right now. rain check?",
    "i want to, but i’m buried in work. another time?",
    "i can’t. my schedule is a crime scene right now",
    "not this time. i’m completely underwater with work",
    "ugh, i can’t. too much on. ask me again soon though",
    "i’m so busy it’s embarrassing. i have to pass on this one",
    "can’t do it, i’m swamped. don’t stop asking though",
    "i’d love to, but i don’t have a free hour right now. soon?",
    "{a} sounds perfect and i still can’t. too much work right now"
   ],
   "travelling": [
    "can’t, i’m travelling. catch me when i’m back?",
    "i’m away for work, so that’s a no. after?",
    "i won’t even be in town, sadly. another time?",
    "i’m on planes for most of it. ask me when i’m back",
    "can’t, i’m out of town. try me again when i land",
    "i’m travelling, so i have to pass. next time i’m around?",
    "i’ll be nowhere near {p}, sorry. when i’m back?",
    "i’m living out of a suitcase right now. not this one",
    "travelling, unfortunately. ask me again when i’m home"
   ],
   "booked": [
    "i’m already booked, sorry. different day?",
    "can’t, i already have something. another day?",
    "that one’s taken, sorry. pick another day?",
    "i’ve got something i can’t move. try me on a different day",
    "booked, sadly. throw me another day",
    "i already said yes to something else. different day?",
    "no, i’m booked. it’s not a no to {a} though",
    "i have a thing i can’t get out of. next time?",
    "i’m already committed to something. ask me another day?"
   ]
  },
  "planCounter": {
   "time": [
    "yes, but can we do a different day?",
    "i’m in, i just need to pick the day. send me a few options?",
    "yes to {a}. the timing is the problem. give me a couple of days?",
    "yes, but my days are a mess. what else works for you?",
    "okay yes. just maybe a different day than you’re thinking",
    "yes. timing’s tricky though. send me some days and i’ll pick",
    "i want to. can we move it to another day?",
    "yes, with one edit: a different day",
    "{a}, yes. the day, maybe not. what are my options?"
   ],
   "place": [
    "yes. somewhere other than {p} though?",
    "i’m in, just not {p}. pick somewhere else?",
    "yes, but can we not do {p}? anywhere else",
    "{a} yes, {p} no. what else is there?",
    "i’m in. {p} is a lot right now though. somewhere else?",
    "yes to you, no to {p}. other ideas?",
    "okay yes, but somewhere quieter than {p}?",
    "i’d do it anywhere except {p}, honestly. your pick",
    "yes. can we swap {p} for somewhere else?"
   ]
  },
  "planWhen": {
   "ask": [
    "what day works for you?",
    "you pick. what day?",
    "depends. what day were you thinking?",
    "i’m flexible-ish. when are you free?",
    "throw me a day and i’ll try to make it work",
    "good question. you tell me",
    "you name the day, i’ll see what i can move",
    "whatever day you’re actually free. which one?",
    "when’s good for you? i’ll work around it"
   ],
   "propose": [
    "how about {day}?",
    "what about {day}?",
    "i can make {day} work, i think",
    "let’s say {day}. tell me if that’s bad",
    "i could do {day}, if you can",
    "put me down for {day}?",
    "{DAY} could work. does it for you?",
    "i’m thinking {day}. yes or no?",
    "maybe {day}? that’s my best guess"
   ]
  },
  "favourSong": {
   "yes": [
    "send it. i’ll listen first",
    "send it. not promising a post, but i’ll actually listen",
    "okay, send it over. honest opinion only",
    "send it. if i love it you’ll know",
    "i’ll listen. no promises past that",
    "send me the song. i listen before i share anything",
    "okay, link me. i’ll give it a proper listen",
    "send it. you’ll get the truth, which is better than a repost",
    "i’ll hear it first. then we talk"
   ],
   "no": [
    "i don’t share music from people i don’t know",
    "i don’t really repost songs from people i’ve never talked to",
    "that’s a big ask for a first message",
    "i don’t post songs from people i don’t know, sorry",
    "sorry, i don’t do song shares like that",
    "that’s not really how my page works",
    "i can’t just post people’s music, sorry",
    "no, sorry. good luck with it though",
    "i get a lot of these. i don’t do them"
   ]
  },
  "favourAccess": {
   "maybe": [
    "i can’t promise that. let me see",
    "that’s not really mine to give out. let me ask, no promises",
    "maybe. don’t tell anyone i said maybe",
    "i’ll see what i can do. that’s not a yes",
    "let me check. it’s not really up to me",
    "hmm. possibly. i’ll ask around, no promises",
    "weirdly that’s above my pay grade. i’ll ask",
    "i can try. if it doesn’t happen, it’s not personal",
    "maybe. let me find out who actually decides that"
   ],
   "no": [
    "i can’t get people in, sorry",
    "that’s not something i can do, sorry",
    "i don’t handle any of that, honestly",
    "no, sorry. that’s not a text thing",
    "i can’t do that for people i don’t really know",
    "that’s a no, sorry. it’s not up to me",
    "i don’t do lists or tickets, sorry",
    "i really can’t. everyone asks and the answer’s always no",
    "not my call, and the answer would be no anyway"
   ]
  },
  "favourFollow": {
   "yes": [
    "i’ll take a look",
    "i’ll check out your page",
    "maybe. i’ll have a look at what you’re posting",
    "i’ll scroll through later. no promises",
    "lol okay, i’ll look",
    "i’ll have a look next time i’m on there",
    "let me see what you’ve got first",
    "i don’t do it on request, but i’ll look",
    "noted. i’ll look at your page"
   ],
   "no": [
    "i don’t really do follow-backs or shout-outs",
    "i don’t do that on request, sorry",
    "i don’t really do that kind of thing on here",
    "not something i do, sorry",
    "i don’t do that for people i don’t know",
    "that’s not really how i use my page",
    "sorry, no. i keep that stuff small",
    "it’s a no on that one, sorry. it’s a rule",
    "no, sorry. i don’t do that for anyone"
   ]
  },
  "askAbout": {
   "known": [
    "the {k}? soon. that’s all i can say",
    "you saw the post. that’s everything i’m allowed to say",
    "{K}? i’ve said what i can. more soon",
    "the {k} is coming. i can’t say more than that yet",
    "everything i can share about the {k} is already up",
    "the {k}? you know as much as i’m allowed to tell you",
    "soon. that’s all you’re getting on the {k}",
    "the post is all i’ve got on the {k} for now",
    "i can’t give you more on the {k} than what’s up. sorry"
   ],
   "deflect": [
    "can’t talk about the {k} yet",
    "the {k}? no comment, sadly",
    "if there’s {k} news, you’ll hear it with everyone else",
    "nice try. nothing on the {k} from me",
    "when there’s {k} news, i’ll say it. not before",
    "no {k} news from me, sorry",
    "you’ll know when everyone knows",
    "i don’t talk about stuff before it’s real",
    "that’s not a text question, sorry"
   ]
  },
  "inviteEvent": {
   "stranger": [
    "that’s nice, but i don’t go to things with people i haven’t met",
    "we’ve never met, so {e} is a no from me",
    "i’m going to pass. we don’t really know each other",
    "ha, {e} with someone i just met? no",
    "that’s a lot for a first conversation"
   ],
   "friendly": [
    "maybe. let me check that night for {e}",
    "ooh, {e} could be fun. i’ll see if i’m free",
    "possibly. i need to check where i am that night",
    "i’m not saying no to {e}. let me look",
    "maybe. {p} is fun, let me check"
   ],
   "close": [
    "yes, i’m in for {e}",
    "obviously. {e}, we’re going",
    "yes. meet you at {p}?",
    "okay yes. i’m in for {e}",
    "yes please. {e} sounds perfect"
   ],
   "rival": [
    "not right now.",
    "no.",
    "i’ll pass."
   ]
  },
  "planAcceptDay": [
   "yes. {place}, {time}. i’m in",
   "{time} works. see you in {place}",
   "{time} in {place}? done",
   "okay, {activity} in {place} {time}. it’s happening",
   "yes to {time}. don’t you dare flake",
   "perfect. {place}, {time}. i’ll be there",
   "i’m in. {time}, {place}. holding you to it",
   "yes. {activity} {time} sounds right",
   "{time}? yes. {place} it is",
   "that works. {activity}, {place}, {time}. done"
  ]
 },
 "OV": {
  "sabrina": {
   "planAcceptDay": [
    "Yes. {place}, {time}. I’m clearing my very important schedule",
    "{time} in {place}. Dangerous. I’m in",
    "Done. {activity} {time}, legally binding",
    "Okay, {time}. Flake and I’ll never recover 🙂",
    "Yes to {time}. I’ll pretend I’m not excited"
   ]
  },
  "charli": {
   "planAcceptDay": [
    "yes. {time}. don’t make it boring",
    "ok {place} {time}?? i’m in lol",
    "{activity} {time}, done. we’re not leaving early",
    "yes lol. {time} works",
    "ok it’s happening. {time}. be fun"
   ]
  },
  "tatemcrae": {
   "planAcceptDay": [
    "waittt yes. {time} works",
    "yes!! {time} in {place}, i’m so in",
    "okay {time}. my legs will be dead but i’m coming lol",
    "yes lol. {activity} {time}, don’t let me fall asleep",
    "yesss. {time}, {place}. sorry in advance if i’m late"
   ]
  },
  "sydney": {
   "planAcceptDay": [
    "yes! {time} works",
    "okay, {activity} in {place} {time}. i’m in",
    "{time}? that is perfect actually",
    "yes. {time}, {place}. i might show up looking like a long day 😂",
    "done. {time}. don’t cancel on me"
   ]
  },
  "timothee": {
   "planAcceptDay": [
    "Wait, okay. {time} in {place}? Yes.",
    "Yes, man. {time} works",
    "{activity} in {place} {time}. This is kind of incredible.",
    "Okay, {time}. I’m writing it down. Physically.",
    "Yes. {time}, {place}. Don’t let me be late 😂"
   ]
  },
  "zendaya": {
   "planAcceptDay": [
    "yes 🤍 {time} works",
    "honestly, {time} in {place} sounds perfect",
    "okay. {activity} {time}. i’m in",
    "{time} is good. see you there",
    "yes. {time}, {place}. looking forward to it"
   ]
  },
  "hailey": {
   "planAcceptDay": [
    "yesss {time} works",
    "okay wait, {activity} in {place} {time}? cute. i’m in",
    "yes! {time}. i’m bringing a coffee",
    "okay {time}, {place}. done 🤍",
    "honestly yes. {time} is perfect"
   ]
  },
  "kendall": {
   "planAcceptDay": [
    "lol yes. {time}",
    "hmm, {time} works. fine. i’m in",
    "{time} in {place}. okay",
    "yeah, {activity} {time}. don’t make it a whole thing",
    "okay {time}. keep it out of the group chat"
   ]
  },
  "kylie": {
   "planAcceptDay": [
    "okayyy yes. {time}",
    "wait yes. {activity} in {place} {time} 👀",
    "yes! {time}. i’m already planning outfits",
    "okayyy {place}, {time}. it’s happening",
    "{time} works. tell me the plan"
   ]
  },
  "doja": {
   "planAcceptDay": [
    "yes. {time}. i’ll be there spiritually and physically",
    "lmao okay. {activity} {time}, i’m in",
    "{time} in {place}? deeply serious yes",
    "absolutely. {time}. don’t be normal about it",
    "okay {time}. this is objectively ridiculous. proceed."
   ]
  }
 }
};
globalThis.SCENE_WRITER_LINES_L3=Object.freeze({version:1,...D});
})();
