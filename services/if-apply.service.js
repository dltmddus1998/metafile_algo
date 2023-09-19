import fs from 'fs';

export const ifApply = async (req, res) => {
  const ifApplyList = JSON.parse(fs.readFileSync('/Users/mzc01-sylee1274/Desktop/gitRepo/metafile_algo/services/process/awsIfApply.json', 'utf-8'));

  const result = [];

  ifApplyList.forEach((ifApply) => {
    const ismsApplyVal = ifApply['ifApply1-ISMS(115)'];
    const firstApplyVal = ifApply['ifApply2-AWSManaged(105)'];
    const secondApplyVal = ifApply['ifApply3-AWSManaged(107)'];
    const lastApplyVal = ifApply['ifApply4-HybrixOps(54)'];

    if (ismsApplyVal === 'TRUE' || firstApplyVal === 'TRUE' || secondApplyVal === 'TRUE' || lastApplyVal === 'TRUE') {
      result.push({
        checkRuleName: ifApply['checkRuleName'],
        ifApply: 'TRUE',
      });
    } else if (ismsApplyVal === '' && firstApplyVal === '' && secondApplyVal === '' && lastApplyVal === '') {
      result.push({
        checkRuleName: ifApply['checkRuleName'],
        ifApply: 'FALSE',
      });
    }
  });

  return res.json(result);
};
