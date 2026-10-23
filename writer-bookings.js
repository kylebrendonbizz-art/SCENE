/* SCENE Writer: booking stories (window.SCENE_BOOKING_STORIES).
   Hand-written copy, offline only: no AI, no network.
   Read by the hook in v224/living-world-v48.js (signatureJobScene48 + finishGig48 outcome card).
   byJob[baseJobId] = array of scenarios {s: setup, c: [[choice, tag, winLine, failLine] x3]}.
   Choice order maps onto the existing signature score profile [4,3,2] (bold, messy/clever, safe), so pay/fame/XP/gems
   follow exactly the same rules as before. No placeholders are used. Kill switch: window.SCENE_WRITER_BOOKINGS_OFF=true
   story-copy2: every Music booking also has two 4-choice scenes (c: x4, strongest first). titles3 uses them only for the
   4-choice generic slots (music-decision-0 Soundcheck, music-decision-3 Rumour) and maps choice r onto that question's r-th
   highest weight (3/2/1/0 or 4/3/2/1), so rewards stay the same. Moment 1 never uses a 4-choice scene. */
window.SCENE_BOOKING_STORIES={
 "version": "writer-bookings-1",
 "profile": [
  4,
  3,
  2
 ],
 "byJob": {
  "music-club": [
   {
    "s": "The 800-cap room is half full and the bar is louder than your monitors. A guy by the door is filming the ceiling. You have forty minutes to make them turn around.",
    "c": [
     [
      "Open with the loudest song you have",
      "volume as a strategy",
      "Heads turn on the first chorus. Even the bartender stops pouring to watch.",
      "Too loud, too early. The sound guy gives you a look you will see in your sleep."
     ],
     [
      "Jump off the stage and sing from the bar",
      "bring the show to them",
      "You end up on the bar top. Somebody tips you. It is the best night of your life.",
      "You get stuck between two stools mid-verse. The clip is funny. You are less sure."
     ],
     [
      "Play the set exactly as rehearsed",
      "trust the prep",
      "Clean, tight, no wasted seconds. The promoter books you again before you pack up.",
      "Polished but polite. The room claps like it is at a dentist's open day."
     ]
    ]
   },
   {
    "s": "The promoter hands you a drink ticket and a warning: the headliner's fans are already here and they do not care who you are. Somebody in the front row is wearing a shirt with the headliner's face on it.",
    "c": [
     [
      "Shout out the headliner and win their fans",
      "borrow the hype",
      "Shirt guy sings your last chorus back to you. A convert, at last.",
      "The crowd cheers for the headliner's name and then goes straight back to their phones."
     ],
     [
      "Dedicate a song to shirt guy",
      "pick a target",
      "Shirt guy films the whole thing. His story gets more views than your last post.",
      "Shirt guy leaves for the bar halfway through his own dedication."
     ],
     [
      "Keep your head down and let the songs work",
      "quiet confidence",
      "By song four the chatter dies. They came for someone else. They leave talking about you.",
      "They talk through all of it. You still get paid, which honestly helps."
     ]
    ]
   },
   {
    "s": "Your guitar strap snaps during the soundcheck. Doors open in ten minutes. The only spare in the building is a bright pink one with 'BRIDE SQUAD' on it.",
    "c": [
     [
      "Wear the Bride Squad strap with pride",
      "commit to the bit",
      "It becomes the whole look. Three people ask where you got it.",
      "The strap is the only thing anyone posts about. The songs barely get a mention."
     ],
     [
      "Play sitting on the drum riser",
      "make it intimate",
      "The room leans in. It feels like a secret show inside a real one.",
      "Nobody past row three can see you. You are basically a rumour."
     ],
     [
      "Tape the old strap and hope",
      "patch it and pray",
      "The tape holds. Nobody knows. You will never tell them.",
      "The tape gives out on the bridge. You catch the guitar. Mostly."
     ]
    ]
   },
   {
    "s": "The set before yours ran long and now you only get thirty minutes. The promoter says to cut 'the slow one'. The slow one is your best song.",
    "c": [
     [
      "Cut a fast one and keep the slow one",
      "protect the heart",
      "The slow one stops the room cold. Someone near the front is crying in a good way.",
      "The slow one lands in a room that wanted to dance. Long four minutes."
     ],
     [
      "Mash the slow one into the opener",
      "make it weird",
      "The mashup works so well you are now keeping it forever.",
      "The mashup confuses everyone, including your drummer."
     ],
     [
      "Do what the promoter says",
      "keep the peace",
      "The promoter remembers you were easy. That matters more than it should.",
      "The set is fine. The slow one waits for a better night."
     ]
    ]
   },
   {
    "s": "Soundcheck is forty minutes behind. The in-ears keep cutting out, doors are open and the front row has started a slow clap. The promoter keeps tapping his watch like you owe him money.",
    "c": [
     [
      "Strip it back to voice and one guitar and walk out",
      "raw over perfect",
      "The stripped version silences the room. Someone yells that it's better than the record.",
      "Without the band the first song feels thin. You win them back by the third."
     ],
     [
      "Cut one song and start on time",
      "protect the clock",
      "Nobody misses the missing song. The set is tight and the promoter finally stops glaring.",
      "You cut the song the front row came for. They let you know about it."
     ],
     [
      "Keep fixing the mix until it's right",
      "chase the sound",
      "When you finally start it sounds incredible. The wait almost feels worth it.",
      "By the time it sounds right, half the room is at the bar."
     ],
     [
      "Ask the opener to stretch their set",
      "buy time",
      "The opener plays two extra songs and makes some new fans. Generous of you.",
      "The opener fills the time with a cover of your song. Louder than yours."
     ]
    ]
   },
   {
    "s": "The podcast host leans into the mic and says, 'So. About the feud.' You didn't know you had a feud. Apparently it trended yesterday.",
    "c": [
     [
      "Laugh and say the only feud is with your alarm clock",
      "charm offensive",
      "Big laugh. The feud dies on air and the clip goes everywhere for the right reasons.",
      "The joke lands halfway. At least nobody's talking about the feud anymore."
     ],
     [
      "Say 'no comment' with a smile",
      "keep them guessing",
      "The smile does all the work. By tonight everyone has a theory and your name is on all of them.",
      "'No comment' is now the most quoted thing you've ever said. Not ideal."
     ],
     [
      "Ask who exactly you're feuding with",
      "call the bluff",
      "The host can't name them. The audience loves it and the host blushes.",
      "The host names someone. You've never met them. Now you probably will."
     ],
     [
      "Refuse to talk about anything but the song",
      "boundaries",
      "Firm and clear. The host respects it, eventually.",
      "The rest of the interview is very short and very awkward."
     ]
    ]
   }
  ],
  "music-rooftop": [
   {
    "s": "Golden hour is twelve minutes long and the camera crew wants all of it. A wind gust takes your setlist off the roof. It is now somewhere over Main Street.",
    "c": [
     [
      "Play whatever feels right in the moment",
      "no list, no fear",
      "The order you invent on the fly is better than the one you wrote.",
      "You play the same song twice by accident. The second one is slightly worse."
     ],
     [
      "Ask the crowd to shout requests",
      "let them steer",
      "Someone requests a deep cut. You nail it. Instant cult status.",
      "Someone requests a song by another artist. Three times."
     ],
     [
      "Stick to the four songs you know cold",
      "play it safe",
      "Four songs, four clean takes, one perfect sunset in the footage.",
      "Safe and short. The crew asks if there is any more."
     ]
    ]
   },
   {
    "s": "The host's dog keeps walking into frame and the director loves it. The dog is now in every shot. You are slightly jealous of the dog.",
    "c": [
     [
      "Make the dog your co-star",
      "share the spotlight",
      "The dog clip runs everywhere. Your name is in every caption.",
      "The dog gets a fan account. You do not."
     ],
     [
      "Write a quick verse about the dog",
      "improv a moment",
      "The dog verse is the clip of the day. Nobody saw it coming.",
      "The dog verse rhymes 'paws' with 'pause'. It lives forever."
     ],
     [
      "Ask for the dog to be taken inside",
      "protect the shot",
      "Clean footage, perfect light, nobody stealing your thunder.",
      "The crowd boos the dog's exit. Gently, but they boo."
     ]
    ]
   },
   {
    "s": "The sunset is perfect but the rooftop's speaker is a single Bluetooth box. Fifteen people in sunglasses are waiting. One of them runs a playlist everybody follows.",
    "c": [
     [
      "Play fully unplugged and walk the crowd",
      "go acoustic and close",
      "Playlist person takes a video. By morning you are on their list.",
      "Too quiet for the far corner. Half the roof hears a lovely rumour."
     ],
     [
      "Sing straight to the playlist person",
      "aim high",
      "Playlist person smiles and DMs you before the set even ends.",
      "Playlist person is on a call the entire time."
     ],
     [
      "Turn the speaker up and push through",
      "make it work",
      "It is scrappy but charming. Everybody leaves humming.",
      "The speaker crackles every time you hit a high note."
     ]
    ]
   },
   {
    "s": "A helicopter hovers overhead mid-song and drowns you out. The crew is filming anyway. The crowd looks at you, waiting to see what you do.",
    "c": [
     [
      "Sing louder than the helicopter",
      "fight the sky",
      "You win. The crowd screams. The helicopter leaves, defeated.",
      "The helicopter wins. You win second place."
     ],
     [
      "Wave at the helicopter like it is a fan",
      "turn it into a joke",
      "The wave clip is everywhere. The helicopter has never been so loved.",
      "Nobody in the helicopter waves back. Brutal."
     ],
     [
      "Pause and start the song again",
      "reset the moment",
      "The restart feels deliberate and the second take is better.",
      "The helicopter comes back for the second take. It is personal now."
     ]
    ]
   },
   {
    "s": "Your laptop crashes mid-soundcheck and takes every backing track with it. The engineer is rebooting with his eyes closed. Through the curtain the crowd is chanting your name, slightly out of time.",
    "c": [
     [
      "Go out with no tracks and play it live",
      "no safety net",
      "No tracks, no click, all nerve. It's the rawest set you've ever played and the room loves it.",
      "It's shaky without the tracks, but nobody leaves. Barely."
     ],
     [
      "Drop the song that needs the tracks most",
      "cut your losses",
      "You lose one song and keep the whole room. Smart trade.",
      "That was the song with the big drop. You feel its absence all night."
     ],
     [
      "Wait for the reboot and rebuild the set",
      "fix it properly",
      "The tracks come back and the show is exactly what you planned. Just late.",
      "The reboot takes twenty minutes. The chanting stops after ten."
     ],
     [
      "Send the opener back on for a bit",
      "stall for time",
      "The opener gets an encore they'll talk about for years.",
      "The opener runs out of songs. They start telling jokes. Badly."
     ]
    ]
   },
   {
    "s": "Halfway through the live session, the radio host reads a fan text out loud asking if your label dropped you. They didn't. Probably. The studio goes very quiet.",
    "c": [
     [
      "Laugh and play the new song as your answer",
      "let the music talk",
      "You play the new one. By the bridge nobody remembers the question.",
      "The joke falls flat, but the song is good enough to carry it."
     ],
     [
      "Hint that something big is coming",
      "tease the drop",
      "Your hint becomes a countdown. Fans start guessing release dates in the comments.",
      "The hint becomes a rumour of its own. Your manager is on the phone already."
     ],
     [
      "Ask the host if they're hiring",
      "turn the tables",
      "The host loses it laughing and the moment becomes the best clip of the show.",
      "The host says yes, actually. The silence gets worse."
     ],
     [
      "Say you're not answering that",
      "shut it down",
      "Clean, calm, done. The host moves on quickly.",
      "It comes across colder than you meant. The text gets read again on another show."
     ]
    ]
   }
  ],
  "music-listening": [
   {
    "s": "Twenty tastemakers on velvet couches, three unreleased songs, phones in sealed pouches. One woman is already scribbling notes. You cannot read her face at all.",
    "c": [
     [
      "Explain what each song is about",
      "sell the story",
      "She stops writing and actually listens. Her review is glowing.",
      "You overexplain. She writes 'overexplains' in big letters."
     ],
     [
      "Play the weirdest song first",
      "lead with the risk",
      "The room sits up. Everyone talks about track one all night.",
      "Track one throws the room. They spend track two recovering."
     ],
     [
      "Let the music play with no intro",
      "stay mysterious",
      "Silence, then applause. The mystery works on everyone.",
      "The silence is awkward. Someone coughs during the bridge."
     ]
    ]
   },
   {
    "s": "Halfway through track two, someone's phone pouch pops open and the screen lights up. The room freezes. Everybody looks at you.",
    "c": [
     [
      "Laugh and say they can post ten seconds",
      "leak it on purpose",
      "The ten seconds become a mini trend. Everyone wants the full song.",
      "The ten seconds are the worst ten seconds of the song."
     ],
     [
      "Ask for the phone and hold it while you play",
      "make it theatre",
      "The room loves it. You get a round of applause for the confiscation.",
      "You hold the phone so long it rings. It is their mum."
     ],
     [
      "Have the host quietly reseal it",
      "keep it professional",
      "Dealt with in seconds. The room respects how you protected the music.",
      "The fuss takes longer than the song. The vibe takes a hit."
     ]
    ]
   },
   {
    "s": "A rival's manager is sitting in the front row. They clap politely after every song like they are taking notes for someone else.",
    "c": [
     [
      "Dedicate the next song to them",
      "call it out with a smile",
      "The room laughs. The manager laughs too. That's how you win a room.",
      "The manager does not laugh. It is very quiet for a very long time."
     ],
     [
      "Play the song that sounds most like the rival",
      "prove a point",
      "Everyone hears that you did it better. The manager leaves early.",
      "It sounds like a cover. Someone says so out loud."
     ],
     [
      "Ignore them completely",
      "rise above it",
      "Your calm reads as confidence. The tastemakers notice the difference.",
      "You ignore them so hard it becomes obvious."
     ]
    ]
   },
   {
    "s": "The playback system skips and your third track starts at the bridge. It is the best part of the song, but nobody has heard the start yet.",
    "c": [
     [
      "Sing the opening over the top live",
      "save it live",
      "The live opening gives everyone goosebumps. It should always be this way.",
      "Your live key clashes with the recording. Very modern. Not on purpose."
     ],
     [
      "Tell them this is the bridge-first version",
      "own the accident",
      "They believe it was planned. You are now a genius.",
      "Nobody buys it. A tastemaker smirks into their drink."
     ],
     [
      "Stop it and start again from the top",
      "do it properly",
      "The restart lands. The song gets the moment it deserves.",
      "The restart kills the momentum. The room never quite gets it back."
     ]
    ]
   },
   {
    "s": "The drummer's flight landed an hour late and he's still in the cab. Soundcheck starts at doors. The engineer says he needs fifteen minutes. The crowd, loudly, says he doesn't.",
    "c": [
     [
      "Start acoustic and bring him in when he lands",
      "make it a moment",
      "He runs on mid-song with his bag still on his back. The room loses its mind.",
      "He arrives two songs late and spends the third catching up."
     ],
     [
      "Cut the hardest song and go on time",
      "keep it tight",
      "The set is shorter and sharper. Nobody notices the cut.",
      "Somebody notices the cut. They shout the title between every song."
     ],
     [
      "Hold the stage until the drums are checked",
      "do it right",
      "When it starts, it sounds huge. The wait was worth it. Mostly.",
      "Fifteen minutes becomes forty. The room cools down and never fully warms up."
     ],
     [
      "Ask the opener to cover another twenty minutes",
      "lean on a favour",
      "The opener says yes and now owes you nothing. You owe them a lot.",
      "The opener says yes, then plays their quietest songs. The room falls asleep."
     ]
    ]
   },
   {
    "s": "The presenter puts a blurry photo up on the big screen: you leaving a restaurant with someone famous. The audience gasps right on cue. The presenter just waits.",
    "c": [
     [
      "Laugh and say the food was the real story",
      "deflect with jokes",
      "The audience laughs with you, not at you. Then you play the song and they stay with you.",
      "The laugh helps, but the photo stays on the screen a little too long."
     ],
     [
      "Say you had a lovely dinner and leave it there",
      "just enough",
      "Short, warm, quotable. It's on every gossip page by morning, right next to your song.",
      "'A lovely dinner' becomes a meme. Not the kind you wanted."
     ],
     [
      "Ask the presenter who took the photo",
      "flip it",
      "The presenter fumbles and the crowd turns on the camera crew. In a fun way.",
      "The presenter knows who took it. It was their cousin."
     ],
     [
      "Say you don't talk about your private life",
      "close the door",
      "Clean and dignified. The segment moves on.",
      "The segment moves on, but the clip of you saying it doesn't."
     ]
    ]
   }
  ],
  "music-support": [
   {
    "s": "Another act drops out two hours before doors. You get a call sheet with your name spelled wrong and a dressing room that is actually a storage cupboard. The crowd starts arriving.",
    "c": [
     [
      "Make an entrance through the crowd",
      "own the night",
      "By the time you hit the stage, half the room is already on your side.",
      "You get stuck in the merch line. Your entrance is a slow shuffle."
     ],
     [
      "Introduce yourself with the wrong name",
      "play with it",
      "The crowd chants the wrong name. It might be your brand now.",
      "The joke goes over everyone's head. Now the wrong name is on a poster."
     ],
     [
      "Get on, play tight and get off",
      "keep it clean",
      "Short, sharp and on time. The tour manager notes it.",
      "Clean set, quiet crowd, nobody remembers which name it was."
     ]
    ]
   },
   {
    "s": "The headliner's crew needs the stage in thirty minutes but your band is still stuck in traffic. You have a microphone, a keyboard and a crowd that paid for a full show.",
    "c": [
     [
      "Do it solo on keys",
      "strip it back",
      "The solo set becomes the story. Fans call it the best opener this tour.",
      "Your keyboard skills are loud, proud and limited."
     ],
     [
      "Recruit the drummer from the headliner",
      "make a deal",
      "He knows your songs. Nobody knows how. The crowd goes wild.",
      "He only knows one of your songs. You play it three times."
     ],
     [
      "Wait backstage and start late",
      "play it by the book",
      "The band arrives and you play a full, solid set. The headliner's team respects it.",
      "You start twenty minutes late. The headliner's crew sighs on mic."
     ]
    ]
   },
   {
    "s": "The crowd chants for the headliner during your first song. Loudly. Right through the chorus.",
    "c": [
     [
      "Chant along and lead it",
      "join, then steal",
      "You lead the chant into your chorus. Smoothest pivot of the year.",
      "The chant keeps going without you. You are just a backing vocalist now."
     ],
     [
      "Stop and do a crowd poll",
      "make it interactive",
      "The poll turns the room playful. By the end they are chanting your name.",
      "The poll result is very clear and not about you."
     ],
     [
      "Play through it and ignore the noise",
      "stay unshaken",
      "By song three the chant fades. You held your nerve, and people saw it.",
      "You play through it. They chant through it. Everyone loses."
     ]
    ]
   },
   {
    "s": "You find the headliner's setlist in the shared dressing room. Your opener and their opener are the same cover song.",
    "c": [
     [
      "Play it anyway, but better",
      "start a rivalry",
      "Yours goes viral. Theirs gets compared. Awkward for them.",
      "Theirs is the version everyone films. Yours is the warmup."
     ],
     [
      "Swap to a cover nobody expects",
      "pull a surprise",
      "The deep-cut cover wins the night. Even the headliner claps.",
      "The cover is so obscure the room thinks it is an original. A bad one."
     ],
     [
      "Drop the cover and play an original",
      "stay in your lane",
      "The original lands. The headliner's team thanks you quietly.",
      "Your original gets a polite clap. Their cover gets a scream."
     ]
    ]
   },
   {
    "s": "Five minutes until the stream goes live and your mic is still buzzing like a fridge. The chat is already filling with question marks. The producer whispers 'your call' and backs slowly out of shot.",
    "c": [
     [
      "Unplug everything and sing straight to the room mic",
      "own the mess",
      "It's lo-fi and close and weirdly intimate. The chat calls it the best version yet.",
      "The room mic catches everything, including the producer sneezing."
     ],
     [
      "Cut the opening song and start clean",
      "save the slot",
      "You start a few minutes late with a clean sound. Nobody minds.",
      "The opening song was the one everyone came for. The chat asks where it went."
     ],
     [
      "Keep swapping cables until the buzz is gone",
      "perfectionist",
      "The buzz goes. The sound is perfect. The chat has been waiting a while.",
      "Six cables later the buzz is still there and now it's louder."
     ],
     [
      "Ask the host to fill time with a chat",
      "stall politely",
      "The host tells a long story. It's actually great.",
      "The host fills the time by reading out comments about you. Not the nice ones."
     ]
    ]
   },
   {
    "s": "Live on air, the host skips your song completely and asks if the dating rumour is true. The producer behind the glass is nodding way too hard.",
    "c": [
     [
      "Laugh it off and play the song",
      "pivot with charm",
      "You laugh, you play, and the clip of the pivot does better than the gossip ever would.",
      "The pivot is a bit clunky, but the song lands and people move on."
     ],
     [
      "Give them just enough for a headline",
      "feed the cycle",
      "A careful half answer becomes the headline. Your streams go up by dinner.",
      "The half answer turns into a whole story. Your phone doesn't stop all day."
     ],
     [
      "Ask the host what they heard",
      "flip the script",
      "The host stammers, the crew laughs and suddenly the interview is about the host.",
      "The host had an answer ready. You did not see that coming."
     ],
     [
      "Shut the question down",
      "hold the line",
      "You say you're here for the music. Polite, firm, a little cold on camera.",
      "The silence after your answer is very long. Someone coughs."
     ]
    ]
   }
  ],
  "music-studio": [
   {
    "s": "It's 1am. The producer has one free night, a half-written beat and a cold slice of pizza. He presses record and says, 'go.'",
    "c": [
     [
      "Freestyle the whole verse",
      "trust your gut",
      "Take one is the keeper. The producer just nods and says 'yeah.'",
      "Take one has a pizza crunch in it. So does take two."
     ],
     [
      "Ask him to flip the beat backwards",
      "get experimental",
      "The backwards beat becomes the hook of the year.",
      "It sounds like a fax machine. A very confident fax machine."
     ],
     [
      "Ask for an hour to write first",
      "write it right",
      "The verse you write is the best you have ever done.",
      "You spend so long writing the producer falls asleep."
     ]
    ]
   },
   {
    "s": "The producer plays you a track with a sample from a song your mum loves. It is perfect. It will cost a fortune to clear.",
    "c": [
     [
      "Write on it anyway",
      "fall in love",
      "The song is undeniable. Somebody somewhere will find the money.",
      "Legal says no. You now have a perfect song you can never release."
     ],
     [
      "Replay the sample with your own voice",
      "hack the problem",
      "Your sung version is better than the original. Legally safer too.",
      "The vocal sample sounds like you are humming in a lift."
     ],
     [
      "Move to a beat you can actually release",
      "stay practical",
      "The cleaner track becomes the single. Your manager is thrilled.",
      "The cleaner track is fine. The other one haunts you."
     ]
    ]
   },
   {
    "s": "A famous rapper walks into the studio by mistake, looking for the bathroom. The producer says, 'play them the hook. Now.'",
    "c": [
     [
      "Play it at full volume",
      "shoot your shot",
      "They stop, nod and ask who you are. Now they know.",
      "They nod politely, find the bathroom and never come back."
     ],
     [
      "Ask them to rate it out of ten",
      "a little cheek",
      "They give it a nine and say the missing point is a feature. Interesting.",
      "They give it a four and leave. It hurts in a specific way."
     ],
     [
      "Point them to the bathroom and keep working",
      "stay focused",
      "You finish the song without distraction. It is the best thing you have made.",
      "You keep working, but you spend the night wondering what might have happened."
     ]
    ]
   },
   {
    "s": "Your voice cracks on the high note in the last take. The producer stops the playback, rewinds and plays it again. He is smiling.",
    "c": [
     [
      "Keep the crack in the final mix",
      "make the flaw the hook",
      "Fans call it the most human moment on the record.",
      "Fans call it the most human moment. Critics call it a mistake."
     ],
     [
      "Double it with a harmony and a laugh",
      "make it a moment",
      "The laugh on the record turns into everybody's favourite part.",
      "The laugh sounds forced on the eleventh listen. Then the twelfth."
     ],
     [
      "Retake until the note is perfect",
      "chase perfect",
      "Take forty is flawless. The producer gives you a fist bump.",
      "Take forty is flawless and lifeless. Take one is still better."
     ]
    ]
   },
   {
    "s": "Soundcheck is forty minutes behind. The in-ears keep cutting out, doors are open and the front row has started a slow clap. The promoter keeps tapping his watch like you owe him money.",
    "c": [
     [
      "Strip it back to voice and one guitar and walk out",
      "raw over perfect",
      "The stripped version silences the room. Someone yells that it's better than the record.",
      "Without the band the first song feels thin. You win them back by the third."
     ],
     [
      "Cut one song and start on time",
      "protect the clock",
      "Nobody misses the missing song. The set is tight and the promoter finally stops glaring.",
      "You cut the song the front row came for. They let you know about it."
     ],
     [
      "Keep fixing the mix until it's right",
      "chase the sound",
      "When you finally start it sounds incredible. The wait almost feels worth it.",
      "By the time it sounds right, half the room is at the bar."
     ],
     [
      "Ask the opener to stretch their set",
      "buy time",
      "The opener plays two extra songs and makes some new fans. Generous of you.",
      "The opener fills the time with a cover of your song. Louder than yours."
     ]
    ]
   },
   {
    "s": "The podcast host leans into the mic and says, 'So. About the feud.' You didn't know you had a feud. Apparently it trended yesterday.",
    "c": [
     [
      "Laugh and say the only feud is with your alarm clock",
      "charm offensive",
      "Big laugh. The feud dies on air and the clip goes everywhere for the right reasons.",
      "The joke lands halfway. At least nobody's talking about the feud anymore."
     ],
     [
      "Say 'no comment' with a smile",
      "keep them guessing",
      "The smile does all the work. By tonight everyone has a theory and your name is on all of them.",
      "'No comment' is now the most quoted thing you've ever said. Not ideal."
     ],
     [
      "Ask who exactly you're feuding with",
      "call the bluff",
      "The host can't name them. The audience loves it and the host blushes.",
      "The host names someone. You've never met them. Now you probably will."
     ],
     [
      "Refuse to talk about anything but the song",
      "boundaries",
      "Firm and clear. The host respects it, eventually.",
      "The rest of the interview is very short and very awkward."
     ]
    ]
   }
  ],
  "music-writers": [
   {
    "s": "Three writers, one impossible brief, a hook due before sunrise. The brief says 'like summer, but sad, but danceable, but for a car ad.'",
    "c": [
     [
      "Pitch the weirdest hook in the room",
      "swing first",
      "The room goes quiet, then everybody starts building on yours.",
      "The room goes quiet and stays quiet. Someone suggests a break."
     ],
     [
      "Turn the brief into a joke song",
      "let off steam",
      "The joke song is accidentally the best thing written all week.",
      "The joke song makes everyone laugh and nobody can use it."
     ],
     [
      "Follow the brief to the letter",
      "deliver",
      "Your hook ticks every box. The car people are delighted.",
      "It ticks every box. That is the only thing it does."
     ]
    ]
   },
   {
    "s": "One writer keeps reusing a line from their old song. Everybody notices. Nobody says anything. The hook is due in an hour.",
    "c": [
     [
      "Say it out loud, nicely",
      "clear the air",
      "The writer laughs, fixes it and the new line is better. Respect.",
      "The writer goes quiet for the rest of the session. The air stays very thick."
     ],
     [
      "Rewrite the line into something weirder",
      "sneak a fix",
      "They love the rewrite and think it was their idea. Everybody wins.",
      "They change it back when you go to the bathroom."
     ],
     [
      "Let it slide and focus on the hook",
      "pick your battles",
      "The hook is great. The recycled line can be somebody else's problem.",
      "The recycled line makes the final cut. You wince every time."
     ]
    ]
   },
   {
    "s": "At 3am, the youngest writer in the room plays a voice memo of a melody they hummed in the shower. It is better than anything you have written all night.",
    "c": [
     [
      "Build the whole song around it",
      "back the newcomer",
      "The shower melody becomes the single. The newcomer cries. You cry.",
      "The shower melody is perfect for ten seconds and goes nowhere after."
     ],
     [
      "Turn it into a duet",
      "share the credit",
      "The duet sounds like a real moment between two people. Fans love it.",
      "The duet feels like two songs fighting over one microphone."
     ],
     [
      "Save it for later and finish the brief",
      "stay on task",
      "You deliver on time and keep the memo for the next session.",
      "You deliver on time. The memo becomes someone else's hit."
     ]
    ]
   },
   {
    "s": "The A&R calls at 4am asking for 'something more viral'. Everyone in the room groans. There is one slice of cold toast left.",
    "c": [
     [
      "Add a dance break nobody asked for",
      "overdeliver",
      "The dance break makes the song. The A&R calls back screaming.",
      "The dance break sounds like a different song. The A&R is confused."
     ],
     [
      "Write a song about the A&R's call",
      "get petty",
      "The petty song gets passed around the label. Everyone loves it.",
      "The A&R hears the petty song. Nobody is sure if they are laughing."
     ],
     [
      "Cut the song shorter and punchier",
      "keep it tight",
      "Under two minutes, all hook. The A&R says 'yes, that.'",
      "Under two minutes, all hook, no soul."
     ]
    ]
   },
   {
    "s": "Your laptop crashes mid-soundcheck and takes every backing track with it. The engineer is rebooting with his eyes closed. Through the curtain the crowd is chanting your name, slightly out of time.",
    "c": [
     [
      "Go out with no tracks and play it live",
      "no safety net",
      "No tracks, no click, all nerve. It's the rawest set you've ever played and the room loves it.",
      "It's shaky without the tracks, but nobody leaves. Barely."
     ],
     [
      "Drop the song that needs the tracks most",
      "cut your losses",
      "You lose one song and keep the whole room. Smart trade.",
      "That was the song with the big drop. You feel its absence all night."
     ],
     [
      "Wait for the reboot and rebuild the set",
      "fix it properly",
      "The tracks come back and the show is exactly what you planned. Just late.",
      "The reboot takes twenty minutes. The chanting stops after ten."
     ],
     [
      "Send the opener back on for a bit",
      "stall for time",
      "The opener gets an encore they'll talk about for years.",
      "The opener runs out of songs. They start telling jokes. Badly."
     ]
    ]
   },
   {
    "s": "Halfway through the live session, the radio host reads a fan text out loud asking if your label dropped you. They didn't. Probably. The studio goes very quiet.",
    "c": [
     [
      "Laugh and play the new song as your answer",
      "let the music talk",
      "You play the new one. By the bridge nobody remembers the question.",
      "The joke falls flat, but the song is good enough to carry it."
     ],
     [
      "Hint that something big is coming",
      "tease the drop",
      "Your hint becomes a countdown. Fans start guessing release dates in the comments.",
      "The hint becomes a rumour of its own. Your manager is on the phone already."
     ],
     [
      "Ask the host if they're hiring",
      "turn the tables",
      "The host loses it laughing and the moment becomes the best clip of the show.",
      "The host says yes, actually. The silence gets worse."
     ],
     [
      "Say you're not answering that",
      "shut it down",
      "Clean, calm, done. The host moves on quickly.",
      "It comes across colder than you meant. The text gets read again on another show."
     ]
    ]
   }
  ],
  "music-college": [
   {
    "s": "The college radio host was supposed to do a short interview. Now she wants you to play live. On a ukulele. The only instrument in the room is a ukulele.",
    "c": [
     [
      "Play your single on the ukulele",
      "commit fully",
      "The ukulele version is adorable. Students play it all week.",
      "Your single on four strings sounds like a toy commercial."
     ],
     [
      "Turn it into a ukulele tutorial",
      "make it educational",
      "The tutorial clip gets passed around campus. You are now a teacher.",
      "You only know two chords, which becomes clear very quickly."
     ],
     [
      "Sing it a cappella instead",
      "keep it real",
      "Your voice fills the tiny booth. The host is speechless.",
      "Your voice cracks in the tiny booth. The host fills the silence fast."
     ]
    ]
   },
   {
    "s": "Mid-interview, the host's roommate calls in to ask a question. It is about your ex.",
    "c": [
     [
      "Answer with a song lyric",
      "dodge with style",
      "The lyric answer becomes a campus meme. Very cool, very mysterious.",
      "The lyric answer makes it sound worse than it was."
     ],
     [
      "Ask the roommate how their love life is going",
      "turn the tables",
      "The roommate overshares on air. The clip is gold. Not about you.",
      "The roommate hangs up. The host is mortified."
     ],
     [
      "Laugh and say 'next question'",
      "keep it moving",
      "Smooth and classy. The host moves on without a fuss.",
      "'Next question' becomes the headline. Oops."
     ]
    ]
   },
   {
    "s": "A student band crashes the studio with drums and asks if they can back you on one song. They are... enthusiastic.",
    "c": [
     [
      "Say yes and let them go loud",
      "embrace chaos",
      "It is messy and loud and the best radio of the semester.",
      "It is messy and loud and the station gets a complaint."
     ],
     [
      "Ask them to only play a cowbell",
      "limit the damage",
      "The cowbell version becomes a campus legend.",
      "The cowbell is somehow louder than the whole band."
     ],
     [
      "Say next time, politely",
      "stay in control",
      "You keep the live set clean. The band follows you anyway.",
      "The band waits outside the booth. They are not leaving."
     ]
    ]
   },
   {
    "s": "The station's 'live' light breaks. Nobody knows whether you're on air. The host shrugs and says, 'just assume we are.'",
    "c": [
     [
      "Say something wild, just in case",
      "risk it",
      "You were on air. The wild thing is now campus-famous.",
      "You were on air. The wild thing is now campus-famous. Unfortunately."
     ],
     [
      "Do a fake ad for the station",
      "improvise a bit",
      "The fake ad is so good the station uses it for real.",
      "The fake ad mentions a real sponsor by mistake. Awkward email incoming."
     ],
     [
      "Play a clean song and stay polite",
      "play it straight",
      "Clean and professional. The host books you for next term.",
      "You were not on air. Nobody heard a thing."
     ]
    ]
   },
   {
    "s": "The drummer's flight landed an hour late and he's still in the cab. Soundcheck starts at doors. The engineer says he needs fifteen minutes. The crowd, loudly, says he doesn't.",
    "c": [
     [
      "Start acoustic and bring him in when he lands",
      "make it a moment",
      "He runs on mid-song with his bag still on his back. The room loses its mind.",
      "He arrives two songs late and spends the third catching up."
     ],
     [
      "Cut the hardest song and go on time",
      "keep it tight",
      "The set is shorter and sharper. Nobody notices the cut.",
      "Somebody notices the cut. They shout the title between every song."
     ],
     [
      "Hold the stage until the drums are checked",
      "do it right",
      "When it starts, it sounds huge. The wait was worth it. Mostly.",
      "Fifteen minutes becomes forty. The room cools down and never fully warms up."
     ],
     [
      "Ask the opener to cover another twenty minutes",
      "lean on a favour",
      "The opener says yes and now owes you nothing. You owe them a lot.",
      "The opener says yes, then plays their quietest songs. The room falls asleep."
     ]
    ]
   },
   {
    "s": "The presenter puts a blurry photo up on the big screen: you leaving a restaurant with someone famous. The audience gasps right on cue. The presenter just waits.",
    "c": [
     [
      "Laugh and say the food was the real story",
      "deflect with jokes",
      "The audience laughs with you, not at you. Then you play the song and they stay with you.",
      "The laugh helps, but the photo stays on the screen a little too long."
     ],
     [
      "Say you had a lovely dinner and leave it there",
      "just enough",
      "Short, warm, quotable. It's on every gossip page by morning, right next to your song.",
      "'A lovely dinner' becomes a meme. Not the kind you wanted."
     ],
     [
      "Ask the presenter who took the photo",
      "flip it",
      "The presenter fumbles and the crowd turns on the camera crew. In a fun way.",
      "The presenter knows who took it. It was their cousin."
     ],
     [
      "Say you don't talk about your private life",
      "close the door",
      "Clean and dignified. The segment moves on.",
      "The segment moves on, but the clip of you saying it doesn't."
     ]
    ]
   }
  ],
  "music-video": [
   {
    "s": "One take, no cuts, one camera on a dolly track. Halfway through the take, the dolly track starts squeaking. The director whispers, 'keep going.'",
    "c": [
     [
      "Sync your moves to the squeak",
      "use the glitch",
      "The squeak becomes part of the beat. The video is unhinged and brilliant.",
      "The squeak is all anyone can hear. The comments are all squeak jokes."
     ],
     [
      "Grab the camera and film yourself",
      "take over",
      "The handheld chaos makes it feel real. Fans love the energy.",
      "The handheld footage is so shaky it gives someone motion sickness."
     ],
     [
      "Hold your position and push through",
      "stay professional",
      "Your focus sells it. The squeak gets mixed out. The take is perfect.",
      "The squeak stays in. So does your slightly pained face."
     ]
    ]
   },
   {
    "s": "The budget covered one fog machine. It's on full blast. You can't see the camera. The camera can't see you.",
    "c": [
     [
      "Walk out of the fog at the drop",
      "make an entrance",
      "The reveal is chef's kiss. It looks like a million dollars.",
      "You walk out the wrong side. The camera gets a great shot of the fog."
     ],
     [
      "Dance in the fog like a ghost",
      "lean into weird",
      "The ghost video is cult-classic weird. Fans make edits.",
      "Nobody can tell it is you. Your manager is not thrilled."
     ],
     [
      "Ask for the fog to be turned down",
      "fix the shot",
      "The clearer shot shows off everything. The director thanks you.",
      "The fog is gone, along with the mood."
     ]
    ]
   },
   {
    "s": "The location is a laundromat at midnight and the owner is still doing his laundry. He is very calm about it.",
    "c": [
     [
      "Put him in the video",
      "make him a star",
      "He becomes the breakout star. His deadpan face is everywhere.",
      "He stares into the lens for three full minutes. It is a lot."
     ],
     [
      "Use the dryers as drums",
      "get creative",
      "The dryer beat is iconic. Your producer wants the stems.",
      "The dryer beat is uneven. Somebody's socks fall out."
     ],
     [
      "Wait for the spin cycle to end",
      "wait it out",
      "His load finishes, he leaves, you get your clean take. Simple.",
      "His load takes an hour. Golden hour was yesterday."
     ]
    ]
   },
   {
    "s": "Your outfit has one thousand sequins. One hundred of them just came off on the floor. The take is in five minutes.",
    "c": [
     [
      "Throw the sequins at the camera",
      "make it rain",
      "The sequin storm is the shot of the video. Gorgeous chaos.",
      "Sequins get stuck in the camera. The crew is not amused."
     ],
     [
      "Wear it inside out",
      "flip the look",
      "The inside-out look is weirdly fashion. Stylists repost it.",
      "The inside-out look shows the price tag. In close-up."
     ],
     [
      "Glue them back on fast",
      "fix it fast",
      "The glue holds for the take. Nobody ever knows.",
      "The glue holds. You can no longer bend your elbows."
     ]
    ]
   },
   {
    "s": "Five minutes until the stream goes live and your mic is still buzzing like a fridge. The chat is already filling with question marks. The producer whispers 'your call' and backs slowly out of shot.",
    "c": [
     [
      "Unplug everything and sing straight to the room mic",
      "own the mess",
      "It's lo-fi and close and weirdly intimate. The chat calls it the best version yet.",
      "The room mic catches everything, including the producer sneezing."
     ],
     [
      "Cut the opening song and start clean",
      "save the slot",
      "You start a few minutes late with a clean sound. Nobody minds.",
      "The opening song was the one everyone came for. The chat asks where it went."
     ],
     [
      "Keep swapping cables until the buzz is gone",
      "perfectionist",
      "The buzz goes. The sound is perfect. The chat has been waiting a while.",
      "Six cables later the buzz is still there and now it's louder."
     ],
     [
      "Ask the host to fill time with a chat",
      "stall politely",
      "The host tells a long story. It's actually great.",
      "The host fills the time by reading out comments about you. Not the nice ones."
     ]
    ]
   },
   {
    "s": "Live on air, the host skips your song completely and asks if the dating rumour is true. The producer behind the glass is nodding way too hard.",
    "c": [
     [
      "Laugh it off and play the song",
      "pivot with charm",
      "You laugh, you play, and the clip of the pivot does better than the gossip ever would.",
      "The pivot is a bit clunky, but the song lands and people move on."
     ],
     [
      "Give them just enough for a headline",
      "feed the cycle",
      "A careful half answer becomes the headline. Your streams go up by dinner.",
      "The half answer turns into a whole story. Your phone doesn't stop all day."
     ],
     [
      "Ask the host what they heard",
      "flip the script",
      "The host stammers, the crew laughs and suddenly the interview is about the host.",
      "The host had an answer ready. You did not see that coming."
     ],
     [
      "Shut the question down",
      "hold the line",
      "You say you're here for the music. Polite, firm, a little cold on camera.",
      "The silence after your answer is very long. Someone coughs."
     ]
    ]
   }
  ],
  "music-feature": [
   {
    "s": "A bigger artist wants a sixteen-bar verse. Their name stays secret until you sign. The NDA is twelve pages and in a very small font.",
    "c": [
     [
      "Sign it and write the boldest verse of your life",
      "go all in",
      "They drop a fire emoji on your verse. That is all you need.",
      "They cut your verse to eight bars. It is still on the record. Kind of."
     ],
     [
      "Ask for one hint about who it is",
      "get cheeky",
      "The hint is a single emoji. You guess right. They are impressed.",
      "The hint is a single emoji. You guess wrong. Loudly."
     ],
     [
      "Read every page before you sign",
      "read the room twice",
      "Turns out page nine has a clause your lawyer gets fixed. Smart.",
      "You read so slowly the feature goes to someone else."
     ]
    ]
   },
   {
    "s": "You arrive at the session. The secret artist is not there. Their engineer says they will 'feel the vibe from home.' There's a webcam pointed at you.",
    "c": [
     [
      "Perform to the webcam like a crowd",
      "sell it",
      "The artist sends a voice note: 'I felt that.' Booking secured.",
      "The webcam is off. You performed for nobody."
     ],
     [
      "Hold up a sign saying 'call me'",
      "break the wall",
      "They call. You talk for an hour. The verse is the second best thing.",
      "They do not call. The sign is now in the engineer's story."
     ],
     [
      "Record calmly and send it over",
      "keep it pro",
      "Clean verse, clean delivery. They approve it in ten minutes.",
      "Clean verse, no reply. Ghosted, professionally."
     ]
    ]
   },
   {
    "s": "The artist's beat has a gap where your verse goes. Their note: 'make it sound like you.' Their last feature sounded nothing like the guest.",
    "c": [
     [
      "Do your most you verse ever",
      "zero apologies",
      "Fans say your verse is the best part of the song.",
      "Fans say your verse sounds like a different song. Which it kind of is."
     ],
     [
      "Sing it instead of rapping it",
      "surprise them",
      "The sung verse becomes the hook. They rebuild the song around you.",
      "The sung verse goes in the bin. The rapped one did not get recorded."
     ],
     [
      "Match their style exactly",
      "blend in",
      "It fits so well people think it is them. That is either great or terrible.",
      "It fits so well nobody knows you are on it."
     ]
    ]
   },
   {
    "s": "In the booth, you see the artist's lyric sheet. One of their lines is about someone you used to date.",
    "c": [
     [
      "Write a reply line into your verse",
      "make it a story",
      "The song becomes a two-sided story. Fans go feral decoding it.",
      "The reply line is too obvious. Your ex texts you about it."
     ],
     [
      "Ask them about it during the break",
      "get the tea",
      "They spill, laugh and say 'small world.' You are now friends.",
      "They get weird about it. The session ends early."
     ],
     [
      "Say nothing and do your verse",
      "stay professional",
      "Your professionalism gets noticed. Their team mentions it to their manager.",
      "You say nothing. The internet says everything."
     ]
    ]
   },
   {
    "s": "Soundcheck is forty minutes behind. The in-ears keep cutting out, doors are open and the front row has started a slow clap. The promoter keeps tapping his watch like you owe him money.",
    "c": [
     [
      "Strip it back to voice and one guitar and walk out",
      "raw over perfect",
      "The stripped version silences the room. Someone yells that it's better than the record.",
      "Without the band the first song feels thin. You win them back by the third."
     ],
     [
      "Cut one song and start on time",
      "protect the clock",
      "Nobody misses the missing song. The set is tight and the promoter finally stops glaring.",
      "You cut the song the front row came for. They let you know about it."
     ],
     [
      "Keep fixing the mix until it's right",
      "chase the sound",
      "When you finally start it sounds incredible. The wait almost feels worth it.",
      "By the time it sounds right, half the room is at the bar."
     ],
     [
      "Ask the opener to stretch their set",
      "buy time",
      "The opener plays two extra songs and makes some new fans. Generous of you.",
      "The opener fills the time with a cover of your song. Louder than yours."
     ]
    ]
   },
   {
    "s": "The podcast host leans into the mic and says, 'So. About the feud.' You didn't know you had a feud. Apparently it trended yesterday.",
    "c": [
     [
      "Laugh and say the only feud is with your alarm clock",
      "charm offensive",
      "Big laugh. The feud dies on air and the clip goes everywhere for the right reasons.",
      "The joke lands halfway. At least nobody's talking about the feud anymore."
     ],
     [
      "Say 'no comment' with a smile",
      "keep them guessing",
      "The smile does all the work. By tonight everyone has a theory and your name is on all of them.",
      "'No comment' is now the most quoted thing you've ever said. Not ideal."
     ],
     [
      "Ask who exactly you're feuding with",
      "call the bluff",
      "The host can't name them. The audience loves it and the host blushes.",
      "The host names someone. You've never met them. Now you probably will."
     ],
     [
      "Refuse to talk about anything but the song",
      "boundaries",
      "Firm and clear. The host respects it, eventually.",
      "The rest of the interview is very short and very awkward."
     ]
    ]
   }
  ],
  "music-camp": [
   {
    "s": "Six rooms are writing at once. Yours has a producer who only speaks in movie quotes and a writer with a broken arm. The best song goes upstairs tonight.",
    "c": [
     [
      "Write the song like a movie trailer",
      "match the energy",
      "The trailer song is so dramatic it goes straight upstairs.",
      "It sounds exactly like a trailer. For a film nobody wants to see."
     ],
     [
      "Steal the hook from the room next door",
      "play dirty",
      "Your version of their hook is better. They are furious. You are pitched.",
      "They catch you. Camp politics go nuclear by dinner."
     ],
     [
      "Keep it simple and finish first",
      "win on speed",
      "You finish two hours early and your demo is the cleanest of the day.",
      "You finish first. The upstairs people pick a later one."
     ]
    ]
   },
   {
    "s": "At lunch, the label's head of A&R sits at your table. She asks what you are working on. Your song is not finished.",
    "c": [
     [
      "Hum the unfinished hook right there",
      "shoot your shot",
      "She hums it back. You have a fan in the building.",
      "She smiles politely and switches to talking about the salad."
     ],
     [
      "Pretend it is a top secret project",
      "build hype",
      "She is intrigued and asks to hear it first. Pressure, but the good kind.",
      "She does not care for secrets and moves tables."
     ],
     [
      "Say it is not ready yet",
      "tell the truth",
      "She appreciates the honesty and tells you to send it when it is.",
      "She forgets your name by dessert."
     ]
    ]
   },
   {
    "s": "The camp's group chat leaks a voice memo of your song. Writers from the other rooms are already humming it at the coffee machine.",
    "c": [
     [
      "Lean in and announce it at dinner",
      "own the leak",
      "The whole camp knows the song is yours. Upstairs hears about it first.",
      "The hype is real, but the label is annoyed it leaked."
     ],
     [
      "Pretend it was a decoy song",
      "play games",
      "The decoy story is so good people believe it. Mystery deepens.",
      "Nobody buys the decoy story. Now it is a meme."
     ],
     [
      "Ask the chat admin to delete it",
      "contain it",
      "It is deleted fast and your song stays fresh for upstairs.",
      "It is deleted, but someone screenshotted the lyric sheet."
     ]
    ]
   },
   {
    "s": "The final playback is tonight. The other rooms all wrote sad ballads. Your room wrote a song about a pigeon.",
    "c": [
     [
      "Play the pigeon song first",
      "no fear",
      "The pigeon song is the only one anyone remembers. Upstairs loves it.",
      "The pigeon song makes everyone laugh, including the label boss. Not in a good way."
     ],
     [
      "Rewrite it as a sad pigeon ballad",
      "adapt on the fly",
      "The sad pigeon ballad is a masterpiece. Nobody saw it coming.",
      "The sad pigeon ballad is too sad and too pigeon."
     ],
     [
      "Swap to your backup love song",
      "play it safe",
      "The love song is pretty and lands well. Solid camp result.",
      "The love song gets lost in a sea of other love songs."
     ]
    ]
   },
   {
    "s": "Your laptop crashes mid-soundcheck and takes every backing track with it. The engineer is rebooting with his eyes closed. Through the curtain the crowd is chanting your name, slightly out of time.",
    "c": [
     [
      "Go out with no tracks and play it live",
      "no safety net",
      "No tracks, no click, all nerve. It's the rawest set you've ever played and the room loves it.",
      "It's shaky without the tracks, but nobody leaves. Barely."
     ],
     [
      "Drop the song that needs the tracks most",
      "cut your losses",
      "You lose one song and keep the whole room. Smart trade.",
      "That was the song with the big drop. You feel its absence all night."
     ],
     [
      "Wait for the reboot and rebuild the set",
      "fix it properly",
      "The tracks come back and the show is exactly what you planned. Just late.",
      "The reboot takes twenty minutes. The chanting stops after ten."
     ],
     [
      "Send the opener back on for a bit",
      "stall for time",
      "The opener gets an encore they'll talk about for years.",
      "The opener runs out of songs. They start telling jokes. Badly."
     ]
    ]
   },
   {
    "s": "Halfway through the live session, the radio host reads a fan text out loud asking if your label dropped you. They didn't. Probably. The studio goes very quiet.",
    "c": [
     [
      "Laugh and play the new song as your answer",
      "let the music talk",
      "You play the new one. By the bridge nobody remembers the question.",
      "The joke falls flat, but the song is good enough to carry it."
     ],
     [
      "Hint that something big is coming",
      "tease the drop",
      "Your hint becomes a countdown. Fans start guessing release dates in the comments.",
      "The hint becomes a rumour of its own. Your manager is on the phone already."
     ],
     [
      "Ask the host if they're hiring",
      "turn the tables",
      "The host loses it laughing and the moment becomes the best clip of the show.",
      "The host says yes, actually. The silence gets worse."
     ],
     [
      "Say you're not answering that",
      "shut it down",
      "Clean, calm, done. The host moves on quickly.",
      "It comes across colder than you meant. The text gets read again on another show."
     ]
    ]
   }
  ],
  "music-sync": [
   {
    "s": "A film needs a song for the breakup scene by midnight. Your unfinished demo is in the final three. The music supervisor wants a full version in four hours.",
    "c": [
     [
      "Write the rest in one sitting",
      "sprint",
      "The demo becomes a full song by 11:59pm. They pick you.",
      "It is finished on time. It sounds like it was finished on time."
     ],
     [
      "Send a version with your humming as lyrics",
      "keep the raw feel",
      "The humming makes the scene feel real. The director loves it.",
      "The humming is so raw it sounds unfinished. Because it is."
     ],
     [
      "Ask for a deadline extension",
      "negotiate",
      "They give you until morning. You use every minute well.",
      "They say no and pick someone else."
     ]
    ]
   },
   {
    "s": "The music supervisor sends you the scene. It is two people crying in a car wash. You have to watch it fourteen times.",
    "c": [
     [
      "Write from the car wash's point of view",
      "get weird",
      "The car wash song is bizarre and somehow perfect. They use it.",
      "The car wash song is too weird for the scene and also for you."
     ],
     [
      "Score it with your real breakup in mind",
      "bleed for it",
      "It is so honest the director calls you crying.",
      "It is so honest your ex hears it in the trailer."
     ],
     [
      "Write a classic breakup song",
      "nail the brief",
      "Clean, sad, perfect fit. The supervisor approves it with no notes.",
      "The classic song sounds like every other breakup song."
     ]
    ]
   },
   {
    "s": "The director asks for the song to be 'more purple.' Nobody knows what that means. The deadline is in two hours.",
    "c": [
     [
      "Change the whole key",
      "go big",
      "The new key feels very purple, apparently. The director cries.",
      "The new key is not purple. It might be orange."
     ],
     [
      "Ask the director what purple tastes like",
      "embrace the bit",
      "The director laughs, explains, and you nail the vibe.",
      "The director is not laughing. They want purple."
     ],
     [
      "Add a soft synth pad and hope",
      "subtle tweak",
      "The synth pad adds just the right glow. Purple achieved.",
      "The synth pad is too subtle. They ask for more purple."
     ]
    ]
   },
   {
    "s": "The two other finalists are big-name artists. Their demos are polished. Yours still has a dog barking in the background.",
    "c": [
     [
      "Keep the dog bark in",
      "own the realness",
      "The dog bark gives it heart. The director picks yours.",
      "The dog bark is all anyone in the screening room can hear."
     ],
     [
      "Re-record with the dog as backing vocal",
      "go fully chaotic",
      "The dog duet is the most-talked-about cue at the studio.",
      "The dog does not want to sing. The take is ruined."
     ],
     [
      "Clean it up and polish it fast",
      "compete on quality",
      "Your polished version stands up to the big names. Respect earned.",
      "Your polished version sounds like a weaker copy of theirs."
     ]
    ]
   },
   {
    "s": "The drummer's flight landed an hour late and he's still in the cab. Soundcheck starts at doors. The engineer says he needs fifteen minutes. The crowd, loudly, says he doesn't.",
    "c": [
     [
      "Start acoustic and bring him in when he lands",
      "make it a moment",
      "He runs on mid-song with his bag still on his back. The room loses its mind.",
      "He arrives two songs late and spends the third catching up."
     ],
     [
      "Cut the hardest song and go on time",
      "keep it tight",
      "The set is shorter and sharper. Nobody notices the cut.",
      "Somebody notices the cut. They shout the title between every song."
     ],
     [
      "Hold the stage until the drums are checked",
      "do it right",
      "When it starts, it sounds huge. The wait was worth it. Mostly.",
      "Fifteen minutes becomes forty. The room cools down and never fully warms up."
     ],
     [
      "Ask the opener to cover another twenty minutes",
      "lean on a favour",
      "The opener says yes and now owes you nothing. You owe them a lot.",
      "The opener says yes, then plays their quietest songs. The room falls asleep."
     ]
    ]
   },
   {
    "s": "The presenter puts a blurry photo up on the big screen: you leaving a restaurant with someone famous. The audience gasps right on cue. The presenter just waits.",
    "c": [
     [
      "Laugh and say the food was the real story",
      "deflect with jokes",
      "The audience laughs with you, not at you. Then you play the song and they stay with you.",
      "The laugh helps, but the photo stays on the screen a little too long."
     ],
     [
      "Say you had a lovely dinner and leave it there",
      "just enough",
      "Short, warm, quotable. It's on every gossip page by morning, right next to your song.",
      "'A lovely dinner' becomes a meme. Not the kind you wanted."
     ],
     [
      "Ask the presenter who took the photo",
      "flip it",
      "The presenter fumbles and the crowd turns on the camera crew. In a fun way.",
      "The presenter knows who took it. It was their cousin."
     ],
     [
      "Say you don't talk about your private life",
      "close the door",
      "Clean and dignified. The segment moves on.",
      "The segment moves on, but the clip of you saying it doesn't."
     ]
    ]
   }
  ],
  "music-radio": [
   {
    "s": "Live lounge, one take, live band. The band leader hands you a setlist with a cover you have never sung before. You have thirty minutes.",
    "c": [
     [
      "Learn it and sing it like it's yours",
      "rise to it",
      "Your version is better than the original. The station replays it all day.",
      "You forget the second verse. You hum it. Confidently."
     ],
     [
      "Turn the cover into a mashup with your song",
      "make it yours",
      "The mashup is the clip everyone shares. Instant viral moment.",
      "The mashup sounds like two radios on at once."
     ],
     [
      "Ask to swap it for your own song",
      "stick with your strength",
      "Your own song sounds amazing live. The station respects the choice.",
      "The host looks disappointed. The audience misses the cover."
     ]
    ]
   },
   {
    "s": "The host asks you to sing the jingle for the station live on air. The jingle is very cheesy and you are a serious artist.",
    "c": [
     [
      "Sing it like an opera",
      "overcommit",
      "The opera jingle becomes the station's new official jingle.",
      "The opera jingle goes on for a little too long. Like four minutes."
     ],
     [
      "Rewrite the jingle on the spot",
      "flip it",
      "Your version is catchier. The station asks to buy it.",
      "Your version is catchier but legally risky."
     ],
     [
      "Sing it straight and smile",
      "be a good sport",
      "Good sport points everywhere. The host invites you back.",
      "Your straight-face version becomes a mocking meme."
     ]
    ]
   },
   {
    "s": "Your mic cuts out during the chorus. The band keeps playing. The host is waving frantically from the booth.",
    "c": [
     [
      "Sing even louder with no mic",
      "rise above",
      "The room hears you anyway. The live clip goes everywhere.",
      "Nobody on air hears anything. Dead air, dramatic face."
     ],
     [
      "Grab the host's mic",
      "steal the moment",
      "The host laughs and holds the cable for you. Iconic team-up.",
      "You pull the cable out of the wall. Now both mics are dead."
     ],
     [
      "Stop, wait for a fix and restart",
      "keep it professional",
      "The restart is flawless. Listeners love the comeback.",
      "The fix takes so long they go to an ad break."
     ]
    ]
   },
   {
    "s": "The band's guitarist winks at you during the bridge. He's the host's boyfriend. The host saw.",
    "c": [
     [
      "Wink back and keep singing",
      "stir it up",
      "Listeners call in about the chemistry. Ratings soar.",
      "The host cuts to a commercial immediately."
     ],
     [
      "Make a joke about it on air",
      "defuse it",
      "The joke makes everyone laugh. The host loves you now.",
      "The joke falls flat. The guitarist turns red. The host turns colder."
     ],
     [
      "Ignore it and focus",
      "stay professional",
      "The performance is flawless. The drama stays off air.",
      "The host is cold for the whole interview anyway."
     ]
    ]
   },
   {
    "s": "Five minutes until the stream goes live and your mic is still buzzing like a fridge. The chat is already filling with question marks. The producer whispers 'your call' and backs slowly out of shot.",
    "c": [
     [
      "Unplug everything and sing straight to the room mic",
      "own the mess",
      "It's lo-fi and close and weirdly intimate. The chat calls it the best version yet.",
      "The room mic catches everything, including the producer sneezing."
     ],
     [
      "Cut the opening song and start clean",
      "save the slot",
      "You start a few minutes late with a clean sound. Nobody minds.",
      "The opening song was the one everyone came for. The chat asks where it went."
     ],
     [
      "Keep swapping cables until the buzz is gone",
      "perfectionist",
      "The buzz goes. The sound is perfect. The chat has been waiting a while.",
      "Six cables later the buzz is still there and now it's louder."
     ],
     [
      "Ask the host to fill time with a chat",
      "stall politely",
      "The host tells a long story. It's actually great.",
      "The host fills the time by reading out comments about you. Not the nice ones."
     ]
    ]
   },
   {
    "s": "Live on air, the host skips your song completely and asks if the dating rumour is true. The producer behind the glass is nodding way too hard.",
    "c": [
     [
      "Laugh it off and play the song",
      "pivot with charm",
      "You laugh, you play, and the clip of the pivot does better than the gossip ever would.",
      "The pivot is a bit clunky, but the song lands and people move on."
     ],
     [
      "Give them just enough for a headline",
      "feed the cycle",
      "A careful half answer becomes the headline. Your streams go up by dinner.",
      "The half answer turns into a whole story. Your phone doesn't stop all day."
     ],
     [
      "Ask the host what they heard",
      "flip the script",
      "The host stammers, the crew laughs and suddenly the interview is about the host.",
      "The host had an answer ready. You did not see that coming."
     ],
     [
      "Shut the question down",
      "hold the line",
      "You say you're here for the music. Polite, firm, a little cold on camera.",
      "The silence after your answer is very long. Someone coughs."
     ]
    ]
   }
  ],
  "music-warehouse": [
   {
    "s": "The location dropped an hour ago: an empty warehouse, one generator, a disco ball hanging from a forklift. Half the crowd are people you want to impress.",
    "c": [
     [
      "Climb the forklift and sing from there",
      "go up",
      "The forklift moment is the photo of the year. Everyone posts it.",
      "The forklift starts moving. It is a slow, dramatic exit."
     ],
     [
      "Spin the disco ball by hand mid-song",
      "make a scene",
      "The spinning ball makes the whole room glow. Pure magic.",
      "The disco ball falls. Into the merch table. Nobody is hurt, everyone is shocked."
     ],
     [
      "Stay grounded and own the floor",
      "keep it tight",
      "Your set is so tight that people forget it's a warehouse.",
      "The forklift steals every photo. You are a small dot behind it."
     ]
    ]
   },
   {
    "s": "The generator dies mid-set. Pitch black. Two hundred people, phones up, waiting.",
    "c": [
     [
      "Ask everyone to turn on their phone torches",
      "use the crowd",
      "Two hundred torches. Best visual of the year. It is in everyone's story.",
      "Half the torches point at your face. You are blind and sweating."
     ],
     [
      "Lead the crowd in a singalong in the dark",
      "make it intimate",
      "The dark singalong is spine-tingling. People will talk about it for years.",
      "Nobody knows your songs well enough to sing them in the dark."
     ],
     [
      "Wait for the power and restart",
      "stay calm",
      "The lights come back to applause. Your restart is electric.",
      "The wait is long. The crowd drifts to the bar."
     ]
    ]
   },
   {
    "s": "A well-known DJ shows up unannounced and asks to play a remix of your song right after your set. It is very loud.",
    "c": [
     [
      "Stay on stage and dance through it",
      "ride the wave",
      "Fans love you dancing to your own remix. The DJ tags you.",
      "You dance like nobody's watching. Everybody is."
     ],
     [
      "Grab the mic and freestyle over it",
      "steal the show",
      "The freestyle over the remix is the clip of the night.",
      "The DJ cuts your mic. He wanted that moment for himself."
     ],
     [
      "Thank them and step off stage",
      "take the high road",
      "The DJ appreciates the respect and gives you a shoutout.",
      "The DJ gets all the credit. You get none."
     ]
    ]
   },
   {
    "s": "Somebody in the crowd shouts that the police are coming. The promoter shrugs and says, 'one more song?'",
    "c": [
     [
      "Play the loudest one you have",
      "go out with a bang",
      "The last song is legendary. The police never come. You win.",
      "The police do come. They are very polite. You are less cool now."
     ],
     [
      "Lead the crowd out the back, still singing",
      "make it a parade",
      "The singalong exodus is the stuff of legend. Fans film every step.",
      "The back door is locked. It is a very cramped parade."
     ],
     [
      "Thank everyone and wrap it up",
      "quit while ahead",
      "You leave on a high and no one gets in trouble.",
      "Your exit is so quiet people think you were the police."
     ]
    ]
   },
   {
    "s": "Soundcheck is forty minutes behind. The in-ears keep cutting out, doors are open and the front row has started a slow clap. The promoter keeps tapping his watch like you owe him money.",
    "c": [
     [
      "Strip it back to voice and one guitar and walk out",
      "raw over perfect",
      "The stripped version silences the room. Someone yells that it's better than the record.",
      "Without the band the first song feels thin. You win them back by the third."
     ],
     [
      "Cut one song and start on time",
      "protect the clock",
      "Nobody misses the missing song. The set is tight and the promoter finally stops glaring.",
      "You cut the song the front row came for. They let you know about it."
     ],
     [
      "Keep fixing the mix until it's right",
      "chase the sound",
      "When you finally start it sounds incredible. The wait almost feels worth it.",
      "By the time it sounds right, half the room is at the bar."
     ],
     [
      "Ask the opener to stretch their set",
      "buy time",
      "The opener plays two extra songs and makes some new fans. Generous of you.",
      "The opener fills the time with a cover of your song. Louder than yours."
     ]
    ]
   },
   {
    "s": "The podcast host leans into the mic and says, 'So. About the feud.' You didn't know you had a feud. Apparently it trended yesterday.",
    "c": [
     [
      "Laugh and say the only feud is with your alarm clock",
      "charm offensive",
      "Big laugh. The feud dies on air and the clip goes everywhere for the right reasons.",
      "The joke lands halfway. At least nobody's talking about the feud anymore."
     ],
     [
      "Say 'no comment' with a smile",
      "keep them guessing",
      "The smile does all the work. By tonight everyone has a theory and your name is on all of them.",
      "'No comment' is now the most quoted thing you've ever said. Not ideal."
     ],
     [
      "Ask who exactly you're feuding with",
      "call the bluff",
      "The host can't name them. The audience loves it and the host blushes.",
      "The host names someone. You've never met them. Now you probably will."
     ],
     [
      "Refuse to talk about anything but the song",
      "boundaries",
      "Firm and clear. The host respects it, eventually.",
      "The rest of the interview is very short and very awkward."
     ]
    ]
   }
  ],
  "music-fashion": [
   {
    "s": "You are performing between the last look and the designer's bow. The runway is slick, the models are watching and the editor of a big magazine is in the front row.",
    "c": [
     [
      "Walk the runway while you sing",
      "steal the catwalk",
      "The designer gives you a standing ovation. So does the editor.",
      "You slip on the runway. Gracefully, but still a slip."
     ],
     [
      "Sing a cappella to the front row",
      "make it personal",
      "The editor cries. It is in her column the next day.",
      "The editor takes a phone call mid-song. Ouch."
     ],
     [
      "Stay on your mark and nail the vocals",
      "do your job well",
      "Perfect vocals, perfect moment, perfect respect.",
      "Perfect vocals. Nobody looks away from the clothes."
     ]
    ]
   },
   {
    "s": "Your outfit is from the collection. Five minutes before showtime, the designer changes their mind and hands you something very sheer.",
    "c": [
     [
      "Wear it and own it",
      "nerves of steel",
      "The sheer moment is the talk of fashion week.",
      "The sheer moment is the talk of fashion week. Not your voice."
     ],
     [
      "Layer it with your jacket",
      "compromise",
      "The layered look is cool, edgy and still on brand.",
      "The designer sulks for the whole show."
     ],
     [
      "Politely wear the original",
      "stand firm",
      "The designer respects you for it. Your performance is the focus.",
      "The designer does not invite you back."
     ]
    ]
   },
   {
    "s": "A model trips right before your cue. The crowd gasps. The music cuts out. Everyone looks at you.",
    "c": [
     [
      "Help her up and walk her down the runway",
      "be the hero",
      "Gallantry wins. The moment trends for days.",
      "You both trip again. Now it's a two-person blooper."
     ],
     [
      "Start singing to fill the silence",
      "save the vibe",
      "Your voice saves the show. The designer hugs you.",
      "You start too early. The music comes back and clashes."
     ],
     [
      "Wait for the cue and act normal",
      "stay professional",
      "Calm, cool, collected. People notice how you handled it.",
      "People notice you did nothing."
     ]
    ]
   },
   {
    "s": "Backstage, a famous model whispers that your last song is 'cute.' It is unclear if it is a compliment.",
    "c": [
     [
      "Dedicate the next song to her",
      "flip the shade",
      "She laughs and posts the clip. Fashion internet is delighted.",
      "She does not laugh. Fashion internet is delighted anyway, for the wrong reasons."
     ],
     [
      "Ask her what she means by 'cute'",
      "demand clarity",
      "She explains, it's a compliment, you're now friends.",
      "She says 'cute' again and walks away."
     ],
     [
      "Say thank you and move on",
      "take it gracefully",
      "Grace under pressure. People are impressed.",
      "Grace under pressure. People wonder if you understood the shade."
     ]
    ]
   },
   {
    "s": "Your laptop crashes mid-soundcheck and takes every backing track with it. The engineer is rebooting with his eyes closed. Through the curtain the crowd is chanting your name, slightly out of time.",
    "c": [
     [
      "Go out with no tracks and play it live",
      "no safety net",
      "No tracks, no click, all nerve. It's the rawest set you've ever played and the room loves it.",
      "It's shaky without the tracks, but nobody leaves. Barely."
     ],
     [
      "Drop the song that needs the tracks most",
      "cut your losses",
      "You lose one song and keep the whole room. Smart trade.",
      "That was the song with the big drop. You feel its absence all night."
     ],
     [
      "Wait for the reboot and rebuild the set",
      "fix it properly",
      "The tracks come back and the show is exactly what you planned. Just late.",
      "The reboot takes twenty minutes. The chanting stops after ten."
     ],
     [
      "Send the opener back on for a bit",
      "stall for time",
      "The opener gets an encore they'll talk about for years.",
      "The opener runs out of songs. They start telling jokes. Badly."
     ]
    ]
   },
   {
    "s": "Halfway through the live session, the radio host reads a fan text out loud asking if your label dropped you. They didn't. Probably. The studio goes very quiet.",
    "c": [
     [
      "Laugh and play the new song as your answer",
      "let the music talk",
      "You play the new one. By the bridge nobody remembers the question.",
      "The joke falls flat, but the song is good enough to carry it."
     ],
     [
      "Hint that something big is coming",
      "tease the drop",
      "Your hint becomes a countdown. Fans start guessing release dates in the comments.",
      "The hint becomes a rumour of its own. Your manager is on the phone already."
     ],
     [
      "Ask the host if they're hiring",
      "turn the tables",
      "The host loses it laughing and the moment becomes the best clip of the show.",
      "The host says yes, actually. The silence gets worse."
     ],
     [
      "Say you're not answering that",
      "shut it down",
      "Clean, calm, done. The host moves on quickly.",
      "It comes across colder than you meant. The text gets read again on another show."
     ]
    ]
   }
  ],
  "music-festival": [
   {
    "s": "Someone pulled out of the main stage. You have three hours to be ready for the biggest crowd you've ever seen. Your band is two hours away.",
    "c": [
     [
      "Do it solo with a laptop and a dream",
      "go solo",
      "The solo set is raw and powerful. The festival is talking.",
      "The laptop crashes on song two. You do a cappella. It is a lot."
     ],
     [
      "Borrow the headliner's band",
      "make a deal",
      "The headliner's band knows two of your songs. The rest is jazz.",
      "The headliner's band only knows one of your songs. You play it three times."
     ],
     [
      "Wait for your band and go on late",
      "play it safe",
      "Your band arrives just in time. The set is perfect.",
      "The set starts late. The festival cuts it short."
     ]
    ]
   },
   {
    "s": "The festival crowd is muddy, rainy and very, very loud. The stage manager says to 'just play the hits.' You only have one hit.",
    "c": [
     [
      "Play the hit three times",
      "give them what they want",
      "Each version gets louder. The festival will remember it forever.",
      "By the third time, the crowd wants something else."
     ],
     [
      "Play your whole new album",
      "take a risk",
      "The crowd loves the new songs. They will be the hits next year.",
      "The crowd checks the weather app. It is still raining."
     ],
     [
      "Play the hit, then some covers",
      "keep it fun",
      "The covers keep the energy up. A crowd-pleasing set.",
      "The covers outshine your hit. Bit of a problem."
     ]
    ]
   },
   {
    "s": "A drone films the crowd during your set and crashes into the stage. The crowd goes silent. The drone's light is still blinking.",
    "c": [
     [
      "Pick it up and sing to it",
      "make it a moment",
      "The drone clip is the most viral thing of the festival.",
      "The drone starts flying again. In your face."
     ],
     [
      "Write a song about the drone, live",
      "be an artist",
      "The drone song is a festival legend. Fans demand it be released.",
      "The drone song is a chaotic mess. Fans love it, critics do not."
     ],
     [
      "Ignore it and keep playing",
      "stay focused",
      "Your focus is impressive. The drone gets cleared and you finish strong.",
      "The drone keeps blinking through your whole set."
     ]
    ]
   },
   {
    "s": "You see a famous ex in the VIP section, laughing with someone new. Your next song is about them.",
    "c": [
     [
      "Sing it right to them",
      "own your story",
      "The crowd figures it out. The ex leaves. Iconic.",
      "The ex starts singing along. Now it is about you."
     ],
     [
      "Change the lyrics to be about the new person",
      "get petty",
      "The petty lyrics are the talk of the festival.",
      "The new person thinks it is a love song. They are flattered."
     ],
     [
      "Skip the song entirely",
      "avoid drama",
      "No drama, no headlines, just a great set.",
      "The internet notices you skipped it. Drama anyway."
     ]
    ]
   },
   {
    "s": "The drummer's flight landed an hour late and he's still in the cab. Soundcheck starts at doors. The engineer says he needs fifteen minutes. The crowd, loudly, says he doesn't.",
    "c": [
     [
      "Start acoustic and bring him in when he lands",
      "make it a moment",
      "He runs on mid-song with his bag still on his back. The room loses its mind.",
      "He arrives two songs late and spends the third catching up."
     ],
     [
      "Cut the hardest song and go on time",
      "keep it tight",
      "The set is shorter and sharper. Nobody notices the cut.",
      "Somebody notices the cut. They shout the title between every song."
     ],
     [
      "Hold the stage until the drums are checked",
      "do it right",
      "When it starts, it sounds huge. The wait was worth it. Mostly.",
      "Fifteen minutes becomes forty. The room cools down and never fully warms up."
     ],
     [
      "Ask the opener to cover another twenty minutes",
      "lean on a favour",
      "The opener says yes and now owes you nothing. You owe them a lot.",
      "The opener says yes, then plays their quietest songs. The room falls asleep."
     ]
    ]
   },
   {
    "s": "The presenter puts a blurry photo up on the big screen: you leaving a restaurant with someone famous. The audience gasps right on cue. The presenter just waits.",
    "c": [
     [
      "Laugh and say the food was the real story",
      "deflect with jokes",
      "The audience laughs with you, not at you. Then you play the song and they stay with you.",
      "The laugh helps, but the photo stays on the screen a little too long."
     ],
     [
      "Say you had a lovely dinner and leave it there",
      "just enough",
      "Short, warm, quotable. It's on every gossip page by morning, right next to your song.",
      "'A lovely dinner' becomes a meme. Not the kind you wanted."
     ],
     [
      "Ask the presenter who took the photo",
      "flip it",
      "The presenter fumbles and the crowd turns on the camera crew. In a fun way.",
      "The presenter knows who took it. It was their cousin."
     ],
     [
      "Say you don't talk about your private life",
      "close the door",
      "Clean and dignified. The segment moves on.",
      "The segment moves on, but the clip of you saying it doesn't."
     ]
    ]
   }
  ],
  "music-tv": [
   {
    "s": "National TV gives you four minutes. In rehearsal, the floor manager says you have to sing to a camera on a moving crane. It moves fast.",
    "c": [
     [
      "Chase the camera like a dance partner",
      "play with it",
      "The camera chase is the best performance moment on TV this year.",
      "You chase the wrong camera. Producers are confused."
     ],
     [
      "Ignore the camera and sing to the audience",
      "play to the room",
      "The audience goes wild. TV picks it up. Very real moment.",
      "TV only gets the back of your head. For four minutes."
     ],
     [
      "Do exactly what the floor manager says",
      "stay pro",
      "Perfect TV moments, perfect performance, perfect booking.",
      "Perfect TV. Perfectly forgettable."
     ]
    ]
   },
   {
    "s": "The host is very charming and very interested in your love life. He keeps asking on air if you're single. It is not a dating show.",
    "c": [
     [
      "Say 'are you asking?'",
      "flip the script",
      "The audience screams. The clip is everywhere. You're a star.",
      "The host says 'yes.' The rest of the show is very awkward."
     ],
     [
      "Tell a fake story about a celebrity",
      "invent drama",
      "The fake story is so funny the celebrity reposts it.",
      "The fake story is so convincing a gossip blog prints it."
     ],
     [
      "Smile and say you're focused on music",
      "stay on message",
      "Classy and focused. The music people respect it.",
      "The host keeps asking. You keep smiling. It is a long four minutes."
     ]
    ]
   },
   {
    "s": "Your backing track starts in the wrong key. Live TV. Millions watching. The band looks at you.",
    "c": [
     [
      "Sing it in the wrong key anyway",
      "commit",
      "It somehow works. The internet thinks it's a bold artistic choice.",
      "It does not work. The internet thinks it's a bold artistic mistake."
     ],
     [
      "Stop and ask for the right track",
      "tell the truth",
      "The honesty is charming. The restart is flawless.",
      "The restart takes forever. The host makes jokes to fill time."
     ],
     [
      "Switch to an a cappella version",
      "adapt",
      "Your voice alone is breathtaking. The TV moment of the night.",
      "Your voice alone is too quiet for TV speakers."
     ]
    ]
   },
   {
    "s": "The audience warm-up guy keeps doing your song as a joke between takes. The crowd thinks it's hilarious. You're not sure.",
    "c": [
     [
      "Join him for a duet",
      "be in on the joke",
      "The duet is so funny the show airs it. Best TV moment.",
      "The duet is so funny the show airs it. Nobody hears your actual performance."
     ],
     [
      "Do a better impression of him",
      "one-up him",
      "Your impression is spot on. The crowd turns on him.",
      "Your impression is offensive. Somehow."
     ],
     [
      "Laugh it off and focus on your set",
      "stay professional",
      "You stay classy and your performance gets the cheers.",
      "He keeps doing it. Through your soundcheck."
     ]
    ]
   },
   {
    "s": "Five minutes until the stream goes live and your mic is still buzzing like a fridge. The chat is already filling with question marks. The producer whispers 'your call' and backs slowly out of shot.",
    "c": [
     [
      "Unplug everything and sing straight to the room mic",
      "own the mess",
      "It's lo-fi and close and weirdly intimate. The chat calls it the best version yet.",
      "The room mic catches everything, including the producer sneezing."
     ],
     [
      "Cut the opening song and start clean",
      "save the slot",
      "You start a few minutes late with a clean sound. Nobody minds.",
      "The opening song was the one everyone came for. The chat asks where it went."
     ],
     [
      "Keep swapping cables until the buzz is gone",
      "perfectionist",
      "The buzz goes. The sound is perfect. The chat has been waiting a while.",
      "Six cables later the buzz is still there and now it's louder."
     ],
     [
      "Ask the host to fill time with a chat",
      "stall politely",
      "The host tells a long story. It's actually great.",
      "The host fills the time by reading out comments about you. Not the nice ones."
     ]
    ]
   },
   {
    "s": "Live on air, the host skips your song completely and asks if the dating rumour is true. The producer behind the glass is nodding way too hard.",
    "c": [
     [
      "Laugh it off and play the song",
      "pivot with charm",
      "You laugh, you play, and the clip of the pivot does better than the gossip ever would.",
      "The pivot is a bit clunky, but the song lands and people move on."
     ],
     [
      "Give them just enough for a headline",
      "feed the cycle",
      "A careful half answer becomes the headline. Your streams go up by dinner.",
      "The half answer turns into a whole story. Your phone doesn't stop all day."
     ],
     [
      "Ask the host what they heard",
      "flip the script",
      "The host stammers, the crew laughs and suddenly the interview is about the host.",
      "The host had an answer ready. You did not see that coming."
     ],
     [
      "Shut the question down",
      "hold the line",
      "You say you're here for the music. Polite, firm, a little cold on camera.",
      "The silence after your answer is very long. Someone coughs."
     ]
    ]
   }
  ],
  "music-arena": [
   {
    "s": "Final audition for a major tour support slot. The arena is empty except for the headliner's tour manager, who is eating a salad in seat Q14.",
    "c": [
     [
      "Perform to Q14 like it's sold out",
      "sell it to one",
      "The tour manager stops eating mid-forkful. That's a review.",
      "The tour manager finishes the salad. Then leaves."
     ],
     [
      "Play a song about salad",
      "read the room",
      "The salad song makes the tour manager laugh. Gig secured.",
      "The salad song is too weird. The tour manager is allergic to humour."
     ],
     [
      "Run your set like a real show",
      "keep it pro",
      "Your set is tight and powerful. The tour manager nods.",
      "Your set is tight and powerful. The tour manager is on the phone."
     ]
    ]
   },
   {
    "s": "The headliner watches from the side of the stage. They whisper something to their manager. Their manager writes something down.",
    "c": [
     [
      "Walk over and say hi mid-song",
      "no fear",
      "The headliner laughs and jumps in for a chorus. Goosebumps.",
      "The headliner looks shocked. Security walks over."
     ],
     [
      "Sing a song with the headliner's name in it",
      "make it about them",
      "The headliner is flattered and gives you the slot.",
      "The headliner is creeped out. They send a note."
     ],
     [
      "Ignore them and do your thing",
      "stay focused",
      "Your confidence is magnetic. The headliner gives you a thumbs up.",
      "Your confidence reads as arrogance. The manager writes another note."
     ]
    ]
   },
   {
    "s": "The arena's lighting operator is testing new lights during your audition. The lights flash green, red and purple at random.",
    "c": [
     [
      "Dance to the flashing lights",
      "embrace chaos",
      "Your moves match the lights perfectly. It looks like a real show.",
      "You dance off beat to random lights. Very experimental."
     ],
     [
      "Ask for a spotlight only",
      "take control",
      "The spotlight makes you look like a superstar.",
      "The spotlight operator is on a break. Pitch black."
     ],
     [
      "Ignore the lights and sing",
      "stay focused",
      "Your voice cuts through the chaos. Pure talent.",
      "Your voice gets lost in the light show."
     ]
    ]
   },
   {
    "s": "The tour manager says, 'the headliner likes surprises.' You have one surprise left: a ukulele cover of their biggest hit.",
    "c": [
     [
      "Do it with full emotion",
      "go big",
      "The headliner is moved. You are the new support act.",
      "The headliner hates ukuleles. Nobody told you."
     ],
     [
      "Do it as a comedy bit",
      "make them laugh",
      "The headliner laughs so hard they hire you on the spot.",
      "The headliner does not find their song funny."
     ],
     [
      "Skip the surprise, do your best song",
      "play it safe",
      "Your best song echoes round the empty arena. Undeniable.",
      "Your best song is great, but they wanted the surprise."
     ]
    ]
   },
   {
    "s": "Soundcheck is forty minutes behind. The in-ears keep cutting out, doors are open and the front row has started a slow clap. The promoter keeps tapping his watch like you owe him money.",
    "c": [
     [
      "Strip it back to voice and one guitar and walk out",
      "raw over perfect",
      "The stripped version silences the room. Someone yells that it's better than the record.",
      "Without the band the first song feels thin. You win them back by the third."
     ],
     [
      "Cut one song and start on time",
      "protect the clock",
      "Nobody misses the missing song. The set is tight and the promoter finally stops glaring.",
      "You cut the song the front row came for. They let you know about it."
     ],
     [
      "Keep fixing the mix until it's right",
      "chase the sound",
      "When you finally start it sounds incredible. The wait almost feels worth it.",
      "By the time it sounds right, half the room is at the bar."
     ],
     [
      "Ask the opener to stretch their set",
      "buy time",
      "The opener plays two extra songs and makes some new fans. Generous of you.",
      "The opener fills the time with a cover of your song. Louder than yours."
     ]
    ]
   },
   {
    "s": "The podcast host leans into the mic and says, 'So. About the feud.' You didn't know you had a feud. Apparently it trended yesterday.",
    "c": [
     [
      "Laugh and say the only feud is with your alarm clock",
      "charm offensive",
      "Big laugh. The feud dies on air and the clip goes everywhere for the right reasons.",
      "The joke lands halfway. At least nobody's talking about the feud anymore."
     ],
     [
      "Say 'no comment' with a smile",
      "keep them guessing",
      "The smile does all the work. By tonight everyone has a theory and your name is on all of them.",
      "'No comment' is now the most quoted thing you've ever said. Not ideal."
     ],
     [
      "Ask who exactly you're feuding with",
      "call the bluff",
      "The host can't name them. The audience loves it and the host blushes.",
      "The host names someone. You've never met them. Now you probably will."
     ],
     [
      "Refuse to talk about anything but the song",
      "boundaries",
      "Firm and clear. The host respects it, eventually.",
      "The rest of the interview is very short and very awkward."
     ]
    ]
   }
  ],
  "music-campaign": [
   {
    "s": "A global headphones brand wants your face on billboards. The exclusivity clause means you can't be seen in any other headphones for two years. Your favourite pair are on your head right now.",
    "c": [
     [
      "Throw your old pair in the bin on camera",
      "seal the deal",
      "The brand is thrilled. The video is the start of the campaign.",
      "The video is a little too dramatic. Your old brand is offended."
     ],
     [
      "Ask for a custom pair in your colour",
      "negotiate",
      "They make a custom pair. It becomes the bestseller.",
      "They say no. The meeting gets tense."
     ],
     [
      "Sign the deal and say thank you",
      "take the high road",
      "Deal done. The money is serious and so are you.",
      "Deal done. You miss your old headphones every day."
     ]
    ]
   },
   {
    "s": "The shoot has you dancing on top of a giant spinning headphone. The director shouts 'more joy!' through a megaphone. The headphone is spinning faster than agreed.",
    "c": [
     [
      "Dance like you won the lottery",
      "joy at any speed",
      "Pure joy, perfectly lit. The brand uses it as the opening shot.",
      "The headphone wins. Your left shoe is now in orbit."
     ],
     [
      "Fake a dramatic slow-motion fall",
      "stunt it for the edit",
      "The slow-mo 'fall' is the shot everyone screenshots.",
      "The fall stops being fake around frame twelve."
     ],
     [
      "Ask them to slow the spin a notch",
      "protect the take",
      "Slower spin, sharper moves. It looks like a perfume ad.",
      "Slower spin. Now it looks like a cake stand."
     ]
    ]
   },
   {
    "s": "The brand gives you the campaign tagline to read: 'Feel the noise.' They want it to sound sexy. It is very hard.",
    "c": [
     [
      "Say it like a movie trailer",
      "go dramatic",
      "The trailer voice is so good it becomes a meme. The brand loves it.",
      "The trailer voice is so good it becomes a meme. The brand is unsure."
     ],
     [
      "Rewrite it into a lyric",
      "make it musical",
      "The new lyric is catchy. The brand buys the rights.",
      "The new lyric is catchy but legally risky."
     ],
     [
      "Say it straight, with a smile",
      "play it safe",
      "It sounds nice. The brand is happy.",
      "It sounds nice. Nobody remembers it."
     ]
    ]
   },
   {
    "s": "The brand's CEO visits the set. He wants a selfie with you, wearing a rival brand's headphones. He thinks it's funny.",
    "c": [
     [
      "Take the selfie and post it as a joke",
      "no fear",
      "The CEO's joke goes viral. The brand gets more press than ever.",
      "The joke goes viral. The rival brand's lawyers start typing."
     ],
     [
      "Ask him for a better pair",
      "flip it",
      "He laughs and gives you a limited edition pair. Now you have two.",
      "He does not laugh. The selfie is very awkward."
     ],
     [
      "Politely refuse",
      "protect the deal",
      "Your professionalism is noted. The brand is impressed.",
      "The CEO is disappointed and leaves early."
     ]
    ]
   },
   {
    "s": "Your laptop crashes mid-soundcheck and takes every backing track with it. The engineer is rebooting with his eyes closed. Through the curtain the crowd is chanting your name, slightly out of time.",
    "c": [
     [
      "Go out with no tracks and play it live",
      "no safety net",
      "No tracks, no click, all nerve. It's the rawest set you've ever played and the room loves it.",
      "It's shaky without the tracks, but nobody leaves. Barely."
     ],
     [
      "Drop the song that needs the tracks most",
      "cut your losses",
      "You lose one song and keep the whole room. Smart trade.",
      "That was the song with the big drop. You feel its absence all night."
     ],
     [
      "Wait for the reboot and rebuild the set",
      "fix it properly",
      "The tracks come back and the show is exactly what you planned. Just late.",
      "The reboot takes twenty minutes. The chanting stops after ten."
     ],
     [
      "Send the opener back on for a bit",
      "stall for time",
      "The opener gets an encore they'll talk about for years.",
      "The opener runs out of songs. They start telling jokes. Badly."
     ]
    ]
   },
   {
    "s": "Halfway through the live session, the radio host reads a fan text out loud asking if your label dropped you. They didn't. Probably. The studio goes very quiet.",
    "c": [
     [
      "Laugh and play the new song as your answer",
      "let the music talk",
      "You play the new one. By the bridge nobody remembers the question.",
      "The joke falls flat, but the song is good enough to carry it."
     ],
     [
      "Hint that something big is coming",
      "tease the drop",
      "Your hint becomes a countdown. Fans start guessing release dates in the comments.",
      "The hint becomes a rumour of its own. Your manager is on the phone already."
     ],
     [
      "Ask the host if they're hiring",
      "turn the tables",
      "The host loses it laughing and the moment becomes the best clip of the show.",
      "The host says yes, actually. The silence gets worse."
     ],
     [
      "Say you're not answering that",
      "shut it down",
      "Clean, calm, done. The host moves on quickly.",
      "It comes across colder than you meant. The text gets read again on another show."
     ]
    ]
   }
  ],
  "music-awards": [
   {
    "s": "Awards afterparty, very small room. The A-list are all here, holding their awards. The DJ says, 'you're on in five.' You do not have an award.",
    "c": [
     [
      "Hold up a fake award and say thank you",
      "make a joke",
      "The A-list laughs. You are now the party's favourite.",
      "The A-list does not laugh. Someone asks for their award back."
     ],
     [
      "Do a song about losing",
      "tell the truth",
      "The 'losing' song is heartfelt and funny. Everyone sings along.",
      "The 'losing' song is too sad for a party."
     ],
     [
      "Do your best dance songs",
      "keep the party going",
      "The party is lit. You're asked to play again next year.",
      "The party is lit. You are not the reason why."
     ]
    ]
   },
   {
    "s": "Mid-song, a famous actor jumps on stage and grabs your mic. He wants to say something about his award.",
    "c": [
     [
      "Let him talk, then do a duet",
      "make it a moment",
      "The duet is iconic. It is all over the news.",
      "The duet is iconic. You are just the backing vocalist."
     ],
     [
      "Take the mic back and say 'my turn'",
      "stand your ground",
      "The crowd cheers. You are a legend.",
      "The actor is not pleased. Security looks nervous."
     ],
     [
      "Wait for him to finish",
      "mind your manners",
      "His speech is short. You finish your set to applause.",
      "His speech is long. Very long. Your set is cut."
     ]
    ]
   },
   {
    "s": "The sound system cuts out. The A-list is waiting. A legendary rapper starts beatboxing in the crowd.",
    "c": [
     [
      "Sing with the rapper's beatbox",
      "go with it",
      "The beatbox duet is a legendary moment. The crowd goes wild.",
      "The beatbox duet is chaotic. The rapper takes over."
     ],
     [
      "Ask the crowd to stomp a beat",
      "use the room",
      "The stomping beat is powerful. You lead the room.",
      "The stomping is off beat. It sounds like a stampede."
     ],
     [
      "Wait for the sound to come back",
      "wait it out",
      "The sound comes back. You finish strong.",
      "The wait is long. The A-list moves to the bar."
     ]
    ]
   },
   {
    "s": "An award winner is crying near the stage. You do not know if it's happy tears.",
    "c": [
     [
      "Dedicate a song to them",
      "sugar on top",
      "The tears turn to happy tears. They hug you.",
      "They were sad tears. Now they are sadder."
     ],
     [
      "Ask them to join you for a song",
      "make it fun",
      "They join you. They are terrible. It is the best moment of the night.",
      "They decline. Now everyone is looking at the crying person."
     ],
     [
      "Play an upbeat song",
      "change the mood",
      "The upbeat song changes the mood. The party is happy again.",
      "The upbeat song makes the crying person cry harder."
     ]
    ]
   },
   {
    "s": "The drummer's flight landed an hour late and he's still in the cab. Soundcheck starts at doors. The engineer says he needs fifteen minutes. The crowd, loudly, says he doesn't.",
    "c": [
     [
      "Start acoustic and bring him in when he lands",
      "make it a moment",
      "He runs on mid-song with his bag still on his back. The room loses its mind.",
      "He arrives two songs late and spends the third catching up."
     ],
     [
      "Cut the hardest song and go on time",
      "keep it tight",
      "The set is shorter and sharper. Nobody notices the cut.",
      "Somebody notices the cut. They shout the title between every song."
     ],
     [
      "Hold the stage until the drums are checked",
      "do it right",
      "When it starts, it sounds huge. The wait was worth it. Mostly.",
      "Fifteen minutes becomes forty. The room cools down and never fully warms up."
     ],
     [
      "Ask the opener to cover another twenty minutes",
      "lean on a favour",
      "The opener says yes and now owes you nothing. You owe them a lot.",
      "The opener says yes, then plays their quietest songs. The room falls asleep."
     ]
    ]
   },
   {
    "s": "The presenter puts a blurry photo up on the big screen: you leaving a restaurant with someone famous. The audience gasps right on cue. The presenter just waits.",
    "c": [
     [
      "Laugh and say the food was the real story",
      "deflect with jokes",
      "The audience laughs with you, not at you. Then you play the song and they stay with you.",
      "The laugh helps, but the photo stays on the screen a little too long."
     ],
     [
      "Say you had a lovely dinner and leave it there",
      "just enough",
      "Short, warm, quotable. It's on every gossip page by morning, right next to your song.",
      "'A lovely dinner' becomes a meme. Not the kind you wanted."
     ],
     [
      "Ask the presenter who took the photo",
      "flip it",
      "The presenter fumbles and the crowd turns on the camera crew. In a fun way.",
      "The presenter knows who took it. It was their cousin."
     ],
     [
      "Say you don't talk about your private life",
      "close the door",
      "Clean and dignified. The segment moves on.",
      "The segment moves on, but the clip of you saying it doesn't."
     ]
    ]
   }
  ],
  "music-launch": [
   {
    "s": "A secret collab goes live in one hour. Your appearance hasn't leaked. Your phone is buzzing with texts asking what's up.",
    "c": [
     [
      "Post a cryptic clue",
      "feed the hype",
      "The clue drives fans wild. The launch is massive.",
      "The clue gives it away. The surprise is ruined."
     ],
     [
      "Reply to one fan with a single emoji",
      "play coy",
      "The emoji screenshot goes everywhere. Everyone is guessing.",
      "The emoji is the wrong one. Fans think it's a breakup."
     ],
     [
      "Turn off your phone and wait",
      "keep the secret",
      "The surprise works perfectly. The launch is huge.",
      "You miss the launch. Your phone is still off."
     ]
    ]
   },
   {
    "s": "The launch party has a giant screen with a countdown. Thirty seconds before zero, the screen freezes. The crowd is waiting.",
    "c": [
     [
      "Count down live with the crowd",
      "be the countdown",
      "Your voice leads the crowd. The moment feels huge.",
      "You count down too fast. The song starts at four."
     ],
     [
      "Jump on stage and sing the hook a cappella",
      "go live",
      "Your a cappella reveal is breathtaking.",
      "Your a cappella reveal is too quiet. Nobody hears."
     ],
     [
      "Wait for the tech crew",
      "wait it out",
      "The tech crew fixes it. The launch is a success.",
      "The tech crew does not fix it. The launch is a mess."
     ]
    ]
   },
   {
    "s": "Your collab partner is late. The crowd is waiting. You have to start the song without them.",
    "c": [
     [
      "Sing their part too",
      "cover for them",
      "You sing both parts perfectly. The crowd is amazed.",
      "You forget their part. You hum it."
     ],
     [
      "Ask a fan to sing their part",
      "make it fun",
      "The fan is amazing. They become a viral star.",
      "The fan is terrible. They become a viral star anyway."
     ],
     [
      "Wait for your partner",
      "ride or die",
      "Your partner arrives. The duet is perfect.",
      "Your partner never arrives. You play the recorded version."
     ]
    ]
   },
   {
    "s": "The song is live. It goes to number one on streaming in an hour. Your collab partner is getting all the credit.",
    "c": [
     [
      "Post your verse on its own",
      "claim your credit",
      "Fans love your verse. You are in the headlines too.",
      "Fans think you're jealous. Not a good look."
     ],
     [
      "Make a funny video about it",
      "make a joke",
      "The funny video goes viral. You get the credit you deserve.",
      "The funny video is too passive-aggressive."
     ],
     [
      "Say thank you and celebrate",
      "take the high road",
      "Your grace is noted. People respect you.",
      "Your grace is noted. Nobody knows you're on the song."
     ]
    ]
   },
   {
    "s": "Five minutes until the stream goes live and your mic is still buzzing like a fridge. The chat is already filling with question marks. The producer whispers 'your call' and backs slowly out of shot.",
    "c": [
     [
      "Unplug everything and sing straight to the room mic",
      "own the mess",
      "It's lo-fi and close and weirdly intimate. The chat calls it the best version yet.",
      "The room mic catches everything, including the producer sneezing."
     ],
     [
      "Cut the opening song and start clean",
      "save the slot",
      "You start a few minutes late with a clean sound. Nobody minds.",
      "The opening song was the one everyone came for. The chat asks where it went."
     ],
     [
      "Keep swapping cables until the buzz is gone",
      "perfectionist",
      "The buzz goes. The sound is perfect. The chat has been waiting a while.",
      "Six cables later the buzz is still there and now it's louder."
     ],
     [
      "Ask the host to fill time with a chat",
      "stall politely",
      "The host tells a long story. It's actually great.",
      "The host fills the time by reading out comments about you. Not the nice ones."
     ]
    ]
   },
   {
    "s": "Live on air, the host skips your song completely and asks if the dating rumour is true. The producer behind the glass is nodding way too hard.",
    "c": [
     [
      "Laugh it off and play the song",
      "pivot with charm",
      "You laugh, you play, and the clip of the pivot does better than the gossip ever would.",
      "The pivot is a bit clunky, but the song lands and people move on."
     ],
     [
      "Give them just enough for a headline",
      "feed the cycle",
      "A careful half answer becomes the headline. Your streams go up by dinner.",
      "The half answer turns into a whole story. Your phone doesn't stop all day."
     ],
     [
      "Ask the host what they heard",
      "flip the script",
      "The host stammers, the crew laughs and suddenly the interview is about the host.",
      "The host had an answer ready. You did not see that coming."
     ],
     [
      "Shut the question down",
      "hold the line",
      "You say you're here for the music. Polite, firm, a little cold on camera.",
      "The silence after your answer is very long. Someone coughs."
     ]
    ]
   }
  ],
  "act-ad": [
   {
    "s": "The commercial is for a yoghurt. Your line is 'mmm.' The casting director says the last nine people did the 'mmm' exactly the same way.",
    "c": [
     [
      "Give the most dramatic 'mmm' of all time",
      "go operatic",
      "The casting director laughs so hard she asks for it twice. Callback.",
      "It sounds like you are in pain. They offer you water."
     ],
     [
      "Ask what the yoghurt's backstory is",
      "method it",
      "The room cracks up and then actually considers the backstory. Memorable.",
      "The room does not crack up. Someone checks the time."
     ],
     [
      "Do a small, honest 'mmm'",
      "keep it real",
      "Your quiet 'mmm' is the one that sells yoghurt. You book it.",
      "Your quiet 'mmm' is so quiet the mic misses it."
     ]
    ]
   },
   {
    "s": "The ad is for a car. You have to pretend to be amazed by a cupholder. The real car is not here. It is a cardboard box.",
    "c": [
     [
      "Fall in love with the cardboard box",
      "commit hard",
      "Your love for the box is so real the client asks for your name.",
      "Your love for the box gets a little intense. Someone says 'okay, thank you.'"
     ],
     [
      "Pretend the box is broken",
      "improv a twist",
      "The broken cupholder bit gets a big laugh. They want it in the ad.",
      "The client does not want a broken cupholder in their ad."
     ],
     [
      "Do exactly what the script says",
      "rock solid",
      "Clean, on brief, on time. The kind of actor they rebook.",
      "Clean, on brief, forgotten by lunch."
     ]
    ]
   },
   {
    "s": "In the waiting room, the actor next to you is wearing the exact same outfit. Same hair. Same bag. You both get called in together.",
    "c": [
     [
      "Do the scene as twins",
      "lean in",
      "The twin bit is brilliant. They book both of you as a pair.",
      "They book the other one. You were the spare twin."
     ],
     [
      "Swap jackets right before you go in",
      "get scrappy",
      "The swap throws them just enough to remember you.",
      "The jacket is too small. It shows."
     ],
     [
      "Ignore it and do your read",
      "stay focused",
      "Your read stands out even in the same outfit. That is talent.",
      "Nobody can tell you apart in the notes."
     ]
    ]
   },
   {
    "s": "The director is on a video call from another country and the wifi keeps freezing. Every time it unfreezes, he says 'again.'",
    "c": [
     [
      "Freeze every time he freezes",
      "match the glitch",
      "He laughs out loud for the first time all day. You are booked.",
      "He thinks your freeze is the wifi. He says 'again.'"
     ],
     [
      "Play the scene to the frozen face",
      "use the moment",
      "The frozen face makes you funnier. The room is with you.",
      "The frozen face is his worst angle. It throws you off completely."
     ],
     [
      "Wait patiently for a stable connection",
      "stay pro",
      "When the call is stable your read is perfect. Good impression.",
      "The connection never stabilises. You read to a loading wheel."
     ]
    ]
   }
  ],
  "act-short": [
   {
    "s": "The indie short is shot in a car park at night. The crew is four people and a dog. The director wants to do the crying scene in one take, now.",
    "c": [
     [
      "Cry real tears in one take",
      "go all in",
      "One take, real tears, the crew applauds. This is going to festivals.",
      "Real tears, but also a sneeze. In the close-up."
     ],
     [
      "Laugh instead of crying",
      "flip the scene",
      "The laugh-cry is weird and haunting. The director is obsessed.",
      "The laugh-cry just reads as laughing. In a crying scene."
     ],
     [
      "Ask for five minutes to prepare",
      "take your time",
      "Five minutes buys you the best take of the night.",
      "Five minutes is when the car park security arrives."
     ]
    ]
   },
   {
    "s": "The director tells you the film is a love story. The script has one other character. It is a ghost. Played by a lamp.",
    "c": [
     [
      "Fall in love with the lamp",
      "commit to the bit",
      "Your chemistry with a lamp is so real, critics take notice.",
      "The lamp has better chemistry than you. Somehow."
     ],
     [
      "Turn the lamp on and off for drama",
      "play with it",
      "The flickering lamp scene is beautiful. The director cries.",
      "The lamp bulb blows. You are now in love with darkness."
     ],
     [
      "Ask what the ghost wants",
      "understand it",
      "The director explains, and your scene finally makes sense.",
      "The director doesn't know what the ghost wants either."
     ]
    ]
   },
   {
    "s": "The tiny crew shooting the short accidentally sets off a smoke alarm. The fire brigade arrives. The camera is still rolling.",
    "c": [
     [
      "Stay in character and act through it",
      "stay in the scene",
      "The footage is wild and real. It becomes the opening scene.",
      "The fire brigade is not acting. You get a lecture."
     ],
     [
      "Ask the firefighters to be extras",
      "make it work",
      "The firefighters are surprisingly good actors. The film is a hit.",
      "The firefighters say no. Very politely."
     ],
     [
      "Stop and apologise",
      "adult in the room",
      "You are calm and helpful. The crew respects you.",
      "The night is over. The short is not finished."
     ]
    ]
   },
   {
    "s": "The only costume the crew could afford is a very large banana suit. Your character is a grieving widow.",
    "c": [
     [
      "Play the widow fully straight in the banana suit",
      "go deadpan",
      "The deadpan banana widow is festival gold. Critics are confused but impressed.",
      "The banana suit gets all the attention. Your acting gets none."
     ],
     [
      "Rewrite the character as a grieving banana",
      "make it absurd",
      "The grieving banana is a cult classic. People quote it.",
      "The grieving banana is too absurd. Even the dog leaves."
     ],
     [
      "Wear your own clothes",
      "play it safe",
      "Your own clothes make the scene grounded and moving.",
      "Your own clothes don't match the lighting. Or the tone."
     ]
    ]
   }
  ],
  "act-table": [
   {
    "s": "Cold table read. Nobody has the part yet. The writer is sitting right across from you, mouthing every single line as you read it.",
    "c": [
     [
      "Change one line and look at the writer",
      "make it yours",
      "The writer smiles and writes your change into the script.",
      "The writer stops mouthing and starts frowning. Deeply."
     ],
     [
      "Mouth the writer's lines back at them",
      "mirror them",
      "The table cracks up. The writer laughs hardest. You're remembered.",
      "The writer does not notice. Everyone else thinks you are struggling."
     ],
     [
      "Read it exactly as written",
      "respect the page",
      "The writer looks relieved. Their words, finally done right.",
      "Exactly right, exactly flat. The table moves on."
     ]
    ]
   },
   {
    "s": "The actor next to you is reading your lines by mistake. Very confidently. The director hasn't noticed.",
    "c": [
     [
      "Read their lines instead",
      "swap roles",
      "The swap is hilarious and both reads are brilliant. You both get callbacks.",
      "The swap confuses everyone. The director stops the read."
     ],
     [
      "Tap them gently and point to the page",
      "stay calm",
      "They laugh, apologise and the read gets back on track. You look like a pro.",
      "They ignore you. You look like you are poking them."
     ],
     [
      "Wait for your next line",
      "stay quiet",
      "The mistake gets fixed. You get to read your best scene.",
      "The mistake is not fixed. You read nothing."
     ]
    ]
   },
   {
    "s": "The script calls for you to slap the other actor. They look nervous. You look nervous. The director says, 'go for it.'",
    "c": [
     [
      "Slap the air with total commitment",
      "sell it with sound",
      "The air slap is so convincing the whole table winces. Then claps.",
      "The air slap is so convincing you knock over the water jug."
     ],
     [
      "Ask the other actor to slap you instead",
      "be a team player",
      "The swap makes the scene funnier. The director loves it.",
      "The other actor slaps too hard. You are seeing stars."
     ],
     [
      "Just say 'I slap them'",
      "keep it safe",
      "The director laughs and moves on. The read stays smooth.",
      "The director looks disappointed. They wanted the slap."
     ]
    ]
   },
   {
    "s": "The casting director falls asleep during your monologue. She is snoring softly. Everyone is pretending not to notice.",
    "c": [
     [
      "Get louder until she wakes up",
      "raise the stakes",
      "She wakes up mid-climax and applauds like she never left.",
      "She wakes up and thinks you are shouting at her."
     ],
     [
      "Whisper the rest so she stays asleep",
      "soft touch",
      "The whispered monologue is so moving the others clap.",
      "The whispered monologue is so quiet nobody hears it."
     ],
     [
      "Keep going as normal",
      "stay focused",
      "Your focus is impressive. The others take note.",
      "She sleeps through your best moment."
     ]
    ]
   }
  ],
  "act-musicvideo": [
   {
    "s": "You have one scene in a music video next to a much bigger name. No dialogue. The director just says, 'look at them like you invented heartbreak.'",
    "c": [
     [
      "Stare so hard it becomes the whole video",
      "steal the frame",
      "Fans make edits of your face. You are the most-searched person in the comments.",
      "The star asks the director if you are okay."
     ],
     [
      "Mouth along to the song without being asked",
      "sneak a moment",
      "The mouthing becomes a fan theory. Are you secretly the songwriter?",
      "The director cuts it. Then cuts you."
     ],
     [
      "Give a quiet, sad look and hold it",
      "subtle power",
      "Your one look is the moment fans can't stop rewatching.",
      "Your quiet look looks like you missed lunch."
     ]
    ]
   },
   {
    "s": "The video requires you to dance. You were told it was a 'sitting cameo.' The choreographer gives you eight counts.",
    "c": [
     [
      "Do your own wild dance",
      "make it yours",
      "Your freestyle becomes the moment of the video. Dance challenge incoming.",
      "Your freestyle is so wild the choreographer leaves."
     ],
     [
      "Learn the eight counts and do them perfectly",
      "rise to it",
      "You nail it. The choreographer is impressed.",
      "You nail it at half speed. Everyone else is at full speed."
     ],
     [
      "Ask to stay seated and dance with your arms",
      "stay true to the brief",
      "Your seated dance is so good it becomes a trend.",
      "Your seated dance looks like you're waving for a taxi."
     ]
    ]
   },
   {
    "s": "The star of the video keeps forgetting your name. They call you 'buddy.' The camera is rolling.",
    "c": [
     [
      "Call them 'buddy' back on camera",
      "flip it",
      "The 'buddy' banter is the cutest moment. Fans love you two.",
      "The star is not amused. The 'buddy' moment gets cut."
     ],
     [
      "Say your name very clearly in the scene",
      "make it known",
      "The star laughs and remembers your name forever.",
      "The star still calls you 'buddy' in the next take."
     ],
     [
      "Ignore it and act",
      "stay professional",
      "Your professionalism is noted. The star tells their team about you.",
      "Nobody knows who 'buddy' is in the credits."
     ]
    ]
   },
   {
    "s": "The video has a fake rain machine. It is on full blast. Your make-up is running. The star's make-up is somehow fine.",
    "c": [
     [
      "Make the running make-up part of the moment",
      "be a mess",
      "The smeared look is so dramatic it becomes iconic.",
      "The smeared look is so dramatic the director thinks you are crying."
     ],
     [
      "Ask for an umbrella",
      "fix the problem",
      "The umbrella shot is surprisingly romantic. The star joins you under it.",
      "The umbrella turns inside out. On camera."
     ],
     [
      "Get a make-up fix and go again",
      "stay polished",
      "Your perfect make-up shows off your face. Clean and beautiful.",
      "The make-up fix takes ages. The star is waiting."
     ]
    ]
   }
  ],
  "act-cameo": [
   {
    "s": "Two scenes on a streaming show nobody has announced yet. Your famous co-star improvises a line about your character's 'secret twin.' The writer on set looks thrilled.",
    "c": [
     [
      "Play along and become the twin",
      "yes, and",
      "The writers add a twin storyline. You might be back next season.",
      "The twin storyline gets cut, and so do you."
     ],
     [
      "Deny the twin with a straight face",
      "play the mystery",
      "Fans start theorising about the twin before the episode even airs.",
      "The co-star keeps pushing the bit. You crack on take five."
     ],
     [
      "Stay on the scripted line",
      "respect the script",
      "The director appreciates the steady hand. Clean, usable takes.",
      "Clean takes. The improv takes get used instead."
     ]
    ]
   },
   {
    "s": "Your cameo is a waiter who drops a tray. The star is supposed to catch it. They are on their phone.",
    "c": [
     [
      "Drop it anyway and catch it yourself",
      "save the scene",
      "Your catch is so good it becomes the funniest part of the episode.",
      "Your catch is so good you knock over the coffee."
     ],
     [
      "Drop it on the star's lap",
      "force the moment",
      "The star screams and laughs. It is the best moment on set.",
      "The star is not amused. It was a very expensive phone."
     ],
     [
      "Wait for them to look up",
      "wait it out",
      "The star finally looks up. The scene is perfect.",
      "The star never looks up. They cut your scene."
     ]
    ]
   },
   {
    "s": "The co-star is very method. They are playing a cat. They have not spoken in three days. They are now staring at you.",
    "c": [
     [
      "Play a dog",
      "match their energy",
      "The cat-dog rivalry is the best on-screen chemistry this year.",
      "The cat-dog rivalry gets intense. Someone gets scratched."
     ],
     [
      "Pet them",
      "nerves of steel",
      "The co-star purrs. The scene is perfect.",
      "The co-star hisses. The scene is very awkward."
     ],
     [
      "Ignore them and do your scene",
      "stay focused",
      "Your focus is unshaken. You are a pro.",
      "Your focus is unshaken. The co-star steals the scene."
     ]
    ]
   },
   {
    "s": "A leaked set photo shows you in your cameo costume. The internet thinks you are a new main character. Your agent calls.",
    "c": [
     [
      "Post a cryptic emoji",
      "feed the hype",
      "Fans go wild. The show gets more press. The producers love you.",
      "The producers are not happy you posted anything."
     ],
     [
      "Deny it with a joke",
      "play it cool",
      "Your joke is funny and the rumour gets more traction.",
      "Your joke is so funny it becomes a headline."
     ],
     [
      "Stay quiet",
      "protect the show",
      "The show is grateful for your silence.",
      "The internet decides you are the villain."
     ]
    ]
   }
  ],
  "act-voice": [
   {
    "s": "The animated character has no final design yet. It is currently a grey blob on a screen. The director asks you to 'find its soul.'",
    "c": [
     [
      "Give the blob a booming villain voice",
      "go big",
      "The animators redraw the blob with horns. Your voice designed a character.",
      "The blob now sounds like a weather warning."
     ],
     [
      "Do the voice while lying on the floor",
      "method it",
      "The floor voice has a weird, sleepy charm. The director is obsessed.",
      "The mic can't reach the floor. Take three is just breathing."
     ],
     [
      "Use your natural voice, just warmer",
      "keep it real",
      "Warm, simple, lovable. The blob finally feels like someone.",
      "Nice, but the blob still feels like a blob."
     ]
    ]
   },
   {
    "s": "The character is a talking fridge. The director says, 'it's a very sad fridge.' You have to cry.",
    "c": [
     [
      "Cry like a fridge",
      "commit fully",
      "The sad fridge cry is the most moving thing in the film.",
      "The sad fridge cry sounds like a broken fridge."
     ],
     [
      "Make the fridge sing its sadness",
      "get inventive",
      "The singing fridge is a hit. You get a new song in the film.",
      "The singing fridge is too much. The director says 'just talk.'"
     ],
     [
      "Just talk sadly",
      "keep it simple",
      "Your sad fridge voice is touching. The director is pleased.",
      "Your sad fridge voice sounds like a sad person reading about a fridge."
     ]
    ]
   },
   {
    "s": "The booth is tiny and very hot. Your co-star is in the next booth, but you can't see them. You can only hear their voice. They are very loud.",
    "c": [
     [
      "Shout back at them",
      "match their energy",
      "The shouting match is hilarious. The director loves the chaos.",
      "The shouting match is so loud the sound engineer quits."
     ],
     [
      "Whisper to them",
      "contrast",
      "Your whisper makes them quieter. The scene finds a new balance.",
      "Your whisper is too quiet. The director can't hear you."
     ],
     [
      "Do your lines as written",
      "stay focused",
      "Your focus is impressive. The scene is perfect.",
      "Your focus makes you sound like you're in another film."
     ]
    ]
   },
   {
    "s": "The director is eating a sandwich and keeps saying 'again' with a full mouth. You do the line thirty times.",
    "c": [
     [
      "Change the line every time",
      "get inventive",
      "On take thirty-one the director stops chewing. That's the one.",
      "On take thirty-one the director says 'what was that?'"
     ],
     [
      "Do the line with a sandwich",
      "get messy",
      "The sandwich voice is hilarious. The director laughs and uses it.",
      "The sandwich voice is messy. You get crumbs on the mic."
     ],
     [
      "Do the same line, but better",
      "stay professional",
      "Your consistency is impressive. Take thirty is a keeper.",
      "Your consistency is impressive. The director wanted chaos."
     ]
    ]
   }
  ],
  "act-rewrite": [
   {
    "s": "At lunch, the writers rewrite half your scene. The new pages are still warm from the printer. Cameras roll before dinner.",
    "c": [
     [
      "Memorise it in the make-up chair",
      "sprint",
      "You are word-perfect by take one. The director looks at you differently now.",
      "Word-perfect, except one word. The important word."
     ],
     [
      "Write the key line on your hand",
      "get clever",
      "The hand trick saves you. Nobody ever finds out.",
      "The hand line gets sweaty. It now says 'I lov ou.'"
     ],
     [
      "Ask to keep the old version of one line",
      "negotiate",
      "The writers agree and the scene is better for it.",
      "The writers do not agree. Lunch is very awkward."
     ]
    ]
   },
   {
    "s": "The rewrite turns your character from a nurse into a pirate. Costume has not caught up. You are a pirate in scrubs.",
    "c": [
     [
      "Play the scrubs as a pirate disguise",
      "sell the absurd",
      "The director loves the idea and keeps it. Instant cult scene.",
      "The scrubs pirate makes no sense, but at least you committed."
     ],
     [
      "Steal a hat from the background extra",
      "improv a look",
      "The stolen hat is perfect. The extra is furious.",
      "The hat is too small. It falls in the first take."
     ],
     [
      "Ask for an hour for costume to catch up",
      "protect the scene",
      "Costume delivers, you look the part, the scene sings.",
      "The hour turns into three. The light is gone."
     ]
    ]
   },
   {
    "s": "The new pages give your co-star all the best lines. Your character now just nods. A lot.",
    "c": [
     [
      "Make every nod different",
      "act with your face",
      "Your nod performance is the most-talked-about thing on set.",
      "Your nod performance is so dramatic it's distracting."
     ],
     [
      "Ask the writer for one line back",
      "fight for it",
      "The writer gives you one line. It is the best line in the scene.",
      "The writer gives you one line. It is 'yes.'"
     ],
     [
      "Nod perfectly",
      "be a pro",
      "Your nods are subtle and powerful. The director is impressed.",
      "Your nods are subtle and powerful. Nobody notices."
     ]
    ]
   },
   {
    "s": "The rewrite adds a kiss scene with an actor you just met. They are very nervous. They keep apologising.",
    "c": [
     [
      "Make the scene funny",
      "break the tension",
      "The nervous kiss is funny and real. It is the best moment in the film.",
      "The nervous kiss is too funny. The director says 'again, but sad.'"
     ],
     [
      "Talk to them about their favourite food",
      "make them comfortable",
      "The chat relaxes them. The kiss scene is sweet and natural.",
      "The chat makes them hungry. They are now thinking about food."
     ],
     [
      "Do it quickly and professionally",
      "get it done",
      "The scene is done in one take. Professional and clean.",
      "The scene is done in one take. It has all the heat of a handshake."
     ]
    ]
   }
  ],
  "act-host": [
   {
    "s": "You're hosting the digital premiere live. The celebrities are thirty minutes late. You have to fill dead air with a camera in your face and a crowd behind the barrier.",
    "c": [
     [
      "Interview fans in the crowd",
      "make them the stars",
      "A fan's hot take goes viral. The clip is better than any red carpet.",
      "A fan tells you your fly is down. Live."
     ],
     [
      "Do a dramatic reading of the press release",
      "go strange",
      "The press release reading is so funny the studio posts it.",
      "The press release has a typo. You read the typo. Twice."
     ],
     [
      "Talk about the film like a professional",
      "stay polished",
      "Smooth, informed, never flustered. The studio books you again.",
      "Smooth and informed, which is how you lose 40% of viewers."
     ]
    ]
   },
   {
    "s": "The first celebrity finally arrives forty minutes late. They stop dead at your mark, squint at your microphone and ask, live, 'sorry, who are you?'",
    "c": [
     [
      "'Your new favourite person. Hi.'",
      "charm offensive",
      "They crack up and give you the warmest interview of the night.",
      "They say 'okay' and walk straight past you."
     ],
     [
      "Introduce yourself as their long-lost cousin",
      "commit to a lie",
      "They play along. The 'cousins' clip is the night's big moment.",
      "They do not play along. Security briefly considers you."
     ],
     [
      "Say your name, ask about their look",
      "stay smooth",
      "Easy, polished, quotable. Their publicist nods at you.",
      "Easy, polished. They forget your name before the next mark."
     ]
    ]
   },
   {
    "s": "Your earpiece suddenly switches to a different channel. You are hosting a premiere while a man in your ear explains how to braise lamb shanks.",
    "c": [
     [
      "Narrate the lamb recipe live",
      "share the chaos",
      "Your accidental cooking segment trends harder than the film.",
      "The film's director is not here for lamb content."
     ],
     [
      "Tell viewers exactly what's happening",
      "be in on it",
      "Viewers love the honesty. The producer fixes it in seconds.",
      "The producer can't hear you either. You are both lost."
     ],
     [
      "Pull it out and host by instinct",
      "fly solo",
      "No cues, no problem. You look like you've done this for years.",
      "No cues. You introduce the same guest twice."
     ]
    ]
   },
   {
    "s": "A huge star stops at your mark and starts complimenting your outfit live on camera. Their publicist is visibly pulling them away.",
    "c": [
     [
      "Ask them to stay for one more question",
      "shoot your shot",
      "They stay and give you an exclusive. Huge.",
      "They stay and the publicist cuts the feed."
     ],
     [
      "Compliment them back so they stay",
      "smooth operator",
      "The compliment exchange is the sweetest clip of the night.",
      "The compliment exchange is very long. Very, very long."
     ],
     [
      "Thank them and let them go",
      "respect boundaries",
      "The publicist remembers you were easy. Good relationship built.",
      "The publicist remembers you. The star does not."
     ]
    ]
   }
  ],
  "act-read": [
   {
    "s": "You made the shortlist. In the chemistry read, the other actor keeps stepping on your lines. The producers are watching from behind a glass wall.",
    "c": [
     [
      "Stop and wait until they come to you",
      "shift the power",
      "They notice, slow down, and the scene suddenly breathes. You both get notes.",
      "The pause goes on so long a producer taps the glass."
     ],
     [
      "Step on their lines right back",
      "match their energy",
      "The overlapping chaos looks like real chemistry. The producers love it.",
      "It sounds like an argument over a parking space."
     ],
     [
      "Ask to run it once more, slower",
      "reset the room",
      "The second run is so much better. You look like a leader.",
      "The second run is slower and somehow worse."
     ]
    ]
   },
   {
    "s": "The other actor is your ex. Nobody in the room knows. The scene is about two people who broke up and still love each other.",
    "c": [
     [
      "Use the real feelings",
      "nerves of steel",
      "The scene is devastating. Behind the glass, a producer reaches for tissues.",
      "The scene is devastating. You are both in tears. Nobody can continue."
     ],
     [
      "Make it a comedy",
      "protect yourself",
      "The comedy version is fresh and surprising. You both get callbacks.",
      "The comedy version is very unfunny. Very awkward."
     ],
     [
      "Be professional and do the scene",
      "keep it clean",
      "Clean and controlled. The producers circle something on their sheet.",
      "Your professionalism is noted. Your chemistry is not."
     ]
    ]
   },
   {
    "s": "The producers want a meet-cute: you two bump into each other in a doorway. On take one, you bump hard enough to knock their script across the room.",
    "c": [
     [
      "Turn it into full slapstick",
      "milk the accident",
      "The producers laugh out loud. That's the read they keep talking about.",
      "The slapstick is a bit too real. Someone needs an ice pack."
     ],
     [
      "Pick up the pages and hand them back with a line",
      "save it with charm",
      "The ad-lib is so smooth it sounds written. Chemistry, confirmed.",
      "The ad-lib is cheesy enough to make a producer groan."
     ],
     [
      "Apologise and run it clean",
      "reset properly",
      "The clean run is sweet and natural. Very usable.",
      "The clean run is careful and kind of airless."
     ]
    ]
   },
   {
    "s": "The producers ask you to do the scene again but with a 'funny accent.' They don't say which one.",
    "c": [
     [
      "Do a very specific regional accent",
      "commit",
      "The accent is so specific and funny the producers ask where you learned it.",
      "The accent is very specific. It's also from the producer's hometown."
     ],
     [
      "Ask what accent they want",
      "fix the problem",
      "They pick one. You nail it. Someone behind the glass laughs out loud.",
      "They say 'surprise us.' You are not surprised."
     ],
     [
      "Do the scene in your normal voice",
      "play it straight",
      "The producers are impressed you stayed true to the character.",
      "The producers are disappointed you didn't do the accent."
     ]
    ]
   }
  ],
  "act-period": [
   {
    "s": "Period-drama screen test. The corset is so tight you can only speak in short sentences. Your monologue is two pages long.",
    "c": [
     [
      "Rewrite it into short, gasping lines",
      "make it dramatic",
      "The breathless version is the most intense read of the day.",
      "The breathless version sounds like you need medical help."
     ],
     [
      "Ask to do the scene without the corset",
      "tell the truth",
      "The director agrees. Your read is free and powerful.",
      "The director does not agree. Now everyone knows you can't breathe."
     ],
     [
      "Do it all in one breath",
      "go for it",
      "You do it. Somehow. The director is in awe.",
      "You do it, then you faint. Gracefully."
     ]
    ]
   },
   {
    "s": "The accent coach tells you your accent is 'about four hundred years off.' The camera is about to roll.",
    "c": [
     [
      "Do it four hundred years earlier",
      "commit to the bit",
      "The coach laughs and says 'actually... keep that.'",
      "The ancient accent sounds like a pirate who got lost."
     ],
     [
      "Ask for a crash course",
      "learn fast",
      "The crash course works. Your accent is perfect for the test.",
      "The crash course gives you three accents at once."
     ],
     [
      "Use a neutral accent",
      "play it safe",
      "The neutral accent is clean and lets your acting shine.",
      "The neutral accent is too neutral. The director is bored."
     ]
    ]
   },
   {
    "s": "Today's test includes riding into frame on horseback. The horse is enormous and called Duchess. You have never sat on a horse.",
    "c": [
     [
      "Climb up like you were born in a saddle",
      "fake it superbly",
      "Duchess behaves. You look like a portrait in a museum.",
      "Duchess has other plans. The take is very brief."
     ],
     [
      "Introduce yourself to Duchess first",
      "make a friend",
      "Duchess nuzzles you. The handler says she never does that.",
      "Duchess eats a page of your script. The important page."
     ],
     [
      "Ask for the double for the wide",
      "sensible shoes",
      "The double nails the ride and your close-ups steal the test.",
      "The double rides so well they keep the wide forever."
     ]
    ]
   },
   {
    "s": "Your scene partner is a famous stage actor who has now corrected your pronunciation of 'whilst' four times. In front of the director.",
    "c": [
     [
      "Say it wrong, beautifully, on purpose",
      "take the power back",
      "The director snorts. The scene loosens and finally plays.",
      "The stage actor launches into a lecture on vowels."
     ],
     [
      "Ask them to say every line for you, then",
      "call the bluff",
      "They laugh, apologise and the rest of the test is warm.",
      "They take you literally and start reading your lines."
     ],
     [
      "Nail 'whilst' and carry on",
      "outclass them",
      "Perfect vowel, perfect scene. They nod, grudgingly.",
      "They find a new word. It's 'often'."
     ]
    ]
   }
  ],
  "act-stunt": [
   {
    "s": "The stunt looks simple on paper: walk a beam, look scared. The beam is three storeys up, you're in a harness, and you are not acting the scared part.",
    "c": [
     [
      "Do it yourself and let the fear show",
      "use the real thing",
      "The real fear reads beautifully. The crew applauds at the bottom.",
      "The real fear reads as frozen. For a long while."
     ],
     [
      "Add a cheeky hair flick halfway across",
      "show off a little",
      "The hair flick is the shot of the trailer. Iconic.",
      "The coordinator's face goes white. So does yours."
     ],
     [
      "Hand the beam to the stunt double",
      "stay safe",
      "The double is perfect and your landing close-up kills.",
      "The double gets a round of applause. You get a juice box."
     ]
    ]
   },
   {
    "s": "The stunt coordinator wants you to fall backwards into a stack of boxes. Nobody will say what's in the boxes. They're smiling.",
    "c": [
     [
      "Fall without asking",
      "trust the crew",
      "Feathers everywhere. The shot looks like a dream sequence.",
      "It's old wrapping paper. Very loud, very crunchy."
     ],
     [
      "Peek inside one box first",
      "check your landing",
      "It's popcorn. You eat a handful on camera. Crew favourite.",
      "It's glitter. It will be with you until next year."
     ],
     [
      "Ask the coordinator straight out",
      "get answers",
      "Foam. Safe, soft, perfect fall on take one.",
      "The coordinator shrugs. Somehow that's worse."
     ]
    ]
   },
   {
    "s": "Your fight scene partner is a former boxer who keeps landing real punches. 'Sorry,' he says. 'Habit.'",
    "c": [
     [
      "Fight back for real",
      "match them",
      "The fight looks so real it gets a standing ovation on set.",
      "You both get injured. The scene is cancelled."
     ],
     [
      "Make the punches funny",
      "defuse it",
      "Your funny reactions make the scene a comedy. It works.",
      "Your funny reactions make the scene a comedy. It was meant to be scary."
     ],
     [
      "Ask for a new partner",
      "safety first",
      "Your new partner is great. The scene is perfect and safe.",
      "Your new partner is a former wrestler. Help."
     ]
    ]
   },
   {
    "s": "You have to sprint through a fake explosion. It's all lights and sound, but the bang is so loud you flinch every single take.",
    "c": [
     [
      "Keep the flinch and act around it",
      "make it real",
      "The flinch makes it look terrifyingly real. Director's favourite.",
      "The flinch turns into a stumble. Take nine."
     ],
     [
      "Start screaming before the bang",
      "get ahead of it",
      "The pre-scream is weirdly heroic. They keep it.",
      "The scream starts too early. It looks like you predicted it."
     ],
     [
      "Wear earplugs and run clean",
      "fix the problem",
      "Clean sprint, steady face. Action-star energy.",
      "Earplugs in, you miss 'cut' and keep running into catering."
     ]
    ]
   }
  ],
  "act-premiere": [
   {
    "s": "You're hosting the red carpet for a film you're not in. A huge star walks toward your mark carrying a pet lizard in a tiny jewelled harness.",
    "c": [
     [
      "Interview the lizard first",
      "prioritise the lizard",
      "The lizard interview is the clip of the night. Everyone is obsessed.",
      "The lizard lunges for your mic. Live, in HD."
     ],
     [
      "Ask the star for the lizard's full name",
      "feed their love",
      "The star lights up: 'Sir Reginald.' Your best interview yet.",
      "The star wanted to talk about the film. They say so."
     ],
     [
      "Ask about the film like a pro",
      "stay on message",
      "Clean, smart answers. Their team clocks you as reliable.",
      "The lizard does something on camera. Nobody talks about the film."
     ]
    ]
   },
   {
    "s": "Your heel catches the carpet edge and your hem tears clean up the side. A camera is about two feet from your face.",
    "c": [
     [
      "Pose like the slit was always there",
      "own it",
      "The 'slit' becomes the most talked-about look on the carpet.",
      "The tear keeps going. The camera keeps rolling."
     ],
     [
      "Tie it into a knot and call it couture",
      "style on the spot",
      "Your instant re-style gets reposted by three stylists.",
      "The knot gives up halfway down the carpet."
     ],
     [
      "Borrow a safety pin and carry on",
      "handle it",
      "Pinned, fixed, nobody the wiser. Total pro.",
      "The pin pings off during your next interview."
     ]
    ]
   },
   {
    "s": "A reporter in the pen is shouting your name, but the music is so loud you can't hear the question. Their camera light is already red.",
    "c": [
     [
      "Answer with total confidence anyway",
      "wing it",
      "Your answer is so random and charming it goes viral.",
      "Your answer is about soup. The question was about grief."
     ],
     [
      "Lean in and make them repeat it slowly",
      "make it a bit",
      "The slow-motion repeat is the funniest clip on the carpet.",
      "They repeat it slower and louder. You still can't hear."
     ],
     [
      "Give a warm all-purpose answer",
      "stay safe",
      "Warm, short, fine. Nobody can quote it against you.",
      "Warm and short. It does not match the question at all."
     ]
    ]
   },
   {
    "s": "The film's director stops on your carpet and whispers, 'I hate this film.' The camera is still on.",
    "c": [
     [
      "Ask them why on camera",
      "get the tea",
      "The director's honest answer is the most viral moment of the year.",
      "The director's publicist sprints across the carpet."
     ],
     [
      "Make a joke to cover for them",
      "save them",
      "The joke saves the moment. The director is grateful.",
      "The joke makes it obvious something is wrong."
     ],
     [
      "Pretend you didn't hear",
      "say nothing",
      "The moment passes. Nobody knows.",
      "The microphone heard everything."
     ]
    ]
   }
  ],
  "act-festival": [
   {
    "s": "A filmmaker drags you on stage for a public Q&A and asks what you thought of their film. You were at the bar for most of it.",
    "c": [
     [
      "Say it 'rearranged something in you'",
      "sell the vibe",
      "The crowd applauds. The filmmaker clasps your hand.",
      "The filmmaker asks which scene. The silence is enormous."
     ],
     [
      "Admit it and promise to watch tonight",
      "disarm them",
      "The room laughs with you. The filmmaker hands you a screener.",
      "The room gasps. The filmmaker's face does a thing."
     ],
     [
      "Ask what they hoped people would feel",
      "turn it around",
      "They talk for ten minutes. You nod beautifully.",
      "They turn it straight back to you. Still haven't seen it."
     ]
    ]
   },
   {
    "s": "An audience member takes the mic for a 'question'. Four minutes later it is still a speech about their own screenplay.",
    "c": [
     [
      "Ask them to pitch it in one line",
      "take the mic back",
      "Their one-liner is genuinely good. The room cheers you both.",
      "Their one line has eleven commas."
     ],
     [
      "Thank them for the 'question' with a wink",
      "read the room",
      "The audience howls. The Q&A gets its rhythm back.",
      "They wink back and keep going."
     ],
     [
      "Answer their speech politely",
      "give them the floor",
      "Your patience gets a warm round of applause.",
      "Your patience gives them time for a second speech."
     ]
    ]
   },
   {
    "s": "Another jury guest, a very famous actor, has fallen asleep next to you. They are snoring gently into a live microphone.",
    "c": [
     [
      "Ask them a question by name",
      "wake them up live",
      "They wake up and give a brilliant answer. Legendary moment.",
      "They wake up furious and very confused."
     ],
     [
      "Snore back into your mic",
      "harmonise",
      "The duet brings the house down. Even they laugh.",
      "Half the room thinks it's a planned bit. Half thinks you're rude."
     ],
     [
      "Tap their arm and cover with a joke",
      "rescue them",
      "They wake up mortified and grateful. Ally made.",
      "They wake up and knock their water into your lap."
     ]
    ]
   },
   {
    "s": "The festival's big film just died on screen. People are booing. The director is crying on stage next to you and the Q&A must go on.",
    "c": [
     [
      "Defend the film with real passion",
      "stand up for it",
      "Your speech turns the room. Some people actually clap.",
      "The boos now include you. Brave though."
     ],
     [
      "Ask the director about the hardest day",
      "change the angle",
      "Their story silences the room. Booing turns to listening.",
      "The hardest day was today. They cry harder."
     ],
     [
      "Thank them for taking the swing",
      "warmth wins",
      "Small kindness, big room. The director squeezes your hand.",
      "The director hears 'swing and miss'. Oops."
     ]
    ]
   }
  ],
  "act-reshoot": [
   {
    "s": "A studio flies you in quietly to fix one scene. You watch the current cut: someone eating a sandwich in a parked car, very sadly, for two whole minutes.",
    "c": [
     [
      "Eat it like it's the last sandwich on earth",
      "go operatic",
      "The sandwich scene becomes the one everyone quotes.",
      "The sandwich scene becomes a meme. The bad kind."
     ],
     [
      "Do the whole scene without the sandwich",
      "strip it back",
      "The empty-handed version is devastating. The director goes quiet.",
      "Without the sandwich nobody knows what's happening."
     ],
     [
      "One bite, one tear, hold the look",
      "keep it small",
      "The single tear is perfect. Scene fixed.",
      "The tear is too small to see on a phone screen."
     ]
    ]
   },
   {
    "s": "The reshoot is so secret the call sheet calls you 'THE GUEST'. Your catering name card says 'mystery person'. Your phone is buzzing with 'where are you??'",
    "c": [
     [
      "Post the name card with no caption",
      "tease it",
      "Fans go into full detective mode. The studio secretly loves the buzz.",
      "The studio does not secretly love it. They loudly don't."
     ],
     [
      "Play 'mystery person' all day for the crew",
      "entertain the set",
      "The crew adores you. Best day on set they've had.",
      "The crew are mildly scared of mystery person."
     ],
     [
      "Stay dark and do the work",
      "stay invisible",
      "Scene fixed, zero leaks. The studio remembers who kept quiet.",
      "Scene fixed. The credits say 'additional photography'. That's you."
     ]
    ]
   },
   {
    "s": "The lead actor is openly annoyed you're here. They keep telling everyone they could fix this scene themselves, by lunch.",
    "c": [
     [
      "Invite them to fix it with you",
      "bring them in",
      "The two-hander version is the best the scene has ever been.",
      "The two-hander turns into a polite war."
     ],
     [
      "Ask them to watch one take",
      "let the work talk",
      "One take later, they go quiet and nod.",
      "One take later, they say 'interesting' in a horrible voice."
     ],
     [
      "Smile, do the job, fly home",
      "stay above it",
      "Clean fix, no drama. The director owes you one.",
      "Clean fix. The lead tells the press you were 'lovely' with air quotes."
     ]
    ]
   },
   {
    "s": "The director keeps saying 'do it like the original actor did it.' You have never seen the original. Nobody will show you.",
    "c": [
     [
      "Do it the opposite way",
      "swing hard",
      "The opposite version clicks. The director whispers 'oh.'",
      "The opposite version is the opposite of good."
     ],
     [
      "Find the original on someone's laptop",
      "do your homework",
      "Five minutes of research and you nail the scene.",
      "You find the original. It's so bad you get the giggles."
     ],
     [
      "Make your best educated guess",
      "split the difference",
      "Close enough to keep everyone calm. Scene saved.",
      "Your guess is a different genre."
     ]
    ]
   }
  ],
  "act-lead": [
   {
    "s": "The waiting room for the lead-role screen test is full of huge names. The one beside you has an award on their shelf at home and a very relaxed smile.",
    "c": [
     [
      "Ask them for their best audition tip",
      "learn from the best",
      "Their tip is gold. You walk in loose and electric.",
      "Their tip is 'be taller'. Thanks."
     ],
     [
      "Bring your own prop from home",
      "stand out",
      "Your little prop makes the director lean forward.",
      "Your prop rolls under the casting table."
     ],
     [
      "Close your eyes and run your lines",
      "lock in",
      "You walk in calm and leave the room buzzing.",
      "You run your lines so hard you miss your name being called."
     ]
    ]
   },
   {
    "s": "The director wants you to do the most emotional scene in the film. Then he asks you to do it backwards.",
    "c": [
     [
      "Say the lines backwards",
      "commit",
      "The backwards scene is a masterpiece. The director is obsessed.",
      "The backwards scene is unwatchable. The director is confused."
     ],
     [
      "Start at the end and work your way back",
      "interpret it",
      "Your interpretation is clever. The director is impressed.",
      "Your interpretation is too clever. The director doesn't get it."
     ],
     [
      "Ask what he means",
      "fix the problem",
      "He explains. You do it. It's perfect.",
      "He doesn't explain. You do it wrong."
     ]
    ]
   },
   {
    "s": "Mid-test, the studio boss walks in, sits right in front of you and opens a family-size bag of crisps. Crunching begins.",
    "c": [
     [
      "Hold out your hand for a crisp",
      "break the ice",
      "He laughs and passes the bag. The room relaxes.",
      "He does not pass the bag. He crunches louder."
     ],
     [
      "Play the scene loud enough to beat the crisps",
      "raise your game",
      "The crunching stops halfway. He forgot he was eating.",
      "The crisps win on volume."
     ],
     [
      "Stay locked into your scene partner",
      "ignore the noise",
      "Your focus is the talk of the meeting afterwards.",
      "Your focus is great. He leaves before the good bit."
     ]
    ]
   },
   {
    "s": "The director gives you the same note five times in a row: 'more.' He will not say more of what.",
    "c": [
     [
      "Give him more of absolutely everything",
      "take him literally",
      "The 'more' take is huge and wild and he loves it.",
      "The 'more' take is a cartoon with sound effects."
     ],
     [
      "Secretly give him less",
      "play the opposite",
      "'That's it!' he says. It was less all along.",
      "'More,' he says. Same note. Sixth time."
     ],
     [
      "Ask: more of what, exactly?",
      "just ask",
      "He laughs, explains, and the next take is perfect.",
      "He says 'more of more.' Helpful."
     ]
    ]
   }
  ],
  "act-limited": [
   {
    "s": "The prestige limited series is everything: brilliant script, brutal schedule. The director warns you the first week is all night shoots. Outdoors. In the rain.",
    "c": [
     [
      "Say you've always loved rain",
      "perform enthusiasm",
      "The director loves your energy. Week one becomes a bonding story.",
      "The director doesn't believe anyone loves rain."
     ],
     [
      "Ask for a heated trailer in the deal",
      "negotiate",
      "They say yes to the trailer and you start week one warm.",
      "They say no. Loudly. The room cools."
     ],
     [
      "Nod and buy good thermals",
      "just get on with it",
      "Thermals on, you're the only one not shivering. Respect.",
      "You get a cold by Wednesday. A real one."
     ]
    ]
   },
   {
    "s": "The showrunner is a famous novelist doing TV for the first time. They keep rewriting your lines on the day, by hand, on napkins.",
    "c": [
     [
      "Improve the napkin lines live",
      "play with them",
      "They love your version and start writing to your voice.",
      "They do not love your version. More napkins."
     ],
     [
      "Ask them what the book version was",
      "speak their language",
      "They light up, explain, and stop rewriting so much.",
      "They read you the whole chapter between takes."
     ],
     [
      "Learn every napkin and deliver it clean",
      "unshakeable",
      "Word-perfect every time. They start calling you 'the reliable one'.",
      "Word-perfect, then a new napkin arrives."
     ]
    ]
   },
   {
    "s": "Awards people visit set. One is taking furious notes. Another is asleep in a director's chair with sunglasses on.",
    "c": [
     [
      "Play the scene for the note-taker",
      "aim the work",
      "They underline something twice. You will never know what.",
      "They write two words and close the notebook."
     ],
     [
      "Play it for the sleeper",
      "wake them",
      "The sleeper sits up mid-scene and takes off the sunglasses.",
      "The sleeper stays asleep. Very asleep."
     ],
     [
      "Forget them all and play the scene",
      "stay inside it",
      "The scene is so good the whole set goes quiet.",
      "The scene is good. Nobody important is looking."
     ]
    ]
   },
   {
    "s": "The series is set in the 1920s and the director wants you in a sharp period bob. Your hair is a big part of your whole personality.",
    "c": [
     [
      "Chop it all off",
      "go method",
      "The bob is iconic. It's on every moodboard by Friday.",
      "The bob is bold. Your mum calls about it."
     ],
     [
      "Ask for a really good wig",
      "protect the hair",
      "The wig is so good even wardrobe forgets it's a wig.",
      "The wig slips in the dance scene."
     ],
     [
      "Offer a pinned-up version instead",
      "meet halfway",
      "The pinned look reads perfectly on camera.",
      "The pins show in every close-up."
     ]
    ]
   }
  ],
  "act-franchise": [
   {
    "s": "The franchise contract is thicker than the script. The executive slides it across the table and describes your character as 'a sexy wizard, but grounded.'",
    "c": [
     [
      "Say you've been preparing for this your whole life",
      "sell the dream",
      "The exec laughs and starts pitching you sequel ideas.",
      "The exec asks to see your wizard voice. Right now."
     ],
     [
      "Ask what 'grounded' means for a wizard",
      "poke the brief",
      "The exec loves the question. You talk lore for an hour.",
      "The exec doesn't know. Neither does the script."
     ],
     [
      "Take the contract home to read",
      "read the room twice",
      "Your reading spots one clause that matters. Your agent cheers.",
      "The exec's smile slips a little when you stand up."
     ]
    ]
   },
   {
    "s": "The executive wants your 'franchise face.' He shows you a reference photo: a man looking very mildly surprised by a sandwich.",
    "c": [
     [
      "Copy the face perfectly",
      "nail the brief",
      "Your mildly surprised face makes the exec clap.",
      "Your face is so surprised it reads as 'alarm'."
     ],
     [
      "Pitch a better face",
      "improve on it",
      "Your face is so good they swap the reference photo.",
      "Your better face scares the intern."
     ],
     [
      "Ask what the man is surprised by",
      "dig deeper",
      "He explains the sandwich. You nail it instantly.",
      "Nobody knows what the sandwich did."
     ]
    ]
   },
   {
    "s": "Merchandising needs your favourite colour for your action figure. Your favourite colour is beige. The team looks sad.",
    "c": [
     [
      "Insist on beige with pride",
      "stand by beige",
      "The beige figure becomes a weird cult favourite.",
      "The beige figure is described as 'oatmeal with a face'."
     ],
     [
      "Go full metallic gold",
      "think shelf appeal",
      "Gold figure, sold out in preorders. Very shiny.",
      "Gold, but the cheap kind. You look like a trophy."
     ],
     [
      "Let them pick",
      "low maintenance",
      "They pick a gorgeous deep green. Everyone is happy.",
      "They pick hot pink. You cannot stop them now."
     ]
    ]
   },
   {
    "s": "Your rival is in the franchise meeting too. Mid-pitch, they announce they have 'a better idea' for your character's backstory.",
    "c": [
     [
      "Let them pitch, then smile",
      "give them rope",
      "Their idea sinks on its own. You didn't have to say a word.",
      "Their idea is actually great. Annoyingly great."
     ],
     [
      "Cut in with your own idea first",
      "get there first",
      "Your idea lands. The room turns to you.",
      "Your idea is half-baked and everybody hears it."
     ],
     [
      "Ask the exec which way they lean",
      "let the room decide",
      "The exec backs you. Your rival drinks their water slowly.",
      "The exec backs your rival. You drink your water slowly."
     ]
    ]
   }
  ],
  "act-auteur": [
   {
    "s": "Lunch with an A-list director at a private restaurant. No audition, just conversation. They order for both of you without asking. It arrives: something with a lot of tentacles.",
    "c": [
     [
      "Eat it and ask for seconds",
      "match their energy",
      "They grin. You're the first actor who didn't flinch.",
      "The tentacle wins. You keep smiling through it."
     ],
     [
      "Say you're not a tentacle person, honestly",
      "stay real",
      "They laugh, swap plates, and the conversation opens right up.",
      "They seem a little hurt on behalf of the octopus."
     ],
     [
      "Order chips 'for the table'",
      "quietly rescue lunch",
      "Chips arrive. The director eats most of them. Bond formed.",
      "The director looks at the chips like you brought a toy."
     ]
    ]
   },
   {
    "s": "The director asks which of their films is your favourite. You've only seen one, and it's the one critics hated most.",
    "c": [
     [
      "Name it proudly and say why",
      "back the flop",
      "Their eyes light up. Nobody has ever defended that one to them.",
      "They also hate that one. Deeply."
     ],
     [
      "Say you can't pick just one",
      "dodge with charm",
      "They laugh and talk about all of them. You nod a lot.",
      "They ask you to name three. You name one twice."
     ],
     [
      "Admit you've only seen one",
      "come clean",
      "They respect it and tell you which one to watch next.",
      "They signal for the bill a little faster than before."
     ]
    ]
   },
   {
    "s": "Halfway through dessert, the director leans in: 'tell me a secret. It helps me see who you are.'",
    "c": [
     [
      "Tell a wild, dramatic secret",
      "give them a story",
      "They're riveted. You'll be in their next notebook for sure.",
      "They ask a follow-up question you are not ready for."
     ],
     [
      "Tell a small, true secret",
      "just be human",
      "The small truth lands. They tell you one back.",
      "Your secret is that you like cereal for dinner. They wait for more."
     ],
     [
      "Ask them to go first",
      "flip it",
      "They tell you a juicy one. Now you're in the inner circle.",
      "They don't go first. Dessert ends very quietly."
     ]
    ]
   },
   {
    "s": "The director's phone buzzes mid-lunch. It's another actor's agent, and you can hear they're talking about the part you want.",
    "c": [
     [
      "Ask, cheekily, if you can say hi",
      "shoot your shot",
      "The director laughs and hands you the phone. Bold works.",
      "The director doesn't laugh and steps outside."
     ],
     [
      "Act deeply interested in your water",
      "play dumb",
      "They hang up and turn straight back to you, warmer.",
      "They hang up and say 'sorry, where were we?' and mean it."
     ],
     [
      "Step away to give them privacy",
      "show class",
      "When you sit back down, they say 'that was classy.'",
      "When you sit back down, the bill is paid. Lunch is over."
     ]
    ]
   }
  ],
  "fashion-lookbook": [
   {
    "s": "A brand-new label has a budget of one rail, one ring light and a borrowed backdrop with a coffee stain on it. They need you to make it look expensive.",
    "c": [
     [
      "Pose so the stain becomes the art",
      "work the flaw",
      "The stain shot becomes the hero image. The founders frame it.",
      "The stain is all anyone sees. Someone calls it 'brave'."
     ],
     [
      "Drag the shoot outside onto the street",
      "change the set",
      "Street light, real strangers, a lookbook that feels alive.",
      "A bus parks in every frame. A very large, very red bus."
     ],
     [
      "Hit clean angles in front of the backdrop",
      "make cheap look chic",
      "Neat, sharp, sellable. The label gets exactly the lookbook it needed.",
      "Neat and sellable. The stain is still technically in shot."
     ]
    ]
   },
   {
    "s": "The designer is twenty-two and has stitched the whole collection by hand. One sleeve is still pinned. She is trying very hard not to cry.",
    "c": [
     [
      "Wear the pins like jewellery",
      "make it a feature",
      "The pins look intentional. Fashion accounts call it 'deconstructed'.",
      "A pin finds your arm on frame forty. Your face says everything."
     ],
     [
      "Hype her up so loud the room cheers",
      "be the energy",
      "She laughs, relaxes, and the shoot turns into a party.",
      "The hype is a bit much. She now cries happy tears on the clothes."
     ],
     [
      "Hide the sleeve with clever angles",
      "protect her",
      "Nobody can tell. She hugs you at the end.",
      "Every picture is from the same side. It is very noticeable."
     ]
    ]
   },
   {
    "s": "The photographer for the lookbook is the designer's cousin. He has never used a real camera and keeps saying 'yes, slay' between every frame.",
    "c": [
     [
      "Direct him like you're the photographer",
      "take the lead",
      "You basically shoot your own lookbook. It's great. He takes credit.",
      "You shout so many directions he drops the camera."
     ],
     [
      "Match his 'slay' energy pose for pose",
      "play along",
      "The vibe is unhinged and joyful. The photos are electric.",
      "It turns into a slay-off. Nobody remembers to focus."
     ],
     [
      "Find your light and stay still",
      "make it easy",
      "Stillness rescues it. The shots are calm and gorgeous.",
      "Stillness, and also his thumb over the lens."
     ]
    ]
   },
   {
    "s": "Mid-shoot, the label's only pair of sample boots arrives in a size you are definitely not. Two sizes too small. There is no backup.",
    "c": [
     [
      "Wear them and pose from the knees up",
      "suffer for fashion",
      "Not one shot shows your face crying. A professional.",
      "You walk like a baby deer between every frame. It gets filmed."
     ],
     [
      "Shoot barefoot like it was the plan",
      "rewrite the brief",
      "Barefoot is the look now. The label pretends it was theirs.",
      "Barefoot on a cold concrete floor. The shivering shows."
     ],
     [
      "Swap in your own boots",
      "make it work",
      "Your boots fit the collection better. Nobody asks.",
      "Your boots are visibly from last season. Someone asks."
     ]
    ]
   }
  ],
  "fashion-test": [
   {
    "s": "No client, no brief. Just a photographer whose last three test shoots launched three careers. She hands you a bucket and says, 'trust me.'",
    "c": [
     [
      "Put the bucket on your head",
      "full trust",
      "The bucket shot is unreal. It goes in her portfolio and yours.",
      "It is a bucket on your head. That is all it is."
     ],
     [
      "Ask what is going in the bucket",
      "keep it smart",
      "It's water. You ask the right questions and the splash shot is perfect.",
      "She says 'you'll see' and you very much do. Freezing."
     ],
     [
      "Hold it like a vintage handbag",
      "play it chic",
      "The bucket becomes high fashion. She laughs and keeps shooting.",
      "Nobody can tell it is a bucket. Including you."
     ]
    ]
   },
   {
    "s": "The photographer says the light is perfect for exactly six minutes. Your hair is still in rollers.",
    "c": [
     [
      "Shoot in the rollers",
      "embrace the mess",
      "The roller photos are the most interesting test of her year.",
      "The roller photos look like a toothpaste advert."
     ],
     [
      "Pull the rollers out mid-shot",
      "make a moment",
      "The tumbling curls freeze in frame. Accidental genius.",
      "One roller gets stuck. You spend minute four wrestling it."
     ],
     [
      "Wait for the next good light",
      "wait it out",
      "The next light is softer and kinder. The shots are worth it.",
      "The next good light is tomorrow. Tomorrow you are busy."
     ]
    ]
   },
   {
    "s": "She wants you in the public fountain. A security guard is watching. The light is golden and the water is very cold.",
    "c": [
     [
      "Get in the fountain",
      "just go",
      "The fountain shot is the best image she has ever taken of anyone.",
      "The security guard gets a cameo. So does the fine."
     ],
     [
      "Sit on the edge with one foot in",
      "meet halfway",
      "Moody, cinematic, legal. The guard even claps a little.",
      "The edge is wet. You slide in anyway, not on purpose."
     ],
     [
      "Ask the guard for permission",
      "do it right",
      "He says yes and becomes your biggest fan.",
      "He says no and stands in every shot to make sure."
     ]
    ]
   },
   {
    "s": "The photographer's camera dies. She has one disposable camera from 2009 with five shots left.",
    "c": [
     [
      "Make every one of the five count",
      "no wasted frames",
      "Five shots, five keepers. Grainy, perfect, iconic.",
      "You find out in a week. Four of them are her thumb."
     ],
     [
      "Steal the camera and shoot her instead",
      "flip it",
      "The photos of her are amazing. She asks you to come back.",
      "You are not a photographer. It shows."
     ],
     [
      "Wait for her to charge the battery",
      "stay patient",
      "Battery back, full roll, beautiful test images.",
      "The charger is at her flat. Across the city."
     ]
    ]
   }
  ],
  "fashion-pop": [
   {
    "s": "A crowd forms outside the pop-up and the brand decides on the spot: mini runway, right now, down the shop aisle. The aisle is lined with candles.",
    "c": [
     [
      "Walk it like it's Paris",
      "main character walk",
      "The street crowd screams. The brand posts you all night.",
      "One candle loses the fight against your hem. Crowd gasps."
     ],
     [
      "Stop and pose with the crowd",
      "work the people",
      "Fans film themselves with you. Free campaign content.",
      "Everybody films. Nobody buys anything."
     ],
     [
      "Walk carefully and keep it moving",
      "keep it safe",
      "Clean walk, no fires. The manager mouths 'thank you'.",
      "Clean walk. It looks like you are queuing."
     ]
    ]
   },
   {
    "s": "The pop-up's sound system only plays one song. It is a children's song about vegetables. It's on loop.",
    "c": [
     [
      "Walk to the beat like it's a banger",
      "commit",
      "The vegetable walk is a new fashion trend.",
      "The vegetable walk is in a funny-videos compilation by noon."
     ],
     [
      "Start singing a different song over it",
      "override",
      "The crowd sings with you. Peak pop-up energy.",
      "Half sings yours, half sings the vegetable song. Chaos."
     ],
     [
      "Walk in total silence like it isn't happening",
      "ignore it",
      "Your poker face is the most impressive thing in the building.",
      "Your poker face makes the vegetable song even funnier."
     ]
    ]
   },
   {
    "s": "A fan in the crowd is wearing the exact outfit you're about to walk in. They bought it this morning.",
    "c": [
     [
      "Pull them onto the runway with you",
      "share the moment",
      "The twin walk is the clip of the day. They're a mini star.",
      "They freeze halfway. You both stop to wait."
     ],
     [
      "Style yours differently on the spot",
      "stand out",
      "Your twist sells out the rail. People want your version.",
      "Your twist looks like you put it on in the dark."
     ],
     [
      "Wave at them and walk anyway",
      "sugar on top",
      "Cute moment, happy fan, solid pictures.",
      "The comments say they wore it better."
     ]
    ]
   },
   {
    "s": "The pop-up's air conditioning is broken. It's like walking through a sauna. Your foundation is sliding off.",
    "c": [
     [
      "Go sweaty-glam on purpose",
      "glow for it",
      "'Post-workout chic' trends. The brand is thrilled.",
      "Under the flash, you look like you're melting."
     ],
     [
      "Make a 'too hot' sign and walk with it",
      "joke it off",
      "The sign is funnier than the clothes. People repost it.",
      "The brand doesn't love the sign. They ask for it back."
     ],
     [
      "Fix your make-up and walk fast",
      "speed run",
      "Speed walk, clean face, done. Pros only.",
      "The speed walk is so fast the photographer misses it."
     ]
    ]
   }
  ],
  "fashion-stylist": [
   {
    "s": "A stylist is deciding who gets first pull from the rail everyone wants. She has a coffee in one hand and judgment in the other. You get one minute.",
    "c": [
     [
      "Pull the strangest piece on the rail",
      "show your taste",
      "She raises an eyebrow, then smiles. You get first pull.",
      "She takes the piece back very slowly. Very."
     ],
     [
      "Compliment her coffee, then her rail",
      "charm first",
      "She laughs. You get a chat, a pull and her number.",
      "She says the coffee is from the place downstairs. Moment over."
     ],
     [
      "Ask what she pictures you in",
      "let her lead",
      "She loves being asked. You leave with exactly the right look.",
      "She pictures you in beige. Lots of beige."
     ]
    ]
   },
   {
    "s": "Another influencer in the showroom grabs the dress you wanted. You both have hands on the hanger.",
    "c": [
     [
      "Ask to share it, one sleeve each",
      "make a bit",
      "The two-person dress shot is everywhere. You become friends.",
      "The dress rips down the middle. The stylist screams."
     ],
     [
      "Let go and pick something weirder",
      "outsmart her",
      "Your second choice gets the bigger reaction. She knows it.",
      "Your second choice is a costume. A big one."
     ],
     [
      "Let her have it, gracefully",
      "stay classy",
      "The stylist notices your class. Next time, you pull first.",
      "The stylist does not notice. Nobody notices."
     ]
    ]
   },
   {
    "s": "The stylist's dog walks out of the back room wearing the piece you want. It is a sequinned cape. It is actually very cute.",
    "c": [
     [
      "Ask the dog for a photo",
      "make friends",
      "The stylist loves you now. The dog does too.",
      "The dog runs off with the cape. You chase it."
     ],
     [
      "Ask for a matching cape",
      "go all in",
      "The stylist laughs and pulls you a matching one. Twinning.",
      "The stylist thinks you are serious about the dog cape."
     ],
     [
      "Wait until the dog is done",
      "wait it out",
      "Patience pays. The cape is yours, slightly hairy.",
      "The dog likes the cape too much. It is now the dog's."
     ]
    ]
   },
   {
    "s": "The stylist hands you an archive jacket so rare it has its own insurance. It's two sizes too big. She says 'make it work' and walks off.",
    "c": [
     [
      "Wear it as a mini dress",
      "flip the silhouette",
      "The jacket-dress is the look of the week. The archive account reposts.",
      "It reads 'designer duvet'. A gorgeous duvet, but still."
     ],
     [
      "Belt it and roll the sleeves",
      "tailor on the spot",
      "Sharp, new, very you. The stylist nods once. That's a lot for her.",
      "The only belt in the room is from the gift shop. It squeaks."
     ],
     [
      "Ask for anything in your size",
      "fix the problem",
      "She finds a smaller archive piece. It fits like it was made for you.",
      "She doesn't have one. You leave empty-handed and slightly sad."
     ]
    ]
   }
  ],
  "fashion-fitting": [
   {
    "s": "A cancellation opens up a runway look ten minutes before the final fitting closes. The designer is screaming in Italian. The look is a dress made of mirrors.",
    "c": [
     [
      "Put it on and just walk",
      "grab the chance",
      "The mirror dress is the moment of the night. You glow.",
      "Turns out the mirror dress weighs a lot. Your walk tells everyone."
     ],
     [
      "Ask for one adjustment in your best Italian",
      "speak her language",
      "She stops screaming and laughs. She pins it for you herself.",
      "Your Italian asks for a pizza. She does not stop screaming."
     ],
     [
      "Stand perfectly still while they fit you",
      "be the easy one",
      "Calm, still, quick. The team is grateful.",
      "So still they forget you are there and close the room."
     ]
    ]
   },
   {
    "s": "At the fitting, they tell you the look includes a live parrot on your shoulder. The parrot is called Kevin. Kevin does not like you.",
    "c": [
     [
      "Make Kevin your best friend",
      "win him over",
      "Kevin loves you. He rides your shoulder like a king.",
      "Kevin bites your ear. Your earring is now Kevin's."
     ],
     [
      "Ask for Kevin's understudy",
      "negotiate",
      "A calmer bird arrives. The look is still stunning.",
      "The understudy is a pigeon. It's not the same."
     ],
     [
      "Hold very still and hope",
      "read the room twice",
      "Kevin settles. You walk. Everyone gasps.",
      "Kevin flies off mid-runway. Into the front row."
     ]
    ]
   },
   {
    "s": "The look is 'naked dress' energy but made of thousands of beads. Every time you move, beads fall off.",
    "c": [
     [
      "Walk and let the beads fly",
      "make it rain",
      "The bead trail becomes the image of the show.",
      "Someone in the front row slips on a bead."
     ],
     [
      "Get the team to glue them back on",
      "fix it fast",
      "The glue holds. You walk perfectly.",
      "The glue makes you stick to the chair."
     ],
     [
      "Walk super slowly",
      "read the room twice",
      "The slow walk is dramatic and beautiful.",
      "The slow walk is so slow the next model catches up."
     ]
    ]
   },
   {
    "s": "The designer's assistant whispers that the designer secretly hates the look you're being fitted in. The designer made it. Last night.",
    "c": [
     [
      "Ask the designer what they'd change",
      "open the door",
      "They rework it on you in real time. It becomes the best look of the show.",
      "They start unpicking it while you're wearing it. Hold still."
     ],
     [
      "Gush about the look, loudly",
      "lift the mood",
      "The designer softens and starts to love it again.",
      "The designer thinks you're being sarcastic. Ice."
     ],
     [
      "Stay quiet and stand very still",
      "stay out of it",
      "Fitting done, no drama, the team breathes again.",
      "The designer sighs at the look for forty minutes."
     ]
    ]
   }
  ],
  "fashion-editorial": [
   {
    "s": "Indie magazine. Tiny budget, wild concept: 'what if clothes were afraid of you?' The stylist has hung all the outfits on a fishing rod.",
    "c": [
     [
      "Chase the clothes around the studio",
      "sell the concept",
      "The chase sequence is an editorial masterpiece. People call it art.",
      "The rod snaps. The clothes win."
     ],
     [
      "Pretend you're afraid of the clothes",
      "flip the brief",
      "The reversal is witty and haunting. The editor adores it.",
      "It looks like you have a phobia of shirts."
     ],
     [
      "Ask for one normal look to anchor it",
      "ground it",
      "The one normal look makes the weird ones hit harder.",
      "The normal look is the only one they print."
     ]
    ]
   },
   {
    "s": "The concept is 'urban mermaid.' The location is a public swimming pool. During opening hours.",
    "c": [
     [
      "Get in the pool in full costume",
      "go method",
      "The underwater shots are surreal and gorgeous. A lifeguard claps.",
      "The tail fills with water. You are now an anchor."
     ],
     [
      "Pose with a confused swimmer",
      "use the moment",
      "The swimmer's face makes the photo. An editorial for the ages.",
      "The swimmer is not confused. They are angry."
     ],
     [
      "Pose dry on the diving board",
      "keep it safe",
      "The diving board shot is elegant and striking.",
      "A kid cannonballs into the pool right in front of you."
     ]
    ]
   },
   {
    "s": "The photographer wants you to look 'like a sad cat at a party.' The stylist hands you whiskers.",
    "c": [
     [
      "Commit to sad-cat energy",
      "full method",
      "The sad cat editorial is iconic. Even the cats love it.",
      "It reads 'happy dog'. Nobody knows why."
     ],
     [
      "Ask for the cat's backstory",
      "go deep",
      "The backstory makes your performance sing.",
      "The backstory is longer than the shoot."
     ],
     [
      "Do your best sad look and wear the whiskers",
      "keep it simple",
      "The simple version is the most haunting shot.",
      "The simple version is just you with whiskers on."
     ]
    ]
   },
   {
    "s": "It's a nighttime shoot in an abandoned car park. The lighting guy only has one torch, and his hand keeps shaking.",
    "c": [
     [
      "Make the shaky light part of the vibe",
      "embrace the flicker",
      "The flickery photos are moody and brilliant.",
      "The flickery photos are so dark you can barely see a thing."
     ],
     [
      "Hold the torch yourself",
      "take control",
      "Self-lit portraits feel raw and intimate.",
      "Your arm is in every shot."
     ],
     [
      "Ask him to steady it",
      "fix the problem",
      "He steadies it. The shots are clean.",
      "He tries. His hand shakes even more."
     ]
    ]
   }
  ],
  "fashion-showroom": [
   {
    "s": "A buyer and an editor are in the private showroom. They cannot agree which look is the strongest, and they both turn to you at the same time.",
    "c": [
     [
      "Pick the look nobody mentioned",
      "break the tie",
      "They pause, look again and agree with you. Taste, confirmed.",
      "They both disagree with you. United, finally, against you."
     ],
     [
      "Wear both looks at once",
      "make a third option",
      "The layered combo is a whole new look. Everyone gasps.",
      "You look like a laundry pile with very good tailoring."
     ],
     [
      "Say each one wins a different room",
      "diplomacy",
      "They both nod. You're the calmest person in fashion.",
      "They both roll their eyes. It was a test."
     ]
    ]
   },
   {
    "s": "The showroom is so quiet you can hear the air conditioning. The buyer is staring at your shoes. Not the clothes. Your shoes.",
    "c": [
     [
      "Do a full spin to show them off",
      "own them",
      "The buyer asks where they're from. Your shoes are now a trend.",
      "The spin knocks over a rack."
     ],
     [
      "Ask if they like the shoes",
      "break the silence",
      "The buyer laughs. The ice is broken.",
      "The buyer says 'no.' The silence returns."
     ],
     [
      "Keep showing the clothes",
      "stay focused",
      "The buyer gets back to work. The appointment goes well.",
      "The buyer is still staring at your shoes."
     ]
    ]
   },
   {
    "s": "The showroom manager is demonstrating the new scent. She misses the card and sprays it straight into your face, seconds before you show the main look.",
    "c": [
     [
      "Walk out with watery eyes, like it's emotion",
      "use it",
      "The 'emotional' look sells. Everyone is moved.",
      "You look like you're having a terrible day."
     ],
     [
      "Say 'that's the scent of the season'",
      "make a joke",
      "Everyone laughs. The perfume brand reposts.",
      "The perfume brand is not amused."
     ],
     [
      "Ask for a minute to recover",
      "tell the truth",
      "You recover and show the look perfectly.",
      "It takes ages. The buyer gets bored."
     ]
    ]
   },
   {
    "s": "The editor is on the phone in the middle of your showroom appointment saying 'yes, darling' every nine seconds. She has not looked up once.",
    "c": [
     [
      "Pose directly in her eyeline",
      "make her look",
      "She looks up mid-'darling'. She hangs up. She loves it.",
      "She swivels her chair to face the wall."
     ],
     [
      "Mouth 'darling' back at her",
      "a little cheek",
      "She snorts, covers the phone and says 'okay, show me.'",
      "She does not snort. She sighs."
     ],
     [
      "Wait until the call ends",
      "respect the call",
      "She finishes and gives you her full attention. Worth it.",
      "The call never ends. Different darling, same call."
     ]
    ]
   }
  ],
  "fashion-beauty": [
   {
    "s": "Beauty campaign test. The client wants polish. The photographer wants 'glossy chaos'. They stand on opposite sides of the set, both looking at you.",
    "c": [
     [
      "Polish with one wild detail",
      "give both of them something",
      "Client and photographer both love it. A rare peace treaty.",
      "Neither loves it. The make-up artist secretly does."
     ],
     [
      "Go full glossy chaos",
      "back the photographer",
      "The chaos frames are the most striking images of the day.",
      "The client's face says 'we are a skincare brand'."
     ],
     [
      "Give the client pure polish",
      "back the client",
      "Client delighted. Clean, luminous, on brief.",
      "The photographer is visibly bored. It shows in the pictures."
     ]
    ]
   },
   {
    "s": "The lipstick shade is called 'Feisty Cherry.' You are told to 'be the shade.' The make-up artist hands you an actual cherry.",
    "c": [
     [
      "Eat the cherry, seductively",
      "be the shade",
      "The cherry shot is the hero image. Feisty, achieved.",
      "The cherry juice gets on the white set. Not feisty. Messy."
     ],
     [
      "Throw the cherry at the camera",
      "bring the spice",
      "The cherry blur becomes the shot of the campaign.",
      "The cherry hits the photographer. In the eye."
     ],
     [
      "Pose with the cherry",
      "keep it simple",
      "The simple shot is classic and beautiful.",
      "The simple shot looks like a fruit advert."
     ]
    ]
   },
   {
    "s": "The beauty client wants a 'no make-up' look. You have three hours of make-up on.",
    "c": [
     [
      "Wipe half of it off",
      "go halfway",
      "The half look is so interesting it changes the campaign.",
      "The half look is a disaster. It looks like you're melting."
     ],
     [
      "Pretend you have no make-up on",
      "act it",
      "Your 'natural' face is so convincing the client is amazed.",
      "Your 'natural' face is so obviously not natural."
     ],
     [
      "Ask for a full reset",
      "stay pro",
      "The reset look is stunning and natural.",
      "The reset takes so long the photographer leaves."
     ]
    ]
   },
   {
    "s": "The photographer's assistant is a lovable disaster. In the last hour they have knocked over every pot of glitter on set. Twice.",
    "c": [
     [
      "Lie down in the glitter",
      "make the mess the shoot",
      "The glitter frames are the most iconic of the day.",
      "Every frame now looks like a craft-day accident."
     ],
     [
      "Help them sweep, on camera",
      "be the nice one",
      "The behind-the-scenes clip makes everyone love you.",
      "You get glitter in your eye. Now you're crying, in glitter."
     ],
     [
      "Move to the clean corner",
      "protect the set",
      "Clean corner, clean frames, flawless test.",
      "There is no clean corner. There is only glitter now."
     ]
    ]
   }
  ],
  "fashion-casting": [
   {
    "s": "Runway casting final. You're one of five left for the closing look. The casting director says, 'walk like you're late for a train.'",
    "c": [
     [
      "Actually sprint",
      "take it literally",
      "The casting director laughs out loud and writes your name down.",
      "You go too fast for the turn. The train has left."
     ],
     [
      "Walk like you missed it and don't care",
      "play it icy",
      "Your 'whatever' walk is so cool the room goes quiet.",
      "Your 'whatever' walk reads as 'genuinely whatever'."
     ],
     [
      "Walk fast, chin up, total purpose",
      "nail the brief",
      "Purpose, speed, control. It's the walk they wanted.",
      "Perfect walk. The girl after you does it better."
     ]
    ]
   },
   {
    "s": "The designer sits in the corner eating a salad and not looking at anyone. The other four models are trying increasingly desperate things to get noticed.",
    "c": [
     [
      "Steal a crouton on your turn",
      "make them look",
      "The designer bursts out laughing. They watch your whole walk.",
      "It was their last crouton. A very cold look."
     ],
     [
      "Walk like the room is empty",
      "stay icy",
      "They look up for the first time all day.",
      "They never look up. The salad wins."
     ],
     [
      "Catch their eye and smile once",
      "small and warm",
      "They smile back. That's a big deal in this room.",
      "They think you're smiling at the salad."
     ]
    ]
   },
   {
    "s": "The casting director hands you the closing-look shoes. They are three sizes too big and there is no other pair.",
    "c": [
     [
      "Walk in them like they're perfect",
      "fake it",
      "Your walk is so good nobody notices.",
      "Your shoes fall off halfway."
     ],
     [
      "Walk barefoot",
      "big swing",
      "Your barefoot walk is so cool you get the closing look.",
      "Your barefoot walk is not what they asked for."
     ],
     [
      "Stuff them with tissues",
      "get scrappy",
      "The tissues work. Your walk is perfect.",
      "The tissues fall out mid-walk. Everyone stares."
     ]
    ]
   },
   {
    "s": "The other model in the last five is your best friend. She's just as good as you. You're sharing a mirror backstage.",
    "c": [
     [
      "Suggest you walk the test together",
      "be a duo",
      "The pair walk is electric. Both of you get noticed.",
      "They only wanted one. The duo idea makes it awkward."
     ],
     [
      "Give her the best pep talk of her life",
      "lift her up",
      "She glows. Then you glow. Great energy for both.",
      "She glows. You realise you just coached your competition."
     ],
     [
      "Put your headphones on and lock in",
      "win it clean",
      "You walk the best you've ever walked. She hugs you after.",
      "She walks the best she's ever walked. You hug her after."
     ]
    ]
   }
  ],
  "fashion-cover": [
   {
    "s": "Digital cover shoot. The safe cover is beautiful. The risky frame is the one the whole crew keeps going back to look at.",
    "c": [
     [
      "Fight for the risky frame",
      "back the strange",
      "The risky cover breaks the internet. Editors are jealous.",
      "The risky cover gets ratioed by people who 'don't get it'."
     ],
     [
      "Pitch a split cover, both images",
      "turn it into a debate",
      "The split cover becomes a debate. Debate equals clicks.",
      "The debate is mostly about your eyebrows."
     ],
     [
      "Let the editor pick the safe one",
      "trust the editor",
      "The safe cover is iconic in its own way. Very classic.",
      "The safe cover is lovely and nobody screenshots it."
     ]
    ]
   },
   {
    "s": "The stylist dresses you in real flowers for the cover. Halfway through the shoot, a bee lands right on the tip of your nose.",
    "c": [
     [
      "Hold still and let them shoot it",
      "nature's accessory",
      "The bee cover is everywhere. Fans call it 'nature's accessory'.",
      "The bee had other plans. Your nose has a new shape."
     ],
     [
      "Laugh and shoo it gently",
      "stay human",
      "The laughing frame is the warmest shot of the day.",
      "Your laugh offends the bee. It returns with friends."
     ],
     [
      "Ask for a pause and step back",
      "stay safe",
      "The bee leaves. You come back and the shoot flows.",
      "The flowers start wilting during the pause."
     ]
    ]
   },
   {
    "s": "The cover concept is 'modern queen'. The crown is plastic, slightly too big and falls off every time you breathe.",
    "c": [
     [
      "Wear it lopsided on purpose",
      "tilt it",
      "The tilted crown is the image everyone screenshots.",
      "It reads as an accident. Because it was."
     ],
     [
      "Hold the crown like you just took it",
      "own the throne",
      "Holding it makes the cover feel powerful and new.",
      "Holding it makes you look like you're returning it."
     ],
     [
      "Pin it down firmly",
      "make it work",
      "Pins hold. Crown stays. Very regal.",
      "The pins hold. You'll be removing them for a week."
     ]
    ]
   },
   {
    "s": "The photographer wants tears for the final frame. You cannot cry on demand. The whole crew is waiting in silence.",
    "c": [
     [
      "Think about the saddest thing you know",
      "go there",
      "Real tears. The frame is breathtaking.",
      "Real tears. Many tears. Not stopping."
     ],
     [
      "Laugh instead and let it go wet",
      "switch it up",
      "Laughing-crying is the unexpected hero shot.",
      "Laughing-crying is not the brief. At all."
     ],
     [
      "Ask for the menthol stick",
      "use a pro trick",
      "One swipe, one tear, one perfect frame.",
      "Your eyes go red and puffy. Very 'allergic'."
     ]
    ]
   }
  ],
  "fashion-frontrow": [
   {
    "s": "The brand seats you front row in a seat usually saved for much bigger names. The name card on your seat still says the much bigger name.",
    "c": [
     [
      "Sit down and pose with the name card",
      "own the mix-up",
      "The mix-up photo makes every fashion account laugh. You're the story.",
      "The much bigger name arrives. You meet their eyes. Slowly."
     ],
     [
      "Swap name cards with someone else",
      "pure chaos",
      "Seating chaos for the whole row. Fashion gossip for weeks.",
      "The usher figures it out in nine seconds."
     ],
     [
      "Ask the usher to fix it quietly",
      "play it classy",
      "Fixed in seconds. You get photographed being gracious.",
      "Fixed in seconds. You get photographed looking confused."
     ]
    ]
   },
   {
    "s": "You're seated next to someone the internet thinks you're feuding with. Cameras are already pointing at you both.",
    "c": [
     [
      "Take a selfie together",
      "flip the story",
      "The selfie ends the feud online. Now you're 'besties'.",
      "The selfie makes the feud look worse. Somehow."
     ],
     [
      "Pretend to whisper something mean",
      "stir it up",
      "The whispering photo is everywhere. Huge drama, huge clicks.",
      "They whisper back something genuinely mean."
     ],
     [
      "Be polite and normal",
      "kill the rumour",
      "Your normality ends the rumour. Nobody can write a story.",
      "Your normality is so normal they write that you're 'cold'."
     ]
    ]
   },
   {
    "s": "Mid-show, a model's shoe flies off on the turn and lands right in your lap. Cameras swing your way.",
    "c": [
     [
      "Hold it up like a trophy",
      "make it a moment",
      "The 'award' shot is the image of the day. The model laughs.",
      "The brand would rather people looked at the runway."
     ],
     [
      "Hand it back at the end of the runway",
      "quiet hero",
      "The model mouths thank you. The handover photo is lovely.",
      "You reach out mid-walk and almost trip the next model."
     ],
     [
      "Slip it under your seat for later",
      "stay still",
      "No fuss, no scene. The model collects it backstage.",
      "The model has to finish the walk in one shoe. All eyes."
     ]
    ]
   },
   {
    "s": "The brand's own ambassador is sitting next to you. She keeps whispering that the show is 'mid'. Loudly enough for the row behind.",
    "c": [
     [
      "Whisper back your honest review",
      "bond over it",
      "You two are giggling all show. Instant friend.",
      "The designer is in the row behind."
     ],
     [
      "Defend the collection",
      "ride or die",
      "The brand team hears. They will remember your loyalty.",
      "The ambassador decides you're boring."
     ],
     [
      "Ask where she got her bag",
      "redirect",
      "She lights up. You talk bags all night. Crisis avoided.",
      "She says 'it's from them' and points at the runway. 'Mid'."
     ]
    ]
   }
  ],
  "fashion-house": [
   {
    "s": "No runway tonight. A fashion-house dinner, where the room itself is the audition. The creative director seats you at the end of the table, next to a nervous intern.",
    "c": [
     [
      "Make the intern laugh until the table looks over",
      "own your end",
      "The whole table drifts to your end. The director follows the laughter.",
      "The intern laughs wine onto a vintage tablecloth."
     ],
     [
      "Toast the creative director, unprompted",
      "bold move",
      "They raise a glass right back. The room shifts around you.",
      "Your glass is empty. You toast with a bread roll."
     ],
     [
      "Be charming but stay seated",
      "play it cool",
      "By dessert, the director asks who you are. Mission accomplished.",
      "By dessert, nobody has asked anything."
     ]
    ]
   },
   {
    "s": "The dinner is twelve courses. Each one is smaller than the last. Course seven is a single pea on a spoon. You are starving.",
    "c": [
     [
      "Ask the waiter for more bread",
      "be the hungry one",
      "The chef is delighted. The table relaxes. Bread for everyone.",
      "The table goes silent. Nobody asks for bread here."
     ],
     [
      "Make a toast to the pea",
      "make it funny",
      "The table loves the pea toast. The director laughs.",
      "The chef hears the pea toast. The chef is sensitive."
     ],
     [
      "Eat elegantly and say nothing",
      "stay refined",
      "Your poise is noted. You look like you belong here.",
      "Your stomach growls loudly during a speech."
     ]
    ]
   },
   {
    "s": "The creative director asks everyone to describe their style in one word. Seven people in a row say 'timeless'.",
    "c": [
     [
      "Say 'chaotic'",
      "break the pattern",
      "The creative director laughs and asks you to explain. Room is yours.",
      "The creative director says 'interesting' in a flat voice."
     ],
     [
      "Say 'timeless' with a straight face",
      "be the eighth",
      "The table cracks up. Best comic timing of the night.",
      "Nobody notices the joke. You just said 'timeless'."
     ],
     [
      "Say you'll let the clothes answer",
      "stay mysterious",
      "They like the confidence. They ask what you'd wear tomorrow.",
      "They think you dodged the question. Because you did."
     ]
    ]
   },
   {
    "s": "A very famous designer at the dinner is wearing exactly the same jacket as you. Everyone has noticed. Nobody is saying anything.",
    "c": [
     [
      "Ask for a twin photo",
      "lean into it",
      "The twin photo becomes the moment of the night.",
      "The designer does not want a twin photo."
     ],
     [
      "Compliment their taste",
      "flatter smartly",
      "They laugh: 'you have very good taste.' Ice broken.",
      "They say 'I know' and turn away."
     ],
     [
      "Take the jacket off casually",
      "quietly reset",
      "Smooth move. Nobody can make it a story.",
      "Everyone watches you take it off. It becomes a story."
     ]
    ]
   }
  ],
  "fashion-couture": [
   {
    "s": "One custom couture piece, one impossible deadline. Every major fashion account is waiting outside the atelier. The piece is still being sewn onto you.",
    "c": [
     [
      "Walk out with the seamstress still sewing",
      "make it the show",
      "The 'live couture' moment is the image of the season.",
      "The thread is still attached to the seamstress. She comes too."
     ],
     [
      "Peek out the window to tease the crowd",
      "build suspense",
      "The tease drives everyone wild. The reveal is epic.",
      "The window is the wrong window. You tease a car park."
     ],
     [
      "Wait until it's perfect",
      "respect the craft",
      "The final piece is flawless. Worth every minute.",
      "Perfect piece. The crowd went home."
     ]
    ]
   },
   {
    "s": "The couture gown is so big it won't fit through the atelier door. The crowd outside is chanting. You're stuck in the doorway.",
    "c": [
     [
      "Go sideways, slowly, like it's choreography",
      "make it a reveal",
      "The sideways reveal is the best entrance of the week.",
      "The gown and the door frame have a long negotiation."
     ],
     [
      "Ask the team to take the door off",
      "fix it properly",
      "Door off, gown out. The crowd cheers the carpentry.",
      "Door off. Still too big."
     ],
     [
      "Send one teaser photo from inside",
      "build mystery",
      "The mystery photo drives everyone wild.",
      "The photo is too dark. It looks like a cake."
     ]
    ]
   },
   {
    "s": "The designer has spent two hundred hours on this piece. They are crying quietly. You're about to step into it.",
    "c": [
     [
      "Hug them before you put it on",
      "soft heart",
      "The designer laughs through the tears. The fitting is magic.",
      "The designer cries harder, onto the gown."
     ],
     [
      "Tell them it's the best thing you've ever worn",
      "lift them up",
      "They glow. The whole atelier glows.",
      "They think you say that to everyone."
     ],
     [
      "Put it on carefully and let it speak",
      "respect the work",
      "When you turn around, the whole room gasps.",
      "Your silence reads as 'not sure'. Panic."
     ]
    ]
   },
   {
    "s": "The gown is woven with real gold thread. It's beautiful and it's incredibly heavy. You can barely stand up straight.",
    "c": [
     [
      "Walk out tall anyway",
      "strength mode",
      "The photos are stunning. Nobody can tell it weighs a ton.",
      "Halfway out, you have to stop and lean on a wall."
     ],
     [
      "Pose seated on a throne-like chair",
      "make it regal",
      "The seated photo is regal and powerful.",
      "The designer wanted it walking. They say so."
     ],
     [
      "Ask for the lighter version",
      "save your back",
      "The lighter version still stops the crowd.",
      "There is no lighter version. There's only gold."
     ]
    ]
   }
  ],
  "fashion-face": [
   {
    "s": "Global ambassador meeting. The contract could put your face in airports worldwide. The CEO asks to see your 'airport face'.",
    "c": [
     [
      "Give them sleepy, jet-lagged realness",
      "real talk",
      "The CEO laughs. 'That's what people actually look like.'",
      "The CEO thinks you're genuinely tired. And worries."
     ],
     [
      "Give them first-class glamour",
      "full glam",
      "The CEO is impressed. You look like a billboard already.",
      "Too glam. They want 'aspirational but approachable'."
     ],
     [
      "Ask what an airport face is",
      "clarify",
      "The CEO explains. You nail it instantly.",
      "The CEO doesn't know. It was a vibe."
     ]
    ]
   },
   {
    "s": "The founder asks what you'd change about the brand. The room goes quiet. Everyone is pretending to look at their notes.",
    "c": [
     [
      "Give one honest, sharp answer",
      "no fear",
      "The founder loves the vision. The room relaxes.",
      "The founder is offended. Notes are written."
     ],
     [
      "Say you'd change nothing",
      "play it safe",
      "The founder is pleased. Safe pair of hands.",
      "The founder thinks you're boring and says 'hmm'."
     ],
     [
      "Ask what they'd change",
      "turn it around",
      "The founder talks for an hour. You're now their favourite.",
      "The founder doesn't want to talk. The meeting ends."
     ]
    ]
   },
   {
    "s": "The contract says you can never wear another brand in public. Your favourite sweatpants, which you are wearing right now, are another brand.",
    "c": [
     [
      "Ask them to make you sweatpants",
      "pitch a product",
      "They love it. The sweatpants become a bestseller.",
      "They don't do sweatpants. They never will."
     ],
     [
      "Sign and say goodbye to your sweatpants",
      "commit",
      "You sign. The sweatpants live on in your memory.",
      "You sign. You miss them every day."
     ],
     [
      "Ask for a sweatpants clause",
      "negotiate",
      "They give you a sweatpants clause. A rare win.",
      "They give you a 'no sweatpants' clause. A rare loss."
     ]
    ]
   },
   {
    "s": "The CEO asks you to tour their flagship store. The staff are all watching from behind the counters. One of them is quietly crying.",
    "c": [
     [
      "Go straight to the crying one",
      "soft heart",
      "They're crying because they're your biggest fan. Selfie.",
      "They're crying because their shift was meant to end an hour ago."
     ],
     [
      "Walk the store like a runway",
      "give them a show",
      "The staff start clapping. Everyone films it.",
      "The staff think you're showing off."
     ],
     [
      "Shake every hand and learn names",
      "be a pro",
      "The staff love you. The CEO notices.",
      "Very professional. Very long. The CEO checks their watch."
     ]
    ]
   }
  ],
  "fashion-campaign": [
   {
    "s": "Worldwide fragrance campaign. The concept is cinematic, the usage is global, and they want an answer today. The fragrance smells exactly like your ex's flat.",
    "c": [
     [
      "Say yes and channel the heartbreak",
      "use the feeling",
      "The campaign film is devastating. People buy it to feel something.",
      "The heartbreak leaks into the press tour. Your ex texts."
     ],
     [
      "Ask to rename the scent",
      "negotiate",
      "Your name is so good they actually use it.",
      "They keep their name: 'Velvet Regret'. Yikes."
     ],
     [
      "Say yes, smile and say nothing",
      "take the cheque",
      "Smooth deal, global usage, nobody asks why your eye twitched.",
      "Smooth deal. Your eye twitches in every press photo."
     ]
    ]
   },
   {
    "s": "The campaign shoot has you on a horse, on a beach, at sunrise, in a ball gown. The horse is not having it.",
    "c": [
     [
      "Ride it like you're in a film",
      "go for it",
      "The shot is breathtaking. Pure cinema.",
      "The horse goes for the sea. So do you."
     ],
     [
      "Stand beside the horse and pose",
      "work around it",
      "The shot is beautiful. The horse is relaxed.",
      "The horse walks out of frame. You are alone on a beach."
     ],
     [
      "Talk to the horse first",
      "win it over",
      "The horse loves you. The shot is perfect.",
      "The horse doesn't love you. It walks off anyway."
     ]
    ]
   },
   {
    "s": "The fragrance is called 'Midnight Mystery'. The director wants you to 'smell like a secret'. You have never smelled like a secret.",
    "c": [
     [
      "Whisper a real secret to the lens",
      "keep a secret",
      "The whispered secret is the best part of the campaign.",
      "Your secret is about your dentist. Not sexy."
     ],
     [
      "Look shifty on purpose",
      "go for the laugh",
      "Your shifty look goes viral for all the right reasons.",
      "Your shifty look makes you look like a shoplifter."
     ],
     [
      "Look calm and unreadable",
      "timeless move",
      "Classic and perfect. A timeless campaign image.",
      "Too classic. Nobody remembers it."
     ]
    ]
   },
   {
    "s": "The campaign director wants you to say the slogan in five languages. You speak one. The camera is ready.",
    "c": [
     [
      "Make up a sixth language",
      "get inventive",
      "The invented language is so charming people try to learn it.",
      "Your invented word means something rude somewhere."
     ],
     [
      "Learn all five, fast",
      "grind it out",
      "You nail all five. The director is amazed.",
      "You nail all five. In the wrong order."
     ],
     [
      "Say it in your own language, with feeling",
      "tell the truth",
      "Your honesty is charming. The campaign feels personal.",
      "Your honesty is charming. The client wanted five languages."
     ]
    ]
   }
  ],
  "creator-brief": [
   {
    "s": "Your first proper brand brief arrives. It's for a sparkling water. The script makes you say 'hydration is a vibe' while winking. Twice.",
    "c": [
     [
      "Rewrite it into a bit about your ex",
      "make it yours",
      "Comments are crying laughing. The brand quietly reposts it.",
      "The brand writes back: 'please do not mention exes.'"
     ],
     [
      "Wink so much it becomes the joke",
      "overdo it on purpose",
      "The wink-a-thon is the most-watched ad on their page.",
      "Someone asks if you have something in your eye. Many people ask."
     ],
     [
      "Say the line exactly, with a straight face",
      "deliver clean",
      "Professional, on time, approved first try. They want more.",
      "Approved first try. Your followers can tell it's an ad."
     ]
    ]
   },
   {
    "s": "The brand sends forty-two notes on your thirty-second video. Note thirty-one is 'more energy.' Note thirty-two is 'less energy.'",
    "c": [
     [
      "Film one version per note, as a series",
      "make the notes the content",
      "The 'brand notes' series goes viral. The brand pretends it was their idea.",
      "The brand does not find their notes funny."
     ],
     [
      "Send it back with only note thirty-one done",
      "pick a lane",
      "They love the energy. The other forty-one notes vanish.",
      "They want all forty-two. They count."
     ],
     [
      "Do every note, carefully",
      "do the work",
      "The final cut ticks every box. They book you again.",
      "The final cut ticks every box. It feels like a hostage video."
     ]
    ]
   },
   {
    "s": "The product arrives the morning you film. It's a face mask that turns bright green. Your next post is meant to be glam.",
    "c": [
     [
      "Film the reveal fully green",
      "embrace the goblin",
      "The goblin reveal is your most-saved post ever.",
      "The green does not wash off by dinner. Dinner is in public."
     ],
     [
      "Do the glam post in the mask",
      "mash it up",
      "Glam goblin is a whole aesthetic now. The brand is thrilled.",
      "The ring light makes the green glow. Truly alarming."
     ],
     [
      "Film it neatly at the end of the day",
      "keep it tidy",
      "Calm, clean review. Viewers trust you more.",
      "Calm, clean review. Viewers scroll past."
     ]
    ]
   },
   {
    "s": "The brand's 'surprise' is that their CEO will join your video. He arrives in sunglasses and says he 'gets the youth.'",
    "c": [
     [
      "Teach him a trend on camera",
      "let him flop",
      "His terrible dance is the best ad they have ever had.",
      "His terrible dance is the worst ad they have ever had."
     ],
     [
      "Interview him like a talk show",
      "make it a format",
      "He's funny when he isn't trying. The clip is charming.",
      "He talks about quarterly targets for six minutes."
     ],
     [
      "Let him say his bit and wrap it",
      "keep it short",
      "Short, sweet, approved. Everyone goes home happy.",
      "Short, sweet, sunglasses indoors. The comments notice."
     ]
    ]
   }
  ],
  "creator-street": [
   {
    "s": "A local page hands you the mic for a street-interview takeover. Your first question gets you a man who wants to talk about his pigeons. In detail.",
    "c": [
     [
      "Make him the star of the episode",
      "follow the gold",
      "'Pigeon man' becomes the page's most-shared video ever.",
      "Pigeon man asks for a cut of the views. Firmly."
     ],
     [
      "Ask the pigeons questions too",
      "go absurd",
      "The pigeon Q&A is unhinged and adorable. Comments demand part two.",
      "The pigeons leave. So does pigeon man."
     ],
     [
      "Thank him and find the next person",
      "keep it moving",
      "Your pace keeps the segment snappy. Great edit.",
      "Your pace keeps it snappy. Pigeon man ends up on another page."
     ]
    ]
   },
   {
    "s": "Your question is 'what's the most famous thing you've done?' The first person you ask says, 'I dated your cousin.' They are not joking.",
    "c": [
     [
      "Call your cousin live",
      "go there",
      "Your cousin picks up and confirms. Internet meltdown.",
      "Your cousin picks up and denies it. Meltdown anyway."
     ],
     [
      "Turn it into a 'guess the cousin' game",
      "make it a bit",
      "The bit gets comments guessing for days.",
      "The guesses get very specific, very fast."
     ],
     [
      "Laugh and ask the next person",
      "keep it moving",
      "Smooth save. The clip still lands as a teaser.",
      "The clip lands. Your family group chat explodes."
     ]
    ]
   },
   {
    "s": "It starts raining mid-segment. Everyone runs. One woman stops, smiles and says, 'ask me anything.'",
    "c": [
     [
      "Ask her the most personal question",
      "go deep",
      "Her answer is so real people share it with their mums.",
      "Her answer is so real she asks you to delete it."
     ],
     [
      "Ask her to sing in the rain",
      "make it magic",
      "She sings. It's beautiful. The video travels everywhere.",
      "She sings. It's loud. A car alarm joins in."
     ],
     [
      "Ask her the standard question",
      "stay on brief",
      "Charming answer, rain in the background. Cinematic.",
      "Charming answer. Your mic was off for the rain."
     ]
    ]
   },
   {
    "s": "A guy in a suit storms over and says he's 'kind of a big deal' and wants to be interviewed. Nobody knows who he is.",
    "c": [
     [
      "Interview him like a celebrity",
      "play along",
      "His confidence is so funny the clip goes huge. He's thrilled.",
      "He's actually a local politician. The comments get political."
     ],
     [
      "Ask the crowd who he is",
      "crowdsource it",
      "The crowd guesses wildly. The bit writes itself.",
      "The crowd guesses wildly. He gets genuinely upset."
     ],
     [
      "Politely move on",
      "keep your segment",
      "Your segment stays clean and fun.",
      "He follows you for the rest of the segment."
     ]
    ]
   }
  ],
  "creator-collab": [
   {
    "s": "A creator you've never met DMs: 'film something tonight while the idea is still funny?' The idea is you two dressed as each other.",
    "c": [
     [
      "Go full impression, wig and all",
      "commit to the bit",
      "Your impression is so good their fans think it's them. Chaos.",
      "Your impression is so good it's a little mean."
     ],
     [
      "Swap phones and post on each other's pages",
      "swap the stage",
      "Both audiences cross over. Instant new followers.",
      "They post something you would never post. On your page."
     ],
     [
      "Film it simple, one take each",
      "keep it quick",
      "Quick, cute, done. Both pages get a lift.",
      "Quick, cute, forgettable by Sunday."
     ]
    ]
   },
   {
    "s": "You arrive at their flat. The 'set' is a laundry pile. Their roommate is asleep on the sofa. They want to film right now.",
    "c": [
     [
      "Use the roommate as a background prop",
      "use the room",
      "The sleeping roommate is the true star. Millions of views.",
      "The roommate wakes up mid-take. Not happy."
     ],
     [
      "Film in the laundry pile",
      "embrace the mess",
      "The laundry pile collab is the funniest video of the week.",
      "The laundry pile is not clean."
     ],
     [
      "Suggest filming outside",
      "find a better set",
      "The outdoor version looks great. Better lighting, better vibe.",
      "Outside is loud. The idea isn't funny anymore."
     ]
    ]
   },
   {
    "s": "Halfway through filming, the other creator gets a call from a huge brand. They leave you alone with the camera running.",
    "c": [
     [
      "Keep filming solo, as if they're there",
      "stay in the bit",
      "Your solo version is so funny they use it instead.",
      "Your solo version is talking to an empty chair."
     ],
     [
      "Listen in to their phone call on camera",
      "get the tea",
      "The phone call clip is a goldmine of drama.",
      "The phone call is boring. Very boring."
     ],
     [
      "Stop filming and wait",
      "wait it out",
      "They come back and you finish it together.",
      "They come back with a new idea. Yours is dead."
     ]
    ]
   },
   {
    "s": "The other creator wants to edit the video. Their edit makes them look great and you look silly.",
    "c": [
     [
      "Post your own edit",
      "fight back",
      "Your edit is funnier. Everyone prefers your version.",
      "Your edit starts a feud. Messy and public."
     ],
     [
      "Ask for a re-edit together",
      "collaborate",
      "The new edit is balanced and the best version.",
      "They don't want to re-edit. They're very busy."
     ],
     [
      "Let them post it",
      "take the high road",
      "You look silly. But people like silly.",
      "You look silly. People don't like silly."
     ]
    ]
   }
  ],
  "creator-pop": [
   {
    "s": "You're sent to film a product drop at a pop-up. The product is a pink kettle. The queue outside is two hundred people deep and fighting.",
    "c": [
     [
      "Film the queue drama instead",
      "follow the story",
      "The queue documentary gets way more views than any kettle ever could.",
      "The queue spots you filming. You are now in the queue drama."
     ],
     [
      "Host a mini game show in the queue",
      "make it a show",
      "Queue game show is so fun the brand wants it every drop.",
      "The prize is a kettle. Two people fight over it. Gently."
     ],
     [
      "Film the kettle beautifully",
      "do the job",
      "Gorgeous kettle content. The brand is very pleased.",
      "Gorgeous kettle content. Nobody watches kettles."
     ]
    ]
   },
   {
    "s": "The pop-up's star guest cancels. The brand asks you to host the launch with no notes. There's a crowd waiting.",
    "c": [
     [
      "Wing it with total confidence",
      "fake it",
      "Your hosting is so natural the brand asks you back.",
      "Your hosting is so natural you forget the product's name."
     ],
     [
      "Bring a fan on stage to co-host",
      "share it",
      "The fan is a natural. The crowd loves you both.",
      "The fan is too excited and won't leave the stage."
     ],
     [
      "Read the press release out loud",
      "stay on brief",
      "Calm and informative. The brand is relieved.",
      "Calm and informative. The crowd starts leaving."
     ]
    ]
   },
   {
    "s": "The product is meant to be waterproof. You test it on camera. It is not waterproof.",
    "c": [
     [
      "Keep filming and be honest",
      "tell the truth",
      "Your honesty earns massive respect. Viewers trust you.",
      "Your honesty earns massive respect. The brand is furious."
     ],
     [
      "Turn it into a comedy sketch",
      "make it funny",
      "The sketch is so funny even the brand can't be mad.",
      "The sketch is so funny the brand's stock dips. A tiny bit."
     ],
     [
      "Stop filming and tell the brand",
      "say nothing",
      "The brand is grateful. You build trust with them.",
      "The brand asks you to delete the footage. All of it."
     ]
    ]
   },
   {
    "s": "A very famous person slips into the pop-up in a hoodie and sunglasses, clearly trying to stay incognito. You recognise them instantly. They see you recognise them.",
    "c": [
     [
      "Film them from across the room",
      "get the scoop",
      "The 'guess who' clip is your biggest of the month.",
      "They spot the phone. The look they give you is a whole review."
     ],
     [
      "Ask for a ten-second hello",
      "ask nicely",
      "They laugh and do a tiny, sweet hello for your followers.",
      "They say no and leave through the stockroom."
     ],
     [
      "Pretend you didn't see them",
      "keep their secret",
      "On the way out they wink at you. A small, very valuable moment.",
      "They leave. You missed the biggest story of the day."
     ]
    ]
   }
  ],
  "creator-podcast": [
   {
    "s": "The podcast host is funny, nosy and very good at clips. Two minutes in, she asks, 'so who's the last person you texted?' The mic is right there.",
    "c": [
     [
      "Read the text out loud",
      "give her the clip",
      "The text is so mundane it's hilarious. Biggest clip of the episode.",
      "The text is to your mum and it's very, very weird out of context."
     ],
     [
      "Make up a dramatic fake text",
      "feed the theory",
      "Fans spend a week guessing who it was. Free hype.",
      "A real celebrity gets dragged into the theory. Awkward."
     ],
     [
      "Say 'nice try' and smile",
      "keep your phone private",
      "Fans love that you held your ground. Cool, calm, clipped.",
      "The clip is just you smiling. For eight seconds."
     ]
    ]
   },
   {
    "s": "The host's other guest is your sworn internet rival. They're sitting right across the table. The host looks delighted.",
    "c": [
     [
      "Hug them",
      "kill the feud",
      "The hug shocks everyone. Your fans love the growth.",
      "The hug is very stiff. Like hugging a lamp post."
     ],
     [
      "Play a game of 'who's more famous'",
      "make it a bit",
      "The game is hilarious. It turns into a real friendship.",
      "The game goes badly. Very badly."
     ],
     [
      "Ignore them",
      "freeze them out",
      "The silent treatment clip is iconic drama.",
      "The silent treatment makes you look petty."
     ]
    ]
   },
   {
    "s": "The host's microphone breaks. They ask to share yours. You are now very, very close together.",
    "c": [
     [
      "Make it a 'cosy podcast' vibe",
      "embrace it",
      "The cosy podcast is the most viral episode ever.",
      "The cosy podcast is too cosy. People are uncomfortable."
     ],
     [
      "Hold the mic for them like a talk show host",
      "take control",
      "Your hosting skills are impressive. The host is grateful.",
      "Your arm gets tired. The mic drops."
     ],
     [
      "Find a new mic",
      "fix the problem",
      "The new mic works. The podcast is back on track.",
      "The new mic is worse. It squeaks."
     ]
    ]
   },
   {
    "s": "At the end of the recording, the host asks you for 'one spicy line for the trailer'. Her producer is already circling the timestamp.",
    "c": [
     [
      "Give a mildly spicy hot take",
      "feed the trailer",
      "The trailer clip travels everywhere. You're the talk of the week.",
      "The trailer clip travels everywhere. Context does not."
     ],
     [
      "Deliver a fake-dramatic hot take about cereal",
      "parody it",
      "Your cereal 'controversy' is hilarious and harmless.",
      "Breakfast people are surprisingly angry."
     ],
     [
      "Say 'I don't do spicy' and smile",
      "hold the line",
      "Fans love that you won't play the game.",
      "The trailer uses you saying 'I don't do spicy'. It's spicy."
     ]
    ]
   }
  ],
  "creator-live": [
   {
    "s": "Late-night livestream guest spot. The plan is ten minutes. Then the chat starts spamming one word: 'SING.' You cannot sing.",
    "c": [
     [
      "Sing anyway, terribly and proudly",
      "give the people what they want",
      "The terrible singing clip is everywhere. Fans adore you for it.",
      "The terrible singing clip is everywhere. That is the problem."
     ],
     [
      "Make the host sing instead",
      "redirect the chaos",
      "The host's singing is worse than yours would be. Perfect.",
      "The host can actually sing. Very well. You look worse."
     ],
     [
      "Read the chat's funniest messages instead",
      "play the room",
      "The chat reading is so funny they forget about singing.",
      "The chat just types 'SING' louder."
     ]
    ]
   },
   {
    "s": "Your cat walks across your keyboard live and ends the stream. Five thousand people were watching.",
    "c": [
     [
      "Go back live with the cat as a co-host",
      "embrace chaos",
      "The cat co-host stream is twice as popular.",
      "The cat does it again."
     ],
     [
      "Post a clip of the cat ending the stream",
      "make it a joke",
      "The clip is everywhere. Your cat is a star.",
      "Your cat is a star. You are just 'the cat's human'."
     ],
     [
      "Apologise and restart",
      "stay pro",
      "Viewers come back. The stream is a success.",
      "Half the viewers come back. The other half are asleep."
     ]
    ]
   },
   {
    "s": "A viewer sends a huge donation on the livestream with one request: eat a whole raw onion. Like an apple. Right now.",
    "c": [
     [
      "Eat the onion",
      "do the bit",
      "The onion clip is legendary. You donate the money to a food bank.",
      "You finish the onion. You cry for the rest of the stream."
     ],
     [
      "Eat one slice with dramatic commentary",
      "meet halfway",
      "The narrated slice is funnier than the full onion could ever be.",
      "One slice is still a lot of onion."
     ],
     [
      "Thank them and redirect the money",
      "set a boundary",
      "Chat respects it. Someone matches the donation for charity.",
      "The donor asks for a refund in all caps."
     ]
    ]
   },
   {
    "s": "Mid-stream, chat starts spamming a rumour about you. It's not true. It is, unfortunately, very funny.",
    "c": [
     [
      "Read it out and debunk it live",
      "face it head on",
      "Clear, calm, funny. The rumour dies on the spot.",
      "Debunking it live just teaches more people the rumour."
     ],
     [
      "Pretend it's true for one minute",
      "play along",
      "Your fake confession is so over the top nobody believes the rumour now.",
      "Some people believe the fake confession. A lot of people."
     ],
     [
      "Ignore chat and keep going",
      "starve it",
      "No reaction, no fuel. The rumour fizzles.",
      "The rumour gets louder. Chat is now just the rumour."
     ]
    ]
   }
  ],
  "creator-challenge": [
   {
    "s": "The challenge is to film yourself trying to balance a spoon on your nose for an hour. The concept sounds stupid enough to either flop or explode.",
    "c": [
     [
      "Do it for the full hour, with commentary",
      "go all in",
      "The hour-long spoon video is a legendary piece of internet history.",
      "The hour-long spoon video is exactly as boring as it sounds."
     ],
     [
      "Balance a whole cutlery drawer",
      "raise the stakes",
      "The cutlery drawer clip is the most impressive thing you've ever done.",
      "The cutlery drawer falls. On your foot."
     ],
     [
      "Do it for a minute and move on",
      "play it safe",
      "Short, sweet and funny. A solid post.",
      "Short, sweet and very forgettable."
     ]
    ]
   },
   {
    "s": "Today's challenge: do the viral dance in public. You are filming in a very quiet library, and the librarian has excellent hearing.",
    "c": [
     [
      "Dance like nobody's watching",
      "full volume",
      "The library dance is the funniest video on your page.",
      "The librarian's 'shhh' is now the most famous part."
     ],
     [
      "Do the whole dance with your eyebrows",
      "silent mode",
      "The eyebrow dance is genius. People copy it in offices.",
      "It looks like you have something in your eye. For a minute."
     ],
     [
      "Move the shoot to the steps outside",
      "find a better spot",
      "Sunlight, steps, perfect take. Easy win.",
      "Outside is fine. It just isn't funny any more."
     ]
    ]
   },
   {
    "s": "The challenge is to say yes to everything for a whole day. The very first request is from your mum: clean out the garage.",
    "c": [
     [
      "Clean the garage, fully filmed",
      "honour the rules",
      "The garage glow-up is weirdly satisfying. People watch it twice.",
      "It takes eight hours. The video is mostly dust."
     ],
     [
      "Turn it into a garage-sale stream",
      "monetise mum",
      "The garage sale sells out and mum becomes a star.",
      "Mum sells your old diaries. To strangers."
     ],
     [
      "Say no and film the fallout",
      "fail on purpose",
      "The 'failed in one minute' video is gold.",
      "Mum's disappointed face is now your most viewed content."
     ]
    ]
   },
   {
    "s": "Another creator posts the same challenge an hour after you. Theirs is better. Their comments are calling yours 'the draft'.",
    "c": [
     [
      "Post a reply video doing it worse on purpose",
      "out-joke them",
      "Your 'worse on purpose' reply gets more views than both.",
      "It just looks like you're bad at it now."
     ],
     [
      "DM them about a joint version",
      "team up",
      "The joint version is the best of all three. Both pages grow.",
      "They leave you on read. Publicly, somehow."
     ],
     [
      "Let it go and post something new",
      "move on",
      "Your next post does great. Nobody remembers 'the draft'.",
      "Their version keeps climbing. You keep watching."
     ]
    ]
   }
  ],
  "creator-launch": [
   {
    "s": "Product-launch livestream. The comments are moving faster than the talking points, and the client is watching from a laptop in the corner, sweating.",
    "c": [
     [
      "Throw out the script and read the comments live",
      "follow the chat",
      "The chat-led launch sells out in an hour. The client stops sweating.",
      "The chat asks only about the price. Over and over."
     ],
     [
      "Make the client do a demo on camera",
      "pull them in",
      "The client's nervous demo is endearing. Sales spike.",
      "The client drops the product. It breaks. On camera."
     ],
     [
      "Stick to the talking points",
      "stay on brief",
      "Clean launch. The client gives you a thumbs up.",
      "Clean launch. The chat is very loud about how boring it is."
     ]
    ]
   },
   {
    "s": "The product is a lipstick called 'Rosebud'. On camera, under your ring light, it is unmistakably orange.",
    "c": [
     [
      "Show it side by side, ring light vs daylight",
      "show the truth",
      "Viewers love the honesty. The brand gets praised for real colour.",
      "The brand's rep messages you 'pls stop' in real time."
     ],
     [
      "Call it 'the shape-shifter'",
      "rebrand it live",
      "'Shape-shifter' becomes the product's nickname. Sales go up.",
      "Customers want 'Rosebud'. They get orange."
     ],
     [
      "Switch the light and carry on",
      "fix the frame",
      "Light fixed, colour right, launch on track.",
      "The colour is still off. Chat is screaming 'ORANGE'."
     ]
    ]
   },
   {
    "s": "A huge celebrity joins your launch stream as a surprise guest. They are thrilled to be there. They think the product is a completely different product.",
    "c": [
     [
      "Let them keep going",
      "enjoy the chaos",
      "Their confusion is the funniest clip of the year.",
      "The brand's reputation takes a small, confused hit."
     ],
     [
      "Gently steer them back",
      "save the launch",
      "They laugh at themselves. The launch is back on track.",
      "They get embarrassed and drop off the stream."
     ],
     [
      "Play the 'what is it?' game with them",
      "make it a game",
      "The guessing game makes the product the star.",
      "They guess 'toaster'. Repeatedly."
     ]
    ]
   },
   {
    "s": "The client rings mid-stream: 'mention the discount code!' You have no idea what the discount code is. Ten thousand people are watching.",
    "c": [
     [
      "Make one up with total confidence",
      "bluff it",
      "The code is so catchy the brand makes it real by morning.",
      "The code doesn't work. The comments are not kind."
     ],
     [
      "Ask chat if anyone knows it",
      "crowdsource",
      "Someone in chat has it. You thank them like a hero.",
      "Chat invents eleven fake codes. None work."
     ],
     [
      "Say it'll be pinned in a minute",
      "buy time",
      "Pinned, working, sales spike. Smooth.",
      "You forget to pin it. The client rings again."
     ]
    ]
   }
  ],
  "creator-trip": [
   {
    "s": "Mystery creator trip. All they told you was the airport and the dress code: 'yacht casual.' You land. It's a fishing village in the rain.",
    "c": [
     [
      "Film the most glamorous fishing vlog ever",
      "commit to the dress code",
      "Yacht casual in a fishing village is your most iconic content.",
      "A fisherman asks if you're lost. Your fans ask the same."
     ],
     [
      "Get the fishermen to rate your outfits",
      "make friends",
      "The fishermen's fashion reviews go viral. They're celebrities now.",
      "The fishermen's reviews are brutal. And accurate."
     ],
     [
      "Change into your raincoat",
      "adapt",
      "Cosy, honest travel content. People love the realness.",
      "The raincoat is beige. The vlog is beige."
     ]
    ]
   },
   {
    "s": "The trip has ten creators. One is clearly trying to make you the punchline of every video.",
    "c": [
     [
      "Laugh first and take the joke away",
      "outplay them",
      "Your fans love how you handle it. Their videos flop.",
      "They just make a new joke. About your laugh."
     ],
     [
      "Film a video of you being the punchline",
      "embrace it",
      "The 'punchline of the trip' series is your most popular content.",
      "The series confirms you are the punchline."
     ],
     [
      "Call it out privately",
      "grown-up move",
      "They apologise. The rest of the trip is fun.",
      "They film you calling them out. Very public."
     ]
    ]
   },
   {
    "s": "The trip's main event is a hot-air balloon ride. You are terrified of heights.",
    "c": [
     [
      "Do it, and film your fear",
      "nerves of steel",
      "Your fear is so real people love you more.",
      "Your fear is so real you scream the whole time."
     ],
     [
      "Stay on the ground and film the others",
      "be the cameraman",
      "Your ground footage of everyone is the best content of the trip.",
      "Your ground footage is just tiny dots in the sky."
     ],
     [
      "Pretend you're sick",
      "avoid it",
      "You get to rest. No one knows.",
      "Everyone knows. Your fans call you out."
     ]
    ]
   },
   {
    "s": "The trip's sponsor asks all ten creators to post the same photo with the same caption at exactly the same time. You hate the caption.",
    "c": [
     [
      "Post a different photo",
      "stand out",
      "Your photo is the one that stands out. Even the sponsor notices.",
      "The sponsor's account manager sends a long email."
     ],
     [
      "Keep the photo, rewrite the caption",
      "make it yours",
      "Your caption is the most popular post of the trip.",
      "The sponsor did not want jokes about their logo."
     ],
     [
      "Post exactly as asked",
      "be a team player",
      "The sponsor is delighted. A safe pair of hands.",
      "Ten identical posts. Your fans notice you look like a robot."
     ]
    ]
   }
  ],
  "creator-doc": [
   {
    "s": "A camera crew wants a day in your life for a mini-doc. Your life does not feel ready. Your flat currently contains three unwashed mugs and a cardboard cut-out of yourself.",
    "c": [
     [
      "Give the cut-out its own interview",
      "make it a character",
      "The cut-out interview becomes the doc's most quoted scene.",
      "The cut-out's answers are better than yours."
     ],
     [
      "Let them film the mess, totally unfiltered",
      "go raw",
      "'Realest creator doc of the year,' says everyone.",
      "'Please wash your mugs,' says everyone."
     ],
     [
      "Ask for ten minutes to tidy",
      "stage it",
      "Clean flat, calm doc, soft lighting. Very premium.",
      "The crew films you tidying. That's the doc now."
     ]
    ]
   },
   {
    "s": "The doc director asks you something very personal, on camera, and lets the silence sit. You're not ready to answer it.",
    "c": [
     [
      "Answer honestly, even if your voice wobbles",
      "open up",
      "The honesty is breathtaking. It's the heart of the doc.",
      "Too raw. You ask them to cut it. They hesitate."
     ],
     [
      "Say 'I'm not ready for that one yet'",
      "set the line",
      "Your honesty is respected. That line ends up in the trailer.",
      "The line makes it sound like there's a scandal."
     ],
     [
      "Make a joke and change the subject",
      "deflect",
      "The joke lands. The director moves on.",
      "The director circles back. Twice."
     ]
    ]
   },
   {
    "s": "The director needs one shot of you looking 'thoughtful' by a window. You've been up since 5am. You look sleepy.",
    "c": [
     [
      "Do a slow 'thoughtful' interpretive dance",
      "get weird",
      "The thoughtful dance becomes the doc's breakout moment.",
      "The thoughtful dance is very much not thoughtful."
     ],
     [
      "Pretend to read a huge book",
      "fake deep",
      "The reading shot is perfect. You look incredibly wise.",
      "The book is upside down. In 4K."
     ],
     [
      "Look out the window and think of lunch",
      "method it",
      "Thinking about lunch is the most soulful you've ever looked.",
      "You fall asleep standing up. They film it."
     ]
    ]
   },
   {
    "s": "Your best friend is being interviewed for the doc. On camera, they casually mention the thing you made them swear never to mention.",
    "c": [
     [
      "Ask them to explain it on camera",
      "lean in",
      "The explanation is so sweet it's the doc's heart.",
      "The explanation makes it so much worse."
     ],
     [
      "Edit it out yourself",
      "take control",
      "The edit is seamless. Nobody knows.",
      "The director finds out you edited it."
     ],
     [
      "Laugh it off",
      "ice cold",
      "The laugh makes it a cute moment. Fans love it.",
      "The laugh is so forced it's awkward."
     ]
    ]
   }
  ],
  "creator-host": [
   {
    "s": "Three hours of live awards-week hosting, no delay. A guest arrives forty minutes early, sits in your chair, and refuses to move until they get their interview.",
    "c": [
     [
      "Do the interview from the floor",
      "let them win",
      "The floor interview is the most charming clip of the night.",
      "The camera can't find you. You are a voice from below."
     ],
     [
      "Interview them about why they're early",
      "make it the story",
      "Their 'early bird' rant is hilarious. Huge clip.",
      "Their rant turns into a twenty-minute rant. Live."
     ],
     [
      "Politely show them to their seat",
      "keep the schedule",
      "Your poise under pressure impresses the producers.",
      "They make a scene about it. Live, again."
     ]
    ]
   },
   {
    "s": "The producer in your earpiece is very, very stressed. You can hear them breathing. They keep whispering 'okay okay okay.'",
    "c": [
     [
      "Calm them down, live on air",
      "be the steady one",
      "Your calm voice saves the show. The producer owes you forever.",
      "You say 'breathe' on air. Viewers think it was for them."
     ],
     [
      "Make the producer's panic a running bit",
      "make it funny",
      "'Okay okay okay' becomes the catchphrase of the night.",
      "The producer does not want to be a catchphrase."
     ],
     [
      "Take the earpiece out",
      "go solo",
      "You host on instinct and it's your best hour yet.",
      "No earpiece, no cues. You miss three guests."
     ]
    ]
   },
   {
    "s": "A famous guest walks on stage and trips over a cable. The audience gasps. The camera is on you.",
    "c": [
     [
      "Rush over and help them up",
      "soft heart",
      "The moment is so sweet the whole audience applauds.",
      "They're so embarrassed they leave the stage."
     ],
     [
      "Trip on the same cable on purpose",
      "share the fall",
      "Now it's a bit. The guest laughs. Saved.",
      "You trip harder than they did."
     ],
     [
      "Pivot to the next question smoothly",
      "keep the show moving",
      "The guest recovers. The show rolls on, flawless.",
      "The guest is hurt you didn't check on them."
     ]
    ]
   },
   {
    "s": "The teleprompter dies with ninety minutes of live show left. The screen just says 'ERROR 404'. Your notes are in your other jacket.",
    "c": [
     [
      "Improvise the whole thing",
      "go off-script",
      "Your improvised hour is the best live TV you've ever done.",
      "Your improvised hour includes three facts that aren't facts."
     ],
     [
      "Ask the audience to shout the next segment",
      "make it interactive",
      "The audience runs the show with you. Fresh, fun, chaotic.",
      "The audience shouts different segments. All at once."
     ],
     [
      "Throw to a break and get it fixed",
      "hold the line",
      "Quick fix, smooth comeback. Very professional.",
      "The break goes long. The network is not thrilled."
     ]
    ]
   }
  ],
  "creator-campaign": [
   {
    "s": "Global social campaign, twelve markets. The brand loves your personality but sends a forty-page 'tone guide' on how to have it.",
    "c": [
     [
      "Ignore the guide and be yourself",
      "bet on you",
      "Your real voice outperforms every other market. The brand reads the numbers.",
      "The legal team reads your real voice. They sigh."
     ],
     [
      "Make a video reading the guide out loud",
      "roast it gently",
      "The roast is so self-aware the brand shares it. Iconic.",
      "The person who wrote the guide is very hurt."
     ],
     [
      "Follow the guide perfectly",
      "be easy to work with",
      "Consistent across twelve markets. A dream to work with.",
      "Consistent across twelve markets. Also, sleepy."
     ]
    ]
   },
   {
    "s": "The campaign shoot uses a giant inflatable version of the product. Halfway through, it starts slowly, audibly deflating behind you.",
    "c": [
     [
      "Pose as it collapses, dramatically",
      "make it art",
      "The deflating product photo becomes the campaign's most famous image.",
      "The deflating product makes the product look tragic."
     ],
     [
      "Try to blow it back up yourself",
      "hero attempt",
      "Your heroic effort is so funny the photographer gets the best shot.",
      "You turn a concerning colour. The inflatable does not inflate."
     ],
     [
      "Ask for a ten-minute patch-up",
      "pause it",
      "Patched, re-inflated, perfect shot.",
      "The patch pops. The second inflatable is also leaking."
     ]
    ]
   },
   {
    "s": "The brand wants you to post at the exact same moment in all twelve markets. For one of them, that moment is 3am.",
    "c": [
     [
      "Set an alarm and post live at 3am",
      "commit",
      "Your 3am post gets the highest engagement of the campaign.",
      "Your 3am caption has four typos and a cat emoji."
     ],
     [
      "Schedule it and sleep",
      "play it smart",
      "The scheduled post goes out perfectly. You sleep like a baby.",
      "The scheduler glitches. It goes out at 3pm."
     ],
     [
      "Ask for a local-time rollout",
      "renegotiate",
      "The brand agrees. Every market gets prime time.",
      "The brand says no. You lose a whole meeting to it."
     ]
    ]
   },
   {
    "s": "Another creator on the campaign is copying your style. Exactly. Same hand gestures. Same filter. Same pause before the punchline.",
    "c": [
     [
      "Switch it up completely",
      "outrun them",
      "Your new style lands and theirs is suddenly last season.",
      "Your new style flops. Their copy of your old one wins."
     ],
     [
      "Do a video copying them copying you",
      "go meta",
      "The meta video is so funny everyone's in on the joke.",
      "Now there are two copies of everything. Chaos."
     ],
     [
      "Say nothing and keep posting",
      "stay original",
      "Your fans know who started it. They say so.",
      "Their copy keeps outperforming you."
     ]
    ]
   }
  ],
  "creator-equity": [
   {
    "s": "Equity deal meeting. Less cash now, real ownership later. The founder has a whiteboard that just says 'GROWTH' with three arrows pointing in different directions.",
    "c": [
     [
      "Ask which arrow is the real one",
      "test them",
      "The founder laughs, then gives a sharp answer. You trust this.",
      "The founder doesn't know which arrow. Neither does the CFO."
     ],
     [
      "Draw your own arrow",
      "pitch yourself",
      "Your arrow becomes the plan. Your audience is the strategy now.",
      "Your arrow points at the door. The founder notices."
     ],
     [
      "Ask for a split: some cash, some shares",
      "play both sides",
      "The split keeps you safe and still in the upside. Smart.",
      "They counter with less of both. Bold of them."
     ]
    ]
   },
   {
    "s": "The founder gives you a tour of their office. It's one room. Their dog has a name badge that says 'Head of Morale'.",
    "c": [
     [
      "Interview the Head of Morale",
      "make it content",
      "The dog interview is the best thing the company has ever posted.",
      "The Head of Morale growls on camera."
     ],
     [
      "Ask about the actual team",
      "get serious",
      "The founder appreciates the serious question.",
      "The actual team is the dog."
     ],
     [
      "Ask if the dog has equity",
      "a little cheek",
      "The founder laughs: 'more than you, currently.' Bonding.",
      "The founder says yes. You're now negotiating with a dog."
     ]
    ]
   },
   {
    "s": "The founder wants you to name their new product right now. It's a smart sock. It tracks your steps and 'your mood'.",
    "c": [
     [
      "Pitch 'Sole Mate'",
      "go punny",
      "'Sole Mate' is so good it goes straight on the box.",
      "'Sole Mate' is already trademarked by a dating app."
     ],
     [
      "Pitch a very serious one-word name",
      "go premium",
      "The serious name makes the sock feel expensive.",
      "The serious name makes the sock feel like a medical device."
     ],
     [
      "Ask what the sock actually does",
      "understand the product",
      "Once you get it, the perfect name just falls out of you.",
      "The sock doesn't really do anything yet."
     ]
    ]
   },
   {
    "s": "The founder slides a contract across the table and says 'sign today and we'll double your shares'. It's very long and very small print.",
    "c": [
     [
      "Sign it on the spot",
      "bet on them",
      "The deal is genuinely great. You're a co-owner now.",
      "You're a co-owner of a sock company. Of a smart sock."
     ],
     [
      "Ask for twenty-four hours",
      "read the room twice",
      "You read every word and come back with a better deal.",
      "The founder offers the deal to someone else overnight."
     ],
     [
      "Send it to your lawyer",
      "do it properly",
      "Your lawyer finds a clause worth fixing. Big win.",
      "Your lawyer is on holiday. Out-of-office email."
     ]
    ]
   }
  ],
  "creator-series": [
   {
    "s": "A platform wants a whole recurring show built around your point of view. The pilot needs a format by Friday. Your only idea, written on a napkin, says 'just vibes?'",
    "c": [
     [
      "Pitch 'just vibes' with total confidence",
      "sell the napkin",
      "The execs love the napkin. 'Just Vibes' gets a pilot slot.",
      "The execs ask what happens in episode two. Silence."
     ],
     [
      "Turn your group chat into the show",
      "bring your people",
      "The group-chat format feels new. The execs lean in.",
      "Your group chat is not ready to be on television."
     ],
     [
      "Ask for an extra week and a real outline",
      "do it properly",
      "The outline is tight and strong. They trust you more.",
      "The extra week goes to another creator's pitch."
     ]
    ]
   },
   {
    "s": "The platform exec says they're your biggest fan. They've seen every video. They now want to give you notes on content you posted four years ago.",
    "c": [
     [
      "Make 'exec notes' a segment in the pilot",
      "turn it into content",
      "The 'exec notes' segment is the funniest part of the pilot.",
      "The 'exec notes' segment is the most boring part of the pilot."
     ],
     [
      "Give them notes on their notes",
      "big swing",
      "The exec laughs. They love your confidence.",
      "The exec does not laugh. They're very serious."
     ],
     [
      "Say thank you and steer to the pilot",
      "stay gracious",
      "The exec is happy you're so open. You get to the good stuff.",
      "The exec is still giving you notes. On 2022."
     ]
    ]
   },
   {
    "s": "The pilot's first guest is a huge star. Backstage, they admit they're terrified. Their hands are shaking.",
    "c": [
     [
      "Make them laugh before you roll",
      "break the ice",
      "The guest relaxes. The interview is perfect.",
      "They're still nervous. The interview is awkward."
     ],
     [
      "Ask them about the nerves on camera",
      "tell the truth",
      "The guest opens up. The interview is beautiful.",
      "The guest gets more nervous. Now they're sweating."
     ],
     [
      "Stick to your prepared questions",
      "stay steady",
      "The interview is good. Clean, warm, usable.",
      "The interview is too careful. It's boring."
     ]
    ]
   },
   {
    "s": "The platform wants to give you a co-host. They're a famous comedian. They're very, very loud.",
    "c": [
     [
      "Be louder than them",
      "match their energy",
      "The two of you are hilarious together. The show is a hit.",
      "The two of you are very loud. The audience is annoyed."
     ],
     [
      "Be the quiet one",
      "contrast",
      "Your quiet energy balances their loudness perfectly.",
      "Your quiet energy makes you disappear."
     ],
     [
      "Ask for a different co-host",
      "hold the line",
      "The new co-host is perfect. The show is a hit.",
      "There is no new co-host. You're stuck."
     ]
    ]
   }
  ]
 }
};
