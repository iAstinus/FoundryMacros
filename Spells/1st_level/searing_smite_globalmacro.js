// Searing Smite item => target self, add effect:
// 1. macro.execute CUSTOM smite-effect-macro @spellLevel @attributes.spelldc
// 2.system.bonuses.mwak.damage ADD (@spellLevel)d6[fire]

// this goes into global macro
// console.log(args);

const lastArg = args[args.length - 1];
const spellName = "Searing Smite (WIP)";

async function applyActiveEffect(target, item, ownerToken, options) {
    const targetActor = target.actor;

    let effectData = duplicate(item.effects.find(e => e.label === spellName));

    effectData['changes'] = [{
                value: `turn=start,damageRoll=1d6,damageType=fire,saveDC=${options.spelldc},saveAbility=con,label=Burnning`, 
                mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE, 
                priority: 20,
                key:"flags.midi-qol.OverTime"
            }];
    // effectData['duration'] = ownerToken.actor.effects.find(eff=>eff.getFlag('core','statusId') === "Convenient Effect: Concentrating").duration

    console.log(effectData);
    await targetActor.createEmbeddedDocuments("ActiveEffect", [effectData]);
}



if (args[0] === 'off') {
    // checking - is and effect removed because of the attack or  anything else
    if (lastArg["expiry-reason"] === "midi-qol:1Action,1Attack,1Hit,1Spell") {
        // usefull things
        let casterActor = canvas.tokens.get(lastArg.tokenId);
        let targetToken = game.user.targets.first();
        let spellOptions = {spellLevel: args[1], spelldc: args[2]};
        let item = casterActor.actor.items.getName(spellName);

        // console.log(item);

        // add extra damnage
        // done through system.bonuses.mwak.damage effect
        
        //update concentration
        await casterActor.actor.update({'flags.midi-qol.concentration-data.targets':[{tokenUuid:targetToken.document.uuid},{actorUuid:casterActor.actor.uuid}]})
        console.log(getProperty(casterActor.actor.data, "flags.midi-qol.concentration-data"))
        // apply effect
        await applyActiveEffect(targetToken, item, casterActor, spellOptions);
        
        
    }
}
