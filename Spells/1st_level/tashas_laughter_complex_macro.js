// credits to Tyreal74
const casterToken = canvas.tokens.get(args[0].tokenId);
if (!casterToken) {
    ui.notifications.warn("Please select a valid token to use this ability.");
    return;
}
const target = args[0].targets[0];
if (!target) {
    ui.notification.warn("This spell requires at least one valid target.");
    return;
}

new Sequence()
    .effect()
        .file("jb2a.extras.tmfx.runes.circle.outpulse.enchantment")
        .atLocation(casterToken)
        .duration(4000)
        .fadeIn(500)
        .fadeOut(500)
        .scale(0.5)
        .waitUntilFinished(-2000)
        .filter("Glow", { color: 0xffffbf })
    .effect()
        .file("jb2a.impact.004.yellow")
        .atLocation(target)
        .fadeIn(500)
    .effect()
        .file("jb2a.energy_strands.overlay.pinkyellow.01")
        .delay(200)
        .fadeIn(300)
        .fadeOut(500)
        .duration(3000)
        .scale(0.4)
        .opacity(0.4)
        .atLocation(target)
        .scaleIn(0, 500, {ease: "easeOutCubic"})
    .effect()
        .file("jb2a.extras.tmfx.runes.circle.simple.enchantment")
        .atLocation(target)
        .fadeIn(500)
        .scaleIn(0, 300, {ease: "easeOutCubic"})
        .scaleToObject(2)
        .duration(2000)
        .fadeOut(500)
        .filter("Glow", { color: 0xffffbf })
.play();


// global macro, credits to MrPrimate
const lastArg = args[args.length - 1];
const tokenOrActor = await fromUuid(lastArg.actorUuid);
const targetActor = tokenOrActor.actor ? tokenOrActor.actor : tokenOrActor;
const targetToken = await fromUuid(lastArg.tokenUuid);

const DAEItem = lastArg.efData.flags.dae.itemData;
const saveData = DAEItem.system.save;
const flavor = `${CONFIG.DND5E.abilities["wis"]} DC${saveData.dc} ${DAEItem?.name || ""}`;

function effectAppliedAndActive(conditionName) {
  return targetActor.effects.some(
    (activeEffect) =>
      activeEffect?.flags?.isConvenient &&
      activeEffect?.label == conditionName &&
      !activeEffect?.disabled
  );
}

async function cleanUp() {
  // cleanup conditions
  const hasProne = effectAppliedAndActive("Prone", targetActor);
  if (hasProne) await game.dfreds.effectInterface.toggleEffect({ effectName: "Prone", uuid: targetActor.uuid });
  const hasIncapacitated = effectAppliedAndActive("Incapacitated", targetActor);
  if (hasIncapacitated) await game.dfreds.effectInterface.toggleEffect({ effectName: "Incapacitated", uuid: targetActor.uuid });
  // remove hook
  const flag = await DAE.getFlag(targetActor, "hideousLaughterHook");
  if (flag) {
    Hooks.off("preUpdateActor", flag);
    await DAE.unsetFlag(targetActor, "hideousLaughterHook");
  }
  // remove effect
  await targetActor.deleteEmbeddedDocuments("ActiveEffect", [lastArg.effectId]);
}

async function onDamageHook(hookActor, update, options, userId) {
  const flag = await DAE.getFlag(hookActor, "hideousLaughterHook");
  if (!"actorData.system.attributes.hp" in update || !flag) return;
  const oldHP = hookActor.system.attributes.hp.value;
  const newHP = getProperty(update, "system.attributes.hp.value");
  const hpChange = oldHP - newHP;
  if (hpChange > 0 && typeof hpChange === "number") {
    console.warn("hookActor", hookActor);
    const saveActor = game.actors.get(hookActor.id);
    const saveRoll = await saveActor.rollAbilitySave(saveData.ability, {
      flavor,
      fastForward: true,
      advantage: true,
    });
    if (saveRoll.total >= saveData.dc) {
      await cleanUp();
    }
  }
}

if (args[0] === "on") {
    new Sequence()
        .effect()
            .file('jb2a.template_circle.symbol.out_flow.music_note.purple')
            .attachTo(targetToken)
            .scale(0.32)
            .delay(4000)
            .fadeIn(1500)
            .fadeOut(1500)
            .persist()
            .name(`laughter-${lastArg.origin}`)
        .play()


  if (targetActor.system.abilities.int.value < 4) {
    await cleanUp();
  } else {
    const hookId = Hooks.on("preUpdateActor", onDamageHook);
    await DAE.setFlag(targetActor, "hideousLaughterHook", hookId);
  }
}

if (args[0] === "off") {
    Sequencer.EffectManager.endEffects({name: `laughter-${lastArg.origin}`, object: targetToken})
  await cleanUp();
}

if (args[0] === "each") {
  const saveRoll = await targetActor.rollAbilitySave(saveData.ability, { flavor });
  if (saveRoll.total >= saveData.dc) {
    await cleanUp();
  }
}
