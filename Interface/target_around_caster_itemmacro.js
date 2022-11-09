// ItemMacro before targeting complete

////////////////////////////////////////////////////////////////////
//Configuration variables
////////////////////////////////////////////////////////////////////

const maxDistance = 60;          //Max detection distance in ft
const includeFriendly = false;   //Count friendly tokens
const includeNeutral = false;    //Count neutral tokens
const includeHostile = true;     //Count hostile tokens
const includeHidden = false;     //Count hidden tokens
const checkLOS = true;

const debug = true;             //Print debug info if set to true

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
// much easier "canvas.sight.testVisibility(target, {object: self})", probably deprecated in v10
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
