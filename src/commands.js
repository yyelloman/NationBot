const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

const commands = [];

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
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
}

const rest = new REST().setToken(process.env["TOKEN"]);

rest.put(Routes.applicationGuildCommands(process.env["CLIENT_ID"], process.env["TESTGUILD_ID"]), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);

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
