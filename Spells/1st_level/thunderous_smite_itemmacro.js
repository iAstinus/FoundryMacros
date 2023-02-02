// v1.4 Requires midi-qol
// console.log('----------macro strat---------');
// console.log(args);
if (!["mwak","rwak"].includes(args[0].item.data.actionType)) return {}; 
if (args[0].hitTargetUuids.length === 0) return {}; // did not hit anyone

for (let tokenUuid of args[0].hitTargetUuids) {
    const target = await fromUuid(tokenUuid);
    const targetActor = target.actor;
    if (!targetActor) continue;

    // create the prone effect on the target
    let bsEffect = new ActiveEffect({
        label: "Thunderous Smite", 
        icon: "icons/magic/fire/dagger-rune-enchant-flame-purple.webp", 
        changes: [{
            value: "Prone", 
            mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM, 
            priority: 20,
            key:"macro.CE"}], 
        duration: {seconds: 60}
        });
    // 3600 seconds is long enogth to save, I expect

    await MidiQOL.socket().executeAsGM("createEffects", {actorUuid: targetActor.uuid, effects: [bsEffect.toObject()]})
}
Hooks.once("midi-qol.RollComplete", (workflow) => {
    console.log("Deleting concentration")
    const effect = MidiQOL.getConcentrationEffect(actor);
    if (effect) effect.delete();
    return true;
})
const spellLevel = actor.data.flags["midi-qol"].thunderousSmite.level;

const casterToken = canvas.tokens.get(args[0].tokenId);
const target = game.user.targets.first();

// primary animation of caster
new Sequence()
    .effect()
        .file("jb2a.static_electricity.02.blue")
        .atLocation(target)
        .repeats(3)
        .fadeIn(100)
        .fadeOut(100)
        .scaleToObject(1.3)
    .play()

// Handling criticals
if (args[0].isCritical === true) {
    return{damageRoll: `${spellLevel*4}d6[thunder]`, flavor: "Thunderous Smite"}
} else {
    return{damageRoll: `${spellLevel*2}d6[thunder]`, flavor: "Thunderous Smite"}
};