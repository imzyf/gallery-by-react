
// 获取 low 到 high 之间的一个随机值
export function getRangeRandom(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
