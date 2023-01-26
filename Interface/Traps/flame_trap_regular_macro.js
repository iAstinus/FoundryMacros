const [flames1] = await Tagger.getByTag('flametrap-vertical-forefathers-source-1');
const [flames2] = await Tagger.getByTag('flametrap-vertical-forefathers-source-2');

new Sequence()
    .effect()
        .atLocation(flames1)
        .file("jb2a.fire_trap.01.orange")
        .scale(0.35)
        .persist()
        .rotate(180)
        .name('flametrap-1')
.play()

new Sequence()
    .effect()
        .atLocation(flames2)
        .file("jb2a.fire_trap.01.orange")
        .scale(0.35)
        .persist()
        .name('flametrap-2')
    .play();