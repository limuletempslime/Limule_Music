/**
 * Module Imports
 */
const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");
const { TOKEN, PREFIX } = require("./config.json");
const Discord = require("discord.js");
const client = new Discord.Client({ disableMentions: "everyone" });
const { MessageEmbed } = require('discord.js');


client.login(TOKEN);
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();

/**
 * Client Events
 */
client.on("ready", () => {
    console.log(`${client.user.username} ready!`);
    client.user.setActivity(`${client.guilds.cache.size} serveur | ${PREFIX}help`);
});
client.on("warn", (info) => console.log(info));
client.on("error", console.error);

/**
 * Import all commands
 */
const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(join(__dirname, "commands", `${file}`));
    client.commands.set(command.name, command);
}

client.on("message", async(message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    if (message.content.startsWith(PREFIX)) {
        const args = message.content.slice(PREFIX.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command =
            client.commands.get(commandName) ||
            client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply("There was an error executing that command.").catch(console.error);
        }
    }
});

client.on('guildCreate', guild => {
    const embed = new Discord.MessageEmbed()
        .setThumbnail(guild.iconURL())
        .setDescription(`📌 Merci à **${guild.name}** d'avoir ajouté ${client.user.username} c'est notre ${client.guilds.cache.size} serveur`)
        .addField("📋 __Nom du serveur__", guild.name, true)
        .addField("📊 __Nombre de membres__ :", guild.memberCount, true)
        .addField("💻 __Nombre de salons__ :", guild.channels.cache.size, true)
        .addField("👤 __Propriétaire__ :", guild.owner, true)
        .addField("🌍 __Région du serveur__ :", guild.region, true)
        .addField("📝 __ID du serveur__ :", guild.id, true)
        .addField("🔗 • __Liens__", guild.join, true)
        .setColor("#F03A17")
    client.channels.cache.get('channelid').send(embed);
});

client.on('guildDelete', guild => {
    const embed = new Discord.MessageEmbed()
        .setDescription(`📌 Le serveur **${guild.name}** nous à quitté ! `)
        .addField("📋 __Nom du serveur__", guild.name, true)
        .addField("📊 __Nombre de membres__ :", guild.memberCount, true)
        .addField("💻 __Nombre de salons__ :", guild.channels.cache.size, true)
        .addField("👤 __Propriétaire__ :", guild.owner, true)
        .addField("🌍 __Région du serveur__ :", guild.region, true)
        .addField("📝 __ID du serveur__ :", guild.id, true)
        .setColor("#F03A17")
    client.channels.cache.get('channelid').send(embed);
});