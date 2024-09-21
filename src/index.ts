// src/index.ts

import * as nodeUtils from './node';
import * as browserUtils from './browser';

const isNode = typeof window === 'undefined' || typeof window.document === 'undefined';

export default isNode ? nodeUtils : browserUtils;