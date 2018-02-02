const letters = 'abcdefghijklmnopqrstuvwxyz';
const alphabet = `${letters}${letters.toUpperCase()}0123456789`;

const rando = () => {
  let output = '';
  for (let i = 0; i < 6; i += 1) {
    output += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return output;
};

module.exports = rando;
