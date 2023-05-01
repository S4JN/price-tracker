const puppeteer = require('puppeteer');
// const $ = require('cheerio');
const { sendNotification } = require("./utils/notification");
const cheerio = require('cheerio');
const CronJob = require('cron').CronJob;


const fs = require("fs")



const filepath = "input.json";

fs.readFile(filepath, "utf8", (err, data) => {
    if (err) {
        console.log(err);
        return;
    }
    const { url, price } = JSON.parse(data);
    console.log(url);    // "https://www.amazon.in/boAt-Airdopes-190-Breathing-Signature/dp/B0BBTYDK6Y?th=1"
    //console.log(price);


    //const url = "https://www.amazon.in/boAt-Airdopes-190-Breathing-Signature/dp/B0BBTYDK6Y?th=1";

    async function configureBrowser() {

        const browser = await puppeteer.launch()
        const page = await browser.newPage();
        await page.goto(url);
        return page;
    }

    async function checkPrice(page) {
        await page.reload();
        let html = await page.evaluate(() => document.body.innerHTML);
        const $ = cheerio.load(html);
        const firstPrice = $('span.a-price-whole').first().text();
        //formatting the price
        const firstce = firstPrice.split('.')[0];
        let num = parseInt(firstce.replace(',', ''));
        //perfectly giving the price 
        console.log(num);
        console.log(price);

        if (num <= price) {
            console.log("Buy..");
            //send notification
            sendNotification(num, url);
        }
        else {
            console.log("nahh");
        }

    }

    // async function monitor() {
    //     let page = await configureBrowser();
    //     await checkPrice(page);
    // }
    // monitor();
    async function startTracking() {
        const page = await configureBrowser();
      
        let job = new CronJob('* */30 * * * *', function() { //runs every 30 minutes in this config
          checkPrice(page);
        }, null, true, null, null, true);
        job.start();
    }

    startTracking();
})