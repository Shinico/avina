var logger = require('winston');
var applications = require('../util/applications.js');

module.exports = {
    execute: function(args, message) {
        if(!message.guild) {
            message.author.send("Sorry, but this command doesn't work in direct messages!");
            return;
        }

        if(args.length == 2) {
            var appliedRole = getRoleForTag(args[1], message.guild.roles).id;
            if(message.guild.member(message.author).roles.has(appliedRole)) {
                message.author.send("You already have that role! No need to apply for it :)");
                message.delete();
                return;
            }
            if(appliedRole) {
                for(let a in applications) {
                    if(applications[a].user === message.author.id) {
                        if(applications[a].roles.indexOf(appliedRole) !== -1)
                            message.author.send("You have already applied for this role! Admins will review it, just be patient. :)");
                        applications[a].roles.push(appliedRole);
                        message.reply('Your Application for ' + getRoleForTag(args[1], message.guild.roles).name + ' has been registered and will be reviewed by an admin shortly!');
                        message.delete();
                        return;
                    }
                }
                applications.push({
                    user: message.author.id,
                    roles: [appliedRole]
                });
                message.author.send('Your Application for ' + getRoleForTag(args[1], message.guild.roles).name + ' has been registered and will be reviewed by an admin shortly!');
            }
            else {
                message.author.send('Invalid role tag \''+args[1]+'\'. It has to be one of the Server\'s role tags. A tag is a text between \'[\' and \']\' and is between 2 and 4 characters long. It\'s case insensitive!');
            }
        }
        else if(args.length == 1) {
            logger.info('\'apply\' command invalid: Missing Channel Tag parameter!');
        }
        else {
            logger.info('\'apply\' command invalid: Too many parameters!');
        }
        message.delete();
    },
    help: "Usage: `!apply <Tag>` where `<Tag>` can be the tag of any role, e.g. `ga` for the role `[GA] Gamer`\n" +
        "Notes an application for a role on this server, if you don't already have the role."
};

function getRoleForTag(text, roles) {
    text = text.toLowerCase();
    for(let entry of roles) {
        var role = entry[1];
        var tagCloserPos = role.name.substring(3,5).indexOf(']');
        if(role.name.substring(0,1) === '[' && tagCloserPos !== -1) {
            var roleTag = role.name.substring(1,3+tagCloserPos).toLowerCase();
            if(text === roleTag) {
                return role;
            }
        }
    }
    return undefined;
}