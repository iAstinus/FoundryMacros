const tileTemplate = {
    alpha: 0.7,
    
    height: 600,
    width: 600,
    x: 3400,
    y: 2400,
    z: 100,

    hidden: false,
    overhead: true,
    roof: true,
    rotation: 0,
    texture: {
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        tint: null,
        src: "modules/jb2a_patreon/Library/1st_Level/Fog_Cloud/FogCloud_01_White_800x800.webm"
    },
    video: {
        autopay: true,
        loop: true,
        volume: 0
    },


    occlusion: {
        alpha: 0.2,
        mode: 3
    },
    flags: {
        // "betterroofs": {

        // },
        spellEffects: {
            FogCloud: {
                // ActorId: fogParams.targetActorId,
                Id: "LIx4Jg32cvsw9A8a"
            }
        },
        // "monk-active-tiles": {

        // }
    }
};

await canvas.scene.createEmbeddedDocuments("Tile", [tileTemplate]);