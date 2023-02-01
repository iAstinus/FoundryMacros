let casterToken = canvas.tokens.get(args[0].tokenId);

new Sequence()
    .effect()
        .file("jb2a.moonbeam.01.intro.rainbow")
        .atLocation(casterToken)
        .fadeIn(100)
        .fadeOut(200)
        .duration(1200)
        .waitUntilFinished(-500)
    .effect()
        .file("jb2a.toll_the_dead.blue.shockwave")
        .atLocation(casterToken)
        .fadeIn(500)
        .fadeOut(500)
        .scale(0.5)
        .scaleIn(0, 500, {ease: "easeOutCubic", delay: 100})
.play();