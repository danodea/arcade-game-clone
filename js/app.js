// Randomizes the starting row of the enemies
// Top row = 138, mid row = 221, bottom row = 304
var randomizeRow = function() {
    var rand = Math.random();
    if (rand > 0.66) {
        return 138;
    } else if (rand < 0.33) {
        return 221;
    } else {
        return 304;
    }
};

// Randomizes the starting x position.  All possible outcomes are offscreen to the left.
var randomizeXoffScreen = function() {
   return -98 - (Math.random() * 300)
};

// Randomizes starting x position in the field of play
var randomizeXonScreen = function() {
    return 505 - (Math.random() * 505);
};

// Randomizes move speed of enemy
var randomizeMoveSpeed = function() {
    return (100 * Math.random()) + 200;
};

// Enemies our player must avoid
var Enemy = function() {
    // The image/sprite for our enemies
    this.sprite = 'images/enemy-bug-cropped.png';
    this.x = randomizeXonScreen();  // Starting X position (on the screen somewhere)
    this.y = randomizeRow();  // Starting Y position (row)
    this.moveSpeed = randomizeMoveSpeed();  // Starting speed of enemy
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (this.moveSpeed * dt);
    // Recyle the enemeies when the go offscreen to the right
    if (this.x > 505) {
        // Start the enemy offscreen this time
        this.x = randomizeXoffScreen();
        this.y = randomizeRow();
        this.moveSpeed = randomizeMoveSpeed();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
    this.sprite = 'images/char-boy-cropped.png';
    this.x = 220;
    this.y = 460;
};

// Keyboard inputs
// Had to hardcode the x and y of where the player is when at the edge of the screen
// If the size of the player sprite changes, this has to be recoded
// There is probably a better way but I dunno what it is :(
Player.prototype.handleInput = function(key) {
    if (key === 'left' && this.x != 18) {
        this.x = this.x - 101;
    };
    if (key === 'right' && this.x != 422) {
        this.x = this.x + 101;
    };
    if (key === 'up' && this.y != 45) {
        this.y = this.y - 83;
    };
    if (key === 'down' && this.y != 460) {
        this.y = this.y + 83;    
    };
};

Player.prototype.update = function(dt) {
    // If the player gets to the final row they win!
    // Again, if the size of the sprite changes, the winning y-value has to be recoded
    if (this.y === 45) {
        allEnemies = allEnemies.concat(createEnemies(1));  // Add another enemy
        winCount++; // Increase the win counter
        player.reset();  // Send the player back to the starting position
    };
};

// Draw the player
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Send player back to start
// Another place that has to be recoded if the sprite size is altered
Player.prototype.reset = function () {
    return player.x = 220, player.y = 460;
};

// Add new enemies function
// Returns an array of enemies with random start positions and speeds
function createEnemies(toCreate) {
    var newEnemies = [];
    for (i = 0; i < toCreate; i++) {
        newEnemies.push(new Enemy());
    }
    return newEnemies;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
allEnemies = allEnemies.concat(createEnemies(3));
var player = new Player;

// Check to see if the center of the enemy is within the player's rectangle.
// I can't figure out how to access the dimensions of images within the code, 
// so I have to hardcode the center points of the enemies
// and the left/right/top/bottom limits for the player.
function checkCollisions() {
    allEnemies.forEach(function (enemy) {
        // First we calculate the center of the enemy
        var enemyCenterX = enemy.x + 49;
        var enemyCenterY = enemy.y + 37.5;
        // Then we calculate the player's rectangle
        var playerLeft = player.x;
        var playerRight = player.x + 71;
        var playerTop = player.y;
        var playerBottom = player.y + 89;
        // Then we see if the center of the enemy is inside that rectangle
        if (enemyCenterX >= playerLeft &&
            enemyCenterX <= playerRight &&
            enemyCenterY >= playerTop &&
            enemyCenterY <= playerBottom) {
                // if it is, they lose a life and...
                lifeCount--;  
                // ...if they are out of lives the game resets
                if (lifeCount === 0) {
                    lifeCount = 3;
                    winCount = 0;
                    allEnemies = createEnemies(3);
                };
                // ...if they still have lives left they get sent back to the starting position
                player.reset();
        };
    });
}

// Initialize the win and life counters.
// The code to display the counters stars at line 142 in Engine.js
var winCount = 0;
var lifeCount = 3;



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});