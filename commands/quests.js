/**
 * @author marc.schaefer
 * @date 27.07.2018
 */

var logger = require('winston');
var games = require('../dnd_util/games.js');

module.exports = {
    execute: function(args, message) {
        if(!message.guild) {
            message.author.send("Sorry, but this command doesn't work in direct messages!");
            return;
        }

        if(args.length > 2) {
            logger.log("Too many arguments for !quests command.");
            return;
        }

        if(!args[1]) {
            logger.log("Not enough arguments for !quests command.");
            return;
        }

        for(let g in games) {
            if(games[g].session === args[1].toLowerCase()) {
                let fields = [];
                if(!games[g].quests || games[g].quests.length === 0) {
                    message.channel.send({
                        embed: {
                            title: "Quest List of game " + games[g].session,
                            description: "There are no Quests!",
                            color: 3447003
                        }
                    });
                    return;
                }
                for(let q in games[g].quests) {
                    fields.push({
                        name: "[" + (Number(q)+1) + "] " + games[g].quests[q].description,
                        value: "Status: " + (games[g].quests[q].completed ? "Completed" : "Open")
                    });
                }
                message.channel.send({
                    embed: {
                        title: "Quest List of game " + games[g].session,
                        color: 3447003,
                        fields: fields
                    }
                });
                return;
            }
        }
        message.author.send("Sorry, but the game '" + args[1].toLowerCase() + "' doesn't exist yet.");
    },
    help: "Usage: `!quests <game>` where `<game>` is the name of the game of which you'd like to list the quests.\n" +
        "Lists all quests of the provided game if the game exists."
};