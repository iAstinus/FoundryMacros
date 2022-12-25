// credits to Tyreal74
// needs nor Illusion actor, using Illusion marker jb2a asset

const casterToken = canvas.tokens.get(args[0].tokenId);
if (!casterToken) {
    ui.notifications.warn("Please select a valid token to use this ability.");
    return;
}

let updates = {
    token : {
        'flags': {"tagger": {'tags': [`caster_${args[0].actor._id}`]}}
    }
}

await warpgate.spawn("Silent Image", updates, {
    pre: async (location) => {
        const seq = new Sequence()
        .effect()
        .file("jb2a.extras.tmfx.runes.circle.outpulse.illusion")
        .atLocation(casterToken)
        .duration(2000)
        .fadeIn(500)
        .fadeOut(500)
        .scale(0.5)
        .opacity(0.3)
        .filter("Glow", { color: 0xffffbf })
        .scaleIn(0, 500, {ease: "easeOutCubic", delay: 100})
    .effect()
        .file("jb2a.moonbeam.01.intro.rainbow")
        .atLocation(casterToken)
        .fadeIn(100)
        .fadeOut(200)
        .duration(1200)
        .waitUntilFinished(-500)
    .effect()
        .file("jb2a.toll_the_dead.blue.shockwave")
        .atLocation(location)
        .fadeIn(500)
        .fadeOut(500)
        .scale(0.5)
        .scaleIn(0, 500, {ease: "easeOutCubic", delay: 100})

    seq.play();

        // Sleep for 500ms
        await (new Promise(resolve => setTimeout(resolve, 1200)));
    }
}, {
    controllingActor: casterToken.actor,
    collision: false
});

Hooks.once("deleteActiveEffect", concentrationHandler);

async function concentrationHandler(activeEffect) {
    // console.log("Concentration: ", activeEffect);

    for (let tokenData of canvas.tokens.placeables.map(a => [a.id, a.document.flags.tagger])) {
        // console.log(tokenData)
        if (tokenData[1] != null) {
            if (tokenData[1]['tags'].includes(`caster_${args[0].actor._id}`)) {
                console.log(tokenData);

                new Sequence()
                    .effect()
                        .file(`jb2a.magic_signs.rune.illusion.outro.green`)
                        .atLocation(canvas.tokens.get(tokenData[0]))
                        .scaleToObject(1)
                    .play()

                await warpgate.wait(500); // we need to wait a little, or token would be destroed and effect cannot be played
                await warpgate.dismiss(tokenData[0]);
            }
        }
    }
    return;
}