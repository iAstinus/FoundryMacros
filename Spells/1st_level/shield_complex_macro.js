// credits to Tyreal74
// first one is on use itemmacro

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
        .filter("Glow", { color: 0xffffff })
        .scaleIn(0, 500, {ease: "easeOutCubic", delay: 100})
    .effect()
        .file("jb2a.moonbeam.01.intro.blue")
        .atLocation(casterToken)
        .fadeIn(100)
        .fadeOut(200)
        .duration(1200)
        .waitUntilFinished(-500)
    .play();

//NOTE: This needs to go into the effect's macro.execute property, rather than midi's 'On Item Use' field.

let tokenD = canvas.tokens.get(args[1].tokenId);

if(args[0] === "on"){
     // If the dynamic active effect started
    new Sequence()
        .effect()
            .file("jb2a.shield.01.intro.blue")
            .attachTo(tokenD)
            .scale(0.5)
            .waitUntilFinished(-500)
        .effect()
            .file("jb2a.shield.01.loop.blue")
            .attachTo(tokenD)
            .scale(0.5)
            .persist()
            .name(`Shield-${tokenD.id}`)
            .fadeIn(300)
            .fadeOut(300)
            .extraEndDuration(800)
        .play()
}

if(args[0] === "off"){
    // If the dynamic active effect ended
    Sequencer.EffectManager.endEffects({ name: `Shield-${tokenD.id}`, object: tokenD });

    new Sequence()
        .effect()
            .file("jb2a.shield.01.outro_explode.blue")
            .scale(0.5)
            .attachTo(tokenD)
        .play()
}
