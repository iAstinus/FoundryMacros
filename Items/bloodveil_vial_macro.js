// console.log('------------Sorcery Points macro start-------------');
// console.log(args);

let actorData = args[0].actor;
let casterToken = canvas.tokens.get(args[0].tokenId)
const resourceName = 'Sorcery Points';
const bonus = 5; // amount of resource to add
const canOverFlow = true; // can result be higher that max of that resource

function getResource(actor, itemName) {
    const resources = actor.system.resources;
    let resourceCheck = Object.entries(resources).filter(
        ([key, value]) => value.label === itemName);

    if (resourceCheck.length > 0) {
        return resourceCheck[0]
    } else {
        let sorcPointsItem = actor.items.find(i => i.name == itemName);
        return [sorcPointsItem.name, sorcPointsItem.system.uses]
    }
}

async function updateResource(actor, resource, amount) {
    if (canOverFlow) {
        resource[1]['value'] = resource[1]['value'] + amount;
    } else {
        resource[1]['value'] = Math.clamped(resource[1].value + amount, 0, resource[1].max);
    }

    if (['primary', 'secondary', 'tertiary'].includes(resource[0])) {
        let data = {};
        data[resource[0]] = resource[1];
        actor.update({"system.resources": data});
    } else {
        actor.items.getName(resource[0]).update({"system.uses": resource[1]});
    }
}

let sorcPoints = getResource(actorData, resourceName);
// console.log(sorcPoints);
await updateResource(actorData, sorcPoints, bonus);

new Sequence()
    .effect()
    .file("jb2a.cure_wounds.400px.red")
    .atLocation(casterToken)
    // .duration(2000)
    .fadeIn(500)
    .fadeOut(500)
    .scale(0.5)
    .waitUntilFinished(-1000)
    .belowTokens()
    .filter("Glow", { color: 0xffffbf })

.effect()
    .file("jb2a.impact.dark_red.2")
    .atLocation(casterToken)
    .fadeIn(500)

.effect()
    .file("jb2a.energy_strands.in.red.01.0")
    .delay(200)
    .fadeIn(300)
    .fadeOut(500)
    .duration(2000)
    .scale(0.4)
    .opacity(1)
    .atLocation(casterToken)
    .scaleIn(0, 500, { ease: "easeOutCubic" })
    
.play();

// console.log('------------Sorcery Points macro end-------------')
