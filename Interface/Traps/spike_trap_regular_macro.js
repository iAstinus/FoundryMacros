const [spike1] = await Tagger.getByTag('spiketrap-forefathers-source');

new Sequence()
    .effect()
        .atLocation(spike1)
        .file("jb2a.spike_trap.10x05ft.side.base.normal.01.01")
        .scale(0.8)
    .play();