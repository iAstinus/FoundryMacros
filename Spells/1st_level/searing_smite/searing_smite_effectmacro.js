// Searing Smite item => target self, add effect:
// 1. macro.execute CUSTOM smite-effect-macro @spellLevel @attributes.spelldc
// 2. system.bonuses.mwak.damage ADD (@spellLevel)d6[fire]

// this goes into global macro
// console.log(args);

const lastArg = args[args.length - 1];
const spellName = "Searing Smite";
// console.log(args);

async function applyActiveEffect(target, item, ownerToken, options) {
    const targetActor = target.actor;

    let effectData = duplicate(item.effects.find(e => e.label === spellName));

    effectData['changes'] = [{
                value: `turn=start,damageRoll=1d6,damageType=fire,saveDC=${options.spelldc},saveAbility=con,label=Burnning`, 
                mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE, 
                priority: 20,
                key:"flags.midi-qol.OverTime"
            }, {
                value: `searing-smite-secondary-effect-macro`, 
                mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM, 
                priority: 20,
                key: "macro.execute"
            }];
    // effectData['duration'] = ownerToken.actor.effects.find(eff=>eff.getFlag('core','statusId') === "Convenient Effect: Concentrating").duration

    // console.log(effectData);
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

        new Sequence()
            .effect()
                .file("jb2a.extras.tmfx.runes.circle.outpulse.evocation")
                .atLocation(casterActor)
                .duration(2000)
                .fadeIn(500)
                .fadeOut(500)
                .scale(0.5)
                .filter("Glow", { color: 0xffa500 })
                .opacity(0.8)
            .effect()
                .file("jb2a.spear.melee.fire.orange")
                .atLocation(casterActor)
                .stretchTo(targetToken)
                .waitUntilFinished(-1200)
                .scale(0.8)
                .fadeIn(500)
                .fadeOut(1500)
            .effect()
                .file("jb2a.explosion.02.orange")
                .atLocation(targetToken)
                .fadeIn(100)
                .fadeOut(100)
                .scale(0.5)
            .effect()
                .file("jb2a.flaming_sphere.400px.orange.02")
                .scaleToObject(2)
                .belowTokens()
                .attachTo(targetToken)
                .duration(2000)
                .fadeIn(500)
                .fadeOut(1000)
                .persist()
                .name(`searing-smite-${targetToken.id}`)
            .play()
        // console.log(item);

        // add extra damnage
        // done through system.bonuses.mwak.damage effect
        
        // console.log(getProperty(casterActor.actor.data, "flags.midi-qol.concentration-data"))
        // apply effect
        await applyActiveEffect(targetToken, item, casterActor, spellOptions);
        // update concentration (not working)
        await casterActor.actor.update(
            {'flags.midi-qol.concentration-data.targets':[
                {tokenUuid:targetToken.document.uuid},
                {actorUuid:casterActor.actor.uuid}]}
            )
        
    }
}
