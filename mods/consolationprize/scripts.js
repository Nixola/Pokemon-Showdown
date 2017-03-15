'use strict';

exports.BattleScripts = {
	pokemon: {
		formeChange: function (template, source) {
			template = this.battle.getTemplate(template);

			if (!template.abilities) return false;

			template = this.battle.singleEvent('ModifyTemplate', this.battle.getFormat(), null, this, source, null, template);

			if (!template) return false;

			this.template = template;

			this.types = template.types;
			this.addedType = template.addedType || '';
			this.knownType = true;

			if (!source) {
				let stats = this.battle.spreadModify(this.template.baseStats, this.set);
				if (!this.baseStats) this.baseStats = stats;
				for (let statName in this.stats) {
					this.stats[statName] = stats[statName];
					this.baseStats[statName] = stats[statName];
					if (this.modifiedStats) this.modifiedStats[statName] = stats[statName]; // Gen 1: Reset modified stats.
				}
				if (this.battle.gen <= 1) {
					// Gen 1: Re-Apply burn and para drops.
					// FIXME: modifyStat() is only defined for the Gen 1 mod...
					if (this.status === 'par') this.modifyStat('spe', 0.25);
					if (this.status === 'brn') this.modifyStat('atk', 0.5);
				}
				this.speed = this.stats.spe;
			}

			this.battle.singleEvent('ModifiedTemplate', this.battle.getFormat(), null, this, source, null, template);

			return true;
		},
	},
};
