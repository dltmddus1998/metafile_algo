export const mergeObject = (arr) => {
  const result = {};

  arr.forEach((obj) => {
    console.log(obj);
    const { checkRuleName, ...rest } = obj;
    // console.log(checkRuleName, rest);
    if (result[checkRuleName]) {
      result[checkRuleName] = { ...result[checkRuleName], ...rest };
    } else {
      result[checkRuleName] = rest;
    }
  });

  return result;
};
