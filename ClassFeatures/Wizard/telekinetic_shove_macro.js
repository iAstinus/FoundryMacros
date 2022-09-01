(async () => {

let actorData = canvas.tokens.controlled[0] || game.user.character;
let action = "none";
let failedActor = args[0];
// console.log("failed Actor", failedActor);

if(actorData == null) 
    ui.notifications.warn(`Please, select your character`);
else if (game.user.targets.size !== 1)
    ui.notifications.warn(`Please target one token.`);
else
{
    let targetActor = game.user.targets.values().next().value;
    // console.log("target Actor", targetActor)
    if (failedActor == targetActor.id) {

        let content = `<p>Do you want to Push or Pull ${targetActor.actor.data.name}?</p>`;
        let x_actor = actorData.x;
        let y_actor = actorData.y;
        let x_target = targetActor.x;
        let y_target = targetActor.y;
        let x_delta = x_target - x_actor;
        let y_delta = y_target - y_actor;
        let x_move = 0;
        let y_move = 0;

        new Dialog({
                title: actorData.name + " tries to shove " + targetActor.actor.data.name,
                content: content,      
                buttons: {
                    push: { label: "Push", callback: () => action = "push" },
                    pull: { label: "Pull", callback: () => action = "pull" }
                    // cancel: { label: "Cancel", callback: () => action = "pull" }
                },
                default: "none",

                close: html => {
                    (async () => {
                    if (action == "push") 
                    {
                        if (x_delta > 0) {x_move = canvas.grid.size}
                        else if (x_delta < 0) {x_move = -1*canvas.grid.size}

                        if (y_delta > 0) {y_move = canvas.grid.size}
                        else if (y_delta < 0) {y_move = -1*canvas.grid.size}

                        await targetActor.document.update({"x": x_target + x_move, "y": y_target + y_move})
                    }
                    else if (action == "pull") {
                        if (x_delta < 0) {x_move = canvas.grid.size}
                        else if (x_delta > 0) {x_move = -1*canvas.grid.size}

                        if (y_delta < 0) {y_move = canvas.grid.size}
                        else if (y_delta > 0) {y_move = -1*canvas.grid.size}

                        await targetActor.document.update({"x": x_target + x_move, "y": y_target + y_move})
                    }
                    })();
                }
            }).render(true);
    }
}
})();