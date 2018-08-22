/**
 * @author marc.schaefer
 * @date 21.08.2018
 */

let mysqlConfig = require("./config.json").database || {
    "host": "127.0.0.1",
    "user": "avina",
    "password": "",
    "database": "Avina"
};
let mysql = require('mysql');
let dbConnection = mysql.createConnection(mysqlConfig);

console.log("Connecting to database...");

dbConnection.connect(function(err) {
    if(err) {
        console.log(err);
        return;
    }
    console.log("Successfully connected to database!");

    console.log("Getting User Info...");
});

// region MAPPED OBJECTS

/**
 * Guild DAO Object
 * @param snowflake {string} The Snowflake ID of the Discord Guild
 * @param checkhoist {boolean}
 * @constructor
 */
export const Guild = function(snowflake, checkhoist) {
    this.snowflake = snowflake;
    this.checkhoist = checkhoist;
};

/**
 * Text Channel DAO Object
 * @param snowflake {string} The Snowflake ID of the Discord Text Channel
 * @param [welcomeMessage] {string} The Welcome Message of the text channel
 * @param ignoreCommands {boolean}
 * @param updateWarframeVersion {boolean}
 * @param notifyWarframeAlerts {boolean}
 * @param guildSnowflake {string} The Snowflake ID of the Discord Guild this text channel is in
 * @constructor
 */
export const TextChannel = function(snowflake, welcomeMessage, ignoreCommands, updateWarframeVersion, notifyWarframeAlerts, guildSnowflake) {
    this.snowflake = snowflake;
    this.welcomeMessage = welcomeMessage || null;
    this.ignoreCommands = ignoreCommands;
    this.updateWarframeVersion = updateWarframeVersion;
    this.notifyWarframeAlerts = notifyWarframeAlerts;
    this.guildSnowflake = guildSnowflake;
};

/**
 * Application DAO Object
 * @param guildSnowflake {string} The Snowflake ID of the Discord Guild
 * @param userSnowflake {string} The Snowflake ID of the Discord User
 * @param roleSnowflake {string} The Snowflake ID of the Discord Role
 * @constructor
 */
export const Application = function(guildSnowflake, userSnowflake, roleSnowflake) {
    this.guildSnowflake = guildSnowflake;
    this.userSnowflake = userSnowflake;
    this.roleSnowflake = roleSnowflake;
};

/**
 * Message DAO Object
 * @param snowflake {string} The Snowflake ID of the Discord Message
 * @param wfAlertMessage {boolean}
 * @param textChannelSnowflake {string} The Snowflake ID of the Discord Text Channel
 * @constructor
 */
export const Message = function(snowflake, wfAlertMessage, textChannelSnowflake) {
    this.snowflake = snowflake;
    this.wfAlertMessage = wfAlertMessage;
    this.textChannelSnowflake = textChannelSnowflake;
};

/**
 * Notification DAO Object
 * @param channelId {string} The ID of the YouTube Channel
 * @param textChannelSnowflake {string} The Snowflake ID of the Discord Text Channel
 * @param [filterLogic] {string} The Filter Logic presented as string
 * @constructor
 */
export const Notification = function(channelId, textChannelSnowflake, filterLogic) {
    this.channelId = channelId;
    this.textChannelSnowflake = textChannelSnowflake;
    this.filterLogic = filterLogic || null;
};

/**
 * Filter DAO Object
 * @param id {number} The ID of the filter
 * @param channelId {string} The ID of the YouTube Channel
 * @param textChannelSnowflake {string} The Snowflake ID of the Discord Text Channel
 * @param attribute {string} The attribute to filter
 * @param value {string} The value to filter for
 * @constructor
 */
export const Filter = function(id, channelId, textChannelSnowflake, attribute, value) {
    this.id = id;
    this.channelId = channelId;
    this.textChannelSnowflake = textChannelSnowflake;
    this.attribute = attribute;
    this.value = value;
};

/**
 * DnDGame DAO Object
 * @param id {number} The ID of the DnDGame
 * @param guildSnowflake {string} The Snowflake ID of the Discord Guild
 * @param name {string} The name of the DnDGame
 * @param playerMax {number} The maximum player count of the DnDGame
 * @param dungeonMasterSnowflake {string} The Snowflake ID of the Discord User who is the DM of this DnDGame
 * @constructor
 */
