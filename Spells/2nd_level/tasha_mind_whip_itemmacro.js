// declaring targets and caster tokens
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
let arrayLength = game.user.targets.size;

// primary animation of caster
let sequence = new Sequence()
        .effect()
            .file("jb2a.extras.tmfx.runes.circle.outpulse.enchantment")
            .atLocation(casterToken)
            .duration(4000)
            .fadeIn(500)
            .fadeOut(500)
            .scale(0.5)
            .waitUntilFinished(-2000)
            .filter("Glow", { color: 0xfadadd })

// secondary animation on targets
for (let i = 0; i < arrayLength; i++) {
    let targetId = Array.from(game.user.targets)[i];
    sequence
        .effect()
            .file("jb2a.moonbeam.01.outro.rainbow") // impact
            .atLocation(targetId)
            .fadeIn(1500)
            .scaleToObject(1.2)
            .waitUntilFinished(-750)
        .effect()
            .file("jb2a.melee_generic.slash.01.bluepurple.2") // main animation
            // .fadeIn(1000)
            .repeats(3, 500, 1000)
            // .fadeOut(1000)
            .scaleToObject(2)
            .atLocation(targetId)
            .randomRotation()
}

//play animation
sequence.play()