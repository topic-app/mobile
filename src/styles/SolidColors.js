function colorShade(color, amount) {
  return `#${color
    .replace(/^#/, '')
    .replace(/../g, (rgb) =>
      `0${Math.min(255, Math.max(0, parseInt(rgb, 16) + amount)).toString(16)}`.substr(-2),
    )}`;
}

const solidLight = {
  // Better colors should be at the front
  red: '#962626',
  green: '#34a115',
  blue: '#147bdd',
  yellow: '#e8dc2d',
  magenta: '#a146c3',
  cyan: '#22a1d2',
  pink: '#ca59cc',
  orange: '#d36301',
  lime: '#64bc19',
  gold: '#deb11a',
  purple: '#6a31a3',
};

const solidDark = {};
Object.entries(solidLight).forEach(([key, val]) => {
  // Darken all values in solidLight by 40 steps
  solidDark[key] = colorShade(val, -40);
});

export { solidLight, solidDark };
