import express from 'express';
import { listWordsFiltering } from './services/list-words.service.js';
import { securityTermsFiltering } from './services/security-terms.service.js';
import { awsResource } from './services/aws-resource.service.js';
import { crawling } from './services/crawling.service.js';
import { ifApply } from './services/if-apply.service.js';
import { filterSeverity } from './services/severity.service.js';
import { securityTermCate } from './services/security-term-cate.service.js';
import { securityTermKo } from './services/security-term-ko.service.js';

export const router = express.Router();

/**
 * 1) List Words Filtering
 */
router.get('/list-word-filtering', listWordsFiltering);

/**
 * 2) Security Terms Filtering
 */
router.get('/security-term-filtering', securityTermsFiltering);

/**
 * 3) AWS Resource Type
 */
router.get('/resource-type', awsResource);

/**
 * 4) Crawling
 */

router.get('/crawling', crawling);

/**
 * 5) IfApply | 연산
 */
router.get('/if-apply', ifApply);

/**
 * 6) severity
 */
router.get('/severity', filterSeverity);

/**
 * 7) security Term - category, csa mapping
 */
router.get('/st-category-csa', securityTermCate);

/**
 * 8) security term - Ko ver.
 */
router.get('/st-ko', securityTermKo);
