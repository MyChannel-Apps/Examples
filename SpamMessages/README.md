# SpamMessages

This example app provides commands to send automatic messages

### Available Commands
* /spam   - List all messages
* /spam start - Start the Spammer
* /spam stop - Stop the Spammmer

* /spam add:$MESSAGE - Add a new message
* /spam remove:$INDEX - Removes a message
* /spam edit:$INDEX:$MESSAGE - Edit a message

* /spam delay - List the actual delation-time
* /spam delay:$SECONDS - Change the Delay

* /spam method - List the current display method
* /spam method:public - Display the spam messages as public message
* /spam method:private - Display the spam messages as private message

### Placeholders

You can use Placeholders in your messages

* $CHANNEL
* $BOT

**Only on private**
* $NICK
* $AGE

### Installation

**Step 1:** Install the App in your MyChannel:
```
/apps install knuddelsDEV.30558139.SpamMessages
```
**Step 2:** Set your AppBot:
```
/apps bindBotUser knuddelsDEV.30558139.SpamMessages $NICK
```
**Step 3:** Start the App:
```
/apps start knuddelsDEV.30558139.SpamMessages
```