// requires warpgate

const actorD = game.actors.get(args[0].actor._id);
const tokenD = canvas.tokens.get(args[0].tokenId);
const level = args[0].spellLevel;
const itemUuid = args[0].item.uuid;
const summonType = "Arcane Eye";
const summonerDc = actorD.data.data.attributes.spelldc;

let updates = {
    token : {
        'name':`${summonType} of ${actorD.name}`,
        'flags': {"tagger": {'tags': [args[0].actor._id]}}
    },
    actor: {
        'name' : `${summonType} of ${actorD.name}`,
        },
}

await warpgate.spawn(summonType, updates, {
    pre: async (location) => {
        const seq = new Sequence()
        .effect()
            .file("jb2a.energy_strands.complete.orange.01")
            .scale(0.4)
            .atLocation(tokenD)
            .fadeIn(500)
            .duration(1500)
            .fadeOut(500)
        .effect()
            .file("jb2a.extras.tmfx.runes.circle.inpulse.divination")
            .scale(0.4)
            .atLocation(tokenD)
            .waitUntilFinished(-1000)
            .fadeIn(500)
            .duration(1500)
            .fadeOut(500)
            .filter("Glow", { color: 0xecbe51 })
        .effect()
            .file("jb2a.magic_signs.circle.02.divination.complete.blue")
            .atLocation(location)
            .fadeIn(100)
            .fadeOut(100)
            .scale(0.18)
            .belowTokens()
            .scaleIn(0, 500, {ease: "easeOutCubic", delay: 100})
        seq.play();

        // Sleep for 300ms
        await (new Promise(resolve => setTimeout(resolve, 800)));
    }
}, {
    collision: false,
    controllingActor: actor
});

const concentrationHookId = Hooks.on("deleteActiveEffect", concentrationHandler);

async function concentrationHandler(activeEffect) {
    console.log("Concentration: ", activeEffect);

    if (activeEffect.origin !== itemUuid) {
        return;
    }
    for (const tokenData of canvas.tokens.placeables.map(a => [a.id, a.document.flags.tagger])) {
        // console.log(tokenData)
        if (tokenData[1] != null) {
            if (tokenData[1]['tags'].includes(args[0].actor._id)) {
                await warpgate.dismiss(tokenData[0]);
            }
        }
    }
    Hooks.off("deleteActiveEffect", concentrationHookId);
    return;
}