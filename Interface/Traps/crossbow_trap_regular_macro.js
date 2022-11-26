// credits to Sequencer advanced trap macro

const trapActor = game.actors.getName("Traps");
const trapItem = trapActor.items.getName("Crossbow Trap");

new MidiQOL.TrapWorkflow(trapActor, trapItem, [token]);

Hooks.once("midi-qol.RollComplete", async function(result){

    const [topLeftTile] = await Tagger.getByTag('topleft-crossbow-trap-source');
    const [bottomLeftTile] = await Tagger.getByTag('bottomleft-crossbow-trap-source');
    const [topRightTile] = await Tagger.getByTag('topright-crossbow-trap-source');
    const [bottomRightTile] = await Tagger.getByTag('bottomright-crossbow-trap-source');

    const topTarget = result.failedSaves.has(token) ? token : topLeftTile;
    const bottomTarget = result.failedSaves.has(token) ? token : bottomLeftTile;

    new Sequence()
        .effect()
            .file("jb2a.arrow.physical.white.01")
            .atLocation(topRightTile, { randomOffset: true })
            .stretchTo(bottomTarget)
            .repeats(3, 30, 60)
        .effect()
            .file("jb2a.arrow.physical.white.01")
            .atLocation(bottomRightTile, { randomOffset: true })
            .stretchTo(topTarget)
            .repeats(3, 30, 60)
        .play();
});