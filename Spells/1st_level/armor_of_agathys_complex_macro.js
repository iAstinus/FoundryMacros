// Complex macro
// first part goes to Armor of Agathys Item Macro

let lastArg = args[args.length - 1];
const spellLevel = args[1];
const casterToken = await fromUuid(lastArg.tokenUuid);
const secondaryItem = game.items.getName("Armor of Agathys Reflect").toObject();

if (args[0] === 'on') {

    // play animation
    new Sequence()
        .effect()
            .file("jb2a.extras.tmfx.runes.circle.inpulse.abjuration")
            .atLocation(casterToken)
            .duration(2000)
            .fadeIn(500)
            .fadeOut(500)
            .scale(0.5)
            .opacity(0.3)
            .filter("Glow", { color: 0xffffff })
            .scaleIn(0, 500, {ease: "easeOutCubic", delay: 100})
        .effect()
            .file("jb2a.moonbeam.01.intro.blue")
            .atLocation(casterToken)
            .fadeIn(100)
            .fadeOut(200)
            .duration(1200)
            .waitUntilFinished(-500)
        .effect()
            .file("jb2a.dodecahedron.star.above.blueyellow")
            .scaleToObject(1.4)
            // .atLocation(casterToken)
            .attachTo(casterToken)
            .fadeIn(500)
            .fadeOut(1500)
            .persist()
            .name(`armor-of-agathys-${casterToken.id}`)
    .play();

    // adding item to the caster
    let updates = {
        actor: {
            system: {
                attributes: {
                    hp: {
                        temp: spellLevel*5
                    }
                }
            }
        },
        embedded: {
            Item: {
                [secondaryItem.name]: {
                    type: secondaryItem.type,
                    img: secondaryItem.img,
                    flags: secondaryItem.flags,
                    system: secondaryItem.system
                }
            }
        }
    };

    // scale damage of secondary item
    updates.embedded.Item[secondaryItem.name].system.damage.parts = [[`${spellLevel*5}[cold]`, 'cold']];
    await warpgate.mutate(casterToken, updates, {}, {name: `armor-of-agathys-${casterToken.id}`});
    ui.notifications.info(`Armor of Agathys Reflect has been added to your spell list.`);

} else if (args[0] === 'off') {

    ui.notifications.info(`Your Armor of Agathys has expired`);
    // remove animation
    Sequencer.EffectManager.endEffects({ name: `armor-of-agathys-${casterToken.id}`, object: casterToken });
    await warpgate.revert(casterToken, `armor-of-agathys-${casterToken.id}`);
}


// --------------
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
