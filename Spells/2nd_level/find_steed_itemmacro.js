// requires warpgate and summon imported in the world

const actorD = game.actors.get(args[0].actor._id);
const tokenD = canvas.tokens.get(args[0].tokenId);
const level = args[0].spellLevel;
const itemUuid = args[0].item.uuid;
const summonerDc = actorD.data.data.attributes.spelldc;

const dialogData = await warpgate.menu({
    inputs: [{
        type: 'select',
        label: 'Select companion to summon',
        options: ["Warhorse", "Elk", "Camel", "Pony", "Mastiff"]
    }, {
        type: 'select',
        label: 'Select companion type',
        options: ["Celestial", "Fey", "Fiend"]
    }]}, {
        title: "Find Steed"
    }
)

const summonType = dialogData.inputs[0];
const creatureType = dialogData.inputs[1];
let animationColor;

if (creatureType === 'Celestial') {
    animationColor = 0x5a8fe6;
} else if (creatureType === 'Fey') {
    animationColor = 0x7cd461;
} else if (creatureType === 'Fiend') {
    animationColor = 0xf02d2b;
}

console.log(dialogData);

let updates = {
    token : {
        'name':`${summonType} of ${actorD.name}`,
        'flags': {"tagger": {'tags': [args[0].actor._id]}}
    },
    actor: {
        'name' : `${summonType} of ${actorD.name}`,
        'system': {'details': {'type': {'value': creatureType.toLowerCase()}}}
        },
}

await warpgate.spawn(summonType, updates, {
    pre: async (location) => {
        const seq = new Sequence()
        .effect()
            .file("jb2a.extras.tmfx.runes.circle.outpulse.conjuration")
            .atLocation(tokenD)
            .duration(4000)
            .fadeIn(500)
            .fadeOut(500)
            .scale(0.5)
            .waitUntilFinished(-2000)
            .filter("Glow", { color: animationColor }) 
        .effect()
            .file("jb2a.energy_strands.complete.dark_red.01")
            .scale(0.4)
            .atLocation(tokenD)
            .fadeIn(500)
            .duration(1500)
            .fadeOut(500)
            .waitUntilFinished(-2000)
        .effect()
            .file("jb2a.extras.tmfx.border.circle.outpulse.02.fast")
            .atLocation(location)
            .fadeIn(500)
            .fadeOut(500)
            .scale(0.5)
            .repeats(3, 750)
            .belowTokens()
            .scaleIn(0, 500, {ease: "easeOutCubic", delay: 100})
            .filter("Glow", { color: animationColor }) 

        seq.play();

        // Sleep for 2800ms
        await (new Promise(resolve => setTimeout(resolve, 2800)));
    }
}, {
    collision: true,
    controllingActor: actor
});