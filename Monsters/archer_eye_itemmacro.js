let target = await fromUuid(args[0].hitTargetUuids[0] ?? "");
let numDice = 1;
if (args[0].isCritical) numDice = numDice * 2;
let damageRoll = await new Roll(`${numDice}d10`).roll();
new MidiQOL.DamageOnlyWorkflow(
    actor, 
    token, 
    damageRoll.total, 
    "piercing", 
    target ? [target] : [], 
    damageRoll, 
    {flavor: "Archer’s Eye (Damage Roll)", itemCardId: args[0].itemCardId})

let actorData = canvas.tokens.controlled[0] || game.user.character;
let targetActor = game.user.targets.values().next().value;

const data = {};
data.sneakWidth = 200;
data.scale = 1;
data.below = false;
data.anchorX = 0.4;
data.anchorY = 0.5;

new Sequence("Sneak_Attack")
    // .addSequence(sourceFX.sourceSeq)
    .effect()
        .file("modules/jb2a_patreon/Library/1st_Level/Hunters_Mark/HuntersMark_01_Regular_Green_Pulse_200x200.webm")
        .atLocation(targetActor)
        .scale((2 * actorData.w / data.sneakWidth) * data.scale)
        // .gridSize(canvas.grid.size)
        .belowTokens(data.below)
        .anchor({ x: data.anchorX, y: data.anchorY })
    .play()