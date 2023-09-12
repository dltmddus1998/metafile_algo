import express from 'express';
import { listWordsFiltering } from './services/list-words.service.js';
import { securityTermsFiltering } from './services/security-terms.service.js';

export const router = express.Router();

/**
 * 1) List Words Filtering
 */
router.get('/list-word-filtering', listWordsFiltering);

/**
 * 2) Security Terms Filtering
 */
router.get('/security-term-filtering', securityTermsFiltering);
