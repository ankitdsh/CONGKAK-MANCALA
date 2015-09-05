var GAME_CONFIG = {
    NO_OF_HOLES: 7,
    NO_OF_COINS: 7
};


var CONGKAK = new(function CONGKAK(params) {
    // SAVING USER CONFIG
    var PARAMS = params;

    // DEFAULT CONFIG
    this.CONFIG = (function() {
        //DEFAULTS
        var TOTAL_HOLES = PARAMS.NO_OF_HOLES || 7,
            TOTAL_COINS = PARAMS.NO_OF_COINS || 7,
            TEMP_COUNTER = 1;

        return {
            NO_OF_HOLES: TOTAL_HOLES,
            NO_OF_COINS: TOTAL_COINS,
            CLOCKWISE: true,
            ITERATE_AFTER: 500, //ms
            ANIMATION: {
                TIMER: 2000, //ms
                ADD_COIN_HOLE: 'pulseMore',
                ADD_COIN_HOUSE: 'rotateIn'
            },
            CSS: {
                DISABLE_PLAYER: 'disablePlayer',
                ADD_PLAYER_TEXT_GLOW: 'activePlayerGlowViolet',
            },
            SOUNDS: {
                ADD_COIN_HOLE: {
                    URL: 'sound/click2.mp3',
                    BUFFER: undefined
                },
                ADD_COIN_HOUSE: {
                    URL: 'sound/coins.mp3',
                    BUFFER: undefined
                },
                WIN: {
                    URL: 'sound/win.mp3',
                    BUFFER: undefined
                },
                ERROR: {
                    URL: 'sound/error.mp3',
                    BUFFER: undefined
                }
            },
            HOUSE: {

                IMG: ''
            },
            HOLE: {
                IMG: ''

            },
            HTML: {
                MAIN_CONTAINER: {
                    NAME: 'body',
                    TYPE: 'div',
                    BACKGROUND: 'img',
                    CLASSES: ['fullbody']
                },
                BOARD: {
                    NAME: 'board',
                    TYPE: 'div',
                    CLASSES: ['board', 'boardBox'],

                },
                PLAYER1_HOUSE: {
                    NAME: 'house',
                    ID: 'PLAYER1_HOUSE',
                    TYPE: 'div',
                    CLASSES: ['house', 'leftHouse', 'animated'],
                    INNERTEXT: 0
                },
                PLAYER2_HOUSE: {
                    NAME: 'house',
                    ID: 'PLAYER2_HOUSE',
                    TYPE: 'div',
                    CLASSES: ['house', 'rightHouse', 'animated'],
                    INNERTEXT: 0
                },
                PLAYER1_TEXT_CONTAINER: {
                    NAME: 'middleContainer',
                    ID: 'PLAYER1_TEXT_CONTAINER',
                    TYPE: 'div',
                    CLASSES: ['activePlayerTextViolet'],
                    INNERTEXT: "PLAYER 1 PLAYING"
                },
                PLAYER2_TEXT_CONTAINER: {
                    NAME: 'middleContainer',
                    ID: 'PLAYER2_TEXT_CONTAINER',
                    TYPE: 'div',
                    CLASSES: ['activePlayerTextViolet'],
                    INNERTEXT: "PLAYER 2 PLAYING"
                },
                HOLES_CONTAINER: {
                    NAME: 'middleContainer',
                    TYPE: 'div',
                    CLASSES: ['middleContainer']
                },
                PLAYER2_HOLES_CONTAINER: {
                    NAME: 'topContainer',
                    ID: 'PLAYER2_HOLE_CONTAINER',
                    TYPE: 'div',
                    CLASSES: ['topContainer']
                },
                PLAYER1_HOLES_CONTAINER: {
                    NAME: 'bottomContainer',
                    ID: 'PLAYER1_HOLE_CONTAINER',
                    TYPE: 'div',
                    CLASSES: ['bottomContainer']
                },
                PLAYER2_HOLE: {
                    NAME: 'hole',
                    ID: 'PLAYER2_HOLE_',
                    UNIQUE_ID_COUNTER: TEMP_COUNTER,
                    TYPE: 'div',
                    CLASSES: ['hole', 'topHole', 'animated'],
                    INNERTEXT: TOTAL_COINS
                },
                PLAYER1_HOLE: {
                    NAME: 'hole',
                    TYPE: 'div',
                    ID: 'PLAYER1_HOLE_',
                    UNIQUE_ID_COUNTER: TEMP_COUNTER,
                    CLASSES: ['hole', 'bottomHole', 'animated'],
                    INNERTEXT: TOTAL_COINS
                },
                MESSAGE_BOARD: {
                    NAME: 'messageBoard',
                    TYPE: 'div',
                    ID: 'MESSAGE_BOARD',
                    CLASSES: ['messageBoard'],
                    INNERTEXT: "ANY PLAYER CAN START!! JUST CLICK ON ANY HOLE"
                },
                STAT_BOX: {
                    NAME: 'statistics',
                    TYPE: 'div',
                    ID: 'STAT_BOX',
                    CLASSES: ['statBox'],
                    INNERTEXT: ""

                }
            },
            MESSAGES: {
                NO_COINS: ",please select any other hole with atleast one coin.",
                PLAYER1_TURN: "PLAYER 1 CHOOSE ANY OF YOUR HOLE...",
                PLAYER2_TURN: "PLAYER 2 CHOOSE ANY OF YOUR HOLE...",
                PLAYER1_WINS: "PLAYER 1 has Won !!",
                PLAYER2_WINS: "PLAYER 2 has Won !!",
                GAME_IN_PROGRESS: "Please Wait game is running !!"

            }
        };
    })();


    // LIVE DOM REPRESENTATION
    this.LIVEGAME = {
        DOM: {
            BODY: undefined,

            BOARD: undefined,
            MESSAGE_BOARD: undefined,

            HOLES_BOX: undefined,
            PLAYER1_HOLES_CONTAINER: undefined,
            PLAYER2_HOLES_CONTAINER: undefined,

            PLAYER1_HOUSE: undefined,
            PLAYER2_HOUSE: undefined,

            PLAYER1_HOLE_1: undefined,
            PLAYER2_HOLE_1: undefined,

            LOOPING_LIST: []

        }
    }

    this.initialize = function() {

        //OVERWRITING DEFAULT PARAMS
        //UNDERSCORE MERGE
        _.extend(this.CONFIG, PARAMS.CONFIG);


        this.createGame();
    };

    //CREATE THE DOM FOR A CONFIGURABLE GAME BOARD
    this.createGame = function() {
        // try {


        var that = this,
            HTML = this.CONFIG.HTML,
            //LIVE DOM REPRESENTATION
            GAME = this.LIVEGAME.DOM,
            MESSAGES = this.CONFIG.MESSAGES,
            NO_OF_HOLES = this.CONFIG.NO_OF_HOLES,
            NO_OF_COINS = this.CONFIG.NO_OF_COINS,

            //KEEPING GAME-ENGINE LOGIC SEPARATE FROM LIVE-DOM REPRESENTATION
            GAME_ENGINE = {
                GAME_OVER: false,
                GAME_SETTINGS: this.CONFIG,
                // HTML: this.CONFIG.HTML,
                // //LIVE DOM REPRESENTATION
                // GAME: this.LIVEGAME.DOM,
                // MESSAGES: this.CONFIG.MESSAGES,
                // NO_OF_HOLES: this.CONFIG.NO_OF_HOLES,


                COUNTER: 0,
                CURRENT_PLAYER: undefined,
                SELECTED_HOLE: undefined,
                COINS_IN_HAND: undefined,
                INITIAL: undefined,
                CURRENT: undefined,

                start: function(item_clicked) {
                    try {
                        this.GAME_IN_PROGRESS = true;


                        // GET THE CURRENT HOLE CLICKED
                        // CHECK WHICH PLAYER
                        // GET THE NO.S OF COINS IN THE HOLE
                        this.SELECTED_HOLE = this.getCurrentHoleDetails(item_clicked);

                        this.CURRENT_PLAYER = this.SELECTED_HOLE.PLAYER_ID;

                        // USED BY WHILE LOOP
                        this.COINS_IN_HAND = this.SELECTED_HOLE.COINS;

                        this.INITIAL = {
                            DOM: this.SELECTED_HOLE.DOM,
                            DOM_ID: this.SELECTED_HOLE.DOM_ID,
                            COINS: this.SELECTED_HOLE.COINS,
                            PLAYER_ID: this.SELECTED_HOLE.PLAYER_ID,
                            HOLE_ID: this.SELECTED_HOLE.HOLE_ID
                        };

                        this.CURRENT = {
                            DOM: this.INITIAL.DOM,
                            DOM_ID: this.INITIAL.DOM_ID,
                            COINS: this.INITIAL.COINS,
                            PLAYER_ID: this.INITIAL.PLAYER_ID,
                            HOLE_ID: this.INITIAL.HOLE_ID
                        };


                        //IF PLAYER SELECTED BLANK HOLE THEN RETURN AND SHOW MESSAGE
                        if (this.COINS_IN_HAND == 0) {
                            this.showMessage("Player " + this.CURRENT_PLAYER + " " + MESSAGES.NO_COINS, 3000);
                            this.playAudio(this.GAME_SETTINGS.SOUNDS.ERROR);
                            return;
                        } else {
                            //EMPTYING THE COINS FOR THE SELECTED HOLE
                            this.setCoins(this.INITIAL.DOM, 0);
                            this.showMessage(MESSAGES.GAME_IN_PROGRESS);
                            this.playAudio(this.GAME_SETTINGS.SOUNDS.ADD_COIN_HOLE);
                        }


                        this.LOOPER = function() {


                            var next_hole = this.getAdjacentStore(this.CURRENT);

                            this.playAudio(this.GAME_SETTINGS.SOUNDS.ADD_COIN_HOLE);
                            this.addPlayerTextAnimation(this.CURRENT_PLAYER);

                            var showinDebug = this.COINS_IN_HAND;
                            // LAST COIN IN HAND
                            if (this.COINS_IN_HAND == 1) {

                                //IF LAST HOLE IS PLAYERS OWN STOREHOUSE DEPOSIT THE COIN IN IT 
                                //AND THEN TELL USER TO PICK ANY COIN ONCE AGAIN
                                if (this.isHouse(next_hole)) {
                                    this.incrementCoins(next_hole);
                                    --this.COINS_IN_HAND;
                                    this.showMessage(MESSAGES['PLAYER' + this.CURRENT_PLAYER + '_TURN']);
                                    this.GAME_IN_PROGRESS = false;
                                    //SHOW STATISTICS
                                    this.showStatistics();
                                } else {

                                    if (this.isCurrentPlayerHole(next_hole, this.CURRENT_PLAYER)) {

                                        if (this.hasCoins(next_hole)) {

                                            // IF OWN HOLE HAS COINS THEN TAKE COINS FROM THIS HOLE                                           
                                            //AND THE LAST COIN AND PUT THE COINS IN OWN HOME

                                            //AND FORFIET TURN
                                            var COINS = this.getCoins(next_hole);
                                            this.setCoins(next_hole, 0);
                                            this.COINS_IN_HAND = this.COINS_IN_HAND + COINS;
                                            this.CURRENT = this.getCurrentHoleDetails(next_hole);
                                            alert('\n' + 'PLAYER' + this.CURRENT_PLAYER + ', PLEASE CLICK TO CONTINUE YOUR TURN' + '\n' + ' Last coin landed in your own hole, so you get 1 more turn \n');

                                            this.LOOPER();
                                            return;

                                        } else {

                                            alert('\n' + 'PLAYER' + this.CURRENT_PLAYER + ', Your Last Coin Landed in an empty hole !!' + '\n' + 'You must FORFEIT your turn. \n' + 'You will get all coins from opposite hole + coins in your hand \n' + 'and they will be added to your house, yay \n');

                                            //IF OWN HOLE IS EMPTY THEN TAKE THE LAST COIN AND ALSO THE OPPOSITE HOLES COIN 
                                            var OPPOSITE_COINS = this.takeOppositeHoleCoins(this.CURRENT_PLAYER);
                                            // AND PLACE THEM IN OWN HOUSE
                                            var HOUSE_COINS = this.getCoins(GAME['PLAYER' + this.CURRENT_PLAYER + '_HOUSE']);

                                            var TOTAL_COINS = HOUSE_COINS + OPPOSITE_COINS + this.COINS_IN_HAND;

                                            //SETTING OPPOSITE PLAYER HOLE TO ZERO
                                            this.setCoins(GAME['PLAYER' + this.CURRENT_PLAYER + '_HOUSE'], TOTAL_COINS);
                                            //EMPTY COINS IN HAND
                                            this.COINS_IN_HAND = 0;

                                            // AND FORFIET TURN
                                            this.setPlayersTurn(this.getOtherPlayerID(this.CURRENT_PLAYER));
                                            this.GAME_IN_PROGRESS = false;
                                        }


                                    } else {

                                        //IF LAST COIN DROPS IN OTHER PLAYERS EMPTY HOUSE
                                        //THEN COLLECT ALL COINS FROM OPPOSITE HOLE
                                        if (this.hasCoins(next_hole)) {
                                            var COINS = this.getCoins(next_hole);
                                            this.setCoins(next_hole, 0);
                                            this.COINS_IN_HAND = this.COINS_IN_HAND + COINS;
                                            this.CURRENT = this.getCurrentHoleDetails(next_hole);
                                            this.LOOPER();
                                            return;

                                        } else {
                                            // IF LAST COIN DROPS IN OTHER PLAYER'S EMPTY HOUSE THEN DEPOSIT THE COIN & FORFIET TURN
                                            this.setCoins(next_hole, (1 + this.getCoins(next_hole)));
                                            --this.COINS_IN_HAND;
                                            this.setPlayersTurn(this.getOtherPlayerID(this.CURRENT_PLAYER));
                                            this.GAME_IN_PROGRESS = false;

                                        }

                                    }
                                }
                                return;
                            } else {
                                //IF HOUSE
                                if (this.isHouse(next_hole)) {

                                    if (this.isCurrentPlayerHouse(next_hole, this.INITIAL.PLAYER_ID)) {
                                        // IF HOUSE BELONGS TO CURRENT PLAYER THEN DEPOSIT COIN 
                                        this.incrementCoins(next_hole);
                                        //this.setCoins(next_hole, (1 + this.getCoins(next_hole)))

                                    } else {
                                        // IF HOUSE BELONGS TO OTHER PLAYER HOUSE THEN SKIP THE HOUSE                                        
                                        //continue;
                                    }

                                } else { //ELSE IT'S A HOLE
                                    //var next_hole_coins=this.getCoins(this.SELECTED_HOLE.dom);
                                    this.setCoins(next_hole, (1 + this.getCoins(next_hole)))
                                }


                                this.CURRENT = this.getCurrentHoleDetails(next_hole);
                                --this.COINS_IN_HAND;
                                var showinDebug = this.COINS_IN_HAND;

                                if (this.COINS_IN_HAND != 0) {
                                    var that = this;
                                    setTimeout(function() {
                                        that.LOOPER();
                                    }, that.GAME_SETTINGS.ITERATE_AFTER);
                                }
                            }

                            //SHOW STATISTICS
                            this.showStatistics();
                        }
                        this.LOOPER();
                    } catch (ex) {
                        console.error('ERROR AT RUNTIME:' + ex)
                    } finally {
                        this.addPlayerTextAnimation(this.CURRENT_PLAYER);

                        //SHOW STATISTICS
                        this.showStatistics();
                        //Deleting the Selected hole                           
                        this.resetGame();

                    }
                },
                getAdjacentStore: function(hole) {


                    //IF CURRENT IS A HOUSE 
                    //THEN NEXT HOLE CAN BE EITHER CURRENT PLAYERS OR OTHER PLAYERS HOLE 
                    if (this.isHouse(hole.DOM)) {

                        // IF THIS IS PLAYERS OWN HOUSE THEN THE NEXT ADJACENT HOLE WILL BE THE OTHER PLAYERS HOLE
                        if (this.isCurrentPlayerHouse(hole.DOM, this.INITIAL.PLAYER_ID)) {
                            var OTHER_PLAYER_ID = (hole.PLAYER_ID == 1) ? 2 : 1;
                            return GAME['PLAYER' + OTHER_PLAYER_ID + '_HOLE_' + (NO_OF_HOLES - 1)]

                        } else {
                            // IF CURRENT HOLE IS OTHER PLAYERS HOUSE THEN THE NEXT HOLE WILL BE CURRENT PLAYERS HOLE
                            return GAME['PLAYER' + hole.PLAYER_ID + '_HOLE_0']
                        }

                    } else {
                        //ELSE CURRENT IS A HOLE 
                        //THEN NEXT HOLE CAN BE EITHER A HOUSE OR A HOLE
                        var adjacent_store;
                        if (hole.HOLE_ID == 0) {

                            if (this.CURRENT_PLAYER == hole.PLAYER_ID) {
                                adjacent_store = GAME['PLAYER' + hole.PLAYER_ID + '_HOUSE'];
                            } else {
                                adjacent_store = GAME['PLAYER' + this.CURRENT_PLAYER + '_HOLE_' + (NO_OF_HOLES - 1)];
                            }


                        } else {
                            adjacent_store = GAME['PLAYER' + hole.PLAYER_ID + '_HOLE_' + (--hole.HOLE_ID)];
                        }
                        return adjacent_store;

                    }

                },

                getCurrentHoleDetails: function(hole) {
                    return {
                        DOM: hole,
                        DOM_ID: hole.id,
                        HOLE_ID: this.getHoleID(hole),
                        PLAYER_ID: this.getPlayerID(hole),
                        COINS: this.getCoins(hole)
                    }
                },
                getPlayerID: function(hole) {
                    return hole.id.indexOf('PLAYER1') == -1 ? 2 : 1;
                },
                getOtherPlayerID: function(playerID) {
                    return (playerID == 1) ? 2 : 1;
                },
                getCoins: function(hole) {
                    return parseInt($(hole).text());
                },
                setCoins: function(hole, value) {
                    var animation = this.GAME_SETTINGS.ANIMATION.ADD_COIN_HOLE;
                    this.addAnimation(hole, animation);
                    $(hole).text(value);

                },
                takeOppositeHoleCoins: function(playerID) {

                    var OTHER_PLAYER_ID = this.getOtherPlayerID(playerID);

                    var OPPOSITE_HOLE_ID = (this.GAME_SETTINGS.NO_OF_HOLES - 1) - this.CURRENT.HOLE_ID;
                    // READING THE OPPOSITE HOLE
                    var OPPOSITE_COINS = this.getCoins(GAME['PLAYER' + OTHER_PLAYER_ID + '_HOLE_' + OPPOSITE_HOLE_ID]);
                    //EMPTYING THE OPPOSITE HOLE
                    this.setCoins(GAME['PLAYER' + OTHER_PLAYER_ID + '_HOLE_' + OPPOSITE_HOLE_ID], 0);

                    return OPPOSITE_COINS;
                },
                incrementCoins: function(hole) {
                    var animation = this.GAME_SETTINGS.ANIMATION.ADD_COIN_HOUSE;
                    $(hole).text((1 + this.getCoins(hole)));
                    this.addAnimation(hole, animation);
                    //this.setCoins(hole, (1 + this.getCoins(hole)));

                },
                hasCoins: function(hole) {
                    return parseInt($(hole).text()) != 0;
                },
                getHoleID: function(hole) {
                    return parseInt(hole.id.split("HOLE_")[1]);
                },
                disablePlayer: function(playerID) {
                    (GAME['PLAYER' + playerID + '_HOLES_CONTAINER']).classList.add(this.GAME_SETTINGS.CSS.DISABLE_PLAYER);

                },
                enablePlayer: function(playerID) {
                    (GAME['PLAYER' + playerID + '_HOLES_CONTAINER']).classList.remove(this.GAME_SETTINGS.CSS.DISABLE_PLAYER);

                },
                setPlayersTurn: function(playerID) {

                    this.enablePlayer(playerID);
                    this.disablePlayer(this.getOtherPlayerID(playerID));
                    this.showMessage(MESSAGES['PLAYER' + playerID + '_TURN']);
                    this.CURRENT_PLAYER = playerID;
                    this.COINS_IN_HAND = 0;
                    this.addPlayerTextAnimation(this.CURRENT_PLAYER);
                    this.showStatistics();
                },
                addAnimation: function(dom, animClass) {

                    dom.classList.add(animClass || 'flip');

                    //ALSO REMOVING ANIMATION CLASS SOON
                    setTimeout(function() {
                        dom.classList.remove(animClass || 'flip');
                    }, this.GAME_SETTINGS.ANIMATION.TIMER);

                },
                addPlayerTextAnimation: function(playerID) {
                    //ADD ANIMATION TO CURRENT PLAYER
                    (GAME['PLAYER' + playerID + '_TEXT_CONTAINER']).classList.add(this.GAME_SETTINGS.CSS.ADD_PLAYER_TEXT_GLOW);
                    //REMOVE ANIMATION FROM OTHER PLAYER
                    (GAME['PLAYER' + this.getOtherPlayerID(playerID) + '_TEXT_CONTAINER']).classList.remove(this.GAME_SETTINGS.CSS.ADD_PLAYER_TEXT_GLOW);
                },
                isHouse: function(hole) {
                    if (hole.id.indexOf('_HOUSE') != -1) {
                        return true;
                    } else {
                        return false;
                    }
                },
                isCurrentPlayerHouse: function(hole, playerID) {
                    if (hole.id.indexOf('PLAYER' + playerID + '_HOUSE') != -1) {
                        return true;
                    } else {
                        return false;
                    }
                },
                isCurrentPlayerHole: function(hole, playerID) {
                    if (hole.id.indexOf('PLAYER' + playerID + '_HOLE') != -1) {
                        return true;
                    } else {
                        return false;
                    }
                },
                isGameOver: function() {
                    var PLAYER1_COINS = PLAYER2_COINS = 0;

                    for (var i = 0; i < NO_OF_HOLES; i++) {
                        PLAYER1_COINS += this.getCoins(GAME['PLAYER1_HOLE_' + i]);
                        PLAYER2_COINS += this.getCoins(GAME['PLAYER2_HOLE_' + i]);
                    }

                    return (PLAYER1_COINS == 0 || PLAYER2_COINS == 0);

                },
                getGameEndStatistics: function() {

                    this.GAME_OVER = true;

                    var PLAYER1_HOUSE_COINS = this.getCoins(GAME['PLAYER1_HOUSE']),
                        PLAYER2_HOUSE_COINS = this.getCoins(GAME['PLAYER2_HOUSE']),
                        PLAYER1_COINS = PLAYER2_COINS = 0;

                    var REMAINING_COINS = this.COINS_IN_HAND;
                    this.COINS_IN_HAND = 0;

                    // for (var i = 0; i < NO_OF_HOLES; i++) {
                    //     PLAYER1_COINS += this.getCoins(GAME['PLAYER1_HOLE_' + i]);
                    //     PLAYER2_COINS += this.getCoins(GAME['PLAYER2_HOLE_' + i]);
                    // }


                    if (PLAYER1_HOUSE_COINS > PLAYER2_HOUSE_COINS) {
                        this.showMessage(MESSAGES.PLAYER1_WINS);
                        PLAYER1_HOUSE_COINS = PLAYER1_HOUSE_COINS + REMAINING_COINS;
                        this.setCoins(GAME['PLAYER1_HOUSE'], PLAYER1_HOUSE_COINS);

                    } else if (PLAYER1_HOUSE_COINS < PLAYER2_HOUSE_COINS) {
                        this.showMessage(MESSAGES.PLAYER2_WINS);
                        PLAYER2_HOUSE_COINS = PLAYER2_HOUSE_COINS + REMAINING_COINS;
                        this.setCoins(GAME['PLAYER2_HOUSE'], PLAYER2_HOUSE_COINS);

                    } else {

                        //IF TIE OCCURS
                        //THEN THE CURRENT PLAYER WILL GET ALL THE COINS IN HAND AND WILL WIN
                        var playerID = this.CURRENT_PLAYER;
                        var TOTAL_COINS = this.getCoins(GAME['PLAYER' + playerID + '_HOUSE']) + REMAINING_COINS;
                        this.setCoins(GAME['PLAYER' + playerID + '_HOUSE'], TOTAL_COINS);
                        this.showMessage(MESSAGES['PLAYER' + playerID + '_WINS'].PLAYER2_WINS);

                        //READING UPDATED HOUSE COINS AND SETTING THE STATISTICS
                        PLAYER1_HOUSE_COINS = this.getCoins(GAME['PLAYER1_HOUSE']);
                        PLAYER2_HOUSE_COINS = this.getCoins(GAME['PLAYER2_HOUSE']);
                        GAME.STAT_BOX.innerHTML = "PLAYER 1 HAS " + PLAYER1_HOUSE_COINS + "COINS. </br>PLAYER 2 HAS " + PLAYER2_HOUSE_COINS + "COINS.";
                        return;

                    }


                    GAME.STAT_BOX.innerHTML = "PLAYER 1 HAS " + PLAYER1_HOUSE_COINS + "COINS. </br>PLAYER 2 HAS " + PLAYER2_HOUSE_COINS + "COINS.";
                    //PLAY WINNING SOUND
                    this.playAudio(this.GAME_SETTINGS.SOUNDS.WIN);
                },
                showMessage: function(msg, timer) {

                    $(GAME.MESSAGE_BOARD).text(msg);
                    var that = this;
                    if (timer) {
                        setTimeout(function() {
                            that.clearMessage()
                        }, timer);
                    }
                },
                showStatistics: function() {
                    GAME.STAT_BOX.innerHTML = "CURRENT PLAYER:" + this.CURRENT_PLAYER + " </br>COINS IN HAND:" + this.COINS_IN_HAND;
                },
                resetGame: function() {
                    this.COUNTER = 0;
                    this.SELECTED_HOLE = undefined;
                },
                clearMessage: function() {
                    $(GAME.MESSAGE_BOARD).text('');
                },
                playAudio: function(audio) {

                    try {
                        var playSound = function(buffer) {
                            var source = window.context.createBufferSource(); // creates a sound source
                            source.buffer = buffer; // tell the source which sound to play
                            source.connect(window.context.destination); // connect the source to the context's destination (the speakers)
                            source.start(0); // play the source now
                            // note: on older systems, may have to use deprecated noteOn(time);
                        }

                        if (!audio.BUFFER) {
                            var audioBuffer = null;
                            // Fix up prefixing
                            window.AudioContext = window.AudioContext || window.webkitAudioContext;
                            window.context = new AudioContext();

                            (function loadDogSound(url) {
                                var request = new XMLHttpRequest();
                                request.open('GET', url, true);
                                request.responseType = 'arraybuffer';

                                // Decode asynchronously
                                request.onload = function() {
                                    context.decodeAudioData(request.response, function(buffer) {
                                        audio.BUFFER = buffer;
                                        playSound(audio.BUFFER);

                                    }, function(a, b, c) {
                                        console.log(a, b, c)
                                    });
                                }


                                request.send();
                            })(audio.URL);

                        } else {
                            playSound(audio.BUFFER)
                        }


                    } catch (e) {
                        //alert('Web Audio API is not supported in this browser');
                    }


                }
            };


        function initialize() {
            // CREATE OPERATION
            function createOperation() {
                //DOCUMENT BODY
                GAME.BODY = document.body || document.getElementsByTagName('body')[0];

                //CREATE BOARD BOX
                GAME.BOARD = createElement(HTML.BOARD);

                //CREATE PLAYER1 TEXT BOX
                GAME.PLAYER1_TEXT_CONTAINER = createElement(HTML.PLAYER1_TEXT_CONTAINER);

                //CREATE PLAYER1 TEXT BOX
                GAME.PLAYER2_TEXT_CONTAINER = createElement(HTML.PLAYER2_TEXT_CONTAINER);


                //CREATE MESSAGE BOARD
                GAME.MESSAGE_BOARD = createElement(HTML.MESSAGE_BOARD);

                //CREATE STATISTIC BOX
                GAME.STAT_BOX = createElement(HTML.STAT_BOX)

                // CREATING A CONTAINER FOR ALL PLAYER HOLES
                GAME.HOLES_BOX = createElement(HTML.HOLES_CONTAINER);


                createPlayer(1);
                createPlayer(2);

                appendOperation();


                // PLAYER1
                function createPlayer(id) {

                    //CREATING CONTAINER FOR ALL PLAYER1 HOLES 
                    GAME['PLAYER' + id + '_HOLES_CONTAINER'] = createElement(HTML['PLAYER' + id + '_HOLES_CONTAINER']);

                    //CREATING PLAYER1 HOME
                    GAME['PLAYER' + id + '_HOUSE'] = createElement(HTML['PLAYER' + id + '_HOUSE']);

                    //CREATING MOUSE CLICK LISTENER ON THE HOUSE
                    //addMouseEvent(GAME['PLAYER' + id + '_HOUSE']);

                    //CREATING PLAYER1 HOLES
                    for (var i = 0; i < NO_OF_HOLES; i++) {
                        GAME['PLAYER' + id + '_HOLE_' + i] = createElement(HTML['PLAYER' + id + '_HOLE'], i);
                        //ADDING MOUSE CLICK LISTENER ON THE HOLES
                        addMouseEvent(GAME['PLAYER' + id + '_HOLE_' + i]);
                    }
                }

                // // PLAYER2
                // function createPlayer2() {

                //     //CREATE CONTAINER FOR ALL PLAYER1 HOLES 
                //     GAME.PLAYER2_HOLES_CONTAINER = createElement(HTML.PLAYER2_HOLE_CONTAINER);
                //     //ADD PLAYER2 HOLES
                //     i = NO_OF_HOLES;
                //     while (i--) {
                //         var temp_hole_name = 'PLAYER2_HOLE_' + i;
                //         GAME[temp_hole_name] = createElement(HTML.PLAYER2_HOLE);
                //         //ADDING MOUSE CLICK LISTENER ON THE HOLES
                //         addMouseEvent(GAME[temp_hole_name]);
                //     };
                //     //ADD PLAYER2 HOME
                //     GAME.PLAYER2_HOUSE = createElement(HTML.PLAYER2_HOUSE);
                //     //ADDING MOUSE CLICK LISTENER ON THE HOUSE
                //     addMouseEvent(GAME.PLAYER2_HOUSE);
                // }

            }

            // APPENDING OPERATION
            function appendOperation() {


                //ADDING MESSAGE BOARD TO THE BODY
                appendToDOM(GAME.BODY, GAME.MESSAGE_BOARD);

                //ADDING STATBOX TO MESSAGE BOARD
                appendToDOM(GAME.BODY, GAME.STAT_BOX);


                // ADDING BOARD TO DOM BODY
                appendToDOM(GAME.BODY, GAME.BOARD);

                // ADDING PLAYER1 TEXT BOX
                appendToDOM(GAME.BOARD, GAME.PLAYER1_TEXT_CONTAINER);


                // ADDING PLAYER1 HOUSE TO BOARD
                appendToDOM(GAME.BOARD, GAME.PLAYER1_HOUSE);


                //ADDING HOLE CONTAINER
                appendToDOM(GAME.BOARD, GAME.HOLES_BOX);


                //ADDING PLAYER2 HOLES CONTAINER
                appendToDOM(GAME.HOLES_BOX, GAME.PLAYER2_HOLES_CONTAINER);


                //ADDING PLAYER1 HOLES CONTAINER
                appendToDOM(GAME.HOLES_BOX, GAME.PLAYER1_HOLES_CONTAINER);


                // ADDING EACH PLAYER1 HOLES TO BOARD
                for (var i = 0; i < NO_OF_HOLES; i++) {
                    appendToDOM(GAME.PLAYER1_HOLES_CONTAINER, GAME['PLAYER1_HOLE_' + i]);
                    GAME.LOOPING_LIST.push(GAME['PLAYER1_HOLE_' + i]);
                }

                // ADDING EACH PLAYER2 HOLES TO BOARD
                for (var i = NO_OF_HOLES - 1; i >= 0; i--) {
                    appendToDOM(GAME.PLAYER2_HOLES_CONTAINER, GAME['PLAYER2_HOLE_' + i]);
                    GAME.LOOPING_LIST.push(GAME['PLAYER2_HOLE_' + i]);
                }

                // ADDING PLAYER2 HOUSE TO BOARD
                appendToDOM(GAME.BOARD, GAME.PLAYER2_HOUSE);

                // ADDING PLAYER2 TEXT BOX
                appendToDOM(GAME.BOARD, GAME.PLAYER2_TEXT_CONTAINER);


            }

            function createElement(config, id) {
                var elem = document.createElement(config.TYPE || 'div');
                addClasses(elem, config);

                // INITIALIZING THE HOLES & HOUSES WITH DEFAULT VALUES
                if (typeof config.INNERTEXT != "undefined") {
                    $(elem).text(config.INNERTEXT);
                }

                //SETTING ID IF NEEDED
                if (typeof config.ID != "undefined") {

                    //IF SETTING ID WITH COUNTER
                    if (typeof id != "undefined") {
                        addAttributes(elem, "ID", config.ID + id);

                    } else {
                        addAttributes(elem, "ID", config.ID);
                    }
                }

                return elem;
            }

            function addClasses(elem, config) {

                var classes = "";
                var len = (config.CLASSES && config.CLASSES.length) || 0;
                while (len) {
                    classes += config.CLASSES[len - 1] + " ";
                    len--;
                }

                if (classes) {
                    elem.setAttribute('class', classes.trim());
                }
            }

            function addAttributes(elem, attr, value) {
                elem.setAttribute(attr, value);
            }

            function appendToDOM(parent, child) {
                // CHECKING IF PARENT IS DOM NODE AND HAS 'appendChild' PROPERTY
                // CHECKING IF CHILD IS ALSO DOM NODE AND HAS A RANDOM DOM PROPERTY CALLED 'style'
                if ((typeof parent == "object" && parent.appendChild) && (typeof child == "object" && child.style)) {
                    parent.appendChild(child);
                }

            };

            function addMouseEvent(dom) {
                dom.onclick = function(evt) {
                    //IDENTIFY IF PLAYER 1 or 2 
                    var hole_clicked = evt.currentTarget || GAME[dom.id];


                    if (GAME_ENGINE.GAME_OVER_CHECKER_ID) {
                        clearInterval(GAME_ENGINE.GAME_OVER_CHECKER_ID);
                    }

                    GAME_ENGINE.GAME_OVER_CHECKER_ID = setInterval(function() {
                        if (!GAME_ENGINE.GAME_IN_PROGRESS && GAME_ENGINE.isGameOver() && !GAME_ENGINE.GAME_OVER) {
                            alert('GAME OVER');
                            GAME_ENGINE.getGameEndStatistics();
                        }
                    }, 1000);

                    //START THE GAME SEQUENCE
                    GAME_ENGINE.start(hole_clicked);
                }
            }


            createOperation();
        }


        initialize();
        // } catch (ex) {
        //     console.error("ERROR IN CREATING GAME:" + ex);
        // }
    };


    //
    //


})(GAME_CONFIG);


setTimeout(function() {
    CONGKAK.initialize();
}, 100);
