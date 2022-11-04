// requires warpgate

const actorD = game.actors.get(args[0].actor._id);
const tokenD = canvas.tokens.get(args[0].tokenId);
const level = args[0].spellLevel;
const summonType = "Swarm of Centipedes";
const summonerDc = actorD.data.data.attributes.spelldc;

let updates = {
    token : {
        'name':`${summonType} of ${actorD.name}`,
        'flags': {"tagger": {'tags': [args[0].actor._id]}}
    },
    actor: {
        'name' : `${summonType} of ${actorD.name}`,
        }
}

await warpgate.spawn(summonType, updates, {
    pre: async (location) => {
        const seq = new Sequence()
        .effect()
            .file("jb2a.throwable.throw.flask.01.white")
            .atLocation(tokenD)
            .stretchTo(location)
            .waitUntilFinished(0)
        .effect()
            .file("jb2a.explosion.top_fracture.flask.02")
            .atLocation(location)
            .fadeIn(100)
            .fadeOut(100)
        seq.play();

        // Sleep for 300ms
        await (new Promise(resolve => setTimeout(resolve, 2000)));
    }
}, {
    collision: false,
    controllingActor: actor
});