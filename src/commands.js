const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

const commands = [];

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
    } else {
        console.log(
            `WARNING: The command at ${filePath} is missing a "data" or "execute" property!!`,
        );
    }
}

const rest = new REST().setToken(process.env["TOKEN"]);

(async () => {
    try {
        console.log(
            `... registering of ${commands.length} slash commands has BEGUN.`,
        );

        const data = await rest.put(
            Routes.applicationCommands(process.env["CLIENT_ID"]),
            { body: commands },
        );

        console.log(
            `... registering of ${data.length} slash commands is SUCCESSFUL.`,
        );
    } catch (error) {
        console.error(`ERROR: ${error}`);
    }
})();
