/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Game = __webpack_require__(1);
	
	document.addEventListener("DOMContentLoaded", function () {
	  var Background = document.getElementById("background");
	  var Pokemon = document.getElementById("pokemon");
	  var Obstacles = document.getElementById("obstacles");
	  var Pokeballs = document.getElementById("pokeballs");
	  var Menu = document.getElementById("menu");
	
	  Background.width = 800;
	  Pokemon.width = 800;
	  Obstacles.width = 800;
	  Pokeballs.width = 800;
	  Menu.width = 1000;
	
	  Background.height = 1000;
	  Pokemon.height = 1000;
	  Obstacles.height = 1000;
	  Pokeballs.height = 1000;
	  Menu.height = 1000;
	
	  var newGame = new Game();
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Cloud = __webpack_require__(2);
	var Pokemon = __webpack_require__(3);
	var Pokeball = __webpack_require__(4);
	var Building = __webpack_require__(5);
	var Balloon = __webpack_require__(6);
	var Menu = __webpack_require__(7);
	
	var Game = function Game() {
	  this.pokeballs = [];
	  this.buildings = [];
	  this.balloons = [];
	  this.pokemon;
	
	  this.canvas = document.getElementById("background");
	  this.context = this.canvas.getContext("2d");
	  this.gameOver = true;
	
	  this.startScreen();
	  this.generateClouds();
	};
	
	Game.prototype = {
	  startScreen: function startScreen() {
	    this.fn = this.startGame.bind(this);
	    document.addEventListener("keyup", this.fn, false);
	    this.menu = new Menu(false, 0);
	    window.setInterval(this.generateClouds.bind(this), 5000);
	  },
	
	  startGame: function startGame(e) {
	    if (e.keyCode === 13 && this.gameOver) {
	      document.removeEventListener("keyup", this.fn, false);
	      this.gameOver = false;
	      this.context.clearRect(0, 0, 800, 1000);
	
	      this.pokeballs = [];
	      this.buildings = [];
	      this.balloons = [];
	
	      var startingPosition = { x: 80, y: 290 };
	      this.pokemon = new Pokemon(startingPosition, this);
	
	      this.menu.started = true;
	      this.menu.currentScore = 0;
	      this.menu.startScoring();
	
	      this.addMoreObstacles();
	
	      this.addBall = window.setInterval(this.addPokeBalls.bind(this), 4567);
	      this.addBuilding = window.setInterval(this.addMoreObstacles.bind(this), 5000);
	    }
	  },
	
	  over: function over() {
	    this.checkCollision(this.pokeballs, "pokeball");
	    this.checkCollision(this.buildings, "building");
	    this.checkCollision(this.balloons, "balloon");
	    return this.gameOver;
	  },
	
	  checkCollision: function checkCollision(array, type) {
	    array.forEach(function (item) {
	      if (item.position.x <= -500) {
	        array.splice(array.indexOf(item), 1);
	      } else {
	        if (this.isBetween(type, item.position.x, item.position.y, item) || this.pokemon.position.y < -100 || this.pokemon.position.y > 1200) {
	          this.gameOver = true;
	        }
	      }
	    }.bind(this));
	  },
	
	  isBetween: function isBetween(type, itemX, itemY, item) {
	    var width = void 0;
	    var height = void 0;
	    var hitPokemon = false;
	
	    if (type === "pokeball") {
	      hitPokemon = this.checkPokeBalls(itemX, itemY);
	    } else if (type === "building") {
	      hitPokemon = this.checkBuildings(itemX, itemY);
	    } else if (type === "balloon") {
	      hitPokemon = this.checkBalloons(itemX, itemY);
	    }
	
	    if (hitPokemon) {
	      return true;
	    } else if (type === "building" && this.pokemon.position.x >= itemX + 400) {
	      this.buildings.splice(this.buildings.indexOf(item), 1);
	      this.menu.currentScore += 1;
	      this.menu.startScoring();
	      return false;
	    }
	  },
	
	  checkBalloons: function checkBalloons(xPos, yPos) {
	    if (this.checkHitBoxes(xPos, yPos - 172, 323, 233) || this.checkHitBoxes(xPos + 90, yPos + 55, 121, 167)) {
	      return true;
	    }
	    return false;
	  },
	
	  checkBuildings: function checkBuildings(xPos, yPos) {
	    if (this.checkHitBoxes(xPos + 15, yPos + 130, 377, 274) || this.checkHitBoxes(xPos + 30, yPos + 70, 251, 61) || this.checkHitBoxes(xPos + 100, yPos + 20, 50, 50)) {
	      return true;
	    }
	  },
	
	  checkPokeBalls: function checkPokeBalls(xPos, yPos) {
	    if (this.checkHitBoxes(xPos, yPos, 22, 22)) {
	      return true;
	    }
	    return false;
	  },
	
	  checkHitBoxes: function checkHitBoxes(itemX, itemY, width, height) {
	    if (!(this.pokemon.position.x > itemX + width || this.pokemon.position.x + this.pokemon.width < itemX || this.pokemon.position.y > itemY + height || this.pokemon.position.y + this.pokemon.height < itemY)) {
	      return true;
	    }
	  },
	
	  overScreen: function overScreen() {
	    this.menu.gameIsOverBuddy();
	    window.clearInterval(this.addBall);
	    window.clearInterval(this.addBuilding);
	    window.addEventListener("keyup", this.fn, false);
	  },
	
	  randomY: function randomY() {
	    return 550 * Math.random();
	  },
	
	  chooseRandomY: function chooseRandomY() {
	    var randomIndex = [0, 1, 2, 3];
	    return randomIndex[Math.floor(Math.random() * randomIndex.length)];
	  },
	
	  generateClouds: function generateClouds() {
	    var position = { x: 800, y: this.randomY() };
	    new Cloud(position, this);
	  },
	
	  addPokeBalls: function addPokeBalls() {
	    var position = { x: 800, y: this.randomY() };
	    this.pokeballs.push(new Pokeball(position, this));
	  },
	
	  addMoreObstacles: function addMoreObstacles() {
	    var balloonYs = [0, -50, -100, -150];
	    var buildingYs = [600, 550, 500, 450];
	    var randomIndex = this.chooseRandomY();
	    var balloonPosition = { x: 800, y: balloonYs[randomIndex] };
	    var buildingPosition = { x: 800, y: buildingYs[randomIndex] };
	    this.balloons.push(new Balloon(balloonPosition, this));
	    this.buildings.push(new Building(buildingPosition, this));
	  }
	};
	
	module.exports = Game;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Cloud = function () {
	  function Cloud(position, game) {
	    _classCallCheck(this, Cloud);
	
	    this.position = position;
	    this.game = game;
	    this.canvas = document.getElementsByTagName("canvas")[0];
	    this.context = this.canvas.getContext('2d');
	    this.velocity = 1.5;
	
	    this.instantiateClouds();
	
	    var possibleClouds = [this.cloud1, this.cloud2, this.cloud3, this.cloud4];
	
	    var randomCloud = possibleClouds[Math.floor(Math.random() * 4)];
	
	    this.cloud = {
	      image: randomCloud,
	      width: randomCloud.width,
	      height: randomCloud.height
	    };
	
	    this.render();
	  }
	
	  _createClass(Cloud, [{
	    key: "instantiateClouds",
	    value: function instantiateClouds() {
	      this.cloud1 = new Image();
	      this.cloud1.src = "./images/cloud1.png";
	      this.cloud1.height = 200;
	      this.cloud1.width = 300;
	
	      this.cloud2 = new Image();
	      this.cloud2.src = "./images/cloud2.png";
	      this.cloud2.height = 108;
	      this.cloud2.width = 231;
	
	      this.cloud3 = new Image();
	      this.cloud3.src = "./images/cloud3.png";
	      this.cloud3.height = 108;
	      this.cloud3.width = 214;
	
	      this.cloud4 = new Image();
	      this.cloud4.src = "./images/cloud4.png";
	      this.cloud4.height = 240;
	      this.cloud4.width = 240;
	    }
	  }, {
	    key: "slowlyDrifting",
	    value: function slowlyDrifting() {
	      this.position.x -= this.velocity;
	
	      if (this.position.x >= -300) {
	        this.drawImg(this.position.x, this.position.y, this.cloud.width, this.cloud.height);
	      }
	    }
	  }, {
	    key: "drawImg",
	    value: function drawImg(x, y, width, height) {
	      this.context.clearRect(x, y, width, height);
	      this.context.drawImage(this.cloud.image, x, y);
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	      this.slowlyDrifting();
	      requestAnimationFrame(this.render.bind(this));
	    }
	  }]);
	
	  return Cloud;
	}();
	
	;
	
	module.exports = Cloud;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	var Pokemon = function Pokemon(position, game) {
	  this.position = position;
	  this.game = game;
	  this.width = 88;
	  this.height = 88;
	
	  this.gravity = 0.4;
	  this.velocity = 0;
	  this.time = 0;
	  this.fly = -15;
	
	  this.makeUpSprite();
	  this.makeDownSprite();
	
	  this.canvas = document.getElementById("pokemon");
	  this.context = this.canvas.getContext("2d");
	
	  this.addKeyListener();
	  this.render();
	};
	
	Pokemon.prototype = {
	
	  makeUpSprite: function makeUpSprite() {
	    var pkmnSpriteUp = new Image();
	    pkmnSpriteUp.src = "./images/bflyup.png";
	
	    this.spriteUp = {
	      image: pkmnSpriteUp
	    };
	  },
	
	  makeDownSprite: function makeDownSprite() {
	    var pkmnSpriteDown = new Image();
	    pkmnSpriteDown.src = "./images/bflydown.png";
	
	    this.spriteDown = {
	      image: pkmnSpriteDown
	    };
	  },
	
	  addKeyListener: function addKeyListener() {
	    this.fn = this.flyPokemonFly.bind(this);
	    document.addEventListener("keyup", this.fn, false);
	  },
	
	  flyPokemonFly: function flyPokemonFly(e) {
	    if (this.game.over()) {
	      window.clearInterval(this.spriteInterval);
	      this.context.clearRect(this.position.x, this.position.y, 800, 1000);
	      document.removeEventListener("keyup", this.fn);
	      this.game.overScreen();
	    } else if (e && e.keyCode === 87) {
	      this.time = 0;
	      this.velocity = this.fly;
	      this.context.clearRect(this.position.x, this.position.y, 800, 1000);
	      this.position.y -= this.velocity;
	      this.drawImg(this.spriteUp.image, this.position.x, this.position.y);
	    } else {
	      this.justGravity();
	    }
	  },
	
	  justGravity: function justGravity() {
	    this.time++;
	    this.velocity += this.gravity;
	    this.context.clearRect(this.position.x, this.position.y, 800, 1000);
	    this.position.y += this.velocity;
	    if (this.time <= 15 && !this.game.over()) {
	      this.drawImg(this.spriteUp.image, this.position.x, this.position.y);
	    } else if (!this.game.over()) {
	      this.drawImg(this.spriteDown.image, this.position.x, this.position.y);
	    }
	  },
	
	  startFlapping: function startFlapping() {
	
	    this.gravityTime = 0;
	    while (this.upTime < 25) {
	      this.position.x += 0.2;
	      this.context.clearRect(this.position.x, this.position.y, 800, 1000);
	      this.position.y -= this.gravity * this.upTime;
	      this.drawImg(this.spriteUp.image, this.position.x, this.position.y);
	      this.upTime += 1.25;
	    }
	    this.upTime = 0;
	  },
	
	  drawImg: function drawImg(image, x, y) {
	    this.context.clearRect(x, y, 800, 1000);
	    this.context.drawImage(image, x, y);
	  },
	
	  render: function render() {
	    this.spriteInterval = window.setInterval(this.flyPokemonFly.bind(this), 17);
	  }
	
	};
	
	module.exports = Pokemon;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	var Pokeball = function Pokeball(position, game) {
	  this.position = position;
	  this.game = game;
	
	  var ball = new Image();
	  ball.src = "./images/ball.png";
	
	  this.ball = {
	    image: ball
	  };
	
	  this.canvas = document.getElementById("pokeballs");
	  this.context = this.canvas.getContext("2d");
	
	  this.constantVelocity = 14;
	  this.ballGravity = 0.2;
	  this.time = 0;
	
	  this.render();
	};
	
	Pokeball.prototype = {
	
	  constantBombardment: function constantBombardment() {
	    this.time++;
	
	    this.context.clearRect(this.position.x, this.position.y, 22, 22);
	    this.position.x -= this.constantVelocity;
	    this.position.y += this.time * this.ballGravity;
	
	    if (!this.game.over() && (this.position.x >= -100 || this.position.y <= 1000)) {
	      this.drawImg(this.position.x, this.position.y);
	    }
	  },
	
	  drawImg: function drawImg(x, y) {
	    this.context.clearRect(x, y, 22, 22);
	    this.context.drawImage(this.ball.image, x, y);
	  },
	
	  render: function render() {
	    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	
	    this.constantBombardment();
	    requestAnimationFrame(this.render.bind(this));
	  }
	
	};
	
	module.exports = Pokeball;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	var Building = function Building(position, game) {
	  this.position = position;
	  this.game = game;
	
	  this.constantVelocity = 5;
	
	  var building = new Image();
	  building.src = "./images/building.png";
	
	  this.building = {
	    image: building
	  };
	
	  this.canvas = document.getElementById("obstacles");
	  this.context = this.canvas.getContext("2d");
	
	  this.render();
	};
	
	Building.prototype = {
	
	  goBuildingGo: function goBuildingGo() {
	
	    this.context.clearRect(this.position.x, this.position.y, 402, 548);
	    this.position.x -= this.constantVelocity;
	
	    if (!this.game.over() && this.position.x >= -1200) {
	      this.drawImg(this.position.x, this.position.y);
	    } else if (this.game.over()) {
	      window.clearInterval(this.buildingInterval);
	    }
	  },
	
	  drawImg: function drawImg(x, y) {
	    this.context.clearRect(x, y, 402, 548);
	    this.context.drawImage(this.building.image, x, y);
	  },
	
	  render: function render() {
	    this.buildingInterval = window.setInterval(this.goBuildingGo.bind(this), 17);
	  }
	
	};
	
	module.exports = Building;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Balloon = function () {
	  function Balloon(position, game) {
	    _classCallCheck(this, Balloon);
	
	    this.position = position;
	    this.game = game;
	
	    this.constantVelocity = 5;
	
	    var balloon = new Image();
	    balloon.src = "./images/balloon.png";
	
	    this.balloon = {
	      image: balloon
	    };
	
	    this.canvas = document.getElementById("obstacles");
	    this.context = this.canvas.getContext("2d");
	
	    this.render();
	  }
	
	  _createClass(Balloon, [{
	    key: "goBalloonGo",
	    value: function goBalloonGo() {
	      this.context.clearRect(this.position.x, this.position.y, 340, 234);
	      this.position.x -= this.constantVelocity;
	
	      if (!this.game.over() && this.position.x >= -400) {
	        this.drawImg(this.position.x, this.position.y);
	      } else if (this.game.over()) {
	        this.game.overScreen();
	        window.clearInterval(this.balloonInterval);
	        this.context.clearRect(0, 0, 800, 1000);
	      }
	    }
	  }, {
	    key: "drawImg",
	    value: function drawImg(x, y) {
	      this.context.clearRect(x, y, 340, 234);
	      this.context.drawImage(this.balloon.image, x, y);
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      this.balloonInterval = window.setInterval(this.goBalloonGo.bind(this), 17);
	    }
	  }]);
	
	  return Balloon;
	}();
	
	;
	
	module.exports = Balloon;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Menu = function () {
	  function Menu(started, currentScore) {
	    _classCallCheck(this, Menu);
	
	    this.started = started;
	    this.currentScore = currentScore;
	    this.canvas = document.getElementById("menu");
	    this.context = this.canvas.getContext("2d");
	
	    this.render();
	  }
	
	  _createClass(Menu, [{
	    key: "gameIsOverBuddy",
	    value: function gameIsOverBuddy() {
	
	      this.context.clearRect(0, 0, 800, 1000);
	      var over = new Image();
	      over.src = "./images/gameOver.png";
	      over.onload = function () {
	        this.context.drawImage(over, 260, 300);
	        this.revealScore();
	      }.bind(this);
	    }
	  }, {
	    key: "revealScore",
	    value: function revealScore() {
	      var whichImage = new Image();
	
	      if (this.currentScore <= 6) {
	        whichImage.src = "./images/bronze.png";
	      } else if (this.currentScore <= 20) {
	        whichImage.src = "./images/silver.png";
	      } else {
	        whichImage.src = "./images/gold.png";
	      }
	
	      whichImage.onload = function () {
	        this.context.drawImage(whichImage, 370, 470);
	        this.context.lineWidth = 2;
	        this.context.strokeStyle = "black";
	
	        this.context.font = "22px Share Tech Mono";
	        this.context.strokeText(this.currentScore, 360, 520);
	        this.context.stroke();
	      }.bind(this);
	    }
	  }, {
	    key: "startScoring",
	    value: function startScoring() {
	      this.context.clearRect(0, 0, 800, 1000);
	
	      this.context.lineWidth = 3;
	      this.context.fillStyle = "white";
	      this.context.strokeStyle = "black";
	
	      this.context.font = "120px Share Tech Mono";
	      this.context.fillText(this.currentScore, 390, 200);
	      this.context.strokeText(this.currentScore, 390, 200);
	
	      this.context.fill();
	      this.context.stroke();
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var startButton = new Image();
	      var instructions = new Image();
	      var logo = new Image();
	      startButton.src = "./images/startButton.png";
	      instructions.src = "./images/instructions.png";
	      logo.src = "./images/logo.png";
	      startButton.onload = function () {
	        this.context.drawImage(startButton, 260, 400);
	      }.bind(this);
	
	      instructions.onload = function () {
	        this.context.drawImage(instructions, 230, 530);
	      }.bind(this);
	
	      logo.onload = function () {
	        this.context.drawImage(logo, 130, 180);
	      }.bind(this);
	    }
	  }]);
	
	  return Menu;
	}();
	
	module.exports = Menu;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map