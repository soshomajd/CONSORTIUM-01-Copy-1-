export function getPaginationItems(page: number, totalPages: number): Array<number | "ellipsis-start" | "ellipsis-end"> {
  if (totalPages < 1) return []
  const current = Math.min(totalPages, Math.max(1, page))
  const visible = new Set([1, totalPages, current])
  if (current > 1) visible.add(current - 1)
  if (current < totalPages) visible.add(current + 1)
  const pages = [...visible].sort((a, b) => a - b)
  const items: ReturnType<typeof getPaginationItems> = []
  pages.forEach((number, index) => {
    if (index > 0 && number - pages[index - 1] > 1) {
      items.push(number <= current ? "ellipsis-start" : "ellipsis-end")
    }
    items.push(number)
  })
  return items
}
