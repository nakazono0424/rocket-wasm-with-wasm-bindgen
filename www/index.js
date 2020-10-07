import { GameData } from "rocket-wasm";

let gamedata = GameData.new(512.0, 300.0)

// Input processing
function processKey(key, b) {
    switch (key) {
    case "ArrowLeft":
	gamedata.toggle_turn_left(b);
	break;
    case "ArrowRight":
	gamedata.toggle_turn_right(b);
	break;
    case "ArrowUp":
	gamedata.toggle_boost(b);
	break;
    case " ":
	gamedata.toggle_shoot(b);
	break;
    }
}

document.addEventListener('keydown', e => processKey(e.key, true));
document.addEventListener('keyup', e => processKey(e.key, false));

function resize() {
    gamedata = GameData.new();
}
// Resizing
window.addEventListener('resize', () => {
    console.log(gamedata);
    resize();
    console.log(gamedata);
});


// Game loop
let start = null;
let prevTimestamp = null;
let drawAndUpdate = (timestamp) => {
    // Initialization
    if (!prevTimestamp) {
	start = timestamp;
	prevTimestamp = timestamp;
	requestAnimationFrame(drawAndUpdate);
	return;
    }

    // Update and draw
    let progress = (timestamp - prevTimestamp) / 1000;
    gamedata.update(progress);
//    clear_screen();
    gamedata.draw();

    // Some bookkeeping
    prevTimestamp = timestamp;
    requestAnimationFrame(drawAndUpdate);
};

drawAndUpdate();
//});
