// console.log(args);
if (args[0] === "on") {
    const lastArg = args[args.length - 1];
    let targetActor, targetToken;
    if (lastArg.tokenId) {
        targetToken = canvas.tokens.get(lastArg.tokenId);
        targetActor = targetToken.actor
    }
    else targetActor = game.actors.get(lastArg.actorId);

    // console.log("Targets:");
    // console.log(targetActor, targetToken);

    const filePath = "modules/autoanimations/src/images/teleportCircle.png"

    let vwSequence01 = new Sequence()
    vwSequence01.effect()
        .file(filePath)
        .atLocation(targetToken)
        .size(18 * 2 * canvas.grid.size)
        .fadeIn(500)
        .scaleIn(0, 500)
        .fadeOut(500)
        .name("teleportationArea")
        .belowTokens(true)
        .persist(true)
        .opacity(0.9)
        .filter("Glow", {
            distance: 20,
            outerStrength: 10,
            innerStrength: 5,
            color: 0xff0000,
            quality: 0.5,
        })
        // .forUsers(hideBorder)
    await vwSequence01.play()

    let pos;
    canvas.app.stage.addListener('pointerdown', event => {
        if (event.data.button !== 0) { return }
        pos = event.data.getLocalPosition(canvas.app.stage);

        console.log(pos);

        if ((pos.x - targetToken.x)**2 + (pos.y - targetToken.y)**2  > (18 * canvas.grid.size)**2) {
            ui.notifications.error(game.i18n.format("AUTOANIM.teleport"))
        } else {
            deleteTemplatesAndMove();
            canvas.app.stage.removeListener('pointerdown');
        }
    });

    async function deleteTemplatesAndMove() {
        let gridPos = canvas.grid.getTopLeft(pos.x, pos.y);
        let centerPos;
        if (canvas.scene.gridType === 0) {
            centerPos = [gridPos[0] + sourceToken.w, gridPos[1] + sourceToken.w];
        } else {
            centerPos = canvas.grid.getCenter(pos.x, pos.y);
        }
        // game.macros.getName('TeleportAnimatedMacro').execute(targetToken, gridPos)

        let vwSequence02 = new Sequence()
        vwSequence02.effect()
                .file("modules/jb2a_patreon/Library/2nd_Level/Misty_Step/MistyStep_01_Regular_Orange_400x400.webm")
                .atLocation(targetToken)
                .scale(0.35)
                .randomRotation()
            .wait(1000)
            .animation()
                .on(targetToken)
                .teleportTo({
                    x: gridPos[0],
                    y: gridPos[1]
                })
                .waitUntilFinished()
            .effect()
                .file("modules/jb2a_patreon/Library/2nd_Level/Misty_Step/MistyStep_02_Regular_Orange_400x400.webm")
                .atLocation(targetToken)
                .scale(0.5)
                .randomRotation()
        await vwSequence02.play();
        // await token.document.update({ x: template.data.x, y: template.data.y }, { animate: false })
        await targetActor.deleteEmbeddedDocuments("ActiveEffect", [lastArg.effectId]);
        Sequencer.EffectManager.endEffects({ name: "teleportationArea" })
    }
};