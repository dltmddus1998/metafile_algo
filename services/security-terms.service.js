import fs from 'fs';
import { findMatchingWordsWithCheckRuleName } from './func/index.js';

/**
 * 2) Security Terms Filtering
 */
export const securityTermsFiltering = async (req, res) => {
  const checkRulesList = fs.readFileSync(
    '/Users/mzc01-sylee1274/Desktop/gitRepo/metafile_algo/services/process/awsCheckRuleListWithSecurityTerms.json',
    'utf-8'
  );

  const parsedCheckRulesList = JSON.parse(checkRulesList);

  const listWordWithCheckRuleNameArr = [];
  const securityTermsArr = [];

  const resultArr = [];

  const resultGoldData = [];

  const finalGoldData = [];

  parsedCheckRulesList.forEach((checkRule) => {
    if (Object.keys(checkRule)[0] !== 'T4r') {
      securityTermsArr.push(checkRule['securityTerms List']);
    }
    if (Object.keys(checkRule)[0] === 'T4r' && checkRule['<<list words in checkRuleName>> 1st Result'] !== '') {
      const listWords = checkRule['<<list words in checkRuleName>> 1st Result'].split(',');
      const checkRuleName = checkRule['checkRuleName'];
      listWordWithCheckRuleNameArr.push({
        checkRuleName,
        listWords,
      });
    }
  });
  listWordWithCheckRuleNameArr.forEach((el, idx) => {
    const result = findMatchingWordsWithCheckRuleName(el.listWords, ...securityTermsArr, el.checkRuleName);
    if (result !== undefined) {
      resultArr.push(...result);
    }
  });

  const finalResult = resultArr.reduce((acc, cur) => {
    acc[cur['checkRuleName']] = acc[cur['checkRuleName']] || [];
    acc[cur.checkRuleName].push({ listWord: cur['listWord'], securityTerm: cur['securityTerms'] });

    return acc;
  }, {});

  const finalResultGroups = Object.keys(finalResult).map((key, idx) => {
    return {
      checkRuleName: key,
      securityTerms: finalResult[key],
    };
  });

  finalResultGroups.forEach((data) => {
    const goldData = data['securityTerms'].reduce((acc, cur) => {
      acc[cur['listWord']] = acc[cur['listWord']] || [];
      acc[cur['listWord']].push(cur['securityTerm']);
      return acc;
    }, []);

    const goldDataGroups = Object.keys(goldData).map((key) => {
      return {
        listWord: goldData[key],
      };
    });

    resultGoldData.push(...goldDataGroups);
  });

  resultGoldData.forEach((data) => {
    const change = new Set(data['listWord']);
    data['listWord'] = [...change];
  });

  finalResultGroups.forEach((data, idx) => {
    finalGoldData.push({
      checkRuleName: data['checkRuleName'],
      securityTerms: resultGoldData[idx]['listWord'],
    });
  });

  finalResultGroups.forEach((group) => {
    const rss = group['securityTerms'].reduce((acc, cur) => {
      acc[cur['listWord']] = acc[cur['listWord']] || [];
      acc[cur['listWord']].push(cur['securityTerm']);

      return acc;
    }, {});

    const rssObj = Object.keys(rss).map((key, idx) => {
      return {
        securityTerm: rss[key],
      };
    });

    group['securityTerms'] = rssObj;
  });

  finalResultGroups.forEach((group) => {
    const rss = group['securityTerms'].reduce((acc, cur) => {
      acc['securityTerm'] = acc['securityTerm'] || [];
      acc['securityTerm'].push(...cur['securityTerm']);

      return acc;
    }, {});

    group['securityTerms'] = rss['securityTerm'];

    const noDupl = new Set(group['securityTerms']);
    const noDuplArr = [...noDupl];

    group['securityTerms'] = noDuplArr.join(',');
  });

  return res.json(finalResultGroups);
};
