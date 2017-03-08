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
			
		},

	}
}