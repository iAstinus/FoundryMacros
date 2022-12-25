// credits to Tyreal74
//edited to be more in line with other effects
// on use itemmacro after active effects

const casterToken = canvas.tokens.get(args[0].tokenId);
if (!casterToken) {
    ui.notifications.warn("Please select a valid token to use this ability.");
    return;
}
const target = game.user.targets.first();
if (!target) {
    ui.notification.warn("This spell requires at least one valid target.");
    return;
}

let sequence = new Sequence()
    .effect()
        .file("jb2a.moonbeam.01.intro.rainbow")
        .atLocation(casterToken)
        .fadeIn(100)
        .fadeOut(500)
        .duration(1200) 
    .effect()
        .file("jb2a.extras.tmfx.runes.circle.outpulse.transmutation")
        .atLocation(casterToken)
        .duration(2000)
        .fadeIn(500)
        .fadeOut(500)
        .scale(0.5)
        .waitUntilFinished(-500)
        .filter("Glow", { color: 0xffffbf })

let targetsLength = game.user.targets.size;

for (let i = 0; i < targetsLength; i++) {
    let targetId = Array.from(game.user.targets)[i];
    sequence
        .effect()
            .file("jb2a.impact.007.yellow")
            .fadeIn(100)
            .fadeOut(100)
            .scale(0.4, 0.45)
            .atLocation(targetId)
            .randomRotation()
}

sequence.play()