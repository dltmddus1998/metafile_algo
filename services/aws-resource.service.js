import fs from 'fs';

export const awsResource = async (req, res) => {
  const resourceList = fs.readFileSync('/Users/mzc01-sylee1274/Desktop/gitRepo/metafile_algo/services/process/awsResourceType.json', 'utf-8');

  const parsedResourceList = JSON.parse(resourceList);

  const result = [];

  if (Array.isArray(parsedResourceList)) {
    parsedResourceList.forEach((resource) => {
      const resourceType = resource['awsResourceType'];

      const resourceTypeSplit = resourceType.split('::');

      const resourceTypeName1 = resourceTypeSplit[1].toLowerCase();
      const resourceTypeName2 = resourceTypeSplit[2].toLowerCase();

      const awsResourceTypeName = `${resourceTypeName1}-${resourceTypeName2}`;

      result.push({
        awsResourceType: resourceType,
        awsResourceTypeName,
      });
    });
  }

  return res.json(result);
};
