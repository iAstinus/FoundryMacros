let caster = canvas.tokens.get("CG0UrCKu8gh2MaW9");

for (var i = 0; i < 3; i++) {

    // let options = {
    //     align: "top-left", 
    //     edge: "on", 
    //     offset: {x: 0 , y: 0},
    //     gridUnits: true
    // }
    // if (i < 3) {
    //     options["align"] = "top-left";
    //     options["offset"]["x"] = i*0.5;
    //     options["offset"]["y"] = 0;
    // } else if (i >= 3 && i < 5) {
    //     options["align"] = "top-right";
    //     options["offset"]["x"] = 0;
    //     options["offset"]["y"] = (i-2)*0.5; 
    // } else {
    //     options["align"] = "bottom-right";
    //     options["offset"]["x"] = (i-5)*0.5;
    //     options["offset"]["y"] = 0;
    // }

    await new Sequence()
        .effect()
            .name(`${caster}_missile_effect_${i}`)
            .file('jb2a.markers.01.blueyellow')
            .attachTo(caster, {randomOffset: true})
            .scaleIn(0, 2300, {ease: "easeOutCubic"})
            .scaleOut(0, 2300, {ease: "easeOutCubic"})
            .persist()
            .scaleToObject()
            .randomRotation()
        .play()
}
