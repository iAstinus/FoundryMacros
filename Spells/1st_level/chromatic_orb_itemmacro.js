const lastArg = args[args.length - 1];
let target = Array.from(game.user.targets)[0];

const animations = {
  acid: "modules/jb2a_patreon/Library/1st_Level/Guiding_Bolt/GuidingBolt_01_Regular_GreenOrange_30ft_1600x400.webm",
  cold: "modules/jb2a_patreon/Library/1st_Level/Guiding_Bolt/GuidingBolt_01_Dark_BlueWhite_30ft_1600x400.webm",
  fire: "modules/jb2a_patreon/Library/1st_Level/Guiding_Bolt/GuidingBolt_01_Regular_Red_30ft_1600x400.webm",
  lightning: "modules/jb2a_patreon/Library/1st_Level/Guiding_Bolt/GuidingBolt_01_Regular_BlueYellow_30ft_1600x400.webm",
  poison: "modules/jb2a_patreon/Library/1st_Level/Guiding_Bolt/GuidingBolt_01_Regular_PurplePink_30ft_1600x400.webm",
  thunder: "modules/jb2a_patreon/Library/1st_Level/Guiding_Bolt/GuidingBolt_01_Regular_BlueYellow_30ft_1600x400.webm",
}

async function selectDamage() {
  const damageTypes = {
    acid: "icons/magic/acid/dissolve-bone-white.webp",
    cold: "icons/magic/water/barrier-ice-crystal-wall-jagged-blue.webp",
    fire: "icons/magic/fire/barrier-wall-flame-ring-yellow.webp",
    lightning: "icons/magic/lightning/bolt-strike-blue.webp",
    poison: "icons/consumables/potions/bottle-conical-fumes-green.webp",
    thunder: "icons/magic/sonic/explosion-shock-wave-teal.webp",
  };
  function generateEnergyBox(type) {
    return `
<label class="radio-label">
  <input type="radio" name="type" value="${type}" />
  <img src="${damageTypes[type]}" style="border: 0px; width: 50px; height: 50px"/>
  ${type.charAt(0).toUpperCase() + type.slice(1)}
</label>
`;
  }
  const damageSelection = Object.keys(damageTypes).map((type) => generateEnergyBox(type)).join("\n");
  const content = `
<style>
  .chromOrb .form-group {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    align-items: flex-start;
  }
  .chromOrb .radio-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    justify-items: center;
    flex: 1 0 20%;
    line-height: normal;
  }
  .chromOrb .radio-label input {
    display: none;
  }
  .chromOrb img {
    border: 0px;
    width: 50px;
    height: 50px;
    flex: 0 0 50px;
    cursor: pointer;
  }
  /* CHECKED STYLES */
  .chromOrb [type="radio"]:checked + img {
    outline: 2px solid #f00;
  }
</style>
<form class="chromOrb">
  <div class="form-group" id="types">
    ${damageSelection}
  </div>
</form>
`;
  const damageType = await new Promise((resolve) => {
    new Dialog({
      title: "Choose a damage type",
      content,
      buttons: {
        ok: {
          label: "Choose!",
          callback: async (html) => {
            const element = html.find("input[type='radio'][name='type']:checked").val();
            resolve(element);
          },
        },
      },
    }).render(true);
  });
  return damageType;
}

if (lastArg.hitTargetUuids.length > 0) {
  const tokenOrActor = await fromUuid(lastArg.actorUuid);
  const casterActor = tokenOrActor.actor ? tokenOrActor.actor : tokenOrActor;
  const casterToken = await fromUuid(lastArg.tokenUuid);
  const damageType = await selectDamage();
  const targets = await Promise.all(lastArg.hitTargetUuids.map(async (uuid) => await fromUuid(uuid)));
  const baseDamage = 3 + (lastArg.spellLevel - 1);
  const damageDice = lastArg.isCritical ? baseDamage * 2 : baseDamage;
  const critFlavour = lastArg.isCritical ? "Critical! " : "";
  const damageRoll = await new Roll(`${damageDice}d8[${damageType}]`).evaluate({ async: true });
  if (game.dice3d) game.dice3d.showForRoll(damageRoll);
  await new MidiQOL.DamageOnlyWorkflow(
    casterActor,
    casterToken,
    damageRoll.total,
    damageType,
    targets,
    damageRoll,
    {
      flavor: `${critFlavour}(${CONFIG.DND5E.damageTypes[damageType]})`,
      itemCardId: lastArg.itemCardId,
      itemData: lastArg.item,
      isCritical: lastArg.isCritical,
    }
  );

  new Sequence()
    .effect()
        .file("jb2a.extras.tmfx.runes.circle.outpulse.evocation")
        .atLocation(casterToken)
        .duration(2000)
        .fadeIn(500)
        .fadeOut(500)
        .scale(0.5)
        .opacity(0.8)
        .filter("Glow", { color: 0xffa500 })
        .scaleIn(0, 500, { ease: "easeOutCubic", delay: 100 })
    .effect()
        .file("jb2a.smoke.puff.centered.dark_black")
        .atLocation(casterToken)
        .fadeIn(500)
        .fadeOut(500)
        .scale(0.5)
        .randomRotation()
    .effect()
        .file(animations[damageType])
        .scale(1.2)
        .atLocation(casterToken)
        .stretchTo(target)
        .playIf(args[0].hitTargets.length === 1) // Comment this line out if not using MIDI
    .effect()
        .file(animations[damageType])
        .scale(1.2)
        .atLocation(casterToken)
        .stretchTo(target)
        .playIf(args[0].hitTargets.length === 0) // Comment this line out if not using MIDI
        .missed(args[0].hitTargets.length === 0)
    .effect()
        .file("jb2a.impact.009.orange")
        .atLocation(target)
        .fadeIn(500)
        .fadeOut(500)
        .delay(1000)
        .scaleToObject()
        .playIf(args[0].hitTargets.length === 1)
    .play();

}