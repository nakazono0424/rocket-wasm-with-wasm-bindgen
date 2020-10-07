// We create this here because it will be used from within `imports`
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");


// Returns an object containing resources that will be used later for drawing
function resources() {
    let res = {
	player: document.createElement('canvas'),
	enemy: document.createElement('canvas'),
	bullet: document.createElement('canvas'),
	particle: document.createElement('canvas')
    }

    // Particle
    res.particle.width = 20;
    res.particle.height = 20;
    let pCtx = res.particle.getContext('2d');
    pCtx.fillStyle = "darkviolet";
    pCtx.beginPath();
    pCtx.arc(10, 10, 10, 0, 2 * Math.PI);
    pCtx.fill();

    // Bullet
    res.bullet.width = 6;
    res.bullet.height = 6;
    let bCtx = res.bullet.getContext('2d');
    bCtx.fillStyle = "blue";
    bCtx.beginPath();
    bCtx.arc(3, 3, 3, 0, 2 * Math.PI);
    bCtx.fill();

    // Enemy
    res.enemy.width = 20;
    res.enemy.height = 20;
    let eCtx = res.enemy.getContext('2d');
    eCtx.fillStyle = "yellow";
    eCtx.beginPath();
    eCtx.arc(10, 10, 10, 0, 2 * Math.PI);
    eCtx.fill();

    // Player
    res.player.width = 20;
    res.player.height = 16;
    let plCtx = res.player.getContext('2d');
    plCtx.fillStyle = "red";
    plCtx.beginPath();
    plCtx.lineTo(20, 8);
    plCtx.lineTo(0, 16);
    plCtx.lineTo(0, 0);
    plCtx.fill();

    return res;
}

// Returns an object containing functions that will be linked to our wasm model
// This means that they can be called from Rust
const res = resources();

export class Draw {
    width() {
	canvas.width = window.innerWidth * 0.8;
	return canvas.width;
    }

    height() {
	canvas.height = window.innerHeight * 0.8;
	return canvas.height;
    }
    
    clear_screen() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    draw_player(x, y, angle) {
	ctx.translate(x, y);
	ctx.rotate(angle);
	ctx.translate(0, -8);
	ctx.drawImage(res.player, 0, 0);
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	
	ctx.fillStyle = "black";
	//ctx.fillRect(x - 17, y - 12, 4, 4);
    }

    draw_enemy(x, y) {
	ctx.drawImage(res.enemy, x - 10, y - 10);
    }

    draw_bullet(x, y) {
	ctx.drawImage(res.bullet, x - 3, y - 3);
    }

    draw_particle(x, y, radius) {
	ctx.drawImage(res.particle, x - radius, y - radius, 2 * radius, 2 * radius);
    }

    draw_score(x) {
	ctx.fillStyle = "orange";
	ctx.textBaseline = "top";
	ctx.font = "20px sans-serif";
	ctx.fillText('Score: ' + x, 10, 10)
    }

    // The real loading and running of our wasm starts here
    //let imports = { clear_screen, draw_player, draw_enemy, draw_bullet, draw_particle, draw_score };
    //imports.Math_atan = Math.atan;
    //imports.sin = Math.sin;
    //imports.cos = Math.cos;
    
}
