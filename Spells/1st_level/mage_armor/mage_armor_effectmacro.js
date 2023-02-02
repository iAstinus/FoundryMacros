let tokenD = canvas.tokens.get(args[1].tokenId);

if(args[0] === "on"){
     // If the dynamic active effect started
    new Sequence()
        .effect()
            .file("jb2a.energy_field.02.above.blue")
            .attachTo(tokenD)
            .scaleToObject(1.5)
            .opacity(0.3)
            .persist()
            .name(`mage-armor-${tokenD.id}`)
            .fadeIn(1000)
            .fadeOut(1000)
        .play()
}

if(args[0] === "off"){
    // If the dynamic active effect ended
    Sequencer.EffectManager.endEffects({ name: `mage-armor-${tokenD.id}`, object: tokenD });
}