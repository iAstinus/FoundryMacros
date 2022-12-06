//Paste this code into the ItemMacro code section

let tokenDoc = canvas.scene.tokens.get("CG0UrCKu8gh2MaW9"); //Gets Token ID

    const updates = {
        embedded: {
            Item: {
                "Sample Spell": { //String
                    type: "spell", // feat, spell
                    img: "icons/magic/life/heart-shadow-red.webp", //Example: "icons/magic/holy/projectiles-blades-salvo-yellow.webp"
                    system: {
                        description: {
                            value: "Sample spell", //String
                            },
                        source: "test", //String
                        activation: {
                            type: "action", // action, bonus, crew, day, hour, lair, legendary, minute, none, reaction, special, reactiondamage, reactionmanual
                            cost: 1, // Numeric
                            condition: "" // String
                            },
                        duration: {
                            value: 1, // Numeric
                            units: "hour" // inst, turn, round, minute, hour, day, month, year, perm, spec
                            },
                        target: {
                            value: 1, // Numeric
                            width: null, // Numeric
                            units: "", // self, touch, spec, any, ft, mi, m, km
                            type: "creature" // ally, cone, cube, cylinder, enemy, line, none, object, radius, self, space, sphere, square, wall
                            },
                        range: {
                            value: 30, // Numeric
                            long: null, // Numeric
                            units: "ft" // self, touch, spec, any, ft, mi, m, km
                            },
                        // uses: {
                        //     value: null, // Numeric
                        //     max: "", // Formula
                        //     per: "" // sr, lr, day, charges
                        //     },
                        // consume: {
                        //     type: "", // ammo, attribute, hitDice, charges, material
                        //     target: "", // Leave blank until the item is on the character sheet
                        //     amount: null // Numeric
                        //     },
                        // ability: "", // str, dex, con, int, 
                        actionType: "save", // mwak, rwak, msak, rsak, save, heal, abil, util, other
                        // attackBonus: null, // Numeric
                        chatFlavor: "", // String
                        // critical: {
                        //     threshold: null, // Numeric
                        //     damage: "" // Formula
                        //     },
                        // damage: {
                        //     parts: [
                        //     ["1d6", "radiant"] // ["Formula", "acid, bludgeoning, cold, fire, force, lightning, necrotic, piercing, poison, psychic, radiant, slashing, thunder, healing, temphp"]
                        //     ], 
                        //     versatile: ""}, // Formula
                        // formula: "", // Formula (Labeled as Other Formula)
                        save: {
                            ability: "wis", // str, dex, con, int, wis, cha
                            dc: 15, // Numeric
                            scaling: "flat", // spell, str, dex, con, int, wis, cha, flat
                            },
                        // requirements: "",
                        // recharge: {
                        //     value: null, // Numeric 1-6
                        //     charged: false // true, false
                        //     },
                        //Spell section
                        level: 1, // Numeric 1-9
                        school: "abj", // abj, con, div, enc, evo, ill, nec, trs
                        components: {
                            value: "", // String
                            vocal: true, // true, false
                            somatic: false, // true, false
                            material: false, // true, false
                            ritual: false, // true, false
                            concentration: false // true, false
                            },
                        materials: {
                            value: "", // String
                            consumed: false, // true, false
                            cost: 0, // Numeric
                            supply: 0 // Numeric
                            },
                        preparation: {
                            mode: "atwill", // prepared, pact, always, atwill, innate
                            prepared: true // true, false
                            },
                        scaling: {
                            mode: "none", // cantrip, none, level
                            formula: "" // Formula
                            },
                        //End of spell section
                        // Active Effects
                        
                        },
                        effects: [{ActiveEffect: {
                                                    "Charmed": {
                                                      icon : 'icons/magic/life/heart-shadow-red.webp',
                                                      changes: [],
                                                      duration : {rounds: 10},
                                                    }
                                                }}],
                    }
                },
                // ActiveEffect: 
            }
        };
await warpgate.mutate(tokenDoc, updates);