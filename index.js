const puppeteer = require('puppeteer');
const ObjectsToCsv = require('objects-to-csv');

const run = async () => {
  // launch a web browser instance
  const browser = await puppeteer.launch();
  // create a new browser tab
  const page = await browser.newPage();
  // set browser tab's viewport dimensions
  await page.setViewport({
    width: 1024,
    height: 768,
    deviceScaleFactor: 1,
  });

  // navigate to the website
  await page.goto('https://quotes.toscrape.com/js/');

  // wait for quotes to be loaded
  await page.waitForSelector('.quote');

  // find quote elements
  const quoteElements = await page.$$('.quote');

  let quotes = [];

  for (const quoteElement of quoteElements) {
    // find text and author elements
    const textElement = await quoteElement.$('.text');
    const authorElement = await quoteElement.$('.author');

    // extract text from both elements
    const text = await page.evaluate(el => el.textContent, textElement);
    const author = await page.evaluate(el => el.textContent, authorElement);

    quotes.push({ text, author });
  }

  // save quotes to csv file
  const csv = new ObjectsToCsv(quotes);
  await csv.toDisk('./quotes.csv');

  // close the browser when done
  await browser.close();
};

run();
