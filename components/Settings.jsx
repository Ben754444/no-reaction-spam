const { React } = require('powercord/webpack'); // We have to import React
const { TextInput, SwitchItem, Category } = require('powercord/components/settings'); // Here we Import the TextInput Component for later use

//This section is the Page the user sees
module.exports = class settings extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { opened: false };
    }

    render() {
        return(
            <div>
                <SwitchItem
                    onChange={val => this.props.updateSetting('displayOptions', val)}
                    value={this.props.getSetting('displayOptions', true)}
                    required={true}
                    disabled={false}
                    note='Adds a tick and cross emoji in place of reaction spam. The tick will bring back the spammed reactions and the cross will remove the options.'
                >
                    Display Options
                </SwitchItem>
                <TextInput
                    onChange={val => {
                        if(Number.isInteger(Number(val))){
                            if(Number(val) > 20 || !Number(val) < 0){
                                this.props.updateSetting('spamThreshold', this.props.getSetting('spamThreshold', '5'))
                            } else {
                                this.props.updateSetting('spamThreshold', val)

                            }
                        } else {
                            this.props.updateSetting('spamThreshold', this.props.getSetting('spamThreshold', '5'))
                        }
                    }}
                    value={this.props.getSetting('spamThreshold', '5')}
                    required={true}
                    disabled={false}
                    note='(Integer between 0 and 20) Any number of unique reactions above this threshold will be considered spam and hidden.'
                >
                    Spam Threshold
                </TextInput>
                <Category
                    name='Hidden'
                    description={'Hidden settings, for advanced users only!'}
                    opened={this.state.opened}
                    onChange={() => this.setState({ opened: !this.state.opened })}
                >
                    <SwitchItem
                        onChange={val => this.props.updateSetting('debug', val)}
                        value={this.props.getSetting('debug', false)}
                        required={false}
                        disabled={false}
                        note="Floods the console with useless information. Even I don't leave this enabled."
                                            >
                        Debug
                    </SwitchItem>
                    <SwitchItem
                        onChange={val => this.props.updateSetting('saveReactionStatus', val)}
                        value={this.props.getSetting('saveReactionStatus', true)}
                        required={true}
                        disabled={true}
                        note='!!This setting is currently broken. I am keeping it here in case I decide to fix it at some point.!! When enabled, messages containing reaction spam will save their state from their previous action. E.g. if you click to show the spammed reactions, the spam will be shown instead of the options.'
                    >
                        [BROKEN] Save Reaction Status
                    </SwitchItem>

                </Category>

            </div>
        )
    }
}