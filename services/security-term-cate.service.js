import fs from 'fs';

export const securityTermCate = async (req, res) => {
  const securityTermInfoList = JSON.parse(
    fs.readFileSync('/Users/mzc01-sylee1274/Desktop/gitRepo/metafile_algo/services/process/awsSecurityTermCate.json', 'utf-8')
  );

  const checkRuleWithSTList = JSON.parse(
    fs.readFileSync('/Users/mzc01-sylee1274/Desktop/gitRepo/metafile_algo/services/process/awsCheckRuleWithST.json', 'utf-8')
  );

  const splitSecurityTermList = [];
  const result = [];

  checkRuleWithSTList.forEach((checkRuleWithST) => {
    const securityTerms = checkRuleWithST['securityTerms'];
    if (securityTerms !== '') {
      const splitSecurityTerms = securityTerms.split(',');
      splitSecurityTermList.push(splitSecurityTerms);
    } else {
      splitSecurityTermList.push(securityTerms);
    }
  });

  splitSecurityTermList.forEach((splitSecurityTerm, idx) => {
    if (splitSecurityTerm) {
      splitSecurityTerm.forEach((st) => {
        securityTermInfoList.forEach((securityTermInfo) => {
          if (securityTermInfo['securityTerms'] === st) {
            result.push({
              checkRuleName: checkRuleWithSTList[idx]['checkRuleName'],
              securityTerm: st,
              awsSecurityCategory: securityTermInfo['awsSecurityCategory'],
              csaCategory: securityTermInfo['csaCategory'],
            });
          }
        });
      });
    }
  });

  const mappedObject = {};

  result.forEach((obj) => {
    const checkRuleName = obj['checkRuleName'];
    if (mappedObject[checkRuleName]) {
      for (const key in obj) {
        if (key !== 'checkRuleName') {
          if (Array.isArray(mappedObject[checkRuleName][key])) {
            mappedObject[checkRuleName][key].push(obj[key]);
          } else {
            mappedObject[checkRuleName][key] = [mappedObject[checkRuleName][key], obj[key]];
          }
        }
      }
    } else {
      mappedObject[checkRuleName] = {};
      for (const key in obj) {
        if (key !== 'checkRuleName') {
          mappedObject[checkRuleName][key] = [obj[key]];
        } else {
          mappedObject[checkRuleName][key] = obj[key];
        }
      }
    }
  });

  // const mappedArr = [mappedObject];

  const mappedResult = Object.keys(mappedObject).map((key, idx) => {
    return {
      checkRuleName: key,
      securityTerm: mappedObject[key]['securityTerm'],
      awsSecurityCategory: mappedObject[key]['awsSecurityCategory'],
      csaCategory: mappedObject[key]['csaCategory'],
    };
  });

  mappedResult.forEach((rs) => {
    if (rs['awsSecurityCategory'].length > 1) {
      const setCate = new Set(rs['awsSecurityCategory']);
      const setCateArr = [...setCate];
      const stringCategory = setCateArr.join(',');
      rs['awsSecurityCategory'] = stringCategory;
    }
    if (rs['csaCategory'].length > 1) {
      const setCate = new Set(rs['csaCategory']);
      const setCateArr = [...setCate];
      const stringCategory = setCateArr.join(',');
      rs['csaCategory'] = stringCategory;
    }
  });

  return res.json(mappedResult);
};
