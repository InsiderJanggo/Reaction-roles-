const Discord = require("discord.js");
const db = require("quick.db");
module.exports.run = async (client, message, args) => {
  var roles = db
    .all()
    .filter(data => data.ID.startsWith(`rolereactions_${message.guild.id}`))
    .sort((a, b) => b.data - a.data);

  if (!roles.length) {
    let noEmbed = new Discord.MessageEmbed()
      .setAuthor(message.member.displayName, message.author.displayAvatarURL())
      .setColor("#FF5349")
      .setFooter("Nothing To See Here Yet!");
    return message.channel.send(noEmbed);
  }

  const embed = new Discord.MessageEmbed()
    .setTitle(
      `Role reactions \`POSITION\` | \`ID\` | \`ROLE\` | \`EMOJI\` | \`MESSAGE ID\``
    )
    .setColor("#FF5349");

  let page = Math.ceil(roles.length / 10);
  let pg = parseInt(args[0]);
  if (pg != Math.floor(pg)) pg = 1;
  if (!pg) pg = 1;

  let end = pg * 10;
  let start = pg * 10 - 10;
  let array = [];
  let i;
  if (roles.length === 0) {
    embed.addField("Error", " No pages found!");
  } else if (roles.length <= start) {
    embed.addField("Error", "Page not found!");
  } else if (roles.length <= end) {
    embed.setFooter(`page ${pg} of ${page}`);

    for (i = start; i < roles.length; i++) {
      let data = roles[i].data;
      let goodData = JSON.parse(data);
      let role = message.guild.roles.cache.get(goodData.role);
      let msgurl;
    
      array.push(
        `\`#${roles.indexOf(roles[i]) + 1}\` \`${goodData.id}\` | ${role} | \`${
          goodData.emoji
        }\` | [${goodData.msg}](${goodData.url})`
      );
      embed.setDescription(array.join("\n"));
    }
  } else {
    embed.setFooter(`page ${pg} of ${page}`);

    for (i = start; i < end; i++) {
      let data = roles[i].data;
      let goodData = JSON.parse(data);
      let role = message.guild.roles.cache.get(goodData.role);
      let msgurl;
   
      array.push(
        `\`#${roles.indexOf(roles[i]) + 1}\` \`${goodData.id}\` | ${role} | \`${
          goodData.emoji
        }\` | [${goodData.msg}](${goodData.url})`
      );
      embed.setDescription(array.join("\n"));
    }
  }

  message.channel.send(embed);
};
module.exports.help = {
  name: "rrlist",
  description: "Lists all reactions roles",
  usage: " <page number>",
  aliases: ["rrlist"]
};
