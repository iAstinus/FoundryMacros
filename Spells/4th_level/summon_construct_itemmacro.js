// requires warpgate
// console.log(args[0]);
const actorD = game.actors.get(args[0].actor._id);
const tokenD = canvas.tokens.get(args[0].tokenId);
const itemUuid = args[0].item.uuid;
const level = args[0].spellLevel;
const summonType = "Construct Spirit";
const summonerSpellAttack = actorD.data.data.attributes.spelldc - 8;


let dialogData = await warpgate.menu(
    {
        inputs: [{
            label: "Select type of golem",
            type: "info"
        }],
        buttons: [{
            label: "Metal",
            value: "Metal"
        }, {
            label: "Stone",
            value: "Stone"
        }, {
            label: "Clay",
            value: "Clay"
        }]
    }, {
        title: "Choose construct type",
        render: true,
        options: {
            width: '100%',
            height: '100%',
        }
    }
    );

console.log(dialogData);

let itemsToDelete = {
    "Metal": ["Berserk Lashing", "Stony Lethargy"],
    "Stone": ["Heated Body", "Berserk Lashing"],
    "Clay": ["Heated Body", "Stony Lethargy"]
};

let updatedItems = {};

for (i = 0; i <= 1; i++) {
    updatedItems[itemsToDelete[dialogData.buttons][i]] = warpgate.CONST.DELETE
};

updatedItems['Slam'] = {
    'system': {
        'attackBonus': `${summonerSpellAttack} - 7`,
        'damage': {
            'parts': [[`1d8[bludgeoning] + 4 + ${level}`, 'bludgeoning']]
        }
    }
};

if (dialogData.buttons === 'Clay') {
    updatedItems['Stony Lethargy'] = {
        'system': {
            'save': {
                'dc': summonerSpellAttack + 8
            }
        }
    }
}

console.log(updatedItems);

let updates = {
    token : {
        'name':`${dialogData.buttons} ${summonType} of ${actorD.name}`,
        'flags': {"tagger": {'tags': [args[0].actor._id]}}
    },
    actor: {
        'name' : `${dialogData.buttons} ${summonType} of ${actorD.name}`,
        'system': {
            'attributes': {
                'hp': {'value': 40 + (level - 4)*15, 'max': 40 + (level - 4)*15},
                'ac': {'flat': 13 + level},
            }
        }
        },
    embedded: { Item: updatedItems}
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
            .file("jb2a.extras.tmfx.runes.circle.inpulse.conjuration")
            .scale(0.4)
            .atLocation(tokenD)
            .waitUntilFinished(-1000)
            .fadeIn(500)
            .duration(1500)
            .fadeOut(500)
            .filter("Glow", { color: 0xecbe51 })
        .effect()
            .file("jb2a.explosion.02.orange")
            .atLocation(location)
            .fadeIn(100)
            .fadeOut(100)
            .scale(0.8)
            .scaleIn(0, 500, {ease: "easeOutCubic", delay: 100})
        seq.play();

        // Sleep for 300ms
        await (new Promise(resolve => setTimeout(resolve, 800)));
    }
}, {
    collision: true,
    controllingActor: actor,
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