export const DnDGame = function(id, guildSnowflake, name, playerMax, dungeonMasterSnowflake) {
    this.id = id;
    this.guildSnowflake = guildSnowflake;
    this.name = name;
    this.playerMax = playerMax;
    this.dungeonMasterSnowflake = dungeonMasterSnowflake;
};

/**
 * DnDGamePlayer DAO Object
 * @param playerSnowflake {string} The Snowflake ID of the Discord User who is the player
 * @param gameId {number} The DnD Game ID
 * @param guildSnowflake {string} The Snowflake ID of the Discord Guild
 * @param active {boolean} Whether or not the player is active in the game right now
 * @constructor
 */
export const DnDGamePlayer = function(playerSnowflake, gameId, guildSnowflake, active) {
    this.playerSnowflake = playerSnowflake;
    this.gameId = gameId;
    this.guildSnowflake = guildSnowflake;
    this.active = active;
};

/**
 * DnDQuest DAO Object
 * @param id {number} The ID of the Quest
 * @param gameId {number} The DnD Game ID
 * @param guildSnowflake {string} The Snowflake ID of the Discord Guild
 * @param description {string} The Quest description
 * @param completed {boolean} Whether or not the quest has been completed
 * @constructor
 */
export const DnDQuest = function(id, gameId, guildSnowflake, description, completed) {
    this.id = id;
    this.gameId = gameId;
    this.guildSnowflake = guildSnowflake;
    this.description = description;
    this.completed = completed;
};

//endregion

