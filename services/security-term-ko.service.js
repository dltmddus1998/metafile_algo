import fs from 'fs';
import { matchExactly } from './func/index.js';

export const securityTermKo = async (req, res) => {
  const securityTermKoList = JSON.parse(
    fs.readFileSync('/Users/mzc01-sylee1274/Desktop/gitRepo/metafile_algo/services/process/awsSecurityTermKo.json', 'utf-8')
  );

  const checkRuleWithSTList = JSON.parse(
    fs.readFileSync('/Users/mzc01-sylee1274/Desktop/gitRepo/metafile_algo/services/process/awsCheckRuleWithST.json', 'utf-8')
  );

  const splitSecurityTerm = [];
  const result = [];

  checkRuleWithSTList.forEach((checkRuleWithST) => {
    if (checkRuleWithST['securityTerms'] !== '') {
      const securityTerms = checkRuleWithST['securityTerms'].split(',');
      splitSecurityTerm.push(securityTerms);
    } else {
      splitSecurityTerm.push(checkRuleWithST['securityTerms']);
    }
  });

  securityTermKoList.forEach((securityTermKo) => {
    splitSecurityTerm.forEach((securityTerm, idx) => {
      const isMatched = matchExactly(securityTermKo['securityTerm'], securityTerm);
      if (!Array.isArray(securityTerm)) {
        result.push({
          checkRuleName: checkRuleWithSTList[idx]['checkRuleName'],
          securityTermEn: null,
          securityTermKo: null,
        });
      }
      if (isMatched) {
        result.push({
          checkRuleName: checkRuleWithSTList[idx]['checkRuleName'],
          securityTermEn: securityTermKo['securityTerm'],
          securityTermKo: securityTermKo['securityTerm-ko'],
        });
      }
    });
  });

  const reducedResult = result.reduce((acc, cur) => {
    acc[cur['checkRuleName']] = acc[cur['checkRuleName']] || [];
    acc[cur['checkRuleName']].push(cur['securityTermKo']);

    return acc;
  }, {});

  const finalResult = Object.keys(reducedResult).map((key, idx) => {
    const splitVal = reducedResult[key].join(',');
    return {
      checkRuleName: key,
      securityTermKo: splitVal,
    };
  });

  return res.json(finalResult);
};

/**
 * 임시로 사용한 부분 - seed-securityterm 작업시 중복 제거 사용
 */
// export const securityTermKo = async (req, res) => {
//   // 최종 보안 용어 파일의 내용을 읽어온다.
//   const finalSecurityTerm = fs
//     .readFileSync('/Users/mzc01-sylee1274/Desktop/gitRepo/metafile_algo/services/process/finalSecurityTerm.txt', 'utf-8')
//     .split('\n');

//   // 각 줄을 :: 기준으로 분리한다.
//   const terms = finalSecurityTerm.map((line) => line.split('::'));

//   // 각 줄의 오른쪽 부분을 , 기준으로 분리한다.
//   const termsList = terms.map((term) => term[1].split(','));

//   // 각 줄의 오른쪽 부분을 합친 배열을 만든다.
//   const combinedTerms = termsList.reduce((acc, curr) => acc.concat(curr), []);

//   // 중복을 제거한다.
//   const uniqueTerms = new Set(combinedTerms);

//   // 각 줄의 오른쪽 부분을 중복이 제거된 값으로 변경한다.
//   const filteredTerms = terms.map((term, index) => {
//     const termList = term[1].split(',');
//     // const filteredTermList = termList.filter((term) => {
//     // return uniqueTerms.has(term) && termList.indexOf(term) === termList.lastIndexOf(term);
//     // });
//     const noSame = new Set(termList);
//     const noSameArr = [...noSame];
//     return `${term[0]}::${noSameArr.join(',')}`;
//   });

//   // 결과를 출력한다.
//   fs.writeFileSync('/Users/mzc01-sylee1274/Desktop/gitRepo/metafile_algo/services/process/finalSecurityTerm2.txt', filteredTerms.join('\n'), 'utf-8');
// };

// export const securityTermKo = async (req, res) => {
//   const finalSecurityTerm2 = fs
//     .readFileSync('/Users/mzc01-sylee1274/Desktop/gitRepo/metafile_algo/services/process/finalSecurityTerm2.txt', 'utf-8')
//     .split('\n');

//   const terms = finalSecurityTerm2.map((line) => line.split('::'));

//   const result = [];

//   terms.forEach((term) => {
//     result.push({
//       checkRuleName: term[0],
//       securityTerms: term[1],
//     });
//   });

//   return res.json(result);
// };
