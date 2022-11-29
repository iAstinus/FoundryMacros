// credits to Tyreal74 for original macro, all effects replaced
let casterToken = canvas.tokens.get(args[0].tokenId);
let target = Array.from(game.user.targets)[0];

new Sequence()

.effect()
    .file("jb2a.sacred_flame.source.yellow")
    .atLocation(casterToken)
    .duration(4000)
    .fadeIn(500)
    .fadeOut(500)
    .scale(0.5)
    .filter("Glow", { color: 0xFFA500 })
    .waitUntilFinished(-1000)

.effect()
    .file("jb2a.chain_lightning.primary.orange")
    .atLocation({ x: target.center.x, y: target.center.y - (canvas.grid.size * 2) })
    .stretchTo(target)
    .waitUntilFinished(-1000)

.effect()
    .from(target)
    .duration(2500)
    .fadeIn(500)
    .fadeOut(500)
    .atLocation(target)
    .filter("Glow", { color: 0xFFA500 })
    .scaleToObject()

.effect()
    .file("jb2a.sacred_flame.target.yellow")
    .atLocation(target)
    .fadeIn(500)
    .fadeOut(500)
    .waitUntilFinished()

.play()