module.exports = {

    //region GET ENTRIES

    /**
     * Retrieves saved information of a user
     * @param snowflake {string} The snowflake ID of the user
     * @async
     */
    getUser: async function(snowflake) {
        let result = await query("SELECT * FROM u_users where u_snowflake = '" + snowflake + "';");
        if(result)
            return result[0];
        return null;
    },
    /**
     * Retrieves saved information of a guild
     * @param snowflake {string} The snowflake ID of the guild
     * @async
     * @return {Guild}
     */
    getGuild: async function(snowflake) {
        let result =  await query("SELECT * FROM g_guilds where g_snowflake = '" + snowflake + "';");
        if(result)
            return new Guild(result[0].g_snowflake, tinyIntToBool(result[0].g_checkhoist));
        return null;
    },
    /**
     * Retrieves saved information of a text channel
     * @param snowflake {string} The snowflake ID of the text channel
     * @async
     * @return {TextChannel}
     */
    getTextChannel: async function(snowflake) {
        let result = await query("SELECT * FROM t_textchannels where t_snowflake = '" + snowflake + "';");
        if(result)
            return new TextChannel(result[0].t_snowflake, result[0].t_welcomemessage, tinyIntToBool(result[0].t_ignorecommands), tinyIntToBool(result[0].t_updatewarframeversion), tinyIntToBool(result[0].t_notifywarframealerts), result[0].t_g_guild);
        return null;
    },
    /**
     * Retrieves saved information of a message
     * @param snowflake {string} The snowflake ID of the message
     * @async
     * @return {Message}
     */
    getMessage: async function(snowflake) {
        let result = await query("SELECT * FROM m_messages where m_snowflake = '" + snowflake + "';");
        if(result)
            return new Message(result[0].m_snowflake, tinyIntToBool(result[0].m_wfalertmessage), result[0].m_t_textchannel);
        return null;
    },
    /**
     * Retrieves saved role applications of a user in a guild
     * @param userSnowflake {string} The snowflake ID of the user
     * @param guildSnowflake {string} The snowflake ID of the guild
     * @async
     * @return {[Application]}
     */
    getApplications: async function(userSnowflake, guildSnowflake) {
        let result = await query("SELECT * FROM a_applications where a_g_guild = '" + guildSnowflake + "' and a_u_user = '" + userSnowflake + "';");
        if(result) {
            let apps = [];
            result.forEach(function(app) {
                apps.push(new Application(app.a_g_guild, app.a_u_user, app.a_r_role));
            });
            return apps;
        }
        return null;
    },
    /**
     * Retrieves saved dnd games of a guild
     * @param snowflake {string} The snowflake ID of the guild
     * @async
     * @return {[DnDGame]}
     */
    getDnDGames: async function(snowflake) {
        let result = await query("SELECT * FROM d_dndgames where d_g_guild = '" + snowflake + ";");
        if(result) {
            let games = [];
            result.forEach(function(game) {
                games.push(new DnDGame(game.d_id, game.d_g_guild, game.d_name, game.d_playermax, game.d_dp_u_dungeonmaster));
            });
            return games;
        }
        return null;
    },
    /**
     * Retrieves a saved dnd game of a guild
     * @param snowflake {string} The snowflake ID of the guild
     * @param id {number} The ID of the game
     * @async
     * @return {DnDGame}
     */
    getDnDGame: async function(snowflake, id) {
        let result = await query("SELECT * FROM d_dndgames where d_g_guild = '" + snowflake + " and d_id = " + id + ";");
        if(result)
            return new DnDGame(result[0].d_id, result[0].d_g_guild, result[0].d_name, result[0].d_playermax, result[0].d_dp_u_dungeonmaster);
    },
    /**
     * Retrieves a saved dnd game of a guild
     * @param guildSnowflake {string} The snowflake ID of the guild
     * @param dmSnowflake {string} The snowflake ID of the User who is the DM of the game
     * @async
     * @return {DnDGame}
     */
    getDnDGameByDM: async function(guildSnowflake, dmSnowflake) {
        let result = await query("SELECT * FROM d_dndgames where d_g_guild = '" + guildSnowflake + " and d_dp_u_dungeonmaster = '" + dmSnowflake + "';");
        if(result)
            return new DnDGame(result[0].d_id, result[0].d_g_guild, result[0].d_name, result[0].d_playermax, result[0].d_dp_u_dungeonmaster);
    },
    /**
     * Retrieves saved quests of a dnd game
     * @param snowflake {string} The snowflake ID of the guild
     * @param id {number} The ID of the game
     * @async
     * @return {[DnDQuest]}
     */
    getDnDQuests: async function(snowflake, id) {
        let result = await query("SELECT * FROM dq_dndquests where dq_d_g_guild = '" + snowflake + " and dq_d_dndgame = " + id + ";");
        if(result) {
            let quests = [];
            result.forEach(function(quest) {
                quests.push(new DnDQuest(quest.dq_id, quest.dq_d_dndgame, quest.dq_d_g_guild, quest.dq_description, tinyIntToBool(quest.dq_completed)));
            });
            return quests;
        }
        return null;
    },
    /**
     * Retrieves a saved quest of a dnd game
     * @param snowflake {string} The snowflake ID of the guild
     * @param gameId {number} The ID of the game
     * @param questId {number} The ID of the quest
     * @async
     * @return {DnDQuest}
     */
    getDnDQuest: async function(snowflake, gameId, questId) {
        let result = await query("SELECT * FROM dq_dndquests where dq_d_g_guild = '" + snowflake + " and dq_d_dndgame = " + gameId + " and dq_id = " + questId + ";");
        if(result)
            return new DnDQuest(result[0].dq_id, result[0].dq_d_dndgame, result[0].dq_d_g_guild, result[0].dq_description, tinyIntToBool(result[0].dq_completed));
        return null;
    },
    /**
     * Retrieves all DnD Players
     * @async
     */
    getDnDPlayers: async function() {
        return await query("SELECT * FROM dp_dndplayers;");
    },
    /**
     * Retrieves all DnD players of a DnD game
     * @param guildSnowflake {string} The  Snowflake ID of the Discord guild
     * @param gameId {number} The ID of the DnD game
     * @async
     * @return {[DnDGamePlayer]}
     */
    getDnDGamePlayers: async function(guildSnowflake, gameId) {
        let result = await query("SELECT * FROM dpl_dndgameplayers WHERE dpl_d_dndgame = " + gameId + " AND dpl_d_g_guild = '" + guildSnowflake + "';");
        if(result) {
            let players = [];
            result.forEach(function(player) {
                players.push(new DnDGamePlayer(player.dpl_dp_dndplayer, player.dpl_d_dndgame, player.dpl_d_g_guild, tinyIntToBool(player.dpl_active)));
            });
            return players;
        }
        return null;
    },
    /**
     * Retrieves all saved Warframe Alert Messages of a Text Channel
     * @param snowflake {string} The Snowflake ID of the Discord TextChannel
     * @async
     * @return {[Message]}
     */
    getTextChannelWarframeAlertMessages: async function(snowflake) {
        let result = await query("SELECT * FROM m_messages WHERE m_t_textchannel = '" + snowflake + "' AND m_wfalertmessage = 1;");
        if(result) {
            let messages = [];
            result.forEach(function(msg) {
                messages.push(new Message(msg.m_snowflake, tinyIntToBool(msg.m_wfalertmessage), msg.m_t_textchannel));
            });
            return messages;
        }
        return null;
    },
    /**
     * Retrieves all saved YouTube Subscriptions
     * @async
     */
    getYouTubeSubscriptions: async function() {
        return await query("SELECT * FROM y_youtubesubscriptions;");
    },
    /**
     * Retrieves a YouTube Subscription
     * @param channelId {string} The ID of the YouTube Channel
     * @async
     */
    getYouTubeSubscription: async function(channelId) {
        return await query("SELECT * FROM y_youtubesubscriptions WHERE y_channelid = '" + channelId + "';");
    },
    /**
     * Retrieves all saved Notifications for a YouTube channel
     * @param channelId {string} The ID of the YouTube channel
     * @async
     * @return {[Notification]}
     */
    getYoutubeChannelNotifications: async function(channelId) {
        let result = await query("SELECT * FROM n_notifications WHERE n_y_youtubesubscription = '" + channelId + "';");
        if(result) {
            let notifications = [];
            result.forEach(function(not) {
                notifications.push(new Notification(not.n_y_youtubesubscription, not.n_t_textchannel, not.n_filterlogic));
            });
            return notifications;
        }
        return null;
    },
    /**
     * Retrieves all saved filters of a Notification
     * @param channelId {string} The ID of the YouTube Channel
     * @param textChannelSnowflake {string} The Snowflake ID of the Discord TextChannel
     * @async
     * @return {[Filter]}
     */
    getNotificationFilters: async function(channelId, textChannelSnowflake) {
        let result = await query("SELECT * FROM f_filters WHERE f_n_y_youtubesubscription = '" + channelId + "' AND f_n_t_textchannel = '" + textChannelSnowflake + "';");
        if(result) {
            let filters = [];
            result.forEach(function(filter) {
                filters.push(new Filter(filter.f_id, filter.f_n_y_youtubesubscription, filter.f_n_t_textchannel, filter.f_attribute, filter.f_filtervalue));
            });
            return filters;
        }
        return null;
    },

    //endregion

    //region ADD NEW ENTRIES / UPDATE ENTRIES IF THEY EXIST

    /**
     * Adds one or several users to the database if not already there.
     * @param snowflakes {...string} The Snowflake ID(s) of the User(s)
     * @async
     */
    addUsers: async function(...snowflakes) {
        let valuesString = "";
        snowflakes.forEach(function(snowflake) {
            valuesString += "('" + snowflake + "'),"
        });
        valuesString = valuesString.substring(0, valuesString.length-1);
        return await query("INSERT INTO u_users (u_snowflake) VALUES " + valuesString + ";");
    },
    /**
     * Adds one or several guilds to the database if not already there.
     * @param guilds {...Guild} The Guild object(s)
     * @async
     */
    addGuilds: async function(...guilds) {
        let valuesString = "";
        guilds.forEach(function(guild) {
            valuesString += "('" + guild.snowflake + "', " + boolToTinyint(guild.checkhoist) + "),"
        });
        valuesString = valuesString.substring(0, valuesString.length-1);
        return await query("INSERT INTO g_guilds (g_snowflake, g_checkhoist) VALUES " + valuesString + " ON DUPLICATE KEY UPDATE g_checkhoist = VALUES(`g_checkhoist`);");
    },
    /**
     * Adds one or several roles to the database if not already there.
     * @param snowflakes {...string} The Snowflake ID(s) of the Role(s)
     * @async
     */
    addRoles: async function(...snowflakes) {
        let valuesString = "";
        snowflakes.forEach(function(snowflake) {
            valuesString += "('" + snowflake + "'),"
        });
        valuesString = valuesString.substring(0, valuesString.length-1);
        return await query("INSERT INTO r_roles (r_snowflake) VALUES " + valuesString + ";");
    },
    /**
     * Adds one or several text channels to the database if not already there.
     * @param textChannels {...TextChannel} The Snowflake ID(s) of the Role(s)
     * @async
     */
    addTextChannels: async function(...textChannels) {
        let valuesString = "";
        textChannels.forEach(function(textChannel) {
            valuesString += "('" + textChannel.snowflake + "'," +
                (textChannel.welcomeMessage? " '" : " ") + textChannel.welcomeMessage + (textChannel.welcomeMessage? "'," : ",") +
                " " + boolToTinyint(textChannel.ignoreCommands) + "," +
                " " + boolToTinyint(textChannel.updateWarframeVersion) + "," +
                " " + boolToTinyint(textChannel.notifyWarframeAlerts) + "," +
                " '" + textChannel.guildSnowflake + "'),"
        });
        valuesString = valuesString.substring(0, valuesString.length-1);
        return await query("INSERT INTO t_textchannels (t_snowflake, t_welcomemessage, t_ignorecommands, t_updatewarframeversion, t_notifywarframealerts, t_g_guild) VALUES " + valuesString +
            " ON DUPLICATE KEY UPDATE t_weclomemessage = VALUES(`t_welcomemessage`), t_ignorecommands = VALUES(`t_ignorecommands`), t_updatewarframeversion = VALUES(`t_updatewarframeversion`), t_notifywarframealerts = VALUES(`t_notifywarframealerts`);");
    },
    /**
     * Adds one or several applications to the database if not already there.
     * @param applications {...Application} The Application(s)
     * @async
     */
    addApplications: async function(...applications) {
        let valuesString = "";
        applications.forEach(function(app) {
            valuesString += "('" + app.guildSnowflake + "'," +
                " '" + app.userSnowflake + "'," +
                " '" + app.roleSnowflake + "'),"
        });
        valuesString = valuesString.substring(0, valuesString.length-1);
        return await query("INSERT INTO a_applications (a_g_guild, a_u_user, a_r_role) VALUES " + valuesString + ";");
    },
    /**
     * Adds one or several messages to the database if not already there.
     * @param messages {...Message} The Message(s)
     * @async
     */
    addMessages: async function(...messages) {
        let valuesString = "";
        messages.forEach(function(message) {
            valuesString += "('" + message.snowflake + "'," +
                " " + boolToTinyint(message.wfAlertMessage) + "," +
                " '" + message.textChannelSnowflake + "'),"
        });
        valuesString = valuesString.substring(0, valuesString.length-1);
        return await query("INSERT INTO m_messages (m_snowflake, m_wfalertmessage, m_t_textchannel) VALUES " + valuesString +
            " ON DUPLICATE KEY UPDATE m_wfalertmessage = VALUES(`m_wfalertmessage`);");
    },
    /**
     * Adds one or several YouTube Subscription to the database if not already there.
     * @param channelIds {...string} The ID(s) of the YouTube Channel(s)
     * @async
     */
    addYouTubeSubscriptions: async function(...channelIds) {
        let valuesString = "";
        channelIds.forEach(function(channelId) {
            valuesString += "('" + channelId + "'),"
        });
        valuesString = valuesString.substring(0, valuesString.length-1);
        return await query("INSERT INTO y_youtubesubscriptions (y_channelid) VALUES " + valuesString + ";");
    },
    /**
     * Adds one or several notifications to the database if not already there.
     * @param notifications {...Notification} The Notification(s)
     * @async
     */
    addNotifications: async function(...notifications) {
        let valuesString = "";
        notifications.forEach(function(notification) {
            valuesString += "('" + notification.channelId + "'," +
                " '" + notification.textChannelSnowflake + "'," +
                (notification.filterLogic? " '" : " ") + notification.filterLogic + (notification.filterLogic? "')," : "),");
        });
        valuesString = valuesString.substring(0, valuesString.length-1);
        return await query("INSERT INTO n_notifications (n_y_youtubesubscription, n_t_textchannel, n_filterlogic) VALUES " + valuesString +
            " ON DUPLICATE KEY UPDATE n_filterlogic = VALUES(`n_filterlogic`);");
    },
    /**
     * Adds one or several filters to the database if not already there.
     * @param filters {...Filter} The Filter(s)
     * @async
     */
    addFilters: async function(...filters) {
        let valuesString = "";
        filters.forEach(function(filter) {
            valuesString += "(" + filter.id + "," +
                " '" + filter.channelId + "'," +
                " '" + filter.textChannelSnowflake + "'," +
                " '" + filter.attribute + "'," +
                " '" + filter.value + "'),"
        });
        valuesString = valuesString.substring(0, valuesString.length-1);
        return await query("INSERT INTO f_filters (f_id, f_n_y_youtubesubscription, f_n_t_textchannel, f_attribute, f_filtervalue) VALUES " + valuesString +
            " ON DUPLICATE KEY UPDATE f_attribute = VALUES(`f_attribute`), f_filtervalue = VALUES(`f_filtervalue`);");
    },
    /**
     * Adds one or several DnD games to the database if not already there.
     * @param dndGames {...DnDGame} The DnDGame(s)
     * @async
     */
    addDnDGames: async function(...dndGames) {
        let valuesString = "";
        dndGames.forEach(function(game) {
            valuesString += "(" + game.id + "," +
                " '" + game.guildSnowflake + "'," +
                " '" + game.name + "'," +
                " '" + game.playerMax + "'," +
                " '" + game.dungeonMasterSnowflake + "'),"
        });
        valuesString = valuesString.substring(0, valuesString.length-1);
        return await query("INSERT INTO d_dndgames (d_id, d_g_guild, d_name, d_playermax, d_dp_u_dungeonmaster) VALUES " + valuesString +
            " ON DUPLICATE KEY UPDATE d_name = VALUES(`d_name`), d_playermax = VALUES(`d_playermax`), d_dp_u_dungeonmaster = VALUES(`d_dp_u_dungeonmaster`);");
    },
    /**
     * Adds one or several DnD players to the database if not already there.
     * @param snowflakes {...string} The Snowflake ID(s) of the User(s)
     * @async
     */
    addDnDPlayers: async function(...snowflakes) {
        let valuesString = "";
        snowflakes.forEach(function(snowflake) {
            valuesString += "('" + snowflake + "'),"
        });
        valuesString = valuesString.substring(0, valuesString.length-1);
        return await query("INSERT INTO dp_dndplayers (dp_u_user) VALUES " + valuesString + ";");
    },
    /**
     * Adds one or several DnD players of a game to the database if not already there.
     * @param players {...DnDGamePlayer} The Player(s)
     * @async
     */
    addDnDGamePlayers: async function(...players) {
        let valuesString = "";
        players.forEach(function(player) {
            valuesString += "('" + player.playerSnowflake + "'," +
                " " + player.gameId + "," +
                " '" + player.guildSnowflake + "'," +
                " " + boolToTinyint(player.active) + "),"
        });
        valuesString = valuesString.substring(0, valuesString.length-1);
        return await query("INSERT INTO dpl_dndgameplayers (dpl_dp_dndplayer, dpl_d_dndgame, dpl_d_g_guild, dpl_active) VALUES " + valuesString +
            " ON DUPLICATE KEY UPDATE dpl_active = VALUES(`dpl_active`);");
    },
    /**
     * Adds one or several DnD quests of a game to the database if not already there.
     * @param quests {...DnDQuest} The Quest(s)
     * @async
     */
    addDnDQuests: async function(...quests) {
        let valuesString = "";
        quests.forEach(function(quest) {
            valuesString += "(" + quest.id + "," +
                " " + quest.gameId + "," +
                " '" + quest.guildSnowflake + "'," +
                " '" + quest.description + "'," +
                " " + boolToTinyint(quest.completed) + "),"
        });
        valuesString = valuesString.substring(0, valuesString.length-1);
        return await query("INSERT INTO dq_dndquests (dq_id, dq_d_dndgame, dq_d_g_guild, dq_description, dq_completed) VALUES " + valuesString +
            " ON DUPLICATE KEY UPDATE dq_description = VALUES(`dq_description`), dq_completed = VALUES(`dq_completed`);");
    },

    //endregion

    //region DELETE ENTRIES

    /**
     * Deletes all given guilds from the database
     * @param guilds {...Guild} The Guild(s) to be deleted
     */
    deleteGuilds: async function(...guilds) {
        let inString = "(";
        guilds.forEach(function(guild) {
            inString += "'" + guild.snowflake + "',";
        });
        inString = inString.substring(0, inString.length-1) + ")";
        return await query("DELETE FROM g_guilds WHERE g_snowflake IN " + inString + ";");
    },
    /**
     * Deletes all given text channels from the database
     * @param textChannels {...TextChannel} The Text Channel(s) to be deleted
     */
    deleteTextChannels: async function(...textChannels) {
        let inString = "(";
        textChannels.forEach(function(channel) {
            inString += "'" + channel.snowflake + "',";
        });
        inString = inString.substring(0, inString.length-1) + ")";
        return await query("DELETE FROM t_textchannels WHERE t_snowflake IN " + inString + ";");
    },
    /**
     * Deletes all given messages from the database
     * @param messages {...Message} The Message(s) to be deleted
     */
    deleteMessages: async function(...messages) {
        let inString = "(";
        messages.forEach(function(msg) {
            inString += "'" + msg.snowflake + "',";
        });
        inString = inString.substring(0, inString.length-1) + ")";
        return await query("DELETE FROM m_messages WHERE m_snowflake IN " + inString + ";");
    },
    /**
     * Deletes all given users from the database
     * @param snowflakes {...string} The Snowflake ID(s) of the users to be deleted
     */
    deleteUsers: async function(...snowflakes) {
        let inString = "(";
        snowflakes.forEach(function(snowflake) {
            inString += "'" + snowflake + "',";
        });
        inString = inString.substring(0, inString.length-1) + ")";
        return await query("DELETE FROM u_users WHERE u_snowflake IN " + inString + ";");
    },
    /**
     * Deletes all given DnD Players from the database
     * @param snowflakes {...string} The Snowflake ID(s) of the Users
     */
    deleteDnDPlayers: async function(...snowflakes) {
        let inString = "(";
        snowflakes.forEach(function(snowflake) {
            inString += "'" + snowflake + "',";
        });
        inString = inString.substring(0, inString.length-1) + ")";
        return await query("DELETE FROM dp_dndplayers WHERE dp_u_user IN " + inString + ";");
    },
    /**
     * Deletes all given roles from the database
     * @param snowflakes {...string} The Snowflake ID(s) of the roles to be deleted
     */
    deleteRoles: async function(...snowflakes) {
        let inString = "(";
        snowflakes.forEach(function(snowflake) {
            inString += "'" + snowflake + "',";
        });
        inString = inString.substring(0, inString.length-1) + ")";
        return await query("DELETE FROM r_roles WHERE r_snowflake IN " + inString + ";");
    },
    /**
     * Deletes all given YouTube Subscriptions from the database
     * @param channelIds {...string} The ID(s) of the YouTube Channels
     */
    deleteYouTubeSubscriptions: async function(...channelIds) {
        let inString = "(";
        channelIds.forEach(function(channelId) {
            inString += "'" + channelId + "',";
        });
        inString = inString.substring(0, inString.length-1) + ")";
        return await query("DELETE FROM y_youtubesubscriptions WHERE y_channelid IN " + inString + ";");
    },
    /**
     * Deletes all given applications from the database
     * @param applications {...Application} The Application(s) to be deleted
     */
    deleteApplications: async function(...applications) {
        let inString = "(";
        applications.forEach(function(app) {
            inString += "('" + app.guildSnowflake + "',";
            inString += "'" + app.userSnowflake + "',";
            inString += "'" + app.roleSnowflake + "'),";
        });
        inString = inString.substring(0, inString.length-1) + ")";
        return await query("DELETE FROM a_applications WHERE (a_g_guild, a_u_user, a_r_role) IN " + inString + ";");
    },
    /**
     * Deletes all given notifications from the database
     * @param notifications {...Notification} The Notification(s) to be deleted
     */
    deleteNotifications: async function(...notifications) {
        let inString = "(";
        notifications.forEach(function(not) {
            inString += "('" + not.channelId + "',";
            inString += "'" + not.textChannelSnowflake + "'),";
        });
        inString = inString.substring(0, inString.length-1) + ")";
        return await query("DELETE FROM n_notifications WHERE (n_y_youtubesubscription, n_t_textchannel) IN " + inString + ";");
    },
    /**
     * Deletes all given filters from the database
     * @param filters {...Filter} The Filter(s) to be deleted
     */
    deleteFilters: async function(...filters) {
        let inString = "(";
        filters.forEach(function(filter) {
            inString += "(" + filter.id + ",";
            inString += "'" + filter.channelId + "',";
            inString += "'" + filter.textChannelSnowflake + "'),";
        });
        inString = inString.substring(0, inString.length-1) + ")";
        return await query("DELETE FROM f_filters WHERE (f_id, f_n_y_youtubesubscription, f_n_t_textchannel) IN " + inString + ";");
    },
    /**
     * Deletes all given DnD games from the database
     * @param games {...DnDGame} The DnDGame(s) to be deleted
     */
    deleteDnDGames: async function(...games) {
        let inString = "(";
        games.forEach(function(game) {
            inString += "(" + game.id + ",";
            inString += "'" + game.guildSnowflake + "'),";
        });
        inString = inString.substring(0, inString.length-1) + ")";
        return await query("DELETE FROM d_dndgames WHERE (d_id, d_g_guild) IN " + inString + ";");
    },
    /**
     * Deletes all given DnD quests from the database
     * @param quests {...DnDQuest} The DnDQuest(s) to be deleted
     */
    deleteDnDQuests: async function(...quests) {
        let inString = "(";
        quests.forEach(function(quest) {
            inString += "(" + quest.id + ",";
            inString += quest.gameId + ",";
            inString += "'" + quest.guildSnowflake + "'),";
        });
        inString = inString.substring(0, inString.length-1) + ")";
        return await query("DELETE FROM dq_dndquests WHERE (dq_id, dq_d_dndgame, dq_d_g_guild) IN " + inString + ";");
    },
    /**
     * Deletes all given players of a DnD game from the database
     * @param players {...DnDGamePlayer} The DnDGamePlayer(s) to be deleted
     */
    deleteDnDGamePlayers: async function(...players) {
        let inString = "(";
        players.forEach(function(player) {
            inString += "('" + player.playerSnowflake + "',";
            inString += player.gameId + ",";
            inString += "'" + player.guildSnowflake + "'),";
        });
        inString = inString.substring(0, inString.length-1) + ")";
        return await query("DELETE FROM dpl_dndgameplayers WHERE (dpl_dp_dndplayer, dpl_d_dndgame, dpl_d_g_guild) IN " + inString + ";");
    },

    //endregion
};

/**
 *
 * @param queryString {string}
 * @returns {Promise<any>}
 */
let query = function(queryString) {
    return new Promise(resolve => dbConnection.query(queryString, function(error, result, fields) {
        if(error) {
            resolve(error);
            return;
        }
        if(result[0]) {
            resolve(result);
            return;
        }
        resolve();
    }));
};

/**
 * Parses a boolean to a tinyint (0 or 1)
 * @param bool {boolean}
 * @returns {number} 1 if bool is true, 0 if bool is false
 */
let boolToTinyint = function(bool) {
    return bool? 1: 0;
};

/**
 * Parses a tinyInt (0 or 1) to a boolean
 * @param tinyInt {number}
 * @returns {boolean} true if tinyInt is 1, false otherwise
 */
let tinyIntToBool = function(tinyInt) {
    return tinyInt === 1;
};