// 获取 low 到 high 之间的一个随机值
export function getRangeRandom(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

// 获取 -30 到 30 之间正副值
export function get30DegRandom() {
    return getRangeRandom(-30, 30);
}
