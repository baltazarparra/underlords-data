const puppeteer = require('puppeteer')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

const scrape = async () => {
  db.defaults({hero: []}).write()

  const url = 'https://rankedboost.com/dota-underlords/'
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()

  await page.goto(url)
  await page.waitForSelector('.TierListChampionContainer')

  const heroes = await page.$$('.TierListChampionContainer')

  console.log(`[😎] ${heroes.length} Heros found!`)

  for (let i = 0; i < heroes.length; i++) {
    await page.goto(url)
    console.log('[✋] wait loading')
    await page.waitForSelector('.TierListChampionContainer')
    console.log('[π] counting heroes')
    const heroes = await page.$$('.TierListChampionContainer')
    const hero = heroes[i]
    console.log(`[😎] Click in heros datails`)
    hero.click()
    console.log('[✋] wait loading')
    await page.waitForSelector('.rb-build-breadcrumb-a')
    console.log(`[🕷] scraping data for hero ${i + 1}`)
    const alliance = await page.evaluate(() => document.querySelector('.champion-role-info').innerText.split('|'))
    const guide = await page.evaluate(() => document.querySelector('.rb-build-sec-desc.singles-top').innerText)
    const name = await page.evaluate(() => document.querySelector('body > div.site-container.m-wrapper > div.site-inner > div > div.container > div > main > article > div > div.rb-build-article > div:nth-child(2) > table > tbody > tr:nth-child(1) > th:nth-child(1)').innerText)
    const cost = await page.evaluate(() => document.querySelector('body > div.site-container.m-wrapper > div.site-inner > div > div.container > div > main > article > div > div.rb-build-article > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2)').innerText)
    const mana = await page.evaluate(() => document.querySelector('body > div.site-container.m-wrapper > div.site-inner > div > div.container > div > main > article > div > div.rb-build-article > div:nth-child(2) > table > tbody > tr:nth-child(4) > td:nth-child(2)').innerText)
    const dps = await page.evaluate(() => document.querySelector('body > div.site-container.m-wrapper > div.site-inner > div > div.container > div > main > article > div > div.rb-build-article > div:nth-child(2) > table > tbody > tr:nth-child(5) > td:nth-child(2)').innerText)
    const damage = await page.evaluate(() => document.querySelector('body > div.site-container.m-wrapper > div.site-inner > div > div.container > div > main > article > div > div.rb-build-article > div:nth-child(2) > table > tbody > tr:nth-child(6) > td:nth-child(2)').innerText)
    const attackSpeed = await page.evaluate(() => document.querySelector('body > div.site-container.m-wrapper > div.site-inner > div > div.container > div > main > article > div > div.rb-build-article > div:nth-child(2) > table > tbody > tr:nth-child(7) > td:nth-child(2)').innerText)
    const movementSpeed = await page.evaluate(() => document.querySelector('body > div.site-container.m-wrapper > div.site-inner > div > div.container > div > main > article > div > div.rb-build-article > div:nth-child(2) > table > tbody > tr:nth-child(8) > td:nth-child(2)').innerText)
    const range = await page.evaluate(() => document.querySelector('body > div.site-container.m-wrapper > div.site-inner > div > div.container > div > main > article > div > div.rb-build-article > div:nth-child(2) > table > tbody > tr:nth-child(9) > td:nth-child(2)').innerText)
    const magicResist = await page.evaluate(() => document.querySelector('body > div.site-container.m-wrapper > div.site-inner > div > div.container > div > main > article > div > div.rb-build-article > div:nth-child(2) > table > tbody > tr:nth-child(10) > td:nth-child(2)').innerText)
    const armor = await page.evaluate(() => document.querySelector('body > div.site-container.m-wrapper > div.site-inner > div > div.container > div > main > article > div > div.rb-build-article > div:nth-child(2) > table > tbody > tr:nth-child(11) > td:nth-child(2)').innerText)
    const regen = await page.evaluate(() => document.querySelector('body > div.site-container.m-wrapper > div.site-inner > div > div.container > div > main > article > div > div.rb-build-article > div:nth-child(2) > table > tbody > tr:nth-child(12) > td:nth-child(2)').innerText)
    const Ability = await page.evaluate(() => document.querySelector('body > div.site-container.m-wrapper > div.site-inner > div > div.container > div > main > article > div > div.rb-build-article > div:nth-child(3) > table > tbody > tr:nth-child(1) > th:nth-child(2)').innerText)
    const description = await page.evaluate(() => document.querySelector('body > div.site-container.m-wrapper > div.site-inner > div > div.container > div > main > article > div > div.rb-build-article > div:nth-child(3) > table > tbody > tr:nth-child(2) > td:nth-child(2)').innerText)
    const cooldown = await page.evaluate(() => document.querySelector('body > div.site-container.m-wrapper > div.site-inner > div > div.container > div > main > article > div > div.rb-build-article > div:nth-child(3) > table > tbody > tr:nth-child(3) > td:nth-child(2)').innerText)
    console.log(`[📊] saving data for ${name}`)
    await db.get('hero')
      .push(
        {
          alliance,
          guide,
          name,
          cost,
          mana,
          dps,
          damage,
          attackSpeed,
          movementSpeed,
          range,
          magicResist,
          armor,
          regen,
          Ability,
          description,
          cooldown
        }
      ).write()
    console.log('[⬅️] go back for home')
    await page.goBack()
  }
  console.log('[✌] Finish')
  await page.close()
}

scrape()




