// v1.1
if (!["mwak","rwak"].includes(args[0].item.data.actionType)) return {}; // weapon attack
if (args[0].item.data.actionType === "mwak" && !args[0].item.data.properties?.fin) 
  return {}; // ranged or finesse
if (args[0].hitTargets.length < 1) return {};
token = canvas.tokens.get(args[0].tokenId);
actor = token.actor;
// console.log(token);


let actorData = canvas.tokens.controlled[0] || game.user.character;
let targetActor = game.user.targets.values().next().value;

const data = {};
data.sneakWidth = 300;
data.scale = 1;
data.below = false;
data.anchorX = 0.4;
data.anchorY = 0.5;

if (!actor || !token || args[0].hitTargets.length < 1) return {};
const rogueLevels = actor.getRollData().classes.rogue?.levels;
if (!rogueLevels) {
  MidiQOL.warn("Sneak Attack Damage: Trying to do sneak attack and not a rogue");
  return {}; // rogue only
}
let target = canvas.tokens.get(args[0].hitTargets[0].id ?? args[0].hitTargers[0]._id);
if (!target) MidiQOL.error("Sneak attack macro failed");

if (game.combat) {
  let combatTime = game.combat.round + game.combat.turn /100;
  let lastTime = getProperty(token.data.flags, "midi-qol.sneakAttackTime");
  if (combatTime === lastTime) {
   MidiQOL.warn("Sneak Attack Damage: Already done a sneak attack this turn");
   return {};
  }
}
let foundEnemy = true;
let isSneak = args[0].advantage;

if (!isSneak) {
  foundEnemy = false;
  let nearbyEnemy = canvas.tokens.placeables.filter(t => {
    let nearby = (t.actor &&
         t.actor?.id !== args[0].actor._id && // not me
         t.id !== target.id && // not the target
         t.actor?.data.data.attributes?.hp?.value > 0 && // not incapacitated
         t.data.disposition !== target.data.disposition && // not an ally
         MidiQOL.getDistance(t, target, false) <= 5 // close to the target
     );
    foundEnemy = foundEnemy || (nearby && t.data.disposition === -target.data.disposition)
    return nearby;
  });
  isSneak = nearbyEnemy.length > 0;
}
if (!isSneak) {
  MidiQOL.warn("Sneak Attack Damage: No advantage/ally next to target");
  return {};
}
let useSneak = getProperty(actor.data, "flags.dae.autoSneak");
if (!useSneak) {
    let dialog = new Promise((resolve, reject) => {
      new Dialog({
      // localize this text
      title: "Conditional Damage",
      content: `<p>Use Sneak attack?</p>`+(!foundEnemy ? "<p>Only Nuetral creatures nearby</p>" : ""),
      buttons: {
          one: {
              icon: '<i class="fas fa-check"></i>',
              label: "Confirm",
              callback: () => resolve(true)
          },
          two: {
              icon: '<i class="fas fa-times"></i>',
              label: "Cancel",
              callback: () => {resolve(false)}
          }
      },
      default: "two"
      }).render(true);
    });
    useSneak = await dialog;
}
if (!useSneak) return {}
const diceMult = args[0].isCritical ? 2: 1;
const baseDice = Math.ceil(rogueLevels/2);
if (game.combat) {
  let combatTime = game.combat.round + game.combat.turn /100;
  let lastTime = getProperty(token.data.flags, "midi-qol.sneakAttackTime");
  if (combatTime !== lastTime) {
    await token.document.setFlag("midi-qol", "sneakAttackTime", combatTime)
     // await token.setFlag("midi-qol", "sneakAttackTime", combatTime)
  }
}

new Sequence("Sneak_Attack")
    // .addSequence(sourceFX.sourceSeq)
    .effect()
        .file("modules/jb2a_patreon/Library/1st_Level/Sneak_Attack/Sneak_Attack_Regular_Orange_300x300.webm")
        .atLocation(targetActor)
        .scale((2 * actorData.w / data.sneakWidth) * data.scale)
        // .gridSize(canvas.grid.size)
        .template({gridSize: canvas.grid.size, startPoint: canvas.grid.size * 2, endPoint: canvas.grid.size * 2})
        .belowTokens(data.below)
        .anchor({ x: data.anchorX, y: data.anchorY })
    .play()

// How to check that we've already done one this turn?
return {damageRoll: `${baseDice * diceMult}d6`, flavor: "Sneak Attack"};