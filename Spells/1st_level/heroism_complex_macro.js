// credits to Tyreal74
// on use itemmacro after active effects

const casterToken = canvas.tokens.get(args[0].tokenId);
if (!casterToken) {
    ui.notifications.warn("Please select a valid token to use this ability.");
    return;
}

let target = game.user.targets.first();
let targetImg = game.user.targets.first().data.texture.src;

new Sequence()
  .effect()
      .file("jb2a.extras.tmfx.runes.circle.inpulse.enchantment")
      .atLocation(casterToken)
      .duration(2000)
      .fadeIn(500)
      .fadeOut(500)
      .scale(0.5)
      .waitUntilFinished(-500)

  .effect()
      .file("jb2a.markers.light.loop.blue")
      .atLocation(casterToken)
      .duration(1500)
      .fadeIn(500)
      .fadeOut(500)
      .waitUntilFinished(-500)

  .effect()
      .file("jb2a.swirling_sparkles.01.blue")
      .atLocation(target)
      .waitUntilFinished(-250)

  .effect()
      .file(targetImg)
      .fadeOut(500)
      .atLocation(target)
      .scaleIn(0, 500, { ease: "easeInCubic", delay: 0 })
      .scaleToObject(3)
      .waitUntilFinished(-250)

  .effect()
      .file(targetImg)
      .fadeOut(500)
      .atLocation(target)
      .scaleIn(0, 500, { ease: "easeInCubic", delay: 0 })
      .scaleToObject(3)
      .waitUntilFinished(-250)

  .effect()
      .file("jb2a.ward.star.yellow.02")
      .attachTo(target)
      .fadeIn(500)
      .fadeOut(500)
      .scaleToObject(2.5)
      .name(`heroism-${args[0].itemUuid}`)
      .persist()
      .belowTokens()

.play()


// global macro
const lastArg = args[args.length - 1];
const tokenOrActor = await fromUuid(lastArg.actorUuid);
const targetActor = tokenOrActor.actor ? tokenOrActor.actor : tokenOrActor;
const amount = args[1];
const currentTemp = Number.isInteger(targetActor.system.attributes.hp.temp)
  ? targetActor.system.attributes.hp.temp
  : 0;

async function rejuvenateTempHP(tempHP) {
  if (tempHP > currentTemp) {
    const flag = await DAE.setFlag(targetActor, "heroismSpell", tempHP);
    await targetActor.update({ "system.attributes.hp.temp": tempHP });
    ChatMessage.create({ content: `Heroism applies ${tempHP} temporary HP to ${targetActor.name}` });
  }
}

if (args[0] === "on") {
  // await rejuvenateTempHP(amount);
}
if (args[0] === "off") {
  let tokenEffect = await fromUuid(lastArg.tokenUuid);
  Sequencer.EffectManager.endEffects({ name: `heroism-${lastArg.origin}`, object: tokenEffect});
  const flag = await DAE.getFlag(targetActor, "heroismSpell");
  if (flag) {
    const endTempHP = currentTemp > flag ? currentTemp - flag : null;
    await targetActor.update({ "system.attributes.hp.temp": endTempHP });
    await DAE.unsetFlag(targetActor, "heroismSpell");
  }
  ChatMessage.create({ content: `Heroism ends on ${targetActor.name}` });
}
if (args[0] === "each") {
  await rejuvenateTempHP(amount);
}