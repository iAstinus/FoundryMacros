// credits to Wolfe from Foundry Discord
// Telekinetic - Shove
// Requires Midiqol, warpgate, and item macro modules

let combatTime;
// if (game.combat) {
//     combatTime = `${game.combat.id} - 100*${game.combat.round} + ${game.combat.turn}`;
//     const lastTime = actor.getFlag('world', 'TelekineticShoveUsed');
//     if (combatTime === lastTime) return;
// }

if(args[0].failedSaves.length !==0) applyTargetMove(combatTime);
else {
         ui.notifications.notify("Target resists your shove!");
         return;
       }

async function applyTargetMove(time) {
    const targetDoc = game.user.targets.first().document;
    const casterToken = canvas.tokens.get(args[0].tokenId);
    const targetToken = targetDoc.object;
    const targetCenter = targetToken.center;
    const maxRange = 5;
    let distance = 0;
    let ray;
    console.log(targetCenter);
    const checkDistance = async (crosshairs) => {
        while (crosshairs.inFlight) {
               await warpgate.wait(100);
               ray = new Ray(targetCenter, crosshairs);
               distance = canvas.grid.measureDistances([{ ray }], { gridSpaces: true })[0]
               if(canvas.grid.isNeighbor(ray.A.x/canvas.grid.w,ray.A.y/canvas.grid.w,ray.B.x/canvas.grid.w,ray.B.y/canvas.grid.w) === false || canvas.scene.tokens.some(i=>i.object.center.x===ray.B.x && i.object.center.y===ray.B.y)) {
                crosshairs.icon = 'icons/magic/air/wind-vortex-swirl-purple.webp'
            } 
            else {
                crosshairs.icon = targetDoc.texture.src
            }
            crosshairs.draw()
            crosshairs.label = `${distance}/${maxRange} ft`
           }
    }
    const callbacks = {
            show: checkDistance
    }
    let distanceCheck = await warpgate.crosshairs.show({ size: targetDoc.width, icon: targetDoc.texture.src, label: '0 ft.', interval: -1 }, callbacks);

    while (canvas.scene.tokens.some(tok=>tok !== targetToken && tok.object.center.x===ray.B.x && tok.object.center.y===ray.B.y || distance > 5)) {
        ui.notifications.warn(`Telekinetic Shove: Cannot move ${targetDoc.name} on top of another token or further than 5ft away`);
        distanceCheck = await warpgate.crosshairs.show({ size: targetDoc.width, icon: targetDoc.texture.src, label: '0 ft.', interval: -1 }, callbacks);
    let {cancelled} = distanceCheck;
    if (cancelled) return;
    }
    const {x,y,cancelled} = distanceCheck;
    if(cancelled) return;
    const newCenter = canvas.grid.getSnappedPosition(x - targetToken.w / 2, y - targetToken.h / 2, 1);

    // const knockBackFactor = maxRange / canvas.dimensions.distance;
    // const vRay = new Ray(casterToken.center, targetCenter);
    // const knockbackPixels = knockBackFactor * canvas.grid.size * (Math.abs(1/Math.cos(vRay.angle))); //for 5/5/5 grids.
    // let testCenter = vRay.project((vRay.distance + knockbackPixels)/vRay.distance);
    // const isAllowedLocation = canvas.effects.visibility.testVisibility({x: testCenter.x, y: testCenter.y}, {object: casterToken}); //might have an issue with going through walls based on some vision settings...
    // if(!isAllowedLocation) return ChatMessage.create({content: `${targetToken.name} hits a wall`});

    const mutationData = { token: {x: newCenter.x, y: newCenter.y}};
    await warpgate.mutate(targetDoc, mutationData, {}, {permanent: true});
    // if(game.combat) await actor.setFlag('world', 'TelekineticShoveUsed', `${time}`);
    // else if(!game.combat && actor.getFlag('world','TelekineticShoveUsed')) await actor.unsetFlag('world','TelekineticShoveUsed');
}