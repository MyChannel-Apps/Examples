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

var App = (new function() {
	this.chatCommands = {
		smule: function(user, params, command) {
			var title	= 'Smule.com - Song';
			var link	= params;
			
			if(link.length == 0) {
				user.sendPrivateMessage('Bitte gebe den Smule-Link wie folgt an:°#BB°_/smule http://www.smule.com/p/00000\\_00000:°RR°Songtitel deiner Wahl');
				return;
			}
			
			if(link.replace(/http:/g, '').indexOf(':') > -1) {
				var split	= link.replace(/http:/g, '').split(':');
				link		= 'http:' + split[0];
				title		= split[1];
			}
			
			if(!link.match(/http:\/\/www.smule.com\/p\/([0-9]+)_([0-9]+)/g)) {
				user.sendPrivateMessage('Das ist kein Smule-Link!');
				return;
			}
			
			KnuddelsServer.getDefaultBotUser().sendPublicMessage('°>' + KnuddelsServer.getFullImagePath('smule_small.png') + '<° °W>{+textborder}<>' + title + '|' + link + '<>{-textborder}<°');
		}
	};
}());