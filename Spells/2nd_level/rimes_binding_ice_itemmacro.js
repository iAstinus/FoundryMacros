const casterToken = canvas.tokens.get(args[0].tokenId);
if (!casterToken) {
    ui.notifications.warn("Please select a valid token to use this ability.");
    return;
};

new Sequence()
    .effect()
        .file("jb2a.plant_growth.01.ring.4x4.complete.bluepurple")
        .scaleToObject(2)
        .atLocation(casterToken)
        .fadeIn(500)
        .fadeOut(500)
        .duration(2000)
        .belowTokens()
        .waitUntilFinished(-1000)
    .effect()
        .file("jb2a.extras.tmfx.runes.circle.outpulse.conjuration")
        .atLocation(args[0].tokenId)
        .duration(2800)
        .fadeIn(500)
        .fadeOut(500)
        .scale(0.5)
        .filter("Glow", { color: 0xb1b4f0 })
        .opacity(0.8)
    .play()