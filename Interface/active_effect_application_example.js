async function applyActiveEffect(target, source, item) {
    const targetToken = await fromUuid(target.actor.uuid);
    const targetActor = targetToken.actor;

    const effectData = {
        changes: [
        //   {
        //     value: 5, 
        //     mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE, 
        //     priority: 20, 
        //     key:"ATL.dimLight"
        // }
        ],

        origin: item.uuid, //flag the effect as associated to the source item used
        disabled: false,
        duration: { rounds: 1 },
        icon: item.img,
        label: `${item.name}`,
        flags: {
            dae: {
                specialDuration: ['1Spell']
            }
        }
        };
    await targetActor.createEmbeddedDocuments("ActiveEffect", [effectData]);
}

async function removeActiveEffect(target, effectName) {
    const targetToken = await fromUuid(target.actor.uuid);
    const targetActor = targetToken.actor;
    console.log(targetActor)
    await targetActor.effects.find(e => e.data.label === effectName).delete()
}

let casterActor = game.actors.getName("GM");
let casterItem = game.actors.getName("GM").items.get("pK3lLDJwqQyuwaVv");
let target = Array.from(game.user.targets)[0];
await applyActiveEffect(target, casterActor, casterItem, "default");

setTimeout(() => {removeActiveEffect(target, `${casterItem.name}`);}, 2000);