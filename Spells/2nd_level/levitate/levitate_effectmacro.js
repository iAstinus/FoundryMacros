let tokenD = canvas.tokens.get(args[1].tokenId);

if(args[0] === "on"){
     // If the dynamic active effect started
    new Sequence()
        .effect()
            .file("jb2a.magic_signs.circle.02.transmutation.intro.green")
            .attachTo(tokenD)
            .scaleToObject(1.2)
            .waitUntilFinished(-500)
            .opacity(0.7)
            .belowTokens()
        .effect()
            .file("jb2a.magic_signs.circle.02.transmutation.loop.green")
            .attachTo(tokenD)
            .scaleToObject(1.2)
            .persist()
            .name(`levitate-${tokenD.id}`)
            .fadeIn(300)
            .fadeOut(300)
            .belowTokens()
            .extraEndDuration(800)
            .waitUntilFinished(-800)
            .opacity(0.7)
        .play()
}

if(args[0] === "off"){
    // If the dynamic active effect ended
    Sequencer.EffectManager.endEffects({ name: `levitate-${tokenD.id}`, object: tokenD });

    new Sequence()
        .effect()
            .file("jb2a.magic_signs.circle.02.transmutation.outro.green")
            .scaleToObject(1.2)
            .belowTokens()
            .attachTo(tokenD)
            .opacity(0.7)
        .play()
}