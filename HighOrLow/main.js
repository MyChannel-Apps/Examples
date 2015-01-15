var App = (new function() {
	var _games		= {};
	var _users		= {};
	var _success	= [
		'Gut geschätzt, deine Vermutung war super und _°RR°$NUMBER°r°_ war die Zahl.',
		'_°RR°$NUMBER°r°_ - Krasse Wurst, das war ein Volltreffer.'
	];
	var _failure	= [
		'Das war wohl leider nichts, die gesuchte Zahl war _°RR°$NUMBER°r°_',
		'Oh Nein - Du lagst falsch, die zahl _°RR°$NUMBER°r°_ war leider nicht'
	];
	var _button_lower	= '°>{button}kleiner||call|/hol lower|icon|auction/trend_-2.png|color|120,230,90~60,170,25~24,96,1|height|35|my|10|textborder|1<°';
	var _button_higher	= '°>{button}größer||call|/hol higher|icon|auction/trend_2.png|color|230,90,90~172,26,26~97,1,1|height|35|my|10|textborder|1<°';
	
	this.onUserJoined = function(user) {
		user.sendPrivateMessage('Willkommen bei °BB°_High or Low_°r°!#Probiere die nächste Zahl zu schätzen: °>{button}Runde Starten||call|/hol start|color|120,230,90~60,170,25~24,96,1<°');
	};
	
	function formatNumber(number, decimals, dec_point, thousands_sep) {
		number		= (number + '').replace(/[^0-9+\-Ee.]/g, '');
		var n		= !isFinite(+number) ? 0 : +number,
		prec		= !isFinite(+decimals) ? 0 : Math.abs(decimals),
		sep			= (typeof thousands_sep === 'undefined') ? '.' : thousands_sep,
		dec			= (typeof dec_point === 'undefined') ? ',' : dec_point,
		s			= '',
		toFixedFix	= function(n, prec) {
		var k		= Math.pow(10, prec);
			return '' + (Math.round(n * k) / k)
			.toFixed(prec);
		};
		
		s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
		
		if (s[0].length > 3) {
			s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
		}
		
		if ((s[1] || '').length < prec) {
			s[1] = s[1] || '';
			s[1] += new Array(prec - s[1].length + 1).join('0');
		}
		
		return s.join(dec);
	};
	
	function getLevel(_user) {
		return 1000;
		
		if(levelAbove(_user.level, -1, 5)) {
			return 10;
		} else if(levelAbove(_user.level, 5, 10)) {
			return 100;
		} else if(levelAbove(_user.level, 10, 15)) {
			return 1000;
		} else if(levelAbove(_user.level, 1000, 10000)) {
			return 10000;
		} else {
			return 1000000;
		}
	};
	
	function levelUp(_user) {
		if(_user.rounds >= 5) {
			_user.level++;
			_user.rounds = 0;
		} else {
			_user.rounds++;
		}
	};
	
	function levelAbove(level, min, max) {
		return (levelOver(level, min) && levelUnder(level, max));
	};
	
	function levelOver(level, min) {
		return (level >= min);
	};
	
	function levelUnder(level, max) {
		return (level <= max);
	};
	
	this.chatCommands = {
		hol: function(user, params, command) {
			try{
				var button_new_game = ' °>{button}Neuer Versuch||call|/hol start|disabledTimeout|15000<°';
				var _user			= _users[user.getNick()] | { level: 0, rounds: 0 }
				
				if(params == 'start') {
					var numbers				= RandomOperations.nextInts(getLevel(_user), 2, true);
					_games[user.getNick()]	= numbers;
					user.sendPrivateMessage('Die Zahl °RR°_' + formatNumber(numbers[0]) + '_°r° wurde gezogen. Die nächste Zahl ist: ' + _button_higher + ' oder ' + _button_lower);
				} else if(params == 'higher') {
					var numbers				= _games[user.getNick()];
					var output				= '';
					
					if(typeof(numbers) == 'undefined') {
						user.sendPrivateMessage('Ungültige Aktion');
						return;
					}
					
					if(numbers[0] < numbers[1]) {
						output += _success[Math.floor(Math.random() * _success.length)].replace('$NUMBER', formatNumber(numbers[0]));
						levelUp(_user);
					} else {
						output += _failure[Math.floor(Math.random() * _failure.length)].replace('$NUMBER', formatNumber(numbers[1]));
						_user = { level: 0, rounds: 0 };
					}
					
					var numbers				= RandomOperations.nextInts(getLevel(_user), 2, true);
					_games[user.getNick()]	= numbers;
					user.sendPrivateMessage(output + '. Eine neue Zahl wurde gezogen: °RR°_' + formatNumber(numbers[0]) + '_°r°. ' + _button_higher + ' oder ' + _button_lower + '?');
				} else if(params == 'lower') {
					var numbers				= _games[user.getNick()];
					var output				= '';
					
					if(typeof(numbers) == 'undefined') {
						user.sendPrivateMessage('Ungültige Aktion');
						return;
					}
					
					if(numbers[0] > numbers[1]) {
						output += _success[Math.floor(Math.random() * _success.length)].replace('$NUMBER', formatNumber(numbers[1]));
						levelUp(_user);
					} else {
						output += _failure[Math.floor(Math.random() * _failure.length)].replace('$NUMBER', formatNumber(numbers[1]));
						_user = { level: 0, rounds: 0 };
					}
					
					var numbers				= RandomOperations.nextInts(getLevel(_user), 2, true);
					_games[user.getNick()]	= numbers;
					
					user.sendPrivateMessage(output + ' Eine neue Zahl wurde gezogen: °RR°_' + formatNumber(numbers[0]) + '_°r°. ' + _button_higher + ' oder ' + _button_lower + '?');
				}
			} catch(e) {
				user.sendPrivateMessage('_Exception:_ ' + e.message);
			}
		}
	};
}());