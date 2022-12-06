// Itemmacro, needs to be placed on every weapon an actor will attack with
// credits to Midi sample items
let act = game.actors.get(args[0].actor._id);
let tok = canvas.tokens.get(args[0].tokenId);
let spells = duplicate(act.data.data.spells);
let pactLevel = spells.pact.level;
let smiteCard = game.messages.contents
  .reverse()
  .find(
    (message) =>
      message.data.flags["midi-qol"]?.actorUuid === args[0].actorUuid &&
      message.data.flavor === args[0].item.name
  );

// console.log('Actor: ', act);
// console.log('Token: ', tok);
// console.log('Card: ', smiteCard);
// await smiteCard.delete();
async function smite(slotLevel, pact = false) {
  let dice = Math.min(slotLevel + 1, 5);
  // console.log(game.messages.contents);
  let attackMessage = game.messages.contents
    .reverse()
    .find(
      (message) =>
        message.data.flags["midi-qol"]?.actorUuid === args[0].actorUuid &&
        message.data.flavor === args[0].item.name
    );

  let attack = MidiQOL.Workflow.getWorkflow(
    attackMessage.data.flags["midi-qol"].itemUuid
  );
  if (!attack.hitTargets.size) {
    ui.notifications.error(
      `You must successfully hit in order to use ${args[0].item.name}`
    );
    return;
  }
  let target = Array.from(attack.hitTargets)[0];
  // console.log(target);
  let undead = ["undead", "fiend"].some((type) =>
    (target.actor.data.data.details.type.value || "")
      .toLowerCase()
      .includes(type)
  );
  if (undead) {
    dice += 1;
  }
  let key = pact ? "pact" : "spell" + slotLevel;
  await act.update({
    [`data.spells.${key}.value`]: spells[key].value - 1,
  });
  if (attack.isCritical) {
    dice *= 2;
  }
  let roll = await new Roll(`${dice}d8`).roll();
  await game.dice3d?.showForRoll(roll);
  new MidiQOL.DamageOnlyWorkflow(
    act,
    tok,
    roll.total,
    "radiant",
    attack.targets,
    roll,
    {
      // flavor: `${args[0].item.name} - ${
      //   pact ? "Pact Magic" : "slot"
      // } level <strong>${slotLevel}</strong>`,
      flavor: `Divine Smite - ${
        pact ? "Pact Magic" : "slot"
      } level <strong>${slotLevel}</strong>`,
      itemCardId: attack.itemCardId,
    }
  );

  new Sequence()
    .effect()
        .file("jb2a.divine_smite.caster.reversed.dark_red")
        .atLocation(canvas.tokens.get(args[0].tokenId))
        .scaleToObject(1.4)
        .wait(2000)
    .effect()
        .file("jb2a.divine_smite.target.dark_red")
        .atLocation(args[0].targets[0])
        .scale(0.5)
    .play();
}
let options = [];
for (let i = 1; i < 10; ++i) {
  let slot = spells[`spell${i}`];
  // console.log('slot', slot);

  // if (!slot.max || slot.value <= 0) {
  //   break;
  // }
  if (!slot.max) {
    break;
  } 
  else {
    if (slot.value > 0) {
      slot.level = i;
      options.push(slot);
    }
  }

  
}
// console.log('options', options);
if (spells.pact?.max && spells.pact?.value > 0) {
  spells.pact["pact"] = true;
  options.push(spells.pact);
}
if (!options.length) {
  // ui.notifications.error("No spell slots available for Divine Smite");
  return;
}
// if (options.length === 1) {
//   await smite(options[0].level);
//   return;
// }
options = options.map(
  (slot) =>
    `<option value="${slot.pact ? "pact" : slot.level}">${
      slot.pact ? "Pact Magic: " : ""
    }Level ${slot.level} (${slot.value}/${slot.max})</option>`
);

new Dialog({
  title: "Divine Smite",
  content: `
        <form>
            <div class="form-group">
                <label>Spell slot level:</label>
                <select id="level" name="level">
                ${options}
                </select>
            </div>
        </form>
        `,
  buttons: {
    ok: {
      label: `⚡`,
      callback: async (html) => {
        const choice = html.find('[name="level"]').val();
        const pact = choice === "pact";
        const level = pact ? pactLevel : Number(choice);
        await smite(level, pact);
      },
    },
  },
}).render(true);