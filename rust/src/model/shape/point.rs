//! Points

use serde::{Serialize, Deserialize};
use sdl2::rect as sdl;
use std::ops;

/// A point in a 2D coordinate system
#[derive(Copy, Clone, PartialEq, Eq, Hash, Default, Serialize, Deserialize, Debug)]
pub struct Point<T = i32> {
    /// The x position (left = 0)
    pub x: T,
    /// The y position (top = 0)
    pub y: T,
}

impl<T> Point<T> {
    /// Creates a new point
    pub const fn new(x: T, y: T) -> Self {
        Self { x, y }
    }
}

impl Point<i32> {
    /// The pixel distance between two points
    pub fn distance_from(&self, other: &Point) -> u32 {
        ((self.x - other.x).abs() + (self.y - other.y).abs()) as u32
    }
}

impl Point<f32> {
    /// The magnitude of this point, as if it were a vector sqrt(x * x + y * y)
    pub fn magnitude(&self) -> f32 {
        (self.x * self.x + self.y * self.y).sqrt()
    }
}

impl Into<sdl::Point> for Point {
    fn into(self) -> sdl::Point {
        sdl::Point::new(self.x, self.y)
    }
}

impl<T> ops::Add for Point<T>
where T: ops::Add<Output = T> {
    type Output = Point<T>;

    fn add(self, rhs: Point<T>) -> Self::Output {
        Self {
            x: self.x + rhs.x,
            y: self.y + rhs.y,
        }
    }
}

impl<T> ops::Sub for Point<T>
where T: ops::Sub<Output = T> {
    type Output = Point<T>;

    fn sub(self, rhs: Point<T>) -> Self::Output {
        Self {
            x: self.x - rhs.x,
            y: self.y - rhs.y,
        }
    }
}

impl<T> ops::Neg for Point<T>
where T: ops::Neg<Output = T> {
    type Output = Point<T>;

    fn neg(self) -> Self::Output {
        Self {
            x: -self.x,
            y: -self.y,
        }
    }
}
