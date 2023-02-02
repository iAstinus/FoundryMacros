let lastArg = args[args.length - 1];

if (args[0] === 'on') {
    // console.log("--Effect on--");
    // toDo
} else if (args[0] === 'off') {
    // console.log("--Effect off--");
    const targetToken = await fromUuid(lastArg.tokenUuid);
    Sequencer.EffectManager.endEffects({name: `searing-smite-${lastArg.tokenId}`, object: targetToken})
}