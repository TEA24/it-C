const Discord = require('discord.js');
const it = new Discord.Client();

it.on('ready', () => {
    console.log(`Logged in as ${it.user.tag}!`);
});

it.on('message', msg => {
    if (msg.content === 'it') {
        msg.reply(' https://discord.gg/6CnaASVAu3');
    }
});

it.login('your-token-here');
