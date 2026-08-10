'use strict';

const bold = s => `\x1b[1m${s}\x1b[0m`;
const dim = s => `\x1b[2m${s}\x1b[0m`;
const green = s => `\x1b[32m${s}\x1b[0m`;
const yellow = s => `\x1b[33m${s}\x1b[0m`;
const red = s => `\x1b[31m${s}\x1b[0m`;
const blue = s => `\x1b[34m${s}\x1b[0m`;
const cyan = s => `\x1b[36m${s}\x1b[0m`;
const magenta = s => `\x1b[35m${s}\x1b[0m`;

module.exports = { bold, dim, green, yellow, red, blue, cyan, magenta };
