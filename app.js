function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
} 

const app = Vue.createApp({
    data () {
        return {
            playerHealth : 100,
            monsterHealth : 100,
            round : 0,
            winner : null,
            logMessage : []
        }
    },
    methods: {
        addLogMessage(who, what, value) {
            this.logMessage.push({
                actionBy : who,
                actionType : what,
                actionValue : value
            });
        },
        surrender() {
            this.winner = "monster";
            this.playerHealth = 0;
            this.addLogMessage('player', 'surrender');
        },
        attackMonster() {
            this.round++;
            const attackValue = getRandomNumber(5, 12);
            this.monsterHealth -= attackValue;
            this.addLogMessage('player', 'attack', attackValue);
            this.attackPlayer();
        },
        attackPlayer() {
            const attackValue = getRandomNumber(5, 12);
            this.playerHealth -= getRandomNumber(8, 15);
            this.addLogMessage('monster', 'attack', attackValue);
        },
        specialAttackMonster() {
            this.round++;
            const attackValue = getRandomNumber(15, 36);
            this.monsterHealth -= attackValue;
            this.addLogMessage('player', 'special-attack', attackValue);
            this.attackPlayer();
        },
        healPlayer() {
            this.round++;
            const healValue = getRandomNumber(8, 20);
            if(this.playerHealth + healValue> 100) {
                this.playerHealth = 100;
            } else {
                this.playerHealth += healValue;
            }
            this.addLogMessage('player', 'heal', healValue);
            this.attackPlayer();
        },
        newGame() {
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.round = 0;
            this.winner = null;
            this.logMessage = [];
        }
    },
    computed: {
        monsterBarStyles() {
            if(this.monsterHealth < 0) {
                return {width : '0%'};
            }
            return {width : this.monsterHealth + '%'};
        },
        playerBarStyles() {
            if(this.playerHealth < 0) {
                return {width : '0%'};
            }
            return {width : this.playerHealth + '%'};
        },
        specialDisabled() {
            return this.round % 3 !== 0;
        }
    },
    watch: {
        playerHealth(value) {
            if(value <= 0 && this.monsterHealth <= 0) {
                this.winner = 'draw';
            } else if(value <= 0) {
                this.winner = 'monster';
            }
        },
        monsterHealth(value) {
            if(value <= 0 && this.playerHealth <= 0) {
                this.winner = 'draw';
            } else if(value <= 0) {
                this.winner = 'player';
            }
        }
    }
})

app.mount("#game");