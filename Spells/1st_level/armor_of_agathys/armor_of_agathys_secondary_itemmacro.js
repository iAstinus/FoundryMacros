// reflect itemmacro Afte Active Effects
// requires item in world called "Armor of Agathys Reflect" (can be changed in first part of the macro)

const casterToken = await fromUuid(args[0].tokenUuid);

if (!casterToken) {
    ui.notifications.warn("Please select a valid token to use this ability.");
    return;
}
const target = game.user.targets.first();
if (!target) {
    ui.notification.warn("This spell requires at least one valid target.");
    return;
}

new Sequence()
    .effect()
        .file("jb2a.ice_spikes.wall.burst.white")
        .scale(0.4)
        .atLocation(casterToken)
        .rotateTowards(target)
        .fadeIn(500)
        .fadeOut(500)
        .duration(1500) 
        .belowTokens()
        .filter("Glow", { color: 0x6376e0 })
.play()

// check, if there is no more temp hit points:
if (casterToken.actor.system.attributes.hp.temp > 0) {
    // pass
} else {

    const updates = {
        embedded: {
            ActiveEffect: {
                "Armor of Agathys": warpgate.CONST.DELETE
            }
        }
    };

    await warpgate.wait(5000); // timeout so item roll will be finished
    await warpgate.mutate(casterToken, updates, {}, {permanent: true});
    
}
