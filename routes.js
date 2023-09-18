import express from 'express';
import { listWordsFiltering } from './services/list-words.service.js';
import { securityTermsFiltering } from './services/security-terms.service.js';
import { awsResource } from './services/aws-resource.service.js';
import { crawling } from './services/crawling.service.js';

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
