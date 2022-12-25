// declaring targets and caster tokens
const casterToken = canvas.tokens.get(args[0].tokenId);
if (!casterToken) {
    ui.notifications.warn("Please select a valid token to use this ability.");
    return;
}

// primary animation of caster
let sequence = new Sequence()
    .effect()
        .file("jb2a.extras.tmfx.runes.circle.inpulse.abjuration")
        .atLocation(casterToken)
        .duration(2000)
        .fadeIn(500)
        .fadeOut(500)
        .scale(0.5)
        .opacity(0.3)
        .filter("Glow", { color: 0xffffff })
        .scaleIn(0, 500, {ease: "easeOutCubic", delay: 100})
    .effect()
        .file("jb2a.moonbeam.01.intro.blue")
        .atLocation(casterToken)
        .fadeIn(100)
        .fadeOut(200)
        .duration(1200)
        .waitUntilFinished(-250)
    .effect()
        .file("jb2a.impact.003.blue")
        .atLocation(casterToken)
        .fadeIn(100)
        .fadeOut(200)
        .scale(1)
        .repeats(2)

let arrayLength = game.user.targets.size;
if (arrayLength > 0) {
    for (let i = 0; i < arrayLength; i++) {
        let targetToken = Array.from(game.user.targets)[i];
        sequence
            .effect()
                .file("jb2a.impact.003.blue")
                .atLocation(targetToken)
                .fadeIn(100)
                .fadeOut(200)
                .scale(1)
    }
}

//play animation
sequence.play()