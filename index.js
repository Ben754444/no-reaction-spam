const { Plugin } = require("powercord/entities");
const { inject, uninject } = require('powercord/injector');
const {React, getModule, FluxDispatcher, channels} = require("powercord/webpack")
const MessageAccessories = getModule(['MessageAccessories'], false);
const getCachedMessage = getModule(['getMessages'], false).getMessage;
const reactionCache = {}
const Settings = require("./components/Settings.jsx");
let settings;
module.exports = class noReactions extends Plugin {

    async startPlugin() {
        powercord.api.settings.registerSettings(this.entityID, {
            category: this.entityID,
            label: 'No Reaction Spam',
            render: Settings
        })
        settings = this.settings
        inject('no-reactions.remove-reactions', MessageAccessories, 'default', (args, res) => {
            if(settings.get("debug")) console.log(reactionCache[res.props.message.id])
            if(settings.get("debug"))  console.log(res.props.message.reactions)
            if(reactionCache[res.props.message.id] && settings.get("saveReactionStatus", true)) return res; //BROKEN if exists in the cache AND the user wants the status saved, dont update it
            if(res.props.message.reactions.length > Number(settings.get("spamThreshold"))){
                reactionCache[res.props.message.id] = res.props.message.reactions
                if(settings.get("displayOptions")){
                    res.props.message.reactions = [
                        {
                            count: reactionCache[res.props.message.id].length,
                            emoji: {id: "919228458368901151", name: null},
                            me: false
                        },
                        {
                            count: 0,
                            emoji: {id: "919228458448592896", name: null},
                            me: false
                        }
                    ]
                } else {
                    res.props.message.reactions = []
                }

            }


            return res;
        }, false);

        await FluxDispatcher.subscribe('MESSAGE_REACTION_ADD', this.handleReactionButtons);
    }
        async handleReactionButtons(args){
            const message = getCachedMessage(args.channelId, args.messageId)
            if(settings.get("debug"))  console.log(message)
            if(settings.get("debug"))  console.log(args)
            if(args.channelId !== channels.getChannelId()) return;
            if(args.userId !== window.DiscordNative.crashReporter.getMetadata().user_id) return;
            if(args.emoji.id === "919228458368901151"){
                if(settings.get("debug"))  console.log(message.reactions)
                if(settings.get("debug"))  console.log(reactionCache[args.messageId])
                if(!reactionCache[args.messageId]) return console.error("There were no old reactions stored for this message.. oops")
                message.reactions = reactionCache[args.messageId]
            } else if(args.emoji.id === "919228458448592896"){
                message.reactions = []
            }
        }

    pluginWillUnload() {
        powercord.api.settings.unregisterSettings(this.entityID);
        FluxDispatcher.unsubscribe('MESSAGE_REACTION_ADD', this.handleReactionButtons);
        uninject('no-reactions.remove-reactions');
        uninject('no-reactions.show-reactions-menu-item')

    }
}