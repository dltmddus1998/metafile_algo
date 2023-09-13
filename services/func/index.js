export const findMatchingWordsWithCheckRuleName = (listWords, securityTermsArr, result) => {
  const matchingWords = [];
  if (Array.isArray(securityTermsArr) && listWords) {
    for (let i = 0; i < listWords.length; i++) {
      securityTermsArr.forEach((word) => {
        if (word.toLowerCase().includes(listWords[i])) {
          matchingWords.push({ checkRuleName: result, securityTerms: word, listWord: listWords[i] });
        }
      });
    }
  }

  if (matchingWords.length > 0) return matchingWords;
};

export const containsPartialWord = (inputString, targetWords) => {
  const words = inputString.split(' ');

  if (targetWords.includes(',')) {
    for (const word of words) {
      for (const targetWord of targetWords.split(',')) {
        if (targetWord.includes(word)) {
          return true;
        }
      }
    }
    return false;
  }
};