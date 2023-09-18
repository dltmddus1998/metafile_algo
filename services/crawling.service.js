import axios from 'axios';
import { load } from 'cheerio';

export const crawling = async (req, res) => {
  /**
   * TODO: Crawling 구현
   */
  try {
    const html = await axios.get(
      'https://aws.amazon.com/products/?nc1=h_ls&aws-products-all.sort-by=item.additionalFields.productNameLowercase&aws-products-all.sort-order=asc&awsf.re%3AInvent=*all&awsf.Free%20Tier%20Type=*all&awsf.tech-category=tech-category%23compute'
    );

    const $ = load(html.data);
    const liElements = $('ul.aws-directories-container');

    const extractedData = [];

    liElements.map((index, element) => {
      const productName = $(element).find('.m-headline').text().trim();
      const productCategory = $(element).find('.m-category span').text().trim();
      const productDescription = $(element).find('.m-desc').text().trim();

      extractedData.push({ productName, productCategory, productDescription });
    });

    return res.json(extractedData);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
