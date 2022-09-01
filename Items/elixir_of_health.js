console.log(args);
/*
When you drink this potion, it cures any disease afflicting you, and it removes the  blinded,  deafened,  paralyzed, and  poisoned conditions.
*/

// applying potion only to the first target
targetEffects = args[0].targets[0].data.actorData.effects;
targetUuid = args[0].targetUuids[0];
effectsList = ["blinded", "deafened", "paralyzed", "poisoned", "disease"];

// checking, is there any effect with appropriate name, label, or id (and removing it): 
for (var i=0; i < targetEffects.length; i++) {
    // console.log(targetEffects[i]);
    if (targetEffects[i].hasOwnProperty('name')) {
        if (effectsList.some(v => targetEffects[i]["name"].toLowerCase().includes(v) )) {
            await MidiQOL.socket().executeAsGM("removeEffects", {actorUuid: targetUuid, effects:[targetEffects[i]._id]});
        }
    }
    else {
        if (targetEffects[i].hasOwnProperty('label')) {
            if (effectsList.some(v => targetEffects[i]["label"].toLowerCase().includes(v) )) {
                await MidiQOL.socket().executeAsGM("removeEffects", {actorUuid: targetUuid, effects:[targetEffects[i]._id]});
            }
        } else {
            if (effectsList.some(v => targetEffects[i]["_id"].toLowerCase().includes(v) )) {
                await MidiQOL.socket().executeAsGM("removeEffects", {actorUuid: targetUuid, effects:[targetEffects[i]._id]});
            }
        }
    }
}