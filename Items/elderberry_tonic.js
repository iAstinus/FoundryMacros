/*
When you drink this potion, you regain an expended 1st level spell slot.
*/ 

// just in case: defining spell level to restore
const levelToRestore = "spell" + 1;
let actor = game.actors.get(args[0].actor._id);

// getting current and max spell slots of appropriate level:
const spellsCurrent = getProperty(actor, "data.data.spells." + levelToRestore + ".value")
const spellsMax = getProperty(actor, "data.data.spells." + levelToRestore + ".max");

// checking, if restoration of a spell slot is applicable:
if (spellsCurrent < spellsMax) {
    // restoring one spell slot:
    actorUpdate = {};
    actorUpdate["data.spells." + levelToRestore + ".value"] = spellsCurrent + 1;
    await actor.update(actorUpdate);
    // await actor.update({"data.spells.spell1.value": spellsCurrent + 1});
};