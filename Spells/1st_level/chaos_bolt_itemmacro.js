console.log("---macro start---");
console.log(args);

damageTypes = [
    "acid",
    "cold",
    "fire",
    "force",
    "lightning",
    "poison",
    "psyhic",
    "thunder"
    ];

const lastArg = args[args.length - 1];
let workflow = lastArg.workflow;
const casterToken = canvas.tokens.get(args[0].tokenId);
const targetActor = game.user.targets.first();

let damageRolls = workflow.damageRoll.terms.find(x => x.faces === 8).results.map (x => x.result);

const dialogData = await warpgate.menu({
    inputs: [{
        type: "header",
        label: `Select damage type for Chaos Bolt`
    }, {
        type: "info",
        label: `Rolls are ${damageRolls[0]} (${damageTypes[damageRolls[0]-1]}) and ${damageRolls[1]} (${damageTypes[damageRolls[1]-1]})`
    }],
    buttons: [{
        label: `${damageTypes[damageRolls[0]-1]}`,
        value: damageTypes[damageRolls[0]-1]
    }, {
        label: `${damageTypes[damageRolls[1]-1]}`,
        value: damageTypes[damageRolls[1]-1]
    }]
}, {
    title: "Chaos Bolt damage type",
    render: true,
    options: {
        width: "100%",
        height: "100%"
    }
})

workflow.defaultDamageType = dialogData.buttons;

if (damageRolls[0] === damageRolls[1]) {
    ui.notifications.info("Please, select one more target");
}

new Sequence()
    .effect()
        .file("jb2a.extras.tmfx.runes.circle.outpulse.evocation")
        .atLocation(casterToken)
        .duration(2000)
        .fadeIn(500)
        .fadeOut(500)
        .scale(0.5)
        .opacity(0.5)
        .scaleIn(0, 500, {ease: "easeOutCubic", delay: 100})
    .effect()
        .file("jb2a.moonbeam.01.intro.rainbow")
        .atLocation(casterToken)
        .fadeIn(100)
        .fadeOut(200)
        .duration(1200)
        .waitUntilFinished(-500)
    .effect()
        .file("jb2a.flaming_sphere.200px.rainbow")
        .atLocation(casterToken)
        .moveTowards(targetActor, {ease: "easeInCubic"})
        .moveSpeed(500)
        .fadeIn(500)
        .duration(1200)
        .fadeOut(500)
        .scale(0.4)
        .waitUntilFinished(-500)
        .rotateIn(360, 1200)
    .effect()
        .file("jb2a.impact.004.dark_purple")
        .atLocation(targetActor)
    .play();

console.log("---macro end---")