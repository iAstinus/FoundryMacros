// ItemMacro before targeting complete

////////////////////////////////////////////////////////////////////
//Configuration variables
////////////////////////////////////////////////////////////////////

const maxDistance = 30;          //Max detection distance in ft
const includeFriendly = false;   //Count friendly tokens
const includeNeutral = false;    //Count neutral tokens
const includeHostile = true;     //Count hostile tokens
const includeHidden = true;     //Count hidden tokens
const checkLOS = true;

const debug = false;             //Print debug info if set to true

let disposition = -1;

// Calculating disposition, currently works only for one type of token
if (includeHostile) {
    disposition = -1;
} else if (includeNeutral) {
    disposition = 0;
} else if (includeFriendly) {
    disposition = 1
};

// Getting array of nearby tokens:
let nearbyTokens = MidiQOL.findNearby(disposition, args[0].tokenUuid, maxDistance);

if (debug) {
    console.log(nearbyTokens);
}

// in case we target only visible tokens:
if (!includeHidden) {
    nearbyTokens = nearbyTokens.filter(function (el) {
        return !el.document.hidden 
    })
};

if (debug) {
    console.log(nearbyTokens);
}

// checking for line of sight
// much easier "canvas.sight.testVisibility(target, {object: self})" is not working for me 
// probably deprecated in v10
if (checkLOS) {
    nearbyTokens = nearbyTokens.filter(function (el) {
        return new CanvasVisibility().testVisibility(game.canvas.tokens.get(el.id), {object: game.canvas.tokens.get(args[0].tokenId)})
    })
};

if (debug) {
    console.log(nearbyTokens);
}

// finally, targeting tokens for current user
game.user.updateTokenTargets(nearbyTokens.map(a => a.id));

await Sequencer.Preloader.preloadForClients(
    ["jb2a.extras.tmfx.inpulse.circle.03",
        "jb2a.energy_strands.complete.orange.01",
        "jb2a.icon.fear.orange"
    ], false)


const casterToken = canvas.tokens.get(args[0].tokenId);

if (!casterToken) {
    ui.notifications.warn("Please select a valid token to use this ability.");
    return;
}

let target = Array.from(game.user.targets)[0];

//To do - checking for if target saves or not.
//let targetSave = args[0].saves.length === 1;

new Sequence()

.effect()
    .file("jb2a.extras.tmfx.inpulse.circle.03")
    .atLocation(casterToken)
    .filter("Glow", { color: 0xFFC300 })
    .duration(2000)
    .scale(0.8)
    .belowTokens()
    .waitUntilFinished(-500)

.effect()
    .file("jb2a.energy_strands.complete.orange.01")
    .atLocation(casterToken)
    .duration(2500)
    .fadeIn(500)
    .fadeOut(300)
    .scale(0.8)
    .waitUntilFinished(-500)

.effect()
    .file("jb2a.icon.fear.orange")
    .atLocation(casterToken)
    .duration(2500)
    .fadeIn(500)
    .fadeOut(300)
    .scaleToObject(1.4)
    .waitUntilFinished(-500)

.play()