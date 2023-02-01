const casterToken = canvas.tokens.get(args[0].tokenId);
if (!casterToken) {
    ui.notifications.warn("Please select a valid token to use this ability.");
    return;
}

const targets = game.user.targets.toObject();

new Sequence()
    .effect()
        .file("jb2a.extras.tmfx.runes.circle.outpulse.evocation")
        .atLocation(casterToken)
        .duration(2000)
        .fadeIn(500)
        .fadeOut(500)
        .scale(0.5)
        .opacity(0.8)
        .filter("Glow", { color: 0xffffff })
        .scaleIn(0, 500, { ease: "easeOutCubic", delay: 100 })
    .effect()
        .file("jb2a.smoke.puff.centered.dark_black")
        .atLocation(casterToken)
        .fadeIn(500)
        .fadeOut(500)
        .scale(0.5)
        .randomRotation()
.play()

if (targets.length > 0) {
    for (var i = 0; i < targets.length; i++) {

        new Sequence()
            .effect()
                .file("jb2a.magic_missile")
                .atLocation(casterToken)
                .stretchTo(targets[i])
                .repeats(3, 200, 200)
                .randomizeMirrorY()
            .play()
    }
}