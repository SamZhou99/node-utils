const { query } = require('./mysql-sync.js')

var cache = {
	// 数据缓存
	data: {},

	// 初始化
	async init(clearTime = 10000) {
		//定时扫描回收 超时缓存数据
		setInterval(() => {
			cache.clear();
		}, clearTime);
	},

	// 清除超时数据
	async clear() {
		for (let key in cache.data) {
			if (cache.data[key].time + cache.data[key].cacheTime < new Date().getTime()) {
				cache.data[key] = null;
				delete cache.data[key];
			}
		}
	},

	// 查询
	async query(cacheTime, sql, param) {
		// 如果有这个缓存数据
		let key = sql + JSON.stringify(param)
		if (cache.data[key]) {
			// 如果缓存未超时
			if (cache.data[key].time + cacheTime > new Date().getTime()) {
				// console.log('取缓存数据', sql);
				return cache.data[key].data;
			}

			// 更新缓存
			return await cache.update(cacheTime, sql, param);
		}

		return await cache.update(cacheTime, sql, param);
	},

	// 更新缓存
	async update(cacheTime, sql, param) {
		let key = sql + JSON.stringify(param)
		if (!cache.data[key]) {
			cache.data[key] = {};
		}
		cache.data[key].time = new Date().getTime();
		cache.data[key].data = await query(sql, param);
		cache.data[key].cacheTime = cacheTime;
		// console.log('新缓存数据', key);
		return cache.data[key].data;
	}
};


cache.init();


module.exports = cache;