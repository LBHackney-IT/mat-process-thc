const titleCase = (str: string): string => {
  const lowerCase = str.toLowerCase();
  const words = lowerCase.split(" ");
  const titleCasedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );

  return titleCasedWords.join(" ");
};

export default titleCase;
