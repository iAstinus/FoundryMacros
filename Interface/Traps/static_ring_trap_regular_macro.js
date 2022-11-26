// plays animation at chosen location

new Sequence()
    .effect()
        .file('jb2a.static_electricity.01.blue')
        .atLocation({x: 3380, y: 2560})
        .fadeIn(500)
        .fadeOut(500)
        .scale(0.57)
        .duration(5000)
    .play()