// ItemMacro before targeting complete

////////////////////////////////////////////////////////////////////
//Configuration variables
////////////////////////////////////////////////////////////////////

const maxDistance = 5;          //Max detection distance in ft
const includeFriendly = true;   //Count friendly tokens
const includeNeutral = true;    //Count neutral tokens
const includeHostile = true;     //Count hostile tokens
const includeHidden = true;     //Count hidden tokens
const checkLOS = true;

const debug = false;             //Print debug info if set to true

let disposition = -1;
let nearbyTokens = [];

// Calculating disposition and adding tokens to target list
if (includeHostile) {
    disposition = -1;
    nearbyTokens = nearbyTokens.concat(MidiQOL.findNearby(disposition, args[0].tokenUuid, maxDistance));
};

if (includeNeutral) {
    disposition = 0;
    nearbyTokens = nearbyTokens.concat(MidiQOL.findNearby(disposition, args[0].tokenUuid, maxDistance));
};

if (includeFriendly) {
    disposition = 1
    nearbyTokens = nearbyTokens.concat(MidiQOL.findNearby(disposition, args[0].tokenUuid, maxDistance));
};

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
// much easier "canvas.sight.testVisibility(target, {object: self})" is not working 
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

new Sequence()
    .effect()
        .file("jb2a.markers.02.red")
        .delay(200)
        .fadeIn(300)
        .fadeOut(1000)
        .scaleToObject(3)
        .atLocation(args[0].tokenId)
        .duration(3500)
        .opacity(0.5)
        .effect()
    .file("jb2a.markers.01.red")
        .delay(200)
        .fadeIn(300)
        .fadeOut(500)
        .scaleToObject(2)
        .atLocation(args[0].tokenId)
        .duration(3500)
        .belowTokens()
        .waitUntilFinished()
        .animateProperty("sprite", "rotation", { from: 0, to: 360, duration: 4000, ease: "easeInOutCubic"})
.play();
