// Shared coordinates and colors for the scroll journey.
// Z decreases as the camera moves "forward" through the story; Y increases
// during the final climb up the crane, through the clouds, into open sky.

export const COLORS = {
  brand: '#1e3f8f',
  brandDark: '#14306b',
  accent: '#d97a1f',
  light: '#eef1f8',
  gray: '#8891a3',
  warm: '#ffb066',
  concrete: '#aab0bd',
  sky: '#bfe0f5',
};

// Camera position waypoints, in narrative order:
// papers (slalom) -> up to a 1st-floor window -> through it -> down the
// stairs -> across the reception -> out the back -> construction site
// (bigger) -> up the crane mast -> through the clouds -> open sky.
export const CAMERA_WAYPOINTS: [number, number, number][] = [
  [0, 1.7, 21], // among the floating papers
  [2.9, 1.8, 15], // slalom right, between sheets
  [-2.9, 1.6, 9.5], // slalom left, between sheets
  [-1.3, 2.9, 5], // rising toward the facade
  [-0.2, 4.6, 1.5], // lining up with the window
  [0, 5.3, -0.2], // at the window
  [0.3, 5.2, -2], // through the window, inside upstairs
  [0.7, 3.6, -3.3], // turning onto the stairs
  [1, 2, -4.6], // descending
  [0.6, 1.15, -5.9], // reaching the ground floor
  [0, 1.1, -8], // crossing the reception
  [0.8, 1.3, -12], // exiting toward the site
  [2.2, 1.7, -18], // arriving — construction site (bigger now)
  [3.4, 2.3, -25], // passing the crane base
  [3.7, 9, -25], // climbing the mast
  [2.9, 16, -24], // near the top
  [1.3, 21.5, -22.5], // through the clouds
  [0, 27, -21], // clear sky
];

// Look-at targets, one per waypoint above — authored separately (rather than
// derived from the curve tangent) so the camera settles into each beat
// instead of snapping to raw tangent direction on sharp turns.
export const CAMERA_TARGETS: [number, number, number][] = [
  [0.6, 1.7, 16],
  [-1.2, 1.7, 10.5],
  [-0.3, 2.2, 6],
  [-0.1, 3.8, 2.5],
  [0, 5, -0.5],
  [0.2, 5.2, -1.5],
  [0.6, 4, -3],
  [0.9, 2.6, -4.3],
  [0.7, 1.4, -5.9],
  [0.2, 1.1, -7.5],
  [0.5, 1.2, -11],
  [1.6, 1.5, -16],
  [2.9, 1.9, -22],
  [3.6, 4, -25],
  [3.4, 13, -24.5],
  [2, 19, -23.5],
  [0.5, 25, -21.5],
  [0, 30, -20],
];

// Fog/background color ramp sampled across the whole journey (ground → sky).
export const SKY_RAMP: { at: number; color: string }[] = [
  { at: 0, color: COLORS.brandDark },
  { at: 0.34, color: COLORS.brandDark },
  { at: 0.52, color: '#2a3f66' },
  { at: 0.72, color: '#3f6aa1' },
  { at: 0.9, color: '#8fb9d9' },
  { at: 1, color: COLORS.sky },
];

export const TOWN_HALL_Z = 0;
// The mairie facade is at world z=0 — its own depth is clipped (see
// TownHallModel) so it never bleeds into the construction site further back.
export const FACADE_CLIP_Z = -6.5;

export const CONSTRUCTION_Z = -25;
export const CRANE_BASE: [number, number, number] = [3.6, 0, -25];
export const CLOUD_LAYER_Y = 22;
