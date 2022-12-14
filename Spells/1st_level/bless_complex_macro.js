// credits to Tyreal74
// this part goes to ItemMacro before active effects 

const casterToken = canvas.tokens.get(args[0].tokenId);
if (!casterToken) {
    ui.notifications.warn("Please select a valid token to use this ability.");
    return;
}

    new Sequence()
        .effect()
            .file("jb2a.extras.tmfx.runes.circle.outpulse.enchantment")
            .atLocation(casterToken)
            .duration(4000)
            .fadeIn(500)
            .fadeOut(500)
            .scale(0.5)
            .waitUntilFinished(-2000)
            .filter("Glow", { color: 0xfefebe })
            .opacity(0.5)
    .play();


//NOTE: This needs to go into the effect's macro.execute property, rather than midi's 'On Item Use' field.
let targetID = canvas.tokens.get(args[1].tokenId);

if(args[0] === "on"){
    // If the dynamic active effect started

    new Sequence()
         .effect()
            .file("jb2a.extras.tmfx.outpulse.circle.01.slow")
            .atLocation(targetID)
            .fadeIn(500)
            .fadeOut(500)
            .filter("Glow", { color: 0xfefebe })
        .effect()
            .file("jb2a.bless.200px.intro.yellow")
            .atLocation(targetID)
            .fadeIn(100)
            .belowTokens()
            .scaleToObject(2)
            .scaleIn(0, 500, {ease: "easeOutCubic"})
            .waitUntilFinished(-500)
        .effect()
            .file("jb2a.bless.200px.loop.yellow")
            .fadeOut(500)
            .scaleToObject(2)
            .attachTo(targetID)
            .persist()
            .belowTokens()
            .name(`bless-${targetID.id}`)
    .play();

}
    if(args[0] === "off"){
        // If the dynamic active effect ended
        Sequencer.EffectManager.endEffects({ name: `bless-${targetID.id}`, object: targetID });
    }    