```JS

const Discord = require('discord.js');
const it = new Discord.Client();

it.on('ready', () => {
    console.log(`Logged in as ${it.user.tag}!`);
});


it.login('your-token-here');
```