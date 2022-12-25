const casterToken = await fromUuid(args[0].tokenUuid);

if (!casterToken) {
    ui.notifications.warn("Please select a valid token to use this ability.");
    return;
}

new Sequence()
    .effect()
        .file("jb2a.extras.tmfx.runes.circle.outpulse.evocation")
        .atLocation(casterToken)
        .duration(2000)
        .fadeIn(500)
        .fadeOut(500)
        .scale(0.5)
        .opacity(0.8)
        .filter("Glow", { color: 0xa1c4fd })
        .scaleIn(0, 500, { ease: "easeOutCubic", delay: 100 })
        .waitUntilFinished(-500)
    .effect()
        .file("jb2a.smoke.puff.centered.dark_black")
        .atLocation(casterToken)
        .fadeIn(500)
        .fadeOut(500)
        .scale(0.5)
        .randomRotation()
.play()
await warpgate.wait(2000);

if (args[0].failedSaveUuids.length > 0) {
    // asume there is one target
    const targetToken = await fromUuid(args[0].failedSaveUuids[0]);
    const casterToken = await fromUuid(args[0].tokenUuid);

    const gridSize = 100;
    let isAdjuacent = (Math.abs(targetToken.x - casterToken.x) > gridSize) || (Math.abs(targetToken.y - casterToken.y) > gridSize)
    // console.log(isAdjuacent);

    // play animation between targets
    new Sequence()
        .effect()
            .file("jb2a.witch_bolt.blue")
            .attachTo(casterToken)
            .stretchTo(targetToken, {attachTo: true})
            .duration(5000)
            .fadeIn(500)
            .fadeOut(1000)
            .waitUntilFinished(-2000)
        .effect()
            .file("jb2a.static_electricity.02.blue02")
            .atLocation(targetToken)
            .scaleToObject(1.3)
            .fadeIn(500)
            .fadeOut(500)
            .duration(5000)
        .play()

    if (isAdjuacent) {
        //waiting for the animation
        await warpgate.wait(2000);
        // managing pull with warpgate
        const mutationData = { token: findOffset(targetToken, casterToken, gridSize)};
        await warpgate.mutate(targetToken, mutationData, {}, {permanent: true});
    }
}

// function to find , where to move target (if nessesary)
function findOffset(target, caster, gridPixelsSize) {
    let deltaX = Math.floor((target.x - caster.x)/gridPixelsSize);
    let deltaY = Math.floor((target.y - caster.y)/gridPixelsSize);

    let positionX = target.x;
    let positionY = target.y;

    if (deltaX > 1) {
        positionX = caster.x + gridPixelsSize
    } else if (deltaX < -1) {
        positionX = caster.x - gridPixelsSize
    }

    if (deltaY > 1) {
        positionY = caster.y + gridPixelsSize
    } else if (deltaY < -1) {
        positionY = caster.y - gridPixelsSize
    }

    return {x: positionX, y: positionY}
}

