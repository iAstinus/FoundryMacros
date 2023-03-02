//NOTE: This needs to go into the effect's macro.execute property, rather than midi's 'On Item Use' field.
let tokenD = canvas.tokens.get(args[1].tokenId);

if(args[0] === "off"){
    // If the dynamic active effect ended
    Sequencer.EffectManager.endEffects({ name: `synaptic-static-${tokenD.id}`, object: tokenD });
}