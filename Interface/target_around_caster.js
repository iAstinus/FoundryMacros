console.log('---MACRO START---')
console.log(args[0]);

let range = 10;

let confirmed = false;
let content = `<p><em>Header!</em></p>
    <p>Select targets</p>`;

async function targetsSelector() {
    let value = await new Promise((resolve) => {
        new Dialog({
            title: "Dialog, whooo",
            content: content,
            buttons: {
                done: { label: "Done", callback: async () => confirmed = true },
                cancel: { label: "Cancel", callback: async () => confirmed = false }
            },
            default: "done",

            close: html => {
                (async () => {
                if (confirmed) 
                {
                    console.log('there will be some targets');
                }
                })();
            }
        }).render(true);
    });
    return confirmed;
};

let result = await targetsSelector;

console.log('---MACRO END---');