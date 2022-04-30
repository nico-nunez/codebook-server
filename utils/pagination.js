module.exports.pagination = (pageNum = 1, limitNum = 20) => {
	const limit = Math.min(Number(limitNum || 20), 100);
	const page = Math.max(Number(pageNum || 0), 1);
	const offset = Math.max(limit * (page - 1), 0);
	return { limit, page, offset };
};
