let casterToken = canvas.tokens.get(args[0].tokenId);
let targets = Array.from(game.user.targets);

for (var i = 0; i < targets.length; i++) {
    new Sequence("Sneak_Attack")
        .effect()
            .file("jb2a.sneak_attack.orange")
            .atLocation(targets[i])
            .scaleToObject(1.5)
        .play()
}
