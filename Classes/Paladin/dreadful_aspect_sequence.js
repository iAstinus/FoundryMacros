let actorData = canvas.tokens.controlled[0] || game.user.character;

const data = {};
data.sneakWidth = 300;
data.scale = 3;
data.below = false;
data.anchorX = 0.4;
data.anchorY = 0.5;

new Sequence("Dreadful_Aspect")
    // .addSequence(sourceFX.sourceSeq)
    .effect()
        .file("modules/jb2a_patreon/Library/1st_Level/Sneak_Attack/Sneak_Attack_Dark_Red_300x300.webm")
        .atLocation(actorData)
        .scale((2 * actorData.w / data.sneakWidth) * data.scale)
        .gridSize(canvas.grid.size)
        .belowTokens(data.below)
        .anchor({ x: data.anchorX, y: data.anchorY })
    .play()