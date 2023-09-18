import fs from 'fs';
import { containsPartialWord } from './func/index.js';
/**
 * 1) List Words Filtering
 *
 * TODO: sso - associated / no - notify 처럼 문자열이 포함돼 있어도 필터링이 되는 부분 제외시키기.
 */
export const listWordsFiltering = async (req, res) => {
  const seedWords = fs.readFileSync('/Users/mzc01-sylee1274/Desktop/gitRepo/metafile_algo/services/process/awsSeedWords.json', 'utf-8');
  const parsedSeedWords = JSON.parse(seedWords)['seedWords'];

  const checkRulesList = fs.readFileSync(
    '/Users/mzc01-sylee1274/Desktop/gitRepo/metafile_algo/services/process/awsCheckRuleListWithSecurityTerms.json',
    'utf-8'
  );
  const parsedCheckRulesList = JSON.parse(checkRulesList);

  const checkRuleNamesArr = [];
  const originCheckRuleNamesArr = [];
  const splitSeed = [];

  const filteredSeed = [];
  const resultw = [];

  const listWordsResult = [];

  parsedCheckRulesList.forEach((checkRule, idx) => {
    if (Object.keys(checkRule)[0] === 'T4r') {
      if (checkRule['checkRuleType'] !== 'HYBRIXOPS') {
        checkRuleNamesArr.push({
          checkRuleName: checkRule['checkRuleName'].split('-').join(' '),
          checkRuleType: checkRule['checkRuleType'],
        });
      } else if (checkRule['checkRuleType'] === 'HYBRIXOPS') {
        checkRuleNamesArr.push({
          checkRuleName: checkRule['checkRuleName'].split('_').join(' '),
          checkRuleType: checkRule['checkRuleType'],
        });
      }

      originCheckRuleNamesArr.push({
        checkRuleName: checkRule['checkRuleName'],
      });
    }
  });

  parsedSeedWords.map((seedWord) => {
    const splitSeedWord = seedWord.split('::');

    splitSeed.push({
      firstSeed: splitSeedWord[0],
      secondSeed: splitSeedWord[1],
    });
  });

  splitSeed.map((seed) => {
    if (typeof seed.secondSeed === 'string') {
      if (seed.secondSeed.includes(',')) {
        seed.secondSeed = seed.secondSeed.split(',');
      }
    }
  });

  const onlyCheckRuleNamesArr = [];

  // 1. splitSeed의 firstSeed와 checkRuleName 매칭하기
  checkRuleNamesArr.forEach((checkRuleName) => {
    onlyCheckRuleNamesArr.push(checkRuleName['checkRuleName']);
  });

  onlyCheckRuleNamesArr.forEach((checkRuleName, idx) => {
    splitSeed.forEach((seed, i) => {
      const isContainedPartial = containsPartialWord(checkRuleName, seed['firstSeed']);
      if (isContainedPartial) {
      }
      if (checkRuleName.includes(seed['firstSeed']) || isContainedPartial === true) {
        if (checkRuleName.includes('association') || (checkRuleName.includes('associated') && seed['firstSeed'] === 'sso')) {
          return;
        }
        if (checkRuleNamesArr[idx]['checkRuleType'] !== 'HYBRIXOPS') {
          filteredSeed.push({
            checkRuleName: checkRuleName.split(' ').join('-'),
            checkRuleType: checkRuleNamesArr[idx]['checkRuleType'],
            firstSeed: seed['firstSeed'],
            secondSeed: seed['secondSeed'],
          });
        } else if (checkRuleNamesArr[idx]['checkRuleType'] === 'HYBRIXOPS') {
          filteredSeed.push({
            checkRuleName: checkRuleName.split(' ').join('_'),
            checkRuleType: checkRuleNamesArr[idx]['checkRuleType'],
            firstSeed: seed['firstSeed'],
            secondSeed: seed['secondSeed'],
          });
        }
      }
    });
  });

  // 같은 checkRuleName 끼리 매핑해서 결과값 리턴하기.
  const resultArr = filteredSeed.reduce((acc, cur) => {
    acc[cur['checkRuleName']] = acc[cur['checkRuleName']] || [];
    acc[cur['checkRuleName']].push({
      checkRuleType: cur['checkRuleType'],
      firstseed: cur['firstSeed'],
      secondSeed: cur['secondSeed'],
    });

    return acc;
  }, {});

  const result = Object.keys(resultArr).map((key, idx) => {
    return {
      checkRuleName: key,
      listWords_inCheckRuleName: resultArr[key],
    };
  });

  result.forEach((e) => {
    e['listWords_inCheckRuleName'].forEach((d) => {
      if (Array.isArray(d['secondSeed'])) {
        if (d['secondSeed'].length > 1) {
          const setListWords = new Set(d['secondSeed']);
          const setListWordsArr = [...setListWords];
          if (setListWordsArr.length !== d['secondSeed'].length) {
            d['secondSeed'] = setListWordsArr;
          }
        }
      }
    });
  });

  result.forEach((checkRule, idx) => {
    checkRule['listWords_inCheckRuleName'].forEach((e) => {
      listWordsResult.push({
        checkRuleName: checkRule['checkRuleName'],
        checkRuleType: checkRule['listWords_inCheckRuleName'][0]['checkRuleType'],
        listWords: e['secondSeed'],
      });
    });
  });

  const finalListWordsResultArr = listWordsResult.reduce((acc, cur) => {
    acc[cur['checkRuleName']] = acc[cur['checkRuleName']] || [];
    acc[cur['checkRuleName']].push({
      checkRuleType: cur['checkRuleType'],
      listWords: cur['listWords'],
    });

    return acc;
  }, {});

  const finalListWordsResult = Object.keys(finalListWordsResultArr).map((key, idx) => {
    return {
      checkRuleName: key,
      listWords__CheckRuleName: finalListWordsResultArr[key],
    };
  });

  finalListWordsResult.forEach((el) => {
    el['listWords__CheckRuleName'].forEach((e) => {
      if (Array.isArray(e['listWords'])) {
        console.log(e['listWords']);
        // e['listWords'] = e['listWords'].join(',');
      }
      resultw.push({
        checkRuleName: el['checkRuleName'],
        checkRuleType: e['checkRuleType'],
        listwords: e['listWords'],
      });
    });
  });

  const finalResultWArr = resultw.reduce((acc, cur) => {
    acc[cur['checkRuleName']] = acc[cur['checkRuleName']] || [];
    acc[cur['checkRuleName']].push({
      checkRuleType: cur['checkRuleType'],
      listWords: cur['listwords'],
    });

    return acc;
  }, {});

  const finalResultW = Object.keys(finalResultWArr).map((key, idx) => {
    return {
      checkRuleName: key,
      listWordsWithType: finalResultWArr[key],
    };
  });

  const rs = [];

  finalResultW.forEach((w) => {
    if (w['listWordsWithType'].length > 0) {
      const reduced = w['listWordsWithType'].reduce((acc, cur) => {
        acc[cur['checkRuleType']] = acc[cur['checkRuleType']] || [];
        acc[cur['checkRuleType']].push(cur['listWords']);

        return acc;
      }, {});

      const reducedObj = Object.keys(reduced).map((key, idx) => {
        return {
          checkRuleType: key,
          listWords: reduced[key],
        };
      });

      reducedObj.forEach((d) => {
        let noUndefined = d['listWords'].filter((e) => e !== undefined);

        d['listWords'] = noUndefined;

        const noDupl = new Set(d['listWords']);

        const noDuplArr = [...noDupl];
        console.log(noDuplArr);
        d['listWords'] = noDuplArr.join(',');
      });

      rs.push({
        checkRuleName: w['checkRuleName'],
        '<<list words in checkRuleName>>': reducedObj[0]['listWords'],
      });
    }
  });
  return res.json(rs);
};
