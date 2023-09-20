import fs from 'fs';
import { containsPartial } from './func/index.js';
import { mergeObject } from './func/mergeObject.js';
import { DEFAULT, FINANCE, CUSTOMER } from './data/index.js';

export const filterSeverity = async (req, res) => {
  const data = JSON.parse(fs.readFileSync('/Users/mzc01-sylee1274/Desktop/gitRepo/metafile_algo/services/process/awsIfApply.json', 'utf-8'));
  const checkRuleNameList = [];
  const splitCheckRuleNameList = [];
  const defaultResult = [];
  const financeResult = [];
  const customerResult = [];

  data.forEach((d) => {
    checkRuleNameList.push(d['checkRuleName']);
  });

  checkRuleNameList.forEach((checkRuleName) => {
    let splitCheckRuleName;
    if (checkRuleName.includes('-')) {
      splitCheckRuleName = checkRuleName.split('-');
      splitCheckRuleNameList.push(splitCheckRuleName);
    } else {
      splitCheckRuleName = checkRuleName.split('_');
      splitCheckRuleNameList.push(splitCheckRuleName);
    }
  });

  splitCheckRuleNameList.forEach((splitCheckRuleName, idx) => {
    const stringCheckRuleName = splitCheckRuleName.join(' ');

    const isContainedDefault = containsPartial(stringCheckRuleName, DEFAULT);
    const isContainedFinance = containsPartial(stringCheckRuleName, FINANCE);
    const isContainedPrivacy = containsPartial(stringCheckRuleName, CUSTOMER);

    // Default Severity
    if (isContainedDefault) {
      defaultResult.push({
        checkRuleName: checkRuleNameList[idx],
        defaultSeverity: 'CRITICAL',
      });
    } else if (!isContainedDefault) {
      defaultResult.push({
        checkRuleName: checkRuleNameList[idx],
        defaultSeverity: 'WARNING',
      });
    }

    if (isContainedFinance) {
      financeResult.push({
        checkRuleName: checkRuleNameList[idx],
        financeSeverity: 'CRITICAL',
      });
    } else if (!isContainedFinance) {
      financeResult.push({
        checkRuleName: checkRuleNameList[idx],
        financeSeverity: 'WARNING',
      });
    }

    if (isContainedPrivacy) {
      customerResult.push({
        checkRuleName: checkRuleNameList[idx],
        customerSeverity: 'CRITICAL',
      });
    } else if (!isContainedPrivacy) {
      customerResult.push({
        checkRuleName: checkRuleNameList[idx],
        customerSeverity: 'WARNING',
      });
    }
  });

  const severityArr = [...defaultResult, ...financeResult, ...customerResult];

  const mergedSeverityArr = mergeObject(severityArr);

  const result = Object.keys(mergedSeverityArr).map((key, idx) => {
    return {
      checkRuleName: checkRuleNameList[idx],
      defaultSeverity: mergedSeverityArr[key]['defaultSeverity'],
      financeSeverity: mergedSeverityArr[key]['financeSeverity'],
      customerSeverity: mergedSeverityArr[key]['customerSeverity'],
    };
  });

  // const reducedSeverityArr = severityArr.reduce((acc, cur) => {
  //   acc[cur['checkRuleName']] = acc[cur['checkRuleName']] || [];
  //   if (Object.keys(cur).includes('defaultSeverity'))
  //     acc[cur['checkRuleName']].push({
  //       defaultSeverity: acc[cur['defaultSeverity']],
  //     });

  //   return acc;
  // }, {});

  return res.json(result);

  return res.json([...defaultResult, ...financeResult, ...customerResult]);
};
