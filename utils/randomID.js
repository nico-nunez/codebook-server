const crypto = require('crypto');

const alphaCode = (len, codeCase = 'upper') => {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let isLowerCase = codeCase === 'lower' ? true : false;
	let code = '';

	for (let i = 0; i < len; i++) {
		const randCase = Boolean(crypto.randomInt(2));
		let randChar = chars[crypto.randomInt(chars.length)];
		isLowerCase = codeCase === 'mixed' ? randCase : isLowerCase;
		randChar = isLowerCase ? randChar.toLowerCase() : randChar;
		code += randChar;
	}
	return code;
};

const numericCode = (len) => {
	const digits = '0123456789';
	let code = '';
	for (let i = 0; i < len; i++) {
		code += digits[crypto.randomInt(digits.length)];
	}
	return code;
};

const alphaNumCode = (len, codeCase = 'upper') => {
	let code = '';
	for (let i = 0; i < len; i++) {
		const randChar = crypto.randomInt(2)
			? alphaCode(1, codeCase)
			: numericCode(1);
		code += randChar;
	}
	return code;
};

const generateCode = (len, codeType = 'alphaNumeric', alphaCase = 'mixed') => {
	const minLen = Math.max(1, len);
	const actualLength = Math.min(minLen, 2000);
	if (codeType === 'alpha') return alphaCode(actualLength, alphaCase);
	if (codeType === 'numeric') return numericCode(actualLength);
	if (codeType === 'alphaNumeric') return alphaNumCode(actualLength, alphaCase);
};

module.exports = generateCode;
