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

new Sequence()
    .effect()
        .file("jb2a.extras.tmfx.runes.circle.simple.abjuration")
        .atLocation(casterToken)
        .fadeIn(500)
        .scaleIn(0, 300, {ease: "easeOutCubic"})
        .scaleToObject(1.5)
        .duration(2000)
        .fadeOut(500)
        .filter("Glow", { color: 0xfadadd })
        .waitUntilFinished(-1000)
    .effect()
        .file("jb2a.energy_strands.overlay.blue.01")
        .atLocation(casterToken)
        .fadeIn(500)
        .scaleToObject(1.5)
        .duration(2000)
        .fadeOut(500)
    .effect()
        .file("jb2a.cure_wounds.400px.blue")
        .atLocation(casterToken)
        .fadeIn(500)
        .fadeOut(500)
        .scaleToObject(1.5)
        .belowTokens()
        .duration(2500)
        .waitUntilFinished(-1000)
    .effect()
        .file("jb2a.impact.003.blue")
        .atLocation(target)
        .scaleToObject(3)
        .fadeIn(500)
    .effect()
        .file("jb2a.healing_generic.loop.bluewhite")
        .atLocation(target)
        .fadeIn(500)
        .fadeOut(500)
        .scaleToObject(2)
        .belowTokens()
        .opacity(0.5)    
.play();