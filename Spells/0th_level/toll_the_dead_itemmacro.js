// credits to Tyreal74 for animation, MrPrimate for automation
// on use itemmacro after active effects

const lastArg = args[args.length - 1];
const casterToken = await fromUuid(lastArg.tokenUuid);

let animation = new Sequence()
    .effect()
        .file("jb2a.impact.004.dark_purple")
        .atLocation(casterToken)
        .fadeIn(500)    
    .effect()
        .file("jb2a.extras.tmfx.runes.circle.simple.necromancy")
        .atLocation(casterToken)
        .duration(3000)
        .fadeIn(500)
        .fadeOut(500)
        .scale(0.5)
        .filter("Glow", { color: 0x3c1361 })
        .scaleIn(0, 500, {ease: "easeOutCubic"})
        .waitUntilFinished(-2000)

if (lastArg.failedSaveUuids.length > 0) {
  const tokenOrActor = await fromUuid(lastArg.actorUuid);
  const casterActor = tokenOrActor.actor ? tokenOrActor.actor : tokenOrActor;
  const damageType = "necrotic";
  const targets = lastArg.failedSaves.map((fs) => canvas.tokens.get(fs.id));

  // assuming single target for spell
  const damageDiceType = targets[0].actor.system.attributes.hp.max != targets[0].actor.system.attributes.hp.value ? 12 : 8;
  const casterLevel = casterActor.type === "character" ? casterActor.system.details.level : casterActor.system.details.spellLevel;
  const damageDiceNum = Math.floor((casterLevel + 1) / 6) + 1;
  const damageRoll = await new Roll(`${damageDiceNum}d${damageDiceType}[${damageType}]`).evaluate({ async: true });
  if (game.dice3d) game.dice3d.showForRoll(damageRoll);
  await new MidiQOL.DamageOnlyWorkflow(
    casterActor,
    casterToken,
    damageRoll.total,
    damageType,
    targets,
    damageRoll,
    {
      flavor: `(${CONFIG.DND5E.damageTypes[damageType]})`,
      itemCardId: lastArg.itemCardId,
      itemData: lastArg.item,
      isCritical: lastArg.isCritical,
    }
  );
  animation
    .effect()
        .file("jb2a.toll_the_dead.purple.complete")
        .atLocation(targets[0])
        .scaleIn(0, 500, {ease: "easeInCubic"})
        .fadeIn(500)
        .fadeOut(300)
}
animation.play();
