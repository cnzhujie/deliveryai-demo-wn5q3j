import { test, expect, type Page } from '@playwright/test'

const zhRecommendedDishes = [
  { name: '鎏金番茄鸳鸯锅', description: '慢熬番茄与醇香牛油，一锅双味', price: '¥68 起' },
  { name: '牛油麻辣锅', description: '醇厚牛油，花椒与辣椒层层释香', price: '¥59 起' },
  { name: '琥珀嫩牛肉', description: '鲜切嫩牛肉，涮煮约 30 秒', price: '¥42 起' },
  { name: '鲜虾滑', description: '虾肉含量充足，弹嫩鲜甜', price: '¥39 起' },
]

async function gotoHome(page: Page) {
  await page.goto('/#/home')
  await expect(page).toHaveURL(/#\/home$/)
}

test.describe('首页推荐菜 - E2E 验收测试', () => {
  test('REQ-001/REQ-002: 首页展示推荐菜模块，内容复用菜单菜品信息', async ({ page }) => {
    await gotoHome(page)

    await expect(page.getByRole('heading', { name: '首页推荐菜' })).toBeVisible()
    await expect(page.getByText('先看看本店人气好味，选好桌台后即可点餐。')).toBeVisible()
    await expect(page.getByRole('button', { name: /A08/ }).first()).toBeVisible()
    await expect(page.getByRole('button', { name: '快速进入 A08 桌' })).toBeVisible()

    await expect(page.getByRole('button', { name: /查看.*推荐，选择桌台后点餐/ })).toHaveCount(4)
    for (const dish of zhRecommendedDishes) {
      const card = page.getByRole('button', { name: `查看${dish.name}推荐，选择桌台后点餐` })
      await expect(card).toBeVisible()
      await expect(card.getByRole('img', { name: dish.name })).toBeVisible()
      await expect(card.getByText(dish.description)).toBeVisible()
      await expect(card.getByText(dish.price)).toBeVisible()
    }
  })

  test('REQ-003/REQ-004: 点击推荐菜仅提示先选桌台，原桌台绑定流程保持可用', async ({ page }) => {
    await gotoHome(page)

    await page.getByRole('button', { name: '查看鲜虾滑推荐，选择桌台后点餐' }).click()
    await expect(page.getByRole('status')).toHaveText('请先选择桌台，进入点餐页后即可把心仪菜品加入购物车。')
    await expect(page).toHaveURL(/#\/home$/)
    await expect(page.getByRole('button', { name: '加入本桌购物车' })).not.toBeVisible()
    await expect(page.getByText('本桌购物车')).not.toBeVisible()

    await page.getByRole('button', { name: /A08/ }).first().click()
    await expect(page).toHaveURL(/#\/welcome$/)
    await expect(page.getByRole('button', { name: /进入点餐|Enter/ })).toBeVisible()
  })

  test('REQ-002: 英文语言下推荐菜模块与菜品文案同步切换', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('i18nextLng', 'en'))
    await gotoHome(page)

    await expect(page.getByRole('heading', { name: 'Recommended Dishes' })).toBeVisible()
    await expect(page.getByText('Explore popular flavors first. Choose a table to start ordering.')).toBeVisible()
    await expect(page.getByRole('button', { name: 'View Golden Tomato Dual-Flavor Pot recommendation, choose a table to order' })).toBeVisible()
    await expect(page.getByText('Slow-simmered tomato and rich beef tallow, two flavors in one pot')).toBeVisible()
    await expect(page.getByText('Choose a table to order').first()).toBeVisible()
  })

  test('REQ-001: 移动端推荐菜模块可读且不产生横向溢出', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await gotoHome(page)

    await expect(page.getByRole('heading', { name: '首页推荐菜' })).toBeVisible()
    await expect(page.getByRole('button', { name: '查看鎏金番茄鸳鸯锅推荐，选择桌台后点餐' })).toBeVisible()
    await expect(page.getByRole('button', { name: '快速进入 A08 桌' })).toBeVisible()

    const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
    expect(hasHorizontalOverflow).toBe(false)
  })
})
