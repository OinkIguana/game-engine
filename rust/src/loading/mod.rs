//! The loading state of the game

/// Resource that detects when assets are loading internally to the engine on a background
/// thread. This takes into account only tile grids.
#[derive(Copy, Clone, Debug)]
pub struct IsLoading(pub bool);

impl Default for IsLoading {
    fn default() -> Self {
        IsLoading(true)
    }
}
