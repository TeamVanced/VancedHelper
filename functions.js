const Discord = require('discord.js')
const config = require('config')

exports.logchannel = config.logchannel;
exports.prefix = config.prefix

exports.newEmbed = () => {
    return new Discord.RichEmbed().setTimestamp().setColor(Math.random().toString(16).slice(2, 8).toUpperCase())
};

exports.logCommand = (message, command, args) => {
    try {
        const output = new Discord.RichEmbed()
            .setColor(Math.random().toString(16).slice(2, 8).toUpperCase())
            .setAuthor(`${message.author.tag}`, message.author.avatarURL)
            .setDescription(`**Issued the command \`${command.name}\` in ${message.channel}**`)
            .setFooter(`Author: ${message.author.id} | Message ID: ${message.id}`)
            .setTimestamp()

        if (args && args.length) {
            output.addField('Args', args.join(' '), false)
        }

        return message.client.channels.get(config.logchannel).send(output)
    }
    catch (error) {
        console.error(error)
        message.client.channels.get(config.errorChannel).send(`<@${config.devs.join('> <@')}> An error occured!\n\`\`\`js\n${error.stack}\`\`\``)
    }
};

exports.uncolour = (client) => {
    try {
        const guild = client.guilds.get('328493314485518336')
        const colorRoles = []
        const victims = []
        guild.roles.forEach(role => {
            if (role.name.endsWith('-CC'))
                colorRoles.push(role)
        })
        colorRoles.forEach(role => {
            if (!role.members.size) return role.delete();
            role.members.forEach(member => {
                if (!member.roles.find(r => r.name === "Nitro Booster")) {
                    role.delete();
                    victims.push(member.user.tag)
                }
            })

        })
        const output = victims.length ? `Removed the Colour Role(s) from ${victims.join(', ')}` : false;
        if (!output) return;
        client.channels.get(config.logchannel).send(output)
    }
    catch (err) {
        console.error(err)
    }
};

exports.getRole = (message, args, spot) => {
    const roleInput = args[spot];
    let role = message.guild.roles.get(roleInput);
    if (!role) role = message.guild.roles.get(roleInput.substring(3, roleInput.length - 1));
    if (!role) role = message.guild.roles.find(role => role.name.substring(0, roleInput.length).toLowerCase() === roleInput.toLowerCase());
    return role ? role : false;
};
exports.noRole = (message) => {
    message.reply('You did not provide a valid role. Please run the command again and this time provide a valid role! This can be a mention, its id or its name')
        .then(message => message.delete(3000));
};
exports.getMember = (message, args, spot) => {
    const memberInput = args[spot];
    let member = message.guild.members.get(memberInput);
    if (!member) member = message.guild.members.get(memberInput.substring(3, memberInput.length - 1));
    if (!member) member = message.guild.members.find(member => member.user.username.substring(0, memberInput.length).toLowerCase() === memberInput.toLowerCase());
    return member ? member : false;
};
exports.noMember = (message) => {
    message.reply('You did not provide a valid member. Please run the command again and this time provide a valid member! This can be a mention, their id or their name')
        .then(message => message.delete(3000));
};

exports.reply = (message, text) => {
    message.reply(text)
        .then(message => message.delete(3000));
};

exports.errorMessage = (message, text) => {
    message.reply(text)
        .then(msg => {
            msg.delete(3000);
            if (message.guild)
                message.delete(3000);
        });
},