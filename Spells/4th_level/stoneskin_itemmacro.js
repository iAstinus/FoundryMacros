const casterToken = canvas.tokens.get(args[0].tokenId);
if (!casterToken) {
    ui.notifications.warn("Please select a valid token to use this ability.");
    return;
}

let sequence = new Sequence()
    .effect()
        .file("jb2a.extras.tmfx.runes.circle.outpulse.abjuration")
        .atLocation(casterToken)
        .duration(2000)
        .fadeIn(500)
        .fadeOut(500)
        .scale(0.5)
        .waitUntilFinished(500)
        .filter("Glow", { color: 0xffffbf })
    .effect()
        .file("jb2a.impact.orange.10")
        .scale(0.8)
        .atLocation(casterToken)
        .fadeIn(500)
        .waitUntilFinished()
    

let arrayLength = game.user.targets.size;

if (arrayLength > 0) {
    for (let i = 0; i < arrayLength; i++) {
        let targetToken = Array.from(game.user.targets)[i];
        sequence
            .effect()
                .file("jb2a.markers.shield_rampart.complete.01.orange")
                .delay(200)
                .fadeIn(300)
                .scaleToObject(1.4)
                .opacity(0.7)
                .atLocation(targetToken)
    }
}

//play animation
sequence.play()