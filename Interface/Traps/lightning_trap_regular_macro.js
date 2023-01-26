const [lightning1] = await Tagger.getByTag('lightningtrap-zoo-source-1');
const [lightning2] = await Tagger.getByTag('lightningtrap-zoo-source-2');

new Sequence()
    .effect()
        .atLocation(lightning1)
        .stretchTo(canvas.tokens.controlled[0])
        .file("jb2a.chain_lightning.primary.blue")
    .effect()
        .atLocation(lightning2)
        .stretchTo(canvas.tokens.controlled[0])
        .file("jb2a.chain_lightning.primary.blue")
    .play();