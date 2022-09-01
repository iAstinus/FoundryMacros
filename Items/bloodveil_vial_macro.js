console.log(args);

let actorData = args[0].actor;
const resourceName = 'Sorcery Points';
const bonus = 5;

let itemData = actorData ? actorData.items.find(i => i.name===resourceName) : null;

for (var key in actorData.data.resources) {
    // console.log(actorData.resources[key]);
    if (actorData.data.resources[key].label === resourceName) {
        // console.log(actorData.resources[key]);

        let updated_value = itemData.data.data.uses['value'] + bonus;
        // console.log('New value:', updated_value);

        actorData.data.resources[key].value = updated_value;
        itemData.data.data.uses['value'] = updated_value;

        if (game.actors.get(actorData._id).sheet.rendered) {
           // Update the actor sheet if it is currently open
           await game.actors.get(actorData._id).render(true);
        }
    }
};



new Sequence()
    .effect()
        .file("modules/jb2a_patreon/Library/Generic/Marker/MarkerRunes03_02_Regular_Red_400x400.webm")
        .atLocation(canvas.tokens.get(args[0].tokenId))
        .scale(0.5)
.play();
