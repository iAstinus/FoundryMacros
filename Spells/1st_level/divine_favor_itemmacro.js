let lastArg = args[args.length - 1];
// console.log(lastArg);

if (args[0] === 'on') {
    // console.log("--Effect on--");
    // declaring targets and caster tokens
    const casterToken = canvas.tokens.get(lastArg.tokenId);
    if (!casterToken) {
        ui.notifications.warn("Please select a valid token to use this ability.");
        return;
    }
    
    // primary animation of caster
    let sequence = new Sequence()
        .effect()
            .file("jb2a.sacred_flame.source.white")
            .atLocation(casterToken)
            // .duration(1000)
            .fadeIn(500)
            .fadeOut(500)
            .scale(0.5)
            .waitUntilFinished(-1500)
            .filter("Glow", { color: 0x611610 })
        .effect()
            .file("jb2a.bless.200px.loop.yellow")
            .atLocation(casterToken)
            .name(`divine-favor-${casterToken.id}`)
            .persist()
            .fadeIn(1500)
            .fadeOut(1500)
            .scaleToObject(1.5)
            .belowTokens()
            .filter("Glow", { color: 0x611610 })
            .attachTo(casterToken)

    
    //play animation
    sequence.play()
} else if (args[0] === 'off') {
    // console.log("--Effect off--");
    const casterToken = canvas.tokens.get(lastArg.tokenId);
    Sequencer.EffectManager.endEffects({ name: `divine-favor-${casterToken.id}`, object: casterToken });
    // toDo
}