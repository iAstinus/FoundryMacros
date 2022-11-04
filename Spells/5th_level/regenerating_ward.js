// console.log("------------------macro called------------------")
// console.log(args);
const uuid = args[0].actorUuid;
const hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied('Regenerating Ward Instance', uuid);

if (!hasEffectApplied) {
  game.dfreds.effectInterface.addEffect({ effectName: 'Regenerating Ward Instance', uuid });
}

// https://service.crazypanda.ru/v/monosnap/2022-10-24-00-52-31-v6n75.png
// https://service.crazypanda.ru/v/monosnap/2022-10-24-00-52-43-QccfS.png