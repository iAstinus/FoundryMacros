let target = await fromUuid(args[0].hitTargetUuids[0] ?? "");
let tokenD = canvas.tokens.get(args[0].tokenId);

new Sequence()
    .effect()
        .file('modules/jb2a_patreon/Library/Cantrip/Eldritch_Blast/EldritchBlast_01_Regular_Orange_30ft_1600x400.webm')
        .atLocation(tokenD)
        .stretchTo(args[0].targets[0])
    .play()