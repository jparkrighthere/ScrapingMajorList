/**
 * Scraping major list from UW-Madison webpage
 *
 * @author Jeonghyeon Park <fishbox0923@gmail.com>
 */

const {Builder, Browser, By, Key, until} = require('selenium-webdriver');
const chromeDriver = require('selenium-webdriver/chrome');
const chromeOptions = new chromeDriver.Options();
chromeOptions.addArguments('--headless');
chromeOptions.addArguments('--disable-gpu');
chromeOptions.addArguments('--no-sandbox');

export default class MajorListCrawler {
  static async create(): Promise<string[]> {
    const driver = await new Builder()
      .forBrowser(Browser.CHROME)
      .setChromeOptions(chromeOptions)
      .build();

    try {
      //set up and find elements
      await driver.get('https://www.wisc.edu/academics/majors/#majors');
      await driver.wait(until.elementLocated(By.css('#uw-footer-notices')));
      const table = await driver.findElement(By.css('.uw-programs'));

      // Retrieve all first index td elements within the table
      const temp = await table.findElements(By.css('td:first-child'));

      // Filter out the empty elements
      const filteredList = await Promise.all(
        temp.map(async (major: {getText: () => string}) => {
          const text = await major.getText();
          return text.trim();
        })
      );

      // Remove empty elements from the array
      const majorList = filteredList.filter(major => major !== '');
      let count = 1;

      const majorListArray: string[] = [];
      //리스트 체크
      for (const major of majorList) {
        console.log(`${count++} ${major}`);
        majorListArray.push(major);
      }
      // Order alphabetically
      majorListArray.sort();
      return majorListArray;
    } finally {
      await driver.quit();
    }
  }
}