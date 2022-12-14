// credits to Tyreal74
const casterToken = canvas.tokens.get(args[0].tokenId);
if (!casterToken) {
    ui.notifications.warn("Please select a valid token to use this ability.");
    return;
}
new Sequence()
    .effect()
        .file("jb2a.extras.tmfx.runes.circle.inpulse.abjuration")
        .atLocation(casterToken)
        .duration(2000)
        .fadeIn(500)
        .fadeOut(500)
        .scale(0.5)
        .opacity(0.3)
        .filter("Glow", { color: 0xf9e076 })
        .scaleIn(0, 500, {ease: "easeOutCubic", delay: 100})
    .effect()
        .file("jb2a.markers.light.intro.yellow")
        .atLocation(casterToken)
        .fadeIn(100)
        .fadeOut(200)
        .scaleToObject(2)
        .waitUntilFinished(-500)
    .play()

//NOTE: This needs to go into the effect's macro.execute property, rather than midi's 'On Item Use' field.

let tokenD = canvas.tokens.get(args[1].tokenId);

if(args[0] === "on"){
     // If the dynamic active effect started
    new Sequence()
        .effect()
            .file("jb2a.magic_signs.circle.02.abjuration.intro.yellow")
            .attachTo(tokenD)
            .scaleToObject(1.5)
            .waitUntilFinished(-500)
            .belowTokens()
        .effect()
            .file("jb2a.magic_signs.circle.02.abjuration.loop.yellow")
            .attachTo(tokenD)
            .scaleToObject(1.5)
            .persist()
            .name(`protection-from-good-and-evil-${tokenD.id}`)
            .fadeIn(300)
            .fadeOut(300)
            .extraEndDuration(800)
            .belowTokens()
        .play()
}

if(args[0] === "off"){
    // If the dynamic active effect ended
    Sequencer.EffectManager.endEffects({ name: `protection-from-good-and-evil-${tokenD.id}`, object: tokenD });

    new Sequence()
        .effect()
            .file("jb2a.magic_signs.circle.02.abjuration.outro.yellow")
            .scaleToObject(1.5)
            .attachTo(tokenD)
            .belowTokens()
        .play()
}