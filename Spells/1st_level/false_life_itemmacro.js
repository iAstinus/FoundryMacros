// declaring caster token
const casterToken = canvas.tokens.get(args[0].tokenId);
if (!casterToken) {
    ui.notifications.warn("Please select a valid token to use this ability.");
    return;
}

// animation
new Sequence()
    .effect()
        .file("jb2a.extras.tmfx.runes.circle.inpulse.necromancy")
        .atLocation(casterToken)
        .duration(3000)
        .fadeIn(500)
        .fadeOut(500)
        .scale(0.5)
        .opacity(0.7)
        .waitUntilFinished(250)
        .filter("Glow", { color: 0xcf2fe4 })
        .scaleIn(0, 500, {ease: "easeOutCubic", delay: 100})
    .effect()
        .file("jb2a.energy_strands.in.purple.01.0")
        .atLocation(casterToken)
        .scaleToObject(1.5)
        .fadeIn(100)
        .fadeOut(200)
        .duration(1200)
        .waitUntilFinished(250)
    .effect()
        .file("jb2a.impact.003.dark_purple")
        .atLocation(casterToken)
        .fadeIn(100)
        .fadeOut(200)
        .scale(1)
        .repeats(2)
.play()