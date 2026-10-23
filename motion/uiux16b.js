/* uiux16b · two tester fixes on top of the uiux16 glass skin: glossy gold→pink DM Send button, and DM tapback badges moved
   just outside the bubble's corner (sent + received). Loads motion/uiux16b.css itself; all rules are scoped under html.u16b.
   Kill switch: window.SCENE_UIUX16B_OFF = true. */
(function(){
'use strict';
if (window.SCENE_UIUX16B_OFF === true || window.SCENE_UIUX16B) return;
window.SCENE_UIUX16B = { version: 1 };
document.documentElement.classList.add('u16b');
var l = document.createElement('link'); l.id = 'uiux16b-css'; l.rel = 'stylesheet'; l.href = './motion/uiux16b.css?v=uiux16b-1';
(document.head || document.documentElement).appendChild(l);
})();
