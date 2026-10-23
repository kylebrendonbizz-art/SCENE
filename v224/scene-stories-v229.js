/* SCENE stories v229 (Gameplay Logic): WHAT celebrities post to their stories and WHEN.
   Additive, offline, rules-based. Loaded after the existing story code (immersion-v39 / photo-posts-v99 / live-social-v146).
   Owns: per-character story profiles, deterministic daily story plans, reactions to real game events.
   Does NOT own wording (Writer: window.SCENE_STORY_CAPTIONS[captionKey]) or final rendering (UI/UX: listen to scene:stories-changed).
   Kill switch: window.SCENE_STORIES229_OFF=true (before load). Default card paint: window.SCENE_STORIES229_RENDER=false disables it.
   Saves: no new state keys. Each story object pushed into the existing state.stories tray only gains an optional `story229` field. */
(function(){
'use strict';
if(globalThis.SCENE_STORIES229_OFF||globalThis.SCENE_STORIES)return;
const G=globalThis;
const H=s=>{let h=2166136261;s=String(s);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const rnd=(...k)=>H(k.join('|'))/4294967296;
const pickBy=(arr,...k)=>arr.length?arr[H(k.join('|'))%arr.length]:undefined;
const uniq=a=>[...new Set(a.filter(Boolean))];
const ACC=()=>{try{return typeof ACCOUNTS!=='undefined'?ACCOUNTS:[]}catch{return[]}};
const BY=id=>{try{return typeof byId==='function'?byId(id):null}catch{return null}};
const ST=()=>{try{return typeof state!=='undefined'?state:null}catch{return null}};
const NOW=()=>Date.now();

/* ---------- 1. Theme catalog. captionKey = 'story.'+theme (stable; Writer keys caption banks by it). ----------
   [kind, emoji, default place, slots this theme may fill, neutral placeholder caption] */
const T={
 // travel / lifestyle
 jet_travel:['jet','✈️','private jet',['city','place'],'wheels up'],
 airport_run:['travel','🛫','airport',['city'],'airport mode'],
 hotel_window:['room','🏨','hotel room',['city'],'view from the room'],
 city_walk:['city','🏙️','city streets',['city','place'],'out for a walk'],
 coffee_run:['street','☕','coffee spot',['city'],'coffee first'],
 golden_hour:['view','🌅','balcony',['city','place'],'golden hour'],
 beach_day:['view','🏖️','beach',['place'],'salt air'],
 dinner_out:['dinner','🍝','dinner spot',['city','place','person'],'dinner'],
 car_ride:['car','🚗','passenger seat',['city','project'],'on the move'],
 hometown:['city','🏡','hometown',['city'],'home'],
 home_cozy:['room','🕯️','living room',[],'quiet night in'],
 book_tea:['room','📖','reading corner',[],'reading'],
 morning_skincare:['selfie','🧖','bathroom counter',['brand'],'morning routine'],
 workout:['gym','🏋️','gym',['place'],'done'],
 pilates:['gym','🧘','pilates studio',[],'stretch'],
 run_club:['gym','🏃','running route',['city'],'miles in'],
 cooking:['kitchen','🍳','kitchen',['person'],'cooking'],
 pet_time:['pet','🐾','home',[],'my buddy'],
 outfit_check:['mirror','🪞','mirror',['place'],'outfit check'],
 closet_pick:['mirror','👗','closet',[],'picking the look'],
 fan_moment:['event','💌','outside the venue',['city'],'love you guys'],
 // family (wholesome only, never more than a family moment)
 family_baking:['kitchen','🍪','kitchen',['person'],'baking day'],
 family_day:['home','🧸','home',['person'],'family day'],
 sisters_dinner:['dinner','🍽️','family dinner',['person'],'family dinner'],
 // brand / business
 brand_swatches:['product','🎨','brand office',['brand'],'swatching'],
 brand_launch:['product','📦','launch day',['brand'],'launch day'],
 brand_office:['office','🗂️','HQ',['brand','person'],'meetings all day'],
 product_shot:['product','🧴','shoot table',['brand'],'new in'],
 snack_taste:['product','🍫','test kitchen',['brand'],'taste test'],
 glam_room:['glam','💄','glam room',['person'],'glam'],
 // music
 studio_session:['studio','🎚️','studio',['project','person','city'],'in the studio'],
 vocal_warmup:['studio','🎤','warm-up room',[],'warming up'],
 writing_session:['studio','📝','writing room',['project'],'writing'],
 piano_corner:['studio','🎹','piano',['project'],'at the piano'],
 guitar_corner:['studio','🎸','guitar corner',['project'],'guitar'],
 studio_booth:['studio','🎙️','vocal booth',['project'],'booth'],
 band_practice:['studio','🥁','practice room',['person'],'practice'],
 tour_rehearsal:['stage','🎛️','rehearsal space',['project','city'],'rehearsals'],
 soundcheck:['stage','🔊','arena',['city'],'soundcheck'],
 backstage_prep:['backstage','🚪','backstage',['city','person'],'almost showtime'],
 stage_lights:['stage','💡','stage',['city','project'],'tonight'],
 setlist:['backstage','📋','dressing room',['project','city'],'setlist'],
 tour_bus:['travel','🚌','tour bus',['city'],'next city'],
 van_load_in:['travel','🚐','load-in',['city'],'load in'],
 merch_table:['backstage','👕','merch table',['city'],'merch'],
 vinyl_listening:['room','💿','record player',['project'],'listening back'],
 dance_rehearsal:['stage','🩰','dance studio',['person'],'rehearsal'],
 sneaker_shot:['street','👟','street',['brand'],'today\u2019s pair'],
 // screen
 set_trailer:['set','🎬','trailer',['project'],'on set'],
 script_read:['set','📜','script pages',['project'],'reading'],
 between_takes:['set','🎥','set',['project'],'between takes'],
 costume_fitting:['set','🧵','fitting',['project'],'fitting'],
 set_makeup:['glam','💺','makeup chair',['project'],'in the chair'],
 premiere_night:['event','🎟️','premiere',['project','city'],'premiere night'],
 press_day:['event','🎙️','press junket',['project','city'],'press day'],
 red_carpet:['event','✨','red carpet',['city'],'tonight'],
 rehearsal_room:['stage','🎭','rehearsal room',['project'],'rehearsal'],
 // fashion
 runway_backstage:['runway','👠','backstage at the show',['city','brand'],'show day'],
 fitting_room:['runway','📏','fitting room',['brand'],'fittings'],
 campaign_shoot:['set','📸','campaign set',['brand'],'on set'],
 fashion_week:['street','🕶️','fashion week',['city'],'fashion week'],
 editorial_set:['set','🖤','editorial set',['brand'],'shoot day'],
 // creator
 filming_setup:['creator','📹','filming setup',['project'],'filming'],
 editing_desk:['creator','💻','editing desk',['project'],'editing'],
 stream_setup:['creator','🕹️','stream setup',[],'going live soon'],
 ring_light:['creator','💡','ring light',['brand'],'get ready with me'],
 challenge_set:['creator','🏗️','challenge set',['project','brand'],'building something big'],
 // sport / hobby (curated only)
 football_watch:['sport','⚽','stadium',['city','place'],'match day'],
 courtside:['sport','🏀','courtside',['city','place'],'game night'],
 golf_day:['sport','⛳','golf course',[],'on the course'],
 garage_project:['car','🔧','garage',[],'garage day'],
 boxing_camp:['sport','🥊','boxing gym',[],'camp'],
 // reactive: only created from real game events (see section 3)
 hangout_with_player:['hangout','🤝','out with a friend',['player','city'],'good company'],
 hangout_place:['city','📍','around town',['city'],'good day'],
 reshare_player_post:['reshare','🔁','reposted',['player','playerHandle','postSnippet'],'saw this'],
 gig_shoutout:['shoutout','📣','shoutout',['player','gig'],'go see this'],
 collab_day:['studio','🤝','working session',['player','project'],'working on something']
};
const REACTIVE=new Set(['hangout_with_player','hangout_place','reshare_player_post','gig_shoutout','collab_day']);

/* ---------- 2a. Hand-curated profiles (public persona only: work, brands, public places, wholesome family moments).
   No relationships/romance, nothing sexual, medical, legal, or invented. Family people only appear in family_* themes. ---------- */
const CUR={};
function C(id,mood,palette,themes,places,cities,people,brands,family){CUR[id]={themes,places,cities,people:people||[],family:family||[],brands:brands||[],aesthetic:{palette,mood},curated:true}}
C('kylie','glam',['#f6c1cf','#b76e79','#2b1a1f'],['jet_travel','brand_swatches','glam_room','family_baking','closet_pick','brand_launch','product_shot','golden_hour','morning_skincare','family_day','outfit_check','sisters_dinner','brand_office'],['private jet','glam room','Kylie Cosmetics HQ','kitchen','closet','Calabasas'],['Los Angeles','Paris','New York'],['the glam team','the Kylie Cosmetics team'],['Kylie Cosmetics','Kylie Skin','Khy'],['Stormi','the kids','Kendall','Kris']);
C('kim','luxe',['#e8dccb','#8b7765','#1c1a18'],['brand_office','glam_room','jet_travel','family_day','closet_pick','product_shot','campaign_shoot','sisters_dinner','workout','golden_hour','outfit_check','press_day'],['SKIMS office','glam room','private jet','closet','Calabasas'],['Los Angeles','New York','Paris','Tokyo'],['the SKIMS team','the glam team'],['SKIMS'],['North','the kids','Khloé','Kourtney','Kris']);
C('kendall','luxe',['#d9cbb8','#5b4a3d','#121212'],['runway_backstage','campaign_shoot','fitting_room','jet_travel','pilates','golden_hour','fashion_week','outfit_check','editorial_set','sisters_dinner','beach_day','coffee_run'],['backstage at the show','campaign set','Malibu','fitting room'],['Los Angeles','Paris','New York','London'],['the glam team'],[],['Kylie','Kris','Khloé']);
C('khloe','cozy',['#f2e2d2','#a07a5a','#2a2018'],['workout','family_day','brand_office','product_shot','glam_room','family_baking','sisters_dinner','home_cozy','closet_pick','outfit_check','morning_skincare'],['home gym','Good American office','kitchen','glam room'],['Los Angeles'],['the Good American team'],['Good American'],['True','Kim','Kourtney','Kylie','Kris']);
C('kourtney','cozy',['#e6eadf','#7a8b6f','#22281f'],['morning_skincare','product_shot','brand_office','family_day','cooking','pilates','golden_hour','book_tea','sisters_dinner','home_cozy','closet_pick'],['kitchen','garden','Lemme office','Calabasas'],['Los Angeles'],['the Lemme team'],['Lemme','Poosh'],['the kids','Kim','Khloé','Kris']);
C('kris','luxe',['#efe6da','#b08d57','#1d1a16'],['brand_office','jet_travel','dinner_out','family_day','sisters_dinner','golden_hour','press_day','closet_pick','coffee_run','home_cozy'],['office','dinner spot','private jet','home'],['Los Angeles','New York','Paris'],['the team'],[],['the grandkids','Kim','Khloé','Kourtney','Kendall','Kylie']);
C('ariana','glam',['#f3e9ee','#c9a7c7','#2d2433'],['studio_session','vocal_warmup','brand_swatches','glam_room','set_trailer','press_day','premiere_night','pet_time','closet_pick','writing_session','product_shot','home_cozy'],['studio','r.e.m. beauty lab','set','glam room'],['Los Angeles','London','New York'],['the r.e.m. beauty team','the glam team'],['r.e.m. beauty'],[]);
C('taylor','indie',['#efe3d0','#7d6b8f','#1f1b2b'],['writing_session','piano_corner','guitar_corner','tour_rehearsal','soundcheck','stage_lights','backstage_prep','pet_time','cooking','fan_moment','vinyl_listening','studio_session','setlist'],['writing room','stadium','rehearsal space','kitchen'],['New York','London','Tokyo','Los Angeles'],['the band','the dancers'],[],[]);
C('beyonce','luxe',['#f0d9a8','#a8742e','#1a120a'],['stage_lights','tour_rehearsal','studio_session','brand_launch','product_shot','glam_room','closet_pick','soundcheck','backstage_prep','golden_hour','campaign_shoot','dance_rehearsal'],['stadium','Parkwood studio','rehearsal space','glam room','Houston'],['Los Angeles','New York','London','Paris'],['the dancers','the band'],['Cécred','Parkwood'],[]);
C('rihanna','glam',['#f7d6c4','#c0574a','#22110e'],['brand_swatches','brand_launch','product_shot','glam_room','studio_session','fashion_week','jet_travel','outfit_check','beach_day','dinner_out','golden_hour','brand_office'],['Fenty Beauty HQ','studio','Barbados','glam room'],['Los Angeles','London','New York','Paris'],['the Fenty Beauty team'],['Fenty Beauty','Fenty Skin'],[]);
C('selena','cozy',['#f3dfe3','#b4787f','#2a1a1d'],['brand_swatches','brand_launch','set_trailer','cooking','studio_session','between_takes','glam_room','home_cozy','book_tea','press_day','product_shot','pet_time'],['Rare Beauty office','set','kitchen','studio'],['Los Angeles','New York','Paris'],['the Rare Beauty team','the cast'],['Rare Beauty'],[]);
C('hailey','luxe',['#f4ece4','#c6a89a','#2b2420'],['product_shot','morning_skincare','brand_launch','pilates','campaign_shoot','coffee_run','outfit_check','brand_office','golden_hour','closet_pick','fitting_room'],['rhode office','pilates studio','campaign set','coffee spot'],['Los Angeles','New York','Paris'],['the rhode team'],['rhode'],[]);
C('justin','street',['#e8e4dc','#8f8a7a','#1b1b19'],['studio_session','sneaker_shot','golf_day','car_ride','writing_session','outfit_check','studio_booth','golden_hour','coffee_run','guitar_corner','piano_corner'],['studio','golf course','drew house','Stratford'],['Los Angeles','Toronto'],['the band'],['drew house'],[]);
C('shawn','indie',['#e7e0d3','#6f7f6a','#1e221d'],['guitar_corner','writing_session','studio_session','soundcheck','run_club','tour_rehearsal','backstage_prep','hometown','golden_hour','piano_corner','fan_moment'],['studio','venue','Toronto','writing room'],['Toronto','Los Angeles','London'],['the band'],['Shawn Mendes Foundation'],[]);
C('billie','indie',['#d9e7d0','#3e5a3a','#0f140e'],['studio_session','writing_session','tour_rehearsal','soundcheck','backstage_prep','stage_lights','pet_time','cooking','vinyl_listening','car_ride','fan_moment','outfit_check'],['home studio','arena','rehearsal space','kitchen'],['Los Angeles','London','Tokyo'],['FINNEAS','the band','the crew'],[],[]);
C('sabrina','glam',['#ffd9e6','#d46a8c','#2b1220'],['tour_rehearsal','backstage_prep','glam_room','soundcheck','stage_lights','studio_session','closet_pick','writing_session','fan_moment','setlist','coffee_run','hotel_window'],['arena','glam room','studio','rehearsal space'],['Los Angeles','New York','London'],['the dancers','the band','the glam team'],[],[]);
C('olivia','indie',['#e9dcf2','#7a4f9a','#1c1224'],['writing_session','piano_corner','guitar_corner','studio_session','tour_rehearsal','soundcheck','backstage_prep','vinyl_listening','book_tea','outfit_check','fan_moment','coffee_run'],['writing room','studio','arena','record store'],['Los Angeles','London','New York'],['the band'],[],[]);
C('miley','studio',['#f2e3c9','#b5874b','#1d140c'],['studio_session','vocal_warmup','writing_session','pet_time','golden_hour','closet_pick','studio_booth','home_cozy','car_ride','glam_room','vinyl_listening'],['studio','Malibu','home','glam room'],['Los Angeles','Nashville'],['the band'],[],[]);
C('gaga','studio',['#e6e1ea','#5c4b6b','#121014'],['studio_session','piano_corner','brand_swatches','glam_room','set_trailer','tour_rehearsal','stage_lights','product_shot','backstage_prep','closet_pick','vocal_warmup','press_day'],['studio','piano','Haus Labs office','stage'],['Los Angeles','New York','London','Paris'],['the dancers','the band'],['Haus Labs'],[]);
C('nicki','glam',['#ffd1ec','#e0479e','#24081a'],['studio_booth','studio_session','glam_room','closet_pick','tour_rehearsal','backstage_prep','stage_lights','fan_moment','outfit_check','jet_travel','hometown'],['vocal booth','glam room','arena','Queens'],['New York','London','Los Angeles'],['the Barbz','the team'],[],[]);
C('cardi','street',['#ffe0b2','#e0823d','#24140a'],['studio_booth','cooking','glam_room','family_day','closet_pick','studio_session','outfit_check','hometown','fan_moment','car_ride','stage_lights'],['studio','kitchen','the Bronx','glam room'],['New York','Los Angeles'],['the team'],[],['the kids']);
C('dua','luxe',['#dfe8f2','#3d6fa6','#0d1622'],['tour_rehearsal','dance_rehearsal','book_tea','dinner_out','fashion_week','studio_session','hotel_window','golden_hour','beach_day','backstage_prep','city_walk','outfit_check'],['rehearsal space','dinner spot','London','Albania coast'],['London','Paris','New York','Los Angeles'],['the dancers','the Service95 team'],['Service95'],[]);
C('doja','studio',['#e6f0d9','#8fb050','#151c0b'],['studio_session','glam_room','dance_rehearsal','tour_rehearsal','closet_pick','stream_setup','backstage_prep','outfit_check','stage_lights','home_cozy'],['studio','rehearsal space','glam room','home'],['Los Angeles'],['the dancers'],[],[]);
C('sza','cozy',['#e3efe6','#4f8a73','#0f1a15'],['studio_session','writing_session','tour_rehearsal','backstage_prep','book_tea','golden_hour','outfit_check','home_cozy','soundcheck','stage_lights','coffee_run'],['studio','arena','home','St. Louis'],['Los Angeles','New York'],['the band'],[],[]);
C('weeknd','studio',['#2a0f12','#b3121f','#0a0405'],['studio_session','stage_lights','tour_rehearsal','soundcheck','set_trailer','backstage_prep','hometown','studio_booth','hotel_window','car_ride'],['studio','stadium','Toronto','set'],['Toronto','Los Angeles','London','Paris'],['the crew'],['XO'],[]);
C('drake','luxe',['#e8dcc0','#9b7a3c','#120e06'],['studio_session','courtside','jet_travel','hometown','studio_booth','tour_rehearsal','backstage_prep','golden_hour','brand_office','car_ride','outfit_check'],['studio','courtside','Toronto','private jet'],['Toronto','London','Los Angeles','New York'],['OVO'],['OVO','NOCTA'],[]);
C('bruno','studio',['#f4e2c4','#c08a3e','#1d140a'],['studio_session','tour_rehearsal','soundcheck','stage_lights','backstage_prep','guitar_corner','piano_corner','outfit_check','vinyl_listening','dance_rehearsal'],['studio','residency stage','rehearsal space','Hawaii'],['Los Angeles','Las Vegas','Tokyo','London'],['the Hooligans','the band'],[],[]);
C('harry','indie',['#f2e6d8','#d88c6a','#22150f'],['tour_rehearsal','soundcheck','stage_lights','product_shot','run_club','studio_session','guitar_corner','fan_moment','city_walk','backstage_prep','brand_launch'],['stadium','studio','London','rehearsal space'],['London','Los Angeles','New York','Tokyo'],['the band'],['Pleasing'],[]);
C('badbunny','street',['#d7f0f5','#1fa3b8','#06181b'],['stage_lights','studio_session','hometown','tour_rehearsal','beach_day','outfit_check','soundcheck','backstage_prep','car_ride','golden_hour','fan_moment'],['San Juan','stadium','studio','beach'],['San Juan','Los Angeles','New York','Paris'],['the crew'],[],[]);
C('jlo','luxe',['#f6e7d0','#c9a15b','#1f170c'],['dance_rehearsal','set_trailer','product_shot','workout','glam_room','tour_rehearsal','brand_launch','morning_skincare','premiere_night','between_takes','golden_hour'],['dance studio','set','home gym','glam room'],['Los Angeles','New York','Miami'],['the dancers','the JLo Beauty team'],['JLo Beauty'],[]);
C('shakira','sporty',['#fff1cf','#e0a020','#1e1504'],['dance_rehearsal','stage_lights','tour_rehearsal','studio_session','beach_day','hometown','soundcheck','backstage_prep','golden_hour','fan_moment'],['rehearsal space','stadium','Barranquilla','studio'],['Barranquilla','Miami','Paris','London'],['the dancers','the band'],[],[]);
C('zendaya','luxe',['#efe2d3','#8e5b3f','#1a110b'],['set_trailer','premiere_night','press_day','red_carpet','fitting_room','between_takes','script_read','costume_fitting','set_makeup','closet_pick','golden_hour','campaign_shoot'],['set','premiere','fitting room','press junket'],['Los Angeles','London','Paris','New York'],['the cast','the glam team'],[],[]);
C('timothee','indie',['#e4e0ef','#6f63a3','#13101f'],['set_trailer','premiere_night','press_day','courtside','script_read','between_takes','costume_fitting','red_carpet','city_walk','coffee_run'],['set','premiere','Madison Square Garden','New York'],['New York','Paris','London','Los Angeles'],['the cast'],[],[]);
C('pedro','cozy',['#efe6d8','#9c6b4a','#1c130d'],['set_trailer','press_day','premiere_night','script_read','between_takes','red_carpet','coffee_run','book_tea','rehearsal_room','dinner_out'],['set','press junket','premiere','rehearsal room'],['Los Angeles','New York','London'],['the cast'],[],[]);
C('sydney','sporty',['#f3ead6','#c98e3c','#1d150a'],['garage_project','set_trailer','between_takes','press_day','premiere_night','campaign_shoot','set_makeup','workout','golden_hour','red_carpet'],['garage','set','press junket','premiere'],['Los Angeles','New York'],['the cast','the crew'],[],[]);
C('margot','luxe',['#ffe3ea','#e26d8f','#24101a'],['set_trailer','premiere_night','press_day','brand_office','script_read','between_takes','costume_fitting','red_carpet','golden_hour','coffee_run','beach_day'],['set','LuckyChap office','premiere','press junket'],['Los Angeles','London','Gold Coast'],['the LuckyChap team','the cast'],['LuckyChap'],[]);
C('tatemcrae','sporty',['#e5ecf5','#5a7fa8','#0e1520'],['dance_rehearsal','tour_rehearsal','soundcheck','backstage_prep','stage_lights','studio_session','workout','hometown','fan_moment','outfit_check'],['dance studio','arena','Calgary','studio'],['Calgary','Los Angeles','London','New York'],['the dancers'],[],[]);
C('charli','street',['#e9ff7a','#8acb1f','#0d1104'],['studio_session','stage_lights','dinner_out','city_walk','backstage_prep','tour_rehearsal','outfit_check','fashion_week','studio_booth','car_ride'],['studio','club stage','London','Brooklyn'],['London','New York','Los Angeles','Paris'],['the crew'],[],[]);
C('chappell','glam',['#ffd6e0','#e2557a','#250b13'],['glam_room','stage_lights','tour_rehearsal','backstage_prep','soundcheck','writing_session','closet_pick','fan_moment','hometown','studio_session'],['glam room','festival stage','Missouri','studio'],['Los Angeles','New York','London'],['the band','the glam team'],[],[]);
C('scene-u-mrbeast','sporty',['#d6f0ff','#2a8ad6','#061522'],['challenge_set','filming_setup','editing_desk','snack_taste','brand_office','product_shot','car_ride','brand_launch','coffee_run','workout'],['challenge set','studio warehouse','Greenville','edit bay'],['Greenville','Los Angeles','New York'],['the crew'],['Feastables','Beast Industries'],[]);
C('scene-u-ed','indie',['#ffe7c9','#d97a2b','#1f1206'],['guitar_corner','soundcheck','writing_session','stage_lights','studio_session','cooking','hometown','fan_moment','pet_time','backstage_prep','vinyl_listening'],['loop-pedal stage','writing room','Suffolk','studio'],['London','Tokyo','Los Angeles'],['the crew'],['Tingly Ted\u2019s'],[]);
C('scene-u-tomholland','sporty',['#e6edf3','#4b6f8f','#0e151c'],['set_trailer','golf_day','press_day','premiere_night','between_takes','product_shot','workout','script_read','coffee_run','pet_time'],['set','golf course','London','press junket'],['London','Los Angeles','New York'],['the cast'],['BERO'],[]);
C('scene-u-jungkook','studio',['#e4e8f5','#5161a8','#0b0e1f'],['dance_rehearsal','studio_session','vocal_warmup','stage_lights','soundcheck','workout','cooking','backstage_prep','fan_moment','city_walk'],['practice room','studio','Seoul','stage'],['Seoul','Tokyo','Los Angeles'],['the dancers'],[],[]);
C('scene-u-lisa','glam',['#f5dce8','#b84d84','#200a16'],['dance_rehearsal','stage_lights','campaign_shoot','glam_room','fashion_week','studio_session','backstage_prep','pet_time','set_trailer','outfit_check'],['dance studio','stage','campaign set','Bangkok'],['Bangkok','Seoul','Paris','Los Angeles'],['the dancers','the glam team'],[],[]);
C('scene-u-travisscott','street',['#d8c7a6','#6b4f2a','#100b05'],['studio_session','stage_lights','sneaker_shot','studio_booth','tour_rehearsal','hometown','brand_office','backstage_prep','car_ride'],['studio','stadium','Houston','Cactus Jack office'],['Houston','Los Angeles','New York','Paris'],['the crew'],['Cactus Jack'],[]);
C('scene-u-megan','sporty',['#f6d6c8','#c2523a','#220e08'],['studio_booth','workout','glam_room','stage_lights','dance_rehearsal','hometown','studio_session','outfit_check','backstage_prep','fan_moment'],['vocal booth','gym','Houston','glam room'],['Houston','Los Angeles','New York'],['the Hotties','the dancers'],['Hot Girl Productions'],[]);
C('scene-u-ishowspeed','sporty',['#fff3c4','#e3b100','#1c1600'],['stream_setup','football_watch','workout','filming_setup','city_walk','fan_moment','car_ride','stage_lights'],['stream setup','stadium','street','training pitch'],['London','Tokyo','Paris','Johannesburg','Cape Town'],['the stream crew'],[],[]);
const HOME={'scene-u-ed':'Suffolk',justin:'Stratford',shawn:'Toronto',nicki:'Queens',cardi:'the Bronx',badbunny:'San Juan',shakira:'Barranquilla',weeknd:'Toronto',drake:'Toronto',sza:'St. Louis',tatemcrae:'Calgary',chappell:'Missouri','scene-u-travisscott':'Houston','scene-u-megan':'Houston','scene-u-mrbeast':'Greenville',beyonce:'Houston',rihanna:'Barbados',margot:'Gold Coast','scene-u-tomholland':'London','scene-u-jungkook':'Busan','scene-u-lisa':'Bangkok',dua:'London',harry:'Cheshire'};

/* ---------- 2b. Derived first pass for every character (registry role/bio + baked registry professions/brands). ---------- */
const REG={"scene-rising-33":[[],["singer","songwriter","recording artist"]],"scene-rising-10":[[],["singer","songwriter","recording artist"]],"scene-u-cillian":[[],["actor"]],"scene-u-alixearle":[[],["digital creator","media personality","entrepreneur"]],"scene-u-jamescharles":[[],["digital creator","media personality","entrepreneur"]],"scene-rising-55":[[],["actor"]],"scene-u-kaia":[["Library Science book club"],["fashion model","media personality"]],"chappell":[[],["singer","songwriter","recording artist"]],"scene-rising-29":[[],["singer","songwriter","recording artist"]],"scene-u-brad":[["Plan B Entertainment"],["actor","producer"]],"scene-rising-42":[[],["singer","songwriter","recording artist"]],"beyonce":[["Parkwood Entertainment","Cécred","SirDavis"],["singer","songwriter","recording artist"]],"jlo":[["JLo Beauty"],["singer","songwriter","actor","entrepreneur"]],"kendall":[[],["fashion model","media personality"]],"scene-u-lorde":[[],["singer","songwriter","recording artist"]],"charli":[["The Moment"],["singer","songwriter","recording artist"]],"scene-rising-01":[[],["singer","songwriter","recording artist"]],"scene-u-angelina":[["Atelier Jolie"],["actor","producer"]],"scene-u-aniston":[["The Morning Show","LolaVie"],["actor","producer"]],"scene-u-dixie":[[],["digital creator","media personality","entrepreneur"]],"scene-u-karlie":[["Kode With Klossy"],["fashion model","media personality","entrepreneur"]],"scene-rising-51":[[],["singer","songwriter","recording artist"]],"scene-u-chrishemsworth":[["Centr","Limitless"],["actor"]],"scene-rising-48":[[],["singer","songwriter","recording artist"]],"scene-rising-15":[[],["singer","songwriter","recording artist"]],"scene-rising-02":[[],["singer","songwriter","recording artist"]],"scene-rising-32":[[],["singer","songwriter","recording artist"]],"scene-u-jacobelordi":[["Euphoria","Wuthering Heights"],["actor"]],"scene-u-tems":[[],["singer","songwriter","recording artist"]],"scene-rising-59":[["Heartstopper"],["actor"]],"shawn":[["Shawn Mendes Foundation"],["singer","songwriter","recording artist"]],"scene-u-lindaevangelista":[[],["fashion model","media personality"]],"drake":[["OVO","NOCTA","Better World Fragrance House"],["singer","songwriter","recording artist"]],"billie":[["HIT ME HARD AND SOFT era"],["singer","songwriter","recording artist"]],"scene-u-usher":[[],["singer","songwriter","recording artist"]],"scene-u-lilycollins":[["Emily in Paris"],["actor","producer"]],"scene-u-milliebobby":[["Florence by Mills"],["actor","producer"]],"scene-u-aliciakeys":[["Keys Soulcare"],["singer","songwriter","recording artist"]],"scene-u-irina":[[],["fashion model","media personality"]],"sabrina":[["Man’s Best Friend"],["singer","songwriter","recording artist"]],"sydney":[[],["actor"]],"scene-rising-63":[[],["fashion model","media personality"]],"scene-u-rosalia":[[],["singer","songwriter","recording artist"]],"scene-rising-62":[["Ôrebella"],["fashion model","media personality","entrepreneur"]],"scene-rising-57":[[],["singer","songwriter","actor"]],"scene-u-burna":[[],["singer","songwriter","recording artist"]],"scene-rising-64":[[],["fashion model","media personality"]],"scene-u-winnie":[[],["fashion model","media personality"]],"scene-rising-31":[[],["singer","songwriter","recording artist"]],"scene-rising-28":[[],["singer","songwriter","recording artist"]],"scene-rising-30":[[],["singer","songwriter","actor"]],"scene-rising-39":[["JAGUAR era"],["singer","songwriter","recording artist"]],"scene-rising-17":[[],["singer","songwriter","recording artist"]],"scene-rising-52":[[],["singer","songwriter","actor"]],"scene-rising-11":[[],["singer","songwriter","recording artist"]],"sza":[["Not Beauty"],["singer","songwriter","recording artist"]],"scene-rising-24":[[],["singer","songwriter","actor"]],"scene-u-megan":[["Hot Girl Productions"],["singer","songwriter","recording artist"]],"scene-rising-21":[[],["singer","songwriter","recording artist"]],"ariana":[[],["singer","songwriter","actor","entrepreneur"]],"scene-rising-50":[[],["singer","songwriter","recording artist"]],"scene-u-lupita":[[],["actor"]],"nicki":[["Pink Friday franchise"],["singer","songwriter","recording artist"]],"scene-rising-23":[["Stranger Things"],["singer","songwriter","actor"]],"kylie":[["Kylie Cosmetics","Khy","The Kardashians"],["entrepreneur","media personality","fashion/beauty executive"]],"taylor":[[],["singer","songwriter","recording artist"]],"scene-u-gracie":[[],["singer","songwriter","recording artist"]],"zendaya":[["Spider-Man: Brand New Day","The Odyssey","The Drama","Euphoria"],["singer","songwriter","actor"]],"scene-u-preciouslee":[[],["fashion model","media personality"]],"scene-rising-09":[[],["singer","songwriter","recording artist"]],"scene-rising-44":[[],["singer","songwriter","recording artist"]],"timothee":[["Dune franchise","Wonka"],["actor"]],"scene-u-hunter":[[],["actor"]],"scene-rising-56":[[],["singer","songwriter","actor"]],"gaga":[["MAYHEM era","Haus Labs","Outer Bio","Born This Way Foundation"],["singer","songwriter","actor","entrepreneur"]],"cardi":[["AM I THE DRAMA?"],["singer","songwriter","recording artist"]],"pedro":[["The Mandalorian and Grogu","The Last of Us","BEHEMOTH!"],["actor"]],"rihanna":[["Fenty Beauty","Fenty Skin","Fenty Hair","Savage X Fenty"],["singer","songwriter","actor"]],"scene-u-florencepugh":[[],["actor"]],"scene-rising-03":[[],["singer","songwriter","recording artist"]],"scene-u-jenlaw":[["Excellent Cadaver production company"],["actor","producer"]],"scene-u-jennaortega":[["Wednesday"],["actor","producer"]],"scene-u-paloma":[[],["fashion model","media personality"]],"scene-u-benson":[[],["singer","songwriter","recording artist"]],"scene-rising-19":[[],["singer","songwriter","recording artist"]],"scene-rising-34":[[],["singer","songwriter","recording artist"]],"scene-u-nara":[[],["digital creator","media personality","entrepreneur"]],"scene-u-lana":[[],["singer","songwriter","recording artist"]],"scene-u-jungkook":[["BTS"],["singer","songwriter","recording artist"]],"scene-u-tyla":[[],["singer","songwriter","recording artist"]],"dua":[["Radical Optimism","Service95","Service95 Book Club"],["singer","songwriter","recording artist"]],"scene-u-emmaroberts":[["Belletrist"],["actor","producer"]],"scene-u-austinbutler":[[],["actor"]],"scene-rising-53":[[],["singer","songwriter","actor"]],"scene-rising-27":[[],["singer","songwriter","recording artist"]],"scene-rising-18":[[],["singer","songwriter","recording artist"]],"scene-rising-46":[[],["singer","songwriter","recording artist"]],"scene-u-anok":[[],["fashion model","media personality"]],"scene-u-tomholland":[["Spider-Man: Brand New Day","The Brothers Trust"],["actor"]],"scene-u-loganpaul":[["WWE","PRIME"],["digital creator","media personality","entrepreneur"]],"scene-u-ashleygraham":[[],["fashion model","media personality"]],"scene-u-jacksepticeye":[["YouTube gaming"],["digital creator","media personality","entrepreneur"]],"scene-u-travisscott":[["Cactus Jack"],["singer","songwriter","recording artist"]],"scene-u-viola":[["JuVee Productions"],["actor","producer"]],"weeknd":[["XO"],["singer","songwriter","recording artist"]],"scene-rising-14":[[],["singer","songwriter","recording artist"]],"kourtney":[["Poosh","Lemme","The Kardashians"],["media personality","entrepreneur","executive producer"]],"scene-u-drewafualo":[[],["digital creator","media personality","entrepreneur"]],"scene-u-karolg":[[],["singer","songwriter","recording artist"]],"scene-u-leonardo":[["Appian Way Productions"],["actor","producer"]],"scene-rising-35":[[],["singer","songwriter","recording artist"]],"scene-u-wisdom":[[],["digital creator","media personality","entrepreneur"]],"justin":[["SKYLRK"],["singer","songwriter","recording artist"]],"kris":[["Kardashian-Jenner management","The Kardashians"],["media personality","manager","executive producer","entrepreneur"]],"scene-u-ameliagray":[[],["fashion model","media personality"]],"scene-u-jakepaul":[["Most Valuable Promotions"],["digital creator","media personality","entrepreneur"]],"scene-rising-05":[[],["singer","songwriter","recording artist"]],"scene-rising-49":[[],["singer","songwriter","recording artist"]],"scene-rising-25":[[],["actor"]],"scene-u-postmalone":[[],["singer","songwriter","recording artist"]],"scene-u-larray":[[],["digital creator","media personality","entrepreneur"]],"scene-rising-54":[[],["singer","songwriter","actor"]],"margot":[["LuckyChap Entertainment","Wuthering Heights","Barbie legacy"],["actor","producer"]],"scene-rising-47":[[],["singer","songwriter","recording artist"]],"scene-u-cindycrawford":[["Meaningful Beauty"],["fashion model","media personality","entrepreneur"]],"scene-u-markiplier":[[],["digital creator","media personality","entrepreneur"]],"scene-rising-04":[[],["singer","songwriter","recording artist"]],"scene-u-ryangosling":[[],["actor"]],"scene-u-tyra":[[],["fashion model","media personality","entrepreneur"]],"olivia":[["GUTS era"],["singer","songwriter","recording artist"]],"scene-u-jourdandunn":[[],["fashion model","media personality"]],"scene-rising-07":[[],["singer","songwriter","recording artist"]],"scene-rising-45":[[],["singer","songwriter","recording artist"]],"scene-u-mrbeast":[["YouTube","Beast Industries","Feastables"],["digital creator","media personality","entrepreneur"]],"bruno":[["Hello Kitty collaboration","Silk Sonic"],["singer","songwriter","recording artist"]],"scene-u-ishowspeed":[["YouTube"],["digital creator","media personality","entrepreneur"]],"scene-u-cara":[[],["fashion model","media personality"]],"scene-u-anya":[[],["actor"]],"scene-rising-37":[[],["singer","songwriter","recording artist"]],"scene-rising-12":[[],["singer","songwriter","recording artist"]],"scene-rising-58":[["Heartstopper"],["actor"]],"scene-u-scarlett":[[],["actor","producer"]],"scene-rising-43":[[],["singer","songwriter","recording artist"]],"scene-u-ed":[["Gingerbread Man Records"],["singer","songwriter","recording artist"]],"scene-u-emmastone":[["Fruit Tree production company"],["actor","producer"]],"scene-u-emrata":[[],["fashion model","media personality","entrepreneur"]],"scene-rising-36":[[],["singer","songwriter","recording artist"]],"scene-u-charlidamelio":[["D’Amelio Brands"],["digital creator","media personality","entrepreneur"]],"scene-u-tyler":[["Golf Wang","Camp Flog Gnaw"],["singer","songwriter","recording artist"]],"scene-u-samsmith":[[],["singer","songwriter","recording artist"]],"scene-rising-16":[[],["singer","songwriter","recording artist"]],"scene-rising-61":[["Guest in Residence"],["fashion model","media personality","entrepreneur"]],"scene-u-addisonrae":[[],["digital creator","media personality","entrepreneur"]],"scene-rising-08":[[],["singer","songwriter","recording artist"]],"scene-u-paulmescal":[[],["actor"]],"scene-rising-20":[[],["singer","songwriter","recording artist"]],"scene-rising-06":[[],["singer","songwriter","recording artist"]],"scene-u-iman":[["IMAN Cosmetics"],["fashion model","media personality","entrepreneur"]],"scene-u-lisa":[["BLACKPINK"],["singer","songwriter","actor"]],"scene-rising-60":[["The Summer I Turned Pretty"],["actor"]],"scene-u-bretman":[[],["digital creator","media personality","entrepreneur"]],"scene-u-peso":[[],["singer","songwriter","recording artist"]],"miley":[[],["singer","songwriter","actor"]],"doja":[[],["singer","songwriter","recording artist"]],"scene-rising-22":[[],["singer","songwriter","recording artist"]],"selena":[["Rare Beauty","Wondermind"],["singer","songwriter","actor"]],"scene-u-annehathaway":[[],["actor"]],"shakira":[["Las Mujeres Ya No Lloran World Tour","ISIMA","Dai Dai"],["singer","songwriter","actor"]],"scene-rising-38":[[],["singer","songwriter","recording artist"]],"scene-rising-40":[[],["singer","songwriter","recording artist"]],"britney":[[],["singer","songwriter","recording artist"]],"hailey":[["Rhode"],["fashion model","media personality"]],"scene-rising-41":[[],["singer","songwriter","recording artist"]],"scene-u-alexconsani":[[],["fashion model","media personality"]],"badbunny":[[],["singer","songwriter","recording artist"]],"khloe":[["Good American","Khloud Foods","The Kardashians"],["media personality","entrepreneur","executive producer"]],"scene-rising-26":[["The Summer I Turned Pretty"],["actor"]],"scene-u-liamhemsworth":[[],["actor"]],"tatemcrae":[["So Close to What deluxe","Nobody’s Girl","Tit for Tat"],["singer","songwriter","recording artist"]],"harry":[["H.S.","Together, Together Tour","Pleasing"],["singer","songwriter","recording artist"]],"scene-u-khaby":[[],["digital creator","media personality","entrepreneur"]],"scene-u-emmachamberlain":[["Chamberlain Coffee"],["digital creator","media personality","entrepreneur"]],"scene-rising-13":[[],["singer","songwriter","recording artist"]]};/* id -> [public brands/projects from the 183 registry, professions] (read-only copy; registry untouched) */
const BUCKET={
 music:['studio_session','vocal_warmup','writing_session','soundcheck','backstage_prep','stage_lights','tour_rehearsal','hotel_window','setlist'],
 songwriter:['writing_session','piano_corner','guitar_corner','vinyl_listening','studio_session','soundcheck','backstage_prep','tour_bus'],
 indie:['van_load_in','merch_table','soundcheck','band_practice','vinyl_listening','tour_bus','writing_session','coffee_run','backstage_prep'],
 band:['band_practice','van_load_in','merch_table','soundcheck','stage_lights','tour_bus','studio_session','setlist'],
 rap:['studio_booth','studio_session','sneaker_shot','stage_lights','backstage_prep','car_ride','tour_rehearsal'],
 dance:['dance_rehearsal','tour_rehearsal','stage_lights','workout'],
 actor:['set_trailer','script_read','between_takes','costume_fitting','set_makeup','press_day','premiere_night','rehearsal_room','red_carpet'],
 model:['runway_backstage','fitting_room','campaign_shoot','fashion_week','editorial_set','outfit_check','glam_room'],
 creator:['filming_setup','editing_desk','ring_light','coffee_run','outfit_check','city_walk'],
 streamer:['stream_setup','filming_setup','editing_desk'],
 beauty:['ring_light','glam_room','morning_skincare','product_shot'],
 host:['press_day','filming_setup','glam_room'],
 boxer:['boxing_camp','workout','press_day'],
 business:['brand_office','product_shot','brand_launch'],
 life:['coffee_run','golden_hour','home_cozy','book_tea','city_walk','dinner_out','workout','outfit_check','morning_skincare','car_ride','hotel_window','airport_run']
};
const MOODS={music:'studio',songwriter:'indie',indie:'indie',band:'indie',rap:'street',dance:'sporty',actor:'cinema',model:'glam',creator:'street',streamer:'street',beauty:'glam',host:'glam',boxer:'sporty',business:'luxe'};
const PALETTES={studio:[['#1d1b2e','#6b5bd6'],['#14202b','#3fa1c9'],['#2b1a1a','#d0664a']],indie:[['#efe6d6','#7b8b6a'],['#e9e2f0','#7a6a9c'],['#f2e4d4','#b26a4a']],street:[['#e8e8e3','#3a3a3a'],['#fff1b8','#e05a2a'],['#d9f0e6','#2a7a5a']],sporty:[['#e3eef8','#2f6fb0'],['#fff0d0','#e0a020']],cinema:[['#1a1714','#c9a46a'],['#151922','#8aa0c8'],['#20151a','#c27a8a']],glam:[['#fbe3ea','#c7577f'],['#f4e6f2','#9b5aa3'],['#fff0e6','#d07a5a']],luxe:[['#efe6da','#a8854f'],['#e6e0d8','#5a4a3a']],cozy:[['#f3e6dc','#a87a5a'],['#e6efe6','#5a8a6a']]};
const PLACE_BY_BUCKET={music:'studio',songwriter:'writing room',indie:'small venue',band:'practice room',rap:'vocal booth',dance:'dance studio',actor:'set',model:'backstage at the show',creator:'filming setup',streamer:'stream setup',beauty:'glam room',host:'set',boxer:'boxing gym',business:'office'};
const NATION=[[/\bCanadian\b/,'Toronto'],[/\bPuerto Rican\b/,'San Juan'],[/\bAustralian\b/,'Sydney'],[/\bBritish|English|UK\b/,'London'],[/\bIrish\b/,'Dublin'],[/\bColombian\b/,'Medellín'],[/\bSouth African\b/,'Johannesburg'],[/\bNigerian\b/,'Lagos'],[/\bMexican\b/,'Mexico City'],[/\bKorean\b/,'Seoul'],[/\bThai\b/,'Bangkok'],[/\bSpanish\b/,'Barcelona'],[/\bFrench\b/,'Paris'],[/\bNew Zealand/,'Auckland'],[/\bJapanese\b/,'Tokyo']];
function buckets(a){
 const role=String(a.role||'')+' '+((REG[a.id]||[])[1]||[]).join(' '),bio=String(a.personaBio||a.bio||''),r=role.toLowerCase(),b=bio.toLowerCase(),out=[];
 if(/band|group/.test(r))out.push('band','indie');
 if(/rapper|rap\b/.test(r))out.push('rap');
 if(/singer|songwriter|musician|recording artist|performer/.test(r))out.push(/songwriter/.test(r)?'songwriter':'music');
 if(a.sceneRising128&&/singer|songwriter|band/.test(r))out.push('indie');
 if(/dancer|dance/.test(r)||/\bdance|choreograph/.test(b))out.push('dance');
 if(/actor|filmmaker/.test(r))out.push('actor');
 if(/model/.test(r))out.push('model');
 if(/creator|youtuber|influencer/.test(r))out.push('creator');
 if(/streamer/.test(r))out.push('streamer');
 if(/beauty/.test(r)||/\bbeauty|makeup|skincare/.test(b))out.push('beauty');
 if(/host/.test(r))out.push('host');
 if(/boxer/.test(r))out.push('boxer');
 if(/entrepreneur|executive|manager|producer/.test(r)||/\bbrand|business|company/.test(b))out.push('business');
 if(/media personality/.test(r))out.push('host','beauty');
 if(!out.length)out.push(/act/.test(r)?'actor':'creator');
 return uniq(out);
}
function deriveProfile(a){
 const bk=buckets(a),primary=bk[0],reg=REG[a.id]||[[],[]],bio=String(a.personaBio||a.bio||'');
 const projects=uniq((reg[0]||[]).slice(0,4)),brands=bk.includes('business')?projects.slice(0,3):[];/* registry list mixes brands and screen/music projects: only business roles treat them as brands */
 let themes=[];for(const k of bk)themes.push(...BUCKET[k].filter((_,i)=>rnd(a.id,k,i)<.8||i<3));
 const life=BUCKET.life.slice().sort((x,y)=>rnd(a.id,x)-rnd(a.id,y)).slice(0,4);themes.push(...life);
 if(!brands.length)themes=themes.filter(t=>!['brand_office','product_shot','brand_launch'].includes(t)||bk.includes('business'));
 themes=uniq(themes).filter(t=>T[t]&&!REACTIVE.has(t));
 const home=(NATION.find(([re])=>re.test(bio))||[])[1]||(a.sceneRising128&&/british|uk|london/i.test(bio)?'London':'Los Angeles');
 const cities=uniq([home,primary==='model'?'Paris':'',primary==='actor'?'Los Angeles':'',/music|songwriter|indie|band|rap/.test(primary)?'London':'','New York']);
 const mood=MOODS[primary]||'studio',pals=PALETTES[mood]||PALETTES.studio,pal=pals[H(a.id+'pal')%pals.length];
 return {themes,projects,home:home,places:uniq([PLACE_BY_BUCKET[primary],...bk.map(k=>PLACE_BY_BUCKET[k])]),cities,people:bk.includes('band')?['the band']:bk.includes('actor')?['the cast']:['the team'],family:[],brands,aesthetic:{palette:[pal[0],pal[1],'#111111'],mood},curated:false,derivedFrom:{role:a.role||'',buckets:bk}};
}

/* ---------- 2c. Profiles for every character ---------- */
const PROFILES={};
function isStoryChar(a){return a&&a.type==='celeb'&&!a.sceneIndustry128}
function profile(id){
 if(PROFILES[id])return PROFILES[id];
 const a=BY(id);if(!isStoryChar(a))return null;
 const d=deriveProfile(a),c=CUR[id];
 const p=c?{...d,...c,themes:uniq(c.themes).filter(t=>T[t]&&!REACTIVE.has(t)),brands:uniq(c.brands),projects:d.projects,home:HOME[id]||c.cities[0],derivedFrom:d.derivedFrom}:d;
 PROFILES[id]=p;return p;
}
function storyChars(){return ACC().filter(isStoryChar)}
function buildAll(){for(const a of storyChars())profile(a.id);return PROFILES}

/* ---------- 3. Deterministic daily plan ---------- */
const st=()=>ST()||{};
function seed(){const s=st();return G.SCENE_STORIES_SEED!=null?String(G.SCENE_STORIES_SEED):s.player?`${s.player.name||''}|${s.player.handle||''}`:'nosave'}
function today(){return Number(st().sceneDay)||0}
function tierOf(a,p){return p.curated?'A':Number(a.reach||0)>=2e7?'B':'C'}
function countFor(id,day,tier){const r=rnd(seed(),id,day,'n');if(tier==='A')return r<.1?0:r<.45?1:r<.8?2:3;if(tier==='B')return r<.4?0:r<.85?1:2;return r<.72?0:1}
/* in-game day of a timestamp, from the day engine's ledger ({day,at} = the moment that day began) */
function dayOf(t){const L=(st().dayLedger92||[]).filter(x=>x&&Number.isFinite(x.at)).sort((x,y)=>y.at-x.at);for(const x of L)if(t>=x.at)return Number(x.day)||0;return 0}
function memory(){return Array.isArray(st().memory)?st().memory:[]}
/* city the player was in at the end of day d (from real travel memories), else current/home city */
function playerCityOn(d){const tr=memory().filter(m=>m&&m.type==='travel'&&m.city&&Number.isFinite(m.at)).sort((x,y)=>x.at-y.at);let c='';for(const m of tr)if(dayOf(m.at)<=d)c=m.city;return c||(d>=today()?(st().player?.city||''):'')||st().homeCity||'Los Angeles'}
const baseMemo=new Map();/* key seed|id -> array[day] of theme lists */
function baseThemes(id,day){
 const p=profile(id),a=BY(id);if(!p||!a)return[];
 const key=seed()+'|'+id+'|'+p.themes.length;let arr=baseMemo.get(key);if(!arr){arr=[];baseMemo.set(key,arr)}
 for(let d=arr.length;d<=day;d++){
  const avoid=new Set([...(arr[d-1]||[]),...(arr[d-2]||[])]),n=countFor(id,d,tierOf(a,p)),out=[];
  for(let i=0;i<n;i++){const cand=p.themes.filter(t=>!avoid.has(t)&&!out.includes(t));if(!cand.length)break;out.push(pickBy(cand,seed(),id,d,i,'t'))}
  arr[d]=out;
 }
 return arr[day]||[];
}
function relOf(id){return (st().relations||{})[id]||{}}
function postSnippet(postId){const p=(st().posts||[]).find(x=>x&&x.id===postId);if(!p||p.authorId!=='player')return null;return String(p.text||'').replace(/\s+/g,' ').trim().slice(0,60)}
function celebByName(n){const s=String(n||'').toLowerCase().trim();if(!s)return null;return storyChars().find(a=>a.id.toLowerCase()===s||String(a.name).toLowerCase()===s)||null}
/* raw reactive candidates per day from REAL memories only */
function reactiveRaw(){
 const out=new Map(),add=(d,r)=>{if(!out.has(d))out.set(d,[]);out.get(d).push(r)},pl=st().player||{};
 for(const m of memory().slice().sort((x,y)=>(x.at||0)-(y.at||0))){
  if(!m||!Number.isFinite(m.at))continue;const d=dayOf(m.at);
  if(m.type==='hangout'&&profile(m.celebrityId)){const close=(Number(relOf(m.celebrityId).friendship)||0)>=40;add(d,{charId:m.celebrityId,theme:close?'hangout_with_player':'hangout_place',slots:close?{player:pl.name||'',city:m.city||''}:{city:m.city||''},src:m})}
  else if((m.type==='verified_comment'||m.type==='verified_public')&&m.positive!==false&&m.postId&&profile(m.celebrityId)){const sn=postSnippet(m.postId);if(sn!=null)add(d,{charId:m.celebrityId,theme:'reshare_player_post',slots:{player:pl.name||'',playerHandle:pl.handle?'@'+pl.handle:'',postSnippet:sn},src:m})}
  else if(m.type==='player_created_opportunity_confirmed'&&profile(m.celebrityId)){add(d,{charId:m.celebrityId,theme:'collab_day',slots:{player:pl.name||'',project:String(m.proposalType||'').replace(/_/g,' ')},src:m})}
  else if(m.type==='gig'){const c=celebByName(m.client);if(c&&profile(c.id))add(d,{charId:c.id,theme:'gig_shoutout',slots:{player:pl.name||'',gig:String(m.title||'')},src:m})}
 }
 return out;
}
function reactiveByDay(){
 const raw=reactiveRaw(),days=[...raw.keys()].sort((a,b)=>a-b),kept=new Map();
 for(const d of days){const list=[],seen=new Set();for(const r of raw.get(d)){const k=r.charId+'|'+r.theme;if(seen.has(k))continue;const prev=[...(kept.get(d-1)||[]),...(kept.get(d-2)||[])].some(x=>x.charId===r.charId&&x.theme===r.theme);if(prev)continue;seen.add(k);list.push(r)}kept.set(d,list)}
 return kept;
}
/* a profile place is only used where it fits the theme (no 'golden hour' in the glam room) */
const PLACE_FIT={jet_travel:/jet/i,golden_hour:/malibu|balcony|beach|coast|barbados|hawaii|calabasas|garden|san juan/i,beach_day:/beach|malibu|coast|barbados|hawaii/i,city_walk:/^(calabasas|queens|the bronx|brooklyn|toronto|london|stratford|san juan|barranquilla|houston|seoul|bangkok|greenville|suffolk|calgary|st\. louis|missouri|new york)$/i,dinner_out:/dinner/i,workout:/gym/i,football_watch:/stadium|pitch/i,courtside:/courtside|garden/i,studio_session:/studio/i,outfit_check:/closet|mirror/i};
function fillSlots(p,a,theme,d,i,extra){
 const want=T[theme][3],s={name:a.name,first:String(a.name).split(' ')[0]};
 for(const k of want){
  if(k==='city'&&theme==='hometown'){s.city=p.home||p.cities[0]}
  else if(k==='city'){const pc=playerCityOn(d);s.city=(p.cities.includes(pc)&&rnd(seed(),a.id,d,i,'pc')<.5)?pc:pickBy(p.cities,seed(),a.id,d,i,'city')}
  else if(k==='place'){const re=PLACE_FIT[theme],pl=re?p.places.filter(x=>x!==T[theme][2]&&re.test(x)):[];if(pl.length)s.place=pickBy(pl,seed(),a.id,d,i,'pl')}
  else if(k==='brand'&&p.brands.length)s.brand=pickBy(p.brands,seed(),a.id,d,i,'br');
  else if(k==='person'){const fam=/^family_|^sisters_|^cooking$/.test(theme)?p.family:p.people;if(fam.length)s.person=pickBy(fam,seed(),a.id,d,i,'pe')}
  else if(k==='project'&&p.projects&&p.projects.length)s.project=pickBy(p.projects,seed(),a.id,d,i,'pr');
 }
 if(s.place&&s.city&&!extra)delete s.city;/* one location per story: a named place wins over a city */
 Object.assign(s,extra||{});for(const k of Object.keys(s))if(s[k]==null||s[k]==='')delete s[k];
 return s;
}
const imgOk=new Map();/* path -> true|false (probed at runtime) */
function storyImages(id){const R=G.SCENE_REAL_PHOTOS;if(!R)return[];let list=null;if(typeof R==='object'){list=(R.stories&&R.stories[id])||(R[id]&&R[id].stories)||null}if(!Array.isArray(list))list=[1,2,3].map(n=>`./avatars/preview/stories/${id}/${n}.jpg`);return list.filter(x=>imgOk.get(x)===true)}
function avatarImage(id){if(!G.SCENE_REAL_PHOTOS)return'';const R=G.SCENE_REAL_PHOTOS,p=(typeof R==='object'&&R.avatars&&R.avatars[id])||`./avatars/preview/${id}.jpg`;return imgOk.get(p)===true?p:''}
function makeStory(a,p,theme,d,i,extra,src){
 const t=T[theme],slots=fillSlots(p,a,theme,d,i,extra),id=`s229-${a.id}-${d}-${theme}`,hour=src?Math.min(23,8+Math.floor(rnd(id,'h')*14)):8+Math.floor(rnd(seed(),id,'h')*15);
 const pal=p.aesthetic.palette,scene={kind:t[0],emoji:t[1],place:slots.place||(theme==='city_walk'||theme==='hometown'||theme==='hangout_place'?slots.city||t[2]:t[2]),palette:pal.slice(0,3),mood:p.aesthetic.mood};
 const imgs=storyImages(a.id);if(imgs.length)scene.image=imgs[H(id)%imgs.length];const av=avatarImage(a.id);if(av)scene.avatar=av;
 return {id,charId:a.id,theme,captionKey:'story.'+theme,slots,scene,day:d,ttl:1,hour,minute:Math.floor(rnd(id,'m')*60),reactive:Boolean(src),source:src?{type:src.type,memoryId:src.id||''}:null,curated:Boolean(p.curated)};
}
const planMemo=new Map();
function sig(){const m=memory();return [seed(),Object.keys(PROFILES).length,m.length,m[0]&&m[0].id,(st().dayLedger92||[]).length,st().player?.city||'',G.SCENE_REAL_PHOTOS?imgOk.size:0].join('|')}
function plan(d){
 d=Number.isFinite(+d)?+d:today();const k=sig()+'#'+d;if(planMemo.has(k))return planMemo.get(k);
 if(planMemo.size>40)planMemo.clear();
 buildAll();const react=reactiveByDay().get(d)||[],out=[];
 for(const a of storyChars()){
  const p=profile(a.id);if(!p)continue;
  const rs=react.filter(r=>r.charId===a.id).slice(0,3),list=rs.map((r,i)=>makeStory(a,p,r.theme,d,i,r.slots,r.src));
  for(const [i,th] of baseThemes(a.id,d).entries()){if(list.length>=3)break;if(list.some(x=>x.theme===th))continue;list.push(makeStory(a,p,th,d,i))}
  out.push(...list);
 }
 out.sort((x,y)=>(y.reactive-x.reactive)||(x.hour*60+x.minute)-(y.hour*60+y.minute));
 planMemo.set(k,out);return out;
}
/* captions: Writer bank first (window.SCENE_STORY_CAPTIONS[captionKey] = array of strings with {slot} tokens, or fn(story)), else neutral placeholder */
function captionFor(s){
 const bank=G.SCENE_STORY_CAPTIONS&&G.SCENE_STORY_CAPTIONS[s.captionKey],fill=x=>String(x).replace(/\{(\w+)\}/g,(m,k)=>s.slots[k]!=null?s.slots[k]:'\u0000');
 try{if(typeof bank==='function'){const v=bank(s);if(v&&!/\{\w+\}/.test(v))return String(v)}
  if(Array.isArray(bank)&&bank.length){const ok=bank.map(fill).filter(x=>x.trim()&&!x.includes('\u0000'));if(ok.length)return ok[H(s.id)%ok.length]}}catch{}
 return T[s.theme][4];
}

/* ---------- 4. Hook into the existing tray (state.stories) without changing its shape ---------- */
const TRAY_MAX=18;
function trayItem(s,ago){return{id:s.id,authorId:s.charId,createdAt:NOW()-(ago||0),caption:captionFor(s),media:'',seen:false,scene:s.scene.kind,captionPos:'low',sticker:'',story229:{id:s.id,theme:s.theme,captionKey:s.captionKey,day:s.day,seed:H(seed())}}}
function priority(s){const r=relOf(s.charId),fol=(st().followingIds||[]).includes(s.charId);return (s.reactive?1000:0)+(fol?200:0)+(Number(r.friendship)||0)+(s.curated?50:0)+rnd(s.id,'pri')*10}
function publishedIds(){const set=new Set();for(const x of st().stories||[])if(x&&x.story229)set.add(x.story229.id);return set}
/* a story counts as already shown if it, or a later story by the same author that day, is in the tray */
function alreadyShown(s,tray){return tray.some(x=>x.story229&&(x.story229.id===s.id||(x.authorId===s.charId&&x.story229.day===s.day&&(()=>{const o=plan(s.day).find(y=>y.id===x.story229.id);return o&&(o.hour*60+o.minute)>=(s.hour*60+s.minute)})())))}
function publish(n,reason){
 const S=ST();if(!S||!S.player||!Array.isArray(S.stories))return[];
 const d=today(),tray=S.stories,todays=plan(d).filter(s=>!alreadyShown(s,tray)).sort((x,y)=>priority(y)-priority(x)),added=[];
 for(const s of todays){if(added.length>=n)break;if(added.some(x=>x.charId===s.charId))continue;S.stories=S.stories.filter(x=>x.authorId!==s.charId);S.stories.unshift(trayItem(s,added.length*60000));added.push(s)}
 S.stories=S.stories.slice(0,TRAY_MAX);
 if(added.length){try{save()}catch{}emit(reason||'publish',added.map(s=>s.id))}
 return added;
}
/* boot / day change: drop expired v229 items, legacy random items and items from another save seed, then fill the tray */
function syncTray(reason){
 const S=ST();if(!S||!S.player)return;if(!Array.isArray(S.stories))S.stories=[];
 const d=today(),me=H(seed()),before=S.stories.length;
 S.stories=S.stories.filter(x=>x&&x.story229&&x.story229.seed===me&&x.story229.day+1>d&&T[x.story229.theme]);
 const removed=before-S.stories.length,live=S.stories.filter(x=>x.story229.day===d).length;
 const added=publish(Math.max(0,10-live),reason);
 if(removed&&!added.length){try{save()}catch{}emit(reason,[])}
}
let lastEmitSig='';
function emit(reason,ids){const d=today();lastEmitSig=sig()+'#'+d;try{G.dispatchEvent(new CustomEvent('scene:stories-changed',{detail:{day:d,reason,added:ids||[],count:plan(d).length}}))}catch{}}
/* re-draw the feed's story row once late-registered characters exist (boot) or the tray changed; never while a modal/sheet is open or the user is typing */
function refreshTray(){try{const S=ST(),m=typeof modal!=='undefined'?modal:null;if(!S||!S.player||S.tab!=='feed'||(m&&m.innerHTML)||/^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName||''))return;if(typeof render==='function')render()}catch{}}
G.addEventListener('scene:stories-changed',e=>{if(e.detail&&e.detail.reason!=='images')refreshTray()});
/* ---------- 5. Optional runtime image lookup (sibling's public/avatars/preview, behind window.SCENE_REAL_PHOTOS) ---------- */
let probing=false;
function probeImages(){
 if(!G.SCENE_REAL_PHOTOS||probing||typeof Image==='undefined')return;probing=true;
 const ids=uniq(plan(today()).map(s=>s.charId)),paths=[];
 for(const id of ids){const R=G.SCENE_REAL_PHOTOS;let list=typeof R==='object'?((R.stories&&R.stories[id])||(R[id]&&R[id].stories)):null;if(!Array.isArray(list))list=CUR[id]?[1,2,3].map(n=>`./avatars/preview/stories/${id}/${n}.jpg`):[];paths.push(...list,(typeof R==='object'&&R.avatars&&R.avatars[id])||`./avatars/preview/${id}.jpg`)}
 const todo=paths.filter(p=>!imgOk.has(p));let left=todo.length;if(!left){probing=false;return}
 for(const p of todo){const im=new Image();const done=ok=>{imgOk.set(p,ok);if(--left===0){probing=false;planMemo.clear();emit('images',[])}};im.onload=()=>done(true);im.onerror=()=>done(false);im.src=p}
}
/* ---------- 6. Default card paint (minimal; UI/UX may replace: set window.SCENE_STORIES229_RENDER=false) ---------- */
function esc229(x){return String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function paint(){
 if(G.SCENE_STORIES229_RENDER===false)return;const S=ST();const m=typeof modal!=='undefined'?modal:null;if(!S||!m)return;
 const it=S.stories&&S.stories[typeof storyIndex!=='undefined'?storyIndex:-1],box=m.querySelector('.storyscreen');if(!it||!it.story229||!box||box.querySelector('.s229-card'))return;
 const s=plan(it.story229.day).find(x=>x.id===it.story229.id);if(!s)return;
 const [a,b,c]=s.scene.palette;box.classList.add('s229');box.dataset.storyKind=s.scene.kind;box.dataset.storyMood=s.scene.mood;
 const back=box.querySelector('.storytextback');if(back)back.style.background=`linear-gradient(160deg,${a} 0%,${b} 62%,${c||'#111'} 100%)`;
 const hasPhoto=box.querySelector('img.storyimage');
 if(!hasPhoto&&s.scene.image)back&&back.insertAdjacentHTML('afterend',`<img class="storyimage story-photo s229-img" src="${esc229(s.scene.image)}" alt="" onerror="this.remove()">`);
 /* the viewer's own .storycaption (immersion-v39) already shows the caption: no second copy */
 const card=`<div class="s229-card" style="position:absolute;left:0;right:0;top:34%;display:flex;flex-direction:column;align-items:center;gap:10px;pointer-events:none;z-index:2;color:#fff;text-shadow:0 2px 12px rgba(0,0,0,.35)">${hasPhoto||s.scene.image?'':`<span style="font-size:76px;line-height:1">${s.scene.emoji}</span><small style="letter-spacing:.14em;text-transform:uppercase;font-size:11px;opacity:.85">${esc229(s.scene.place)}</small>`}${box.querySelector('.storycaption')?'':`<b class="s229-caption" style="font-size:20px;font-weight:600;max-width:80%;text-align:center">${esc229(it.caption||captionFor(s))}</b>`}</div>`;
 box.insertAdjacentHTML('beforeend',card);
}
/* ---------- 7. Public API ---------- */
G.SCENE_STORY_PROFILES=new Proxy(PROFILES,{get:(o,k)=>typeof k==='string'&&!(k in o)?profile(k)||undefined:o[k],ownKeys:o=>{buildAll();return Reflect.ownKeys(o)},getOwnPropertyDescriptor:(o,k)=>{if(!(k in o))profile(k);return Reflect.getOwnPropertyDescriptor(o,k)}});
G.SCENE_STORIES={version:229,themes:T,reactiveThemes:[...REACTIVE],
 today:()=>plan(today()).map(s=>({...s,caption:captionFor(s)})),
 forChar:(id,day)=>plan(day==null?today():day).filter(s=>s.charId===id).map(s=>({...s,caption:captionFor(s)})),
 forDay:d=>plan(d).map(s=>({...s,caption:captionFor(s)})),
 profile,profiles:()=>buildAll(),captionFor,publish:(n=1)=>publish(n,'manual'),sync:()=>syncTray('manual'),
 debug:()=>({seed:seed(),day:today(),profiles:Object.keys(buildAll()).length,curated:Object.keys(CUR).filter(id=>PROFILES[id]).length,today:plan(today()).length,tray:(st().stories||[]).filter(x=>x.story229).length})};
/* ---------- 8. Install wrappers ---------- */
if(typeof updateStories==='function'){const base229=updateStories;updateStories=function(){if(G.SCENE_STORIES229_OFF)return base229.apply(this,arguments);const S=ST();if(!S||!S.player)return base229.apply(this,arguments);const out=publish(rnd(seed(),today(),NOW()>>16,'k')<.4?2:1,'tick');try{setTimeout(()=>void G.SCENE_MEDIA101?.hydrateStories?.(8),50)}catch{}return out}}
if(typeof makeStories==='function'){const baseMake229=makeStories;makeStories=function(){if(G.SCENE_STORIES229_OFF)return baseMake229.apply(this,arguments);try{return plan(0).sort((x,y)=>priority(y)-priority(x)).filter((s,i,arr)=>arr.findIndex(z=>z.charId===s.charId)===i).slice(0,10).map((s,i)=>trayItem(s,i*5*60000))}catch{return baseMake229.apply(this,arguments)}}}
if(typeof drawStory==='function'){const baseDraw229=drawStory;drawStory=function(){const r=baseDraw229.apply(this,arguments);try{paint()}catch{}return r}}
if(typeof G.SCENE_advanceDay==='function'){const baseAdv229=G.SCENE_advanceDay;G.SCENE_advanceDay=function(){const r=baseAdv229.apply(this,arguments);try{syncTray('day')}catch{}return r};if(G.SCENE_DAY92)G.SCENE_DAY92.advance=G.SCENE_advanceDay}
setTimeout(()=>{try{syncTray('boot');refreshTray();probeImages()}catch(e){console.warn('stories229',e)}},900);
setInterval(()=>{try{const S=ST();if(!S||!S.player||document.hidden)return;const k=sig()+'#'+today();if(k===lastEmitSig)return;const tr=S.stories||[];if(tr.some(x=>x.story229&&x.story229.seed!==H(seed()))||!tr.some(x=>x.story229&&x.story229.day===today()))syncTray('changed');else{const r=plan(today()).filter(s=>s.reactive&&!alreadyShown(s,tr));if(r.length)publish(r.length,'event');else emit('changed',[])}probeImages()}catch{}},4000);
})();
