// credits to Tyreal74 for animation, MrPrimate for automation
// on use itemmacro after active effects

const casterToken = canvas.tokens.get(args[0].tokenId);
if (!casterToken) {
	ui.notifications.warn("Please select a valid token to use this ability.");
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
        .filter("Glow", { color: 0xcd5c5c }) 
.play();

// onUse macro
if (args[0].hitTargets.length === 0) return;
if (args[0].tag === "OnUse") {
  const targetUuid = args[0].hitTargets[0].uuid;
  const tokenOrActor = await fromUuid(args[0].actorUuid);
  const caster = tokenOrActor.actor ? tokenOrActor.actor : tokenOrActor;

  if (!caster || !targetUuid) {
    ui.notifications.warn("Hex: no token/target selected");
    console.error("Hex: no token/target selected");
    return;
  }

  const effectData = {
    changes: [
      {
        key: "flags.midi-qol.hex",
        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
        value: targetUuid,
        priority: 20
      }, // who is marked
      {
        key: "flags.dnd5e.DamageBonusMacro",
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
        value: `ItemMacro.${args[0].item.name}`,
        priority: 20,
      }, // macro to apply the damage
    ],
    origin: args[0].uuid, //flag the effect as associated to the spell being cast
    disabled: false,
    duration: args[0].item.effects[0].duration,
    icon: args[0].item.img,
    label: args[0].item.name,
  };
  effectData.duration.startTime = game.time.worldTime;
  await caster.createEmbeddedDocuments("ActiveEffect", [effectData]);
} else if (args[0].tag === "DamageBonus") {
  const targetUuid = args[0].hitTargets[0].uuid;
  if (targetUuid !== getProperty(args[0].actor.flags, "midi-qol.hex")) return {};
  const diceMult = args[0].isCritical ? 2 : 1;
  return { damageRoll: `${diceMult}d6[necrotic]`, flavor: "Hex Damage" };
}