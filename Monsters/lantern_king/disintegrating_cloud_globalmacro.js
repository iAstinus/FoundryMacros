let storms = Tagger.getByTag('disintegration-cloud');

ChatMessage.create({
    user: game.user._id,
    speaker: ChatMessage.getSpeaker({token: actor}),
    content: `<img src="icons/magic/air/wind-vortex-swirl-blue.webp" title="Font of Magic" width="36" height="36" /><br>Storm is growing...`
    });

storms.forEach(storm => {
    var size = storm.distance;
    if (size <= 30) {
        storm.update({
            "distance": size + 5,
        })
    } else {
        storm.delete()
    }
});