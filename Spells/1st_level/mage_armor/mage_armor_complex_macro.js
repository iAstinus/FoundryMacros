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
    .effect()
        .file("jb2a.shield.02.intro.blue")
        .opacity(0.4)
        .scale(0.45)
        .atLocation(casterToken)
        .fadeIn(500)
        .fadeOut(500)
    .play();

//NOTE: This needs to go into the effect's macro.execute property, rather than midi's 'On Item Use' field.

let tokenD = canvas.tokens.get(args[1].tokenId);

if(args[0] === "on"){
     // If the dynamic active effect started
    new Sequence()
        .effect()
            .file("jb2a.energy_field.02.above.blue")
            .attachTo(tokenD)
            .scaleToObject(1.5)
            .opacity(0.3)
            .persist()
            .name(`mage-armor-${tokenD.id}`)
            .fadeIn(1000)
            .fadeOut(1000)
        .play()
}

if(args[0] === "off"){
    // If the dynamic active effect ended
    Sequencer.EffectManager.endEffects({ name: `mage-armor-${tokenD.id}`, object: tokenD });
}