/**
 * 将时间字符串（如 '7d', '1h', '30m', '10s'）转换为秒
 * @param timeStr 时间字符串
 * @returns 秒数
 */
export function parseTimeToSeconds(timeStr: string): number {
  const unitMap: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  }

  const match = timeStr.match(/^(\d+)([smhd])$/)
  if (!match) {
    // 如果不匹配，尝试直接转换为数字（假设是毫秒，这是 JWT 默认行为的一部分，但这里我们处理为秒）
    const num = parseInt(timeStr, 10)
    return isNaN(num) ? 0 : Math.floor(num / 1000)
  }

  const value = parseInt(match[1], 10)
  const unit = match[2]

  return value * (unitMap[unit] || 0)
}
