/**
 * Sample datasets
 */

let basicDataset = {
  // These are our default starting values
  starter: {
    x: [0.0, 1.0, 2.0, 0.0, 2.0, 1.0],
    y: [0.0, 2.0, 0.0, 1.0, 1.0, 0.0]
  },

  // Suboptimal example
  // len = 10.943174758686338
  suboptimal: {
    x: [0.0, 1.0, 2.0, 0.0, 2.0, 1.0, 1.0, 2.0, 0.0, 1.0, 1.0, 1.0, 1.5],
    y: [0.0, 2.0, 0.0, 1.0, 1.0, 0.0, 1.0, 2.0, 2.0, 1.5, 0.5, 1.5, 1.0]
  },

  // Same as suboptimal but with points 5 and 6 swapped
  // len = 10.23606797749979
  suboptimalSwapped: {
    x: [0.0, 1.0, 2.0, 0.0, 2.0, 1.0, 1.0, 2.0, 0.0, 1.0, 1.0, 1.0, 1.5],
    y: [0.0, 2.0, 0.0, 1.0, 1.0, 1.0, 0.0, 2.0, 2.0, 1.5, 0.5, 1.5, 1.0]
  }
}