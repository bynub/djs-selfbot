'use strict';

//const assert = require('node:assert');
const { token } = require('./auth');
//const { Client, Intents } = require('../src');
const { Client, Intents, MessageEmbed } = require('djs-selfbot'); // ./djs-selfbot/src/ npm link && ./djs-selfbot/test/ npm link djs-selfbot   

const client = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
] });

client.on('ready', async () => {
  //try {
    console.log(`Client logged as: ${client.user.tag}`)
  //} catch (error) {
    //console.error(error);
  //} finally {
    //client.destroy();
  //}
});

const embed = new MessageEmbed()
    .setTitle('Alawaina')
    .setDescription('This shouldnt work') //discord has disabled embed messages for user accounts

client.on('messageCreate', message => {
    if(message.author.bot) return;
    if(message.author.id !== client.user.id) return;
    
    if(message.content === 'message'){
        message.channel.send('Answered!') // this should work
    }

    if(message.content === 'embed'){
        message.channel.send({embeds: [embed]}) // this shouldnt :D
    }
});

client.login(token).catch(console.error);
