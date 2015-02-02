/**
	The MIT License (MIT)

	Copyright (c) 2014 MyChannel-Apps.de

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
	
	@author		Adrian Preuß, Bizarrus
*/

require('framework/KFramework.js');

var App = (new function() {
	var messages	= [];
	var delay		= 30;
	var send_method	= 'private';
	var interval_id;
	
	function getRandomMessage() {
		var message	= messages.random();
		
		if(message == undefined || message == null) {
			getRandomMessage();
			return;
		}
		
		switch(send_method) {
			case 'public':
				message = parseMessageString(message);
				
				if(message == undefined) {
					return;
				}
				
				Bot.public(message);
			break;
			case 'private':
				Channel.getUsers().each(function(user) {
					message = parseMessageString(message, user);
				
					if(message == undefined) {
						return;
					}
					
					Bot.private(user, message);
				});
			break;
		}
	}
	
	function parseMessageString(string, user) {
		if(string == undefined || string == null || typeof(string) == 'object') {
			return;
		}
		
		if(user != undefined) {
			string = string.replace(/\$NICK/g, user.getProfileLink());
			string = string.replace(/\$AGE/g, user.getAge());
		}
		
		string = string.replace(/\$CHANNEL/g, Channel.getName());
		string = string.replace(/\$BOT/g, Bot.getNick());
		
		return string;
	}
	
	function getSendMethod() {
		switch(send_method) {
			case 'public':
				return 'Öffentlich';
			break;
			case 'private':
				return 'Privat';
			break;
		}
	}
	
	this.onAppStart = function() {
		// load data
		messages	= DB.load('messages',		messages);
		delay		= DB.load('delay',			delay);
		send_method	= DB.load('send_method',	send_method);
		
		interval_id	= setInterval(getRandomMessage, delay * 1000);
	};
	
	this.onShutdown = function() {
		// save data
		DB.save('messages',		messages);
		DB.save('delay',		delay);
		DB.save('send_method',	send_method);
		
		if(interval_id != undefined) {
			clearInterval(interval_id);
		}
		
		// Kill Cronjobs
		Cron.onShutdown();
	};
	
	this.chatCommands = {
		spam: function(user, params, command) {
			if(!user.isChannelModerator() && !user.isChannelOwner()) {
				Bot.private(user, 'Dir fehlen die notwendigen Rechte für diese Funktion.');
				return;
			}
			
			if(params.length == 0) {
				var text = new KCode();
					
				if(messages.size() == 0) {
					text.append('Momentan existieren keine Spam-Nachrichten im Channel.');
				} else {
					text.append('Folgende Spam-Nachrichten sind im Channel gespeichert:');
					var temp = [];
					
					messages.each(function(message, index) {
						if(message == undefined || message == null || typeof(message) == 'object') {
							Logger.warn('Messages[' + index + '] is ' + message);
							return;
						} else {
							temp.push(message);
						}
						
						text.newLine();
						text.append(message.escapeKCode());
						text.append(' - _');
						
						var link_edit = new KLink('Bearbeiten');
						link_edit.setCommand('/tf-overridesb /spam edit:' + index + ':[' + message.escapeKCode() + ']');
						text.append(Color.CHANNEL_BLUE);
						text.append(link_edit);
						
						text.append('_°r°§ | _');
						
						var link_remove = new KLink('Löschen');
						link_remove.setCommand('/spam remove:' + index);
						text.append(Color.CHANNEL_RED);
						text.append(link_remove);
						
						text.append('_°r°§');
					});
					messages = temp;
				}
				
				Bot.private(user, text);
			} else {
				var command = params;
				var message	= '';
				var id		= -1;
				
				if(params.indexOf(':') > -1) {
					var split	= params.split(':');
					command		= split[0];
					
					if(split.size() > 2) {
						id		= parseInt(split[1], 16);
					}
					
					split.each(function(entry, index) {
						if(index > (id > -1 ? 1 : 0)) {
							message += entry;
						}
					});
				}
				
				switch(command) {
					case 'add':
						if(message.length == 0) {
							Bot.private(user, 'Was möchtest du denn hinzufügen? Bitte nutze die Funktion wie folgt: °>/tf-overridesb /spam add:[$MESSAGE]<°');
							return;
						}
						
						messages.push(message);
						Bot.private(user, 'Die Nachricht wurde erfolgreich hinzugefügt.');
					break;
					case 'remove':
						var temp = [];
						messages.each(function(text, index) {
							if(parseInt(message, 16) == index) {
								return;
							}
							
							temp.push(text);
						});
						
						messages = temp;
						Bot.private(user, 'Die Nachricht wurde erfolgreich gelöscht.');
					break;
					case 'edit':
						if(messages[id] == undefined) {
							Bot.private(user, 'Die Nachricht konnte nicht bearbeitet werden da diese nicht existiert.');
							return;
						}
						
						messages[id] = message;
						Bot.private(user, 'Die Nachricht wurde erfolgreich bearbeitet.');
					break;
					case 'start':
						if(interval_id != undefined) {
							clearInterval(interval_id);
						}
						
						interval_id	= setInterval(getRandomMessage, delay * 1000);
						Bot.private(user, 'Die Spam-Nachrichten wurden _gestartet_.');
					break;
					case 'stop':
						if(interval_id != undefined) {
							clearInterval(interval_id);
							Bot.private(user, 'Die Spam-Nachrichten wurden _gestoppt_.');
							return;
						}
						
						Bot.private(user, 'Die Spam-Nachrichten wurden nicht gestoppt, da diese nicht laufen.');
					break;
					case 'delay':
						if(message.length == 0) {
							Bot.private(user, 'Der derzeitige Delay ist _' + delay + ' Sekunde' + (delay == 1 ? '' : 'n') + '_.');
							return;
						}
						
						delay = parseInt(message);
						
						if(interval_id != undefined) {
							clearInterval(interval_id);
						}
						
						interval_id	= setInterval(getRandomMessage, delay * 1000);
						
						Bot.private(user, 'Der Delay wurde auf _' + delay + ' Sekunde' + (delay == 1 ? '' : 'n') + '_ geändert.');
					break;
					case 'method':
						if(message.length == 0) {
							Bot.private(user, 'Derzeit werden die Spam-Nachrichten _' + getSendMethod() + '_ versendet.');
							return;
						}
						
						switch(message) {
							case 'public':
								send_method = message;
								Bot.private(user, 'Die Spam-Nachrichten werden nun _' + getSendMethod() + '_ versendet.');
							break;
							case 'private':
								send_method = message;
								Bot.private(user, 'Die Spam-Nachrichten werden nun _' + getSendMethod() + '_ versendet.');
							break;
							default:
								Bot.private(user, 'Unbekannte Methode.');
							break;
						}
					break;
					default:
						Bot.private(user, 'Die Funktion gibt\'s hier leider nicht.');
					break;
				}
			}
		}
	};
}());