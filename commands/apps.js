var logger = require('winston');
var applications = require('../util/applications.js');

let rolesCache = {};

module.exports = function(args, message) {
    if(!message.guild.member(message.author).hasPermission('ADMINISTRATOR')) {
        message.author.send("Only admins of a server may use the !apps command! And you are no admin, sorry :/");
        return;
    }

    if(!rolesCache[message.guild.id]) {
        rolesCache[message.guild.id] = message.guild.roles;
    }

    if(args.length > 1) {
        sendApplicationsOfUsers(message);
        return;
    }

    let fields = [];

    applications.forEach(function(app) {
        let roles = "";
        app.roles.forEach(function(role) {
            roles += getRoleNameById(role, message.guild.id) + ", ";
        });
        roles = roles.substring(0, roles.length-2);
        fields.push({
            name: message.guild.member(app.user).nickname,
            value: "Roles: " + roles
        });
    });

    message.author.send({
        embed: {
            title: "List of current role applications",
            fields: fields,
            color: 3447003
        }
    });
};

let getRoleNameById = function(roleId, guildId) {
    if(!rolesCache[guildId]) {
        return undefined;
    }
    for(let role in rolesCache[guildId].array()) {
        if(rolesCache[guildId].array()[role].id === '' + roleId)
            return rolesCache[guildId].array()[role].name
    }
    return undefined;
};

let sendApplicationsOfUsers = function(message) {
    let fields = [];

    let users = message.mentions.users;

    applications.forEach(function(app) {
        if(users.has(app.user)) {
            let roles = "";
            app.roles.forEach(function (role) {
                roles += getRoleNameById(role, message.guild.id) + ", ";
            });
            roles = roles.substring(0, roles.length - 2);
            fields.push({
                name: message.guild.member(app.user).nickname,
                value: "Roles: " + roles
            });
        }
    });

    message.author.send({
        embed: {
            title: "List of current role applications",
            description: "Filtered for mentioned users",
            fields: fields,
            color: 3447003
        }
    });
};