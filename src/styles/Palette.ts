function colorShade(color: string, amount: number) {
  return `#${color
    .replace(/^#/, '')
    .replace(/../g, (rgb) =>
      `0${Math.min(255, Math.max(0, parseInt(rgb, 16) + amount)).toString(16)}`.substr(-2),
    )}`;
}

const paletteLight = {
  // Better colors should be at the top
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

const paletteDark = Object.entries(paletteLight)
  .map(([key, val]) => ({ [key]: colorShade(val, -40) }))
  .reduce((obj, item) => ({ ...obj, ...item })) as typeof paletteLight;

export { paletteLight, paletteDark };
