export default source => {
  return source.split(/\s+/)
    .reduce((result, part) => {
      const letter = part[part.length - 1];

      const num = parseInt(part);
      const minutes = (letter === 'd') ? num * 60 * 24 : (letter === 'h' ? num * 60 : num);

      if (isNaN(minutes)) {
        throw new Error(`${part} is not a number`);
      }

      return result + minutes;
    }, 0);
};
