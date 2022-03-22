// Below is what we'll log to the console.

async function load() {
    const availableAccounts = await messenger.accounts.list();

    const table = document.getElementById("main-table");

    const { catchAllBirdAccounts } = await messenger.storage.local.get({ catchAllBirdAccounts: new Set() });

    // For each account add the option to add it to handling by checkbox
    // Some master class html right there
    for (const { id, name, identities } of availableAccounts) {
        if (identities.length === 0)
            continue;
        const domain = identities[0].email.split("@").pop();

        const row = table.insertRow();
        const cellId = row.insertCell(0);
        const cellName = row.insertCell(1);
        const cellDomain = row.insertCell(2);
        const cellCheckbox = row.insertCell(3);

        cellId.textContent = id;
        cellName.textContent = name;
        cellDomain.textContent = domain;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = catchAllBirdAccounts.has(id);
        cellCheckbox.appendChild(checkbox);

        checkbox.addEventListener("change", async () => {
            // Add the accountId to the list of desired ids
            const { catchAllBirdAccounts } = await messenger.storage.local.get({ catchAllBirdAccounts: new Set() });
            if (checkbox.checked) {
                catchAllBirdAccounts.add(id);
            } else {
                catchAllBirdAccounts.delete(id);
            }
            await messenger.storage.local.set({ catchAllBirdAccounts });
        });
    }
}

document.addEventListener("DOMContentLoaded", load);