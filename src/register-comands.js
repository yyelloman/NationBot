const { REST, Routes } = require("discord.js");

const commands = [
    {
        name: "hey",
        description: "replies with hey",
    },
];

const rest = new REST({ version: "10" }).setToken(process.env["TOKEN"]);

(async () => {
    console.log("...Slash command registration async function is running");
    try {
        console.log("  Registering slash commands...");

        await rest.put(
            Routes.applicationGuildCommands(
                process.env["CLIENT_ID"],
                process.env["GUILD_ID"],
            ),
            { body: commands },
        );

        console.log("...Slash commands have been registered correctly");
    } catch (error) {
        console.log(error);
    }
})();
