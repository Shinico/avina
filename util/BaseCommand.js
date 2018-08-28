import {Message} from "discord.js";

/**
 * Base Command class to be extended by Commands
 * @author marc.schaefer
 * @date 28.08.2018
 */
export class BaseCommand {
    /**
     * Function to be executed when the command was used
     * @param args {string[]} Arguments the user provided when using the command including the command itself at index 0
     * @param message {Message} The Discord.js API Message object of the command message the user sent
     */
    execute(args, message) {

    }

    /**
     * Help String to be displayed when using the !help command
     * @type {string}
     */
    help = ""
}