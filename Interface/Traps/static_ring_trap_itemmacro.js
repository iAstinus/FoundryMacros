let target = Array.from(game.user.targets)[0];

if(args[0] === "on"){
     // If the dynamic active effect started
    new Sequence()
        .effect()
            .file("jb2a.static_electricity.03.blue")
            .attachTo(target)
            .scaleToObject(1.2)
            .opacity(0.8)
            .persist()
            .name(`static-ring-${target.id}`)
            .fadeIn(1000)
            .fadeOut(1000)
        .play()
}

if(args[0] === "off"){
    // If the dynamic active effect ended
    Sequencer.EffectManager.endEffects({ name: `static-ring-${target.id}`, object: target });
}