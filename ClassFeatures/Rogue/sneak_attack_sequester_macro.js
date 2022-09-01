let actorData = canvas.tokens.controlled[0] || game.user.character;
let targetActor = game.user.targets.values().next().value;

const data = {};
data.sneakWidth = 300;
data.scale = 1;
data.below = false;
data.anchorX = 0.4;
data.anchorY = 0.5;


new Sequence("Sneak_Attack")
    // .addSequence(sourceFX.sourceSeq)
    .effect()
        .file("modules/jb2a_patreon/Library/1st_Level/Sneak_Attack/Sneak_Attack_Regular_Orange_300x300.webm")
        .atLocation(targetActor)
        .scale((2 * actorData.w / data.sneakWidth) * data.scale)
        .gridSize(canvas.grid.size)
        .belowTokens(data.below)
        .anchor({ x: data.anchorX, y: data.anchorY })
    .play()