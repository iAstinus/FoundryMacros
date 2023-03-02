// borrowed ideas from Sunbeam warpgate macro
// code goes to itemmacro, item has to be configured to deal no damage and target self
// and added effect lasting 1 turn with macro.ItemMacro CUSTOM @item.level

const lastArg = args[args.length - 1];
let tactor;
if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
else tactor = game.actors.get(lastArg.actorId);
const casterToken = canvas.tokens.get(lastArg.tokenId);
// const target = canvas.tokens.get(lastArg.tokenId);
// let itemlevel = args[1];  //passed by @item in the DAE field

// console.log(args);

async function selectTarget(missileNum) {
    content = `Choose target for ${missileNum} shard`;

    return new Promise((resolve, reject) => {
        const dialog = new Dialog({
            title: "Choose a target",
            content: content,      
            buttons: {
                ok: { label: "Done", callback: () => { resolve('Done'), tactor.items.getName("Star Shard").roll({"configureDialog": false}) } },
            },
            default: "none",

            close: () => { reject() }
            })
        dialog.render(true, options = {width: 200, left: canvas.screenDimensions[0] * 0.7});
    })
}

if (args[0] === "on") {

    for (var i = 0; i < 4; i++) {
        new Sequence()
            .effect()
                .name(`${casterToken.id}_missile_effect_${i}`)
                .file('jb2a.markers.02.purplepink')
                .fadeIn(1000)
                .attachTo(casterToken, {randomOffset: true})
                .scaleIn(0, 2500, {ease: "easeOutCubic", delay: 1000})
                .scaleOut(0, 4000, {ease: "easeOutCubic"})
                .scale(1)
                .persist()
                .scaleToObject()
                .randomRotation()
            .play()
    }

    for (var i = 0; i < 4; i++) {
        const dialogOutput = await selectTarget(i+1);
        Sequencer.EffectManager.endEffects({ name: `${casterToken.id}_missile_effect_${i}` });
    }
}
if (args[0] === "off") {

    //Let's revert the token and remove the attack spell item
    await warpgate.revert(token.document)
    await Sequencer.EffectManager.endEffects({ name: `${casterToken.id}_missile_effect_*`,  });
    
}