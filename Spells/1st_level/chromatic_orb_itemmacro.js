//Modified Crymic's Chromatic Orb macro

const damage_types = [`Acid`, `Cold`, `Fire`, `Lightning`, `Poison`, `Thunder`];
if (args[0].hitTargets.length > 0) {
  let damage_type = await choose(damage_types, `Choose Damage Type: `);
  let actorD = game.actors.get(args[0].actor._id);
  let tokenD = canvas.tokens.get(args[0].tokenId);
  let target = await fromUuid(args[0].hitTargetUuids[0] ?? "");
  let level = Number(args[0].spellLevel + 2);
  if (args[0].isCritical) level *= 2;
  let damageRoll = await new Roll(`${level}d8`).roll();
  game.dice3d.showForRoll(damageRoll);
  new MidiQOL.DamageOnlyWorkflow(
    actorD,
    tokenD,
    damageRoll.total,
    damage_type,
    target ? [target] : [], 
    damageRoll,
    {flavor: "(Damage Type: " + damage_type + ")", itemCardId: args[0].itemCardId}
  );
}

async function choose(options, prompt) {
  let value = await new Promise((resolve) => {
    let dialogOptions = options
      .map((o) => `<option value="${o}">${o}</option>`)
      .join(``);
    let content = `<form><div class="form-group"><label for="choice">${prompt}</label><select id="choice">${dialogOptions}</select></div></form>`;
    new Dialog({
      content,
      buttons: {
        OK: {
          label: `OK`,
          callback: async (html) => {
            resolve(html.find("#choice").val());
          },
        },
      },
    }).render(true);
  });
  return value;
}