'use strict';

exports.BattleMovedex = {
	soak: {
		inherit: true,
		onHit: function (target) {
			if (!target.setType('Water')) return false;
			this.add('-start', target, 'typechange', 'Water');
			target.addVolatile('soak');
			target.removeVolatile('forestscurse');
			target.removeVolatile('trickortreat');
			target.removeVolatile('conversion');
			target.removeVolatile('conversion2');
		},
	},

	trickortreat: {
		inherit: true,
		onHit: function (target) {
			if (target.hasType('Ghost')) return false;
			if (!target.addType('Ghost')) return false;
			this.add('-start', target, 'typeadd', 'Ghost', '[from] move: Trick-or-Treat');

			if (target.side.active.length === 2 && target.position === 1) {
				// Curse Glitch
				const decision = this.willMove(target);
				if (decision && decision.move.id === 'curse') {
					decision.targetLoc = -1;
				}
			}
			target.addVolatile('trickortreat');
			target.removeVolatile('forestscurse');
		},
	},

	forestscurse: {
		inherit: true,
		onHit: function (target) {
			if (target.hasType('Grass')) return false;
			if (!target.addType('Grass')) return false;
			this.add('-start', target, 'typeadd', 'Grass', '[from] move: Forest\'s Curse');
			target.addVolatile('forestscurse');
			target.removeVolatile('trickortreat');
		},
	},

	conversion: {
		inherit: true,
		onHit: function (target) {
			let type = this.getMove(target.moveset[0].id).type;
			if (target.hasType(type) || !target.setType(type)) return false;
			this.add('-start', target, 'typechange', type);
			target.removeVolatile('soak');
			target.removeVolatile('forestscurse');
			target.removeVolatile('trickortreat');
			target.addVolatile('conversion');
			target.removeVolatile('conversion2');
		},
	},

	conversion2: {
		inherit: true,
		onHit: function (target, source) {
			if (!target.lastMove) {
				return false;
			}
			let possibleTypes = [];
			let attackType = this.getMove(target.lastMove).type;
			for (let type in this.data.TypeChart) {
				if (source.hasType(type) || target.hasType(type)) continue;
				let typeCheck = this.data.TypeChart[type].damageTaken[attackType];
				if (typeCheck === 2 || typeCheck === 3) {
					possibleTypes.push(type);
				}
			}
			if (!possibleTypes.length) {
				return false;
			}
			let randomType = possibleTypes[this.random(possibleTypes.length)];

			if (!source.setType(randomType)) return false;
			this.add('-start', source, 'typechange', randomType);
			source.removeVolatile('soak');
			source.removeVolatile('forestscurse');
			source.removeVolatile('trickortreat');
			source.removeVolatile('conversion');
			source.addVolatile('conversion2');
		},
	}
}