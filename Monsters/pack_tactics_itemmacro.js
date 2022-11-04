// ItemMacro, called before the item is rolled

// We need to make two checks:
// First - if Pack Tactics is in actor items, in case item will be owned by actor without Pack Tactics.
// Second - if there is an ally near the target, and not the attacker itself.

// console.log(args[0]);
// console.log(MidiQOL.Workflow.getWorkflow(args[0].uuid));

let counter = 0;
let disposition = game.canvas.tokens.get(args[0].tokenId).document.disposition; //geting token disposition to check its allies
let nearbyTokens = MidiQOL.findNearby(disposition, args[0].targetUuids[0], 5, 0).map(a => a.objectId);
let sourceToken = "Token." + args[0].tokenId;

if (nearbyTokens.includes(sourceToken)) {
    counter += 1
};

if (nearbyTokens.length > counter && args[0].actorData.items.map(a => a.name).includes('Pack Tactics')) {
    MidiQOL.Workflow.getWorkflow(args[0].uuid).advantage = true;
    // this will still work, if attack also have a disadvantage (resulting in normal attack)
};
