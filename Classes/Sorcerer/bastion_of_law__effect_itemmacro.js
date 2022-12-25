//this goes to itemmacro of bastion of law reaction items

// declaring targets and caster tokens
const casterToken = canvas.tokens.get(args[0].tokenId);
if (!casterToken) {
    ui.notifications.warn("Please select a valid token to use this ability.");
    return;
}

// primary animation of caster
let sequence = new Sequence()
        .effect()
            .file("jb2a.shield.01.complete.01.yellow")
            .attachTo(casterToken)
            .scaleToObject(2)
            .opacity(0.7)


//play animation
sequence.play()