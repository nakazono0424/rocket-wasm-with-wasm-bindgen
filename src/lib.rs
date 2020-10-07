extern crate itertools_num;
extern crate pcg_rand;
extern crate rand;

mod controllers;
mod game_state;
mod geometry;
mod models;
mod util;

use pcg_rand::Pcg32Basic;
use rand::SeedableRng;
use std::f64;
use std::os::raw::{c_double, c_int};

use self::controllers::{Actions, CollisionsController, TimeController};
use self::game_state::GameState;
use self::geometry::Size;

use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub struct GameData {
    state: GameState,
    actions: Actions,
    time_controller: TimeController<Pcg32Basic>,
}

#[wasm_bindgen]
impl GameData {
    pub fn new() -> GameData {
        let draw = Draw::new();
        let width = draw.width();
        let height = draw.height();
        GameData {
            state: GameState::new(Size::new(width, height)),
            actions: Actions::default(),
            time_controller: TimeController::new(Pcg32Basic::from_seed([42, 42])),
        }
    }

    pub fn update(&mut self, time: c_double) {
        self.time_controller
            .update_seconds(time, &self.actions, &mut self.state);
        CollisionsController::handle_collisions(&mut self.state);
    }

    pub fn toggle_shoot(&mut self, b: c_int) {
        //    let data = &mut DATA.lock().unwrap();
        self.actions.shoot = int_to_bool(b);
    }

    pub fn toggle_boost(&mut self, b: c_int) {
        //    let data = &mut DATA.lock().unwrap();
        self.actions.boost = int_to_bool(b);
    }

    pub fn toggle_turn_left(&mut self, b: c_int) {
        //    let data = &mut DATA.lock().unwrap();
        self.actions.rotate_left = int_to_bool(b);
    }

    pub fn toggle_turn_right(&mut self, b: c_int) {
        //    let data = &mut DATA.lock().unwrap();
        self.actions.rotate_right = int_to_bool(b);
    }

    pub fn resize(mut self) {
        self = GameData::new();
    }

    pub fn draw(&mut self) {
        use geometry::{Advance, Position};
        //    let data = &mut DATA.lock().unwrap();
        let world = &self.state.world;

        let draw = Draw::new();

        draw.clear_screen();

        for particle in &world.particles {
            draw.draw_particle(particle.x(), particle.y(), 5.0 * particle.ttl);
        }

        for bullet in &world.bullets {
            draw.draw_bullet(bullet.x(), bullet.y());
        }

        for enemy in &world.enemies {
            draw.draw_enemy(enemy.x(), enemy.y());
        }

        draw.draw_player(world.player.x(), world.player.y(), world.player.direction());
        draw.draw_score(self.state.score as f64);
    }
}

fn int_to_bool(i: c_int) -> bool {
    i != 0
}

// These functions are provided by the runtime
#[wasm_bindgen(module = "/src/javascript/draw.js")]
extern "C" {
    type Draw;

    #[wasm_bindgen(constructor)]
    pub fn new() -> Draw;

    #[wasm_bindgen(method)]
    pub fn width(this: &Draw) -> f64;

    #[wasm_bindgen(method)]
    pub fn height(this: &Draw) -> f64;

    #[wasm_bindgen(method)]
    pub fn clear_screen(this: &Draw);

    #[wasm_bindgen(method)]
    pub fn draw_player(this: &Draw, _: c_double, _: c_double, _: c_double);

    #[wasm_bindgen(method)]
    pub fn draw_enemy(this: &Draw, _: c_double, _: c_double);

    #[wasm_bindgen(method)]
    pub fn draw_bullet(this: &Draw, _: c_double, _: c_double);

    #[wasm_bindgen(method)]
    pub fn draw_particle(this: &Draw, _: c_double, _: c_double, _: c_double);

    #[wasm_bindgen(method)]
    pub fn draw_score(this: &Draw, _: c_double);
}
