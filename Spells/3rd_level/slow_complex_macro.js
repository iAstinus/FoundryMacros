// Complex macro
// credits to Tyreal74
// first part goes to Armor of Agathys Item Macro

const casterToken = canvas.tokens.get(args[0].tokenId);
if (!casterToken) {
    ui.notifications.warn("Please select a valid token to use this ability.");
    return;
}
new Sequence()
    .effect()
        .file("jb2a.extras.tmfx.runes.circle.outpulse.transmutation")
        .atLocation(casterToken)
        .duration(4000)
        .fadeIn(500)
        .fadeOut(500)
        .scale(0.5)
        .waitUntilFinished(-2000)
        .filter("Glow", { color: 0x6a0dad }) 
.play();

//NOTE: This needs to go into the effect's macro.execute property, rather than midi's 'On Item Use' field.
// console.log(args);
let targetID = canvas.tokens.get(args[1].tokenId)

if (args[0] === "on"){
    // If the dynamic active effect started

    new Sequence() 
        .effect()
            .file("jb2a.impact.004.dark_purple")
            .atLocation(targetID)
            .fadeIn(500)
            .delay(2000)
        .effect()
            .delay(2000)
            .file("jb2a.energy_strands.overlay.purple.01")
            .fadeIn(100)
            .fadeOut(500)
            .scale(0.4, 0.45)
            .attachTo(targetID)
            .randomRotation()
            .scaleIn(0, 500, {ease: "easeOutCubic"})
            .persist()
            .name(`slow-${targetID.id}`)
    .play();
}

if(args[0] === "off"){
    // If the dynamic active effect ended
    Sequencer.EffectManager.endEffects({ name: `slow-${targetID.id}`, object: targetID });
}  