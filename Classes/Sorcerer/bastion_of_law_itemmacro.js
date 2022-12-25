// itemmacro, requres warpgate, complementary to metamagic_itemmacro.js

console.log("---macro start---");
console.log(args);

const lastArg = args[args.length - 1];
const cost = lastArg.actor.getFlag('world', 'BastionOfLawCost');
let bastionTag = lastArg.uuid + '-bol-tag';
let bastionMutation = lastArg.uuid + `-bol`;

if (cost) {
     lastArg.actor.unsetFlag('world', 'BastionOfLawCost');
} else {
    ui.notifications.warn('You need to use Metamagic for automation.');
    return;
}

const targetActor = game.user.targets.first();
if (!targetActor) {
    ui.notifications.warn("This feature requires at least one valid target.");
    if (cost) {
        ui.notifications.warn(`Please, manually refund yourself ${cost} sorcery points`);
    }
    return;
}

// removing previous mutation
const currentBastion = await Tagger.getByTag(bastionTag)[0];
if (currentBastion) {
    await warpgate.revert(currentBastion, bastionMutation + '-pool');
    await warpgate.revert(currentBastion, bastionMutation + '-items');
    await Tagger.removeTags(currentBastion, bastionTag);
}

let bastionItems = [
    "Bastion of Law Pool"
    ]

for (var i = 1; i <= cost; i++) {
    bastionItems.push(`Bastion of Law [${i}d8]`);
}

console.log(bastionItems);

// mutation data
let bastionPoolUpdates = {
    embedded: {
        Item: {
            "Bastion of Law Pool": game.items.getName("Bastion of Law Pool").toObject()
        }
    }
};

let bastionItemsUpdates = {
    embedded: {
        Item: {}
    }
};

// making changes
if (cost < 5) {
    bastionPoolUpdates.embedded.Item["Bastion of Law Pool"].system.uses.value = cost;
    bastionPoolUpdates.embedded.Item["Bastion of Law Pool"].system.uses.max = cost;
}

await Tagger.addTags(targetActor, bastionTag);
await warpgate.mutate(targetActor.document, bastionPoolUpdates, {}, {name: bastionMutation + '-pool', comparisonKeys: {Item: 'name'}});

// updating other items to consume pool charges
const poolItemId = targetActor.actor.items.getName("Bastion of Law Pool").id;
bastionItems.forEach( (item) => {
    // bastionItemsData[item] = game.items.getName(item).toObject();
    if (item !== 'Bastion of Law Pool') {
        bastionItemsUpdates.embedded.Item[item] = game.items.getName(item).toObject();
        bastionItemsUpdates.embedded.Item[item].system.consume.target = poolItemId;
    }
})
await warpgate.mutate(targetActor.document, bastionItemsUpdates, {}, {name: bastionMutation + '-items', comparisonKeys: {Item: 'name'}});

const casterToken = canvas.tokens.get(args[0].tokenId);
// primary animation of caster
let sequence = new Sequence()
    .effect()
        .file("jb2a.energy_strands.range.standard.blue")
        .atLocation(casterToken)
        .stretchTo(targetActor)
        .scale(1.5)
        .opacity(1)
        .repeats(parseInt(cost), 500)
        .fadeIn(500)
        .fadeOut(500)
        .randomizeMirrorY()
    .play()

console.log("---macro end---")