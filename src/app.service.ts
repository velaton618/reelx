import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer, { Browser } from 'puppeteer';
import { delay } from 'rxjs';

@Injectable()
export class AppService {
  browser: Browser;

  constructor() {
    this.init();
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  async saerch(q: string): Promise<string[]> {
    const res = await axios.get(
      `https://rezka.ag/search/?do=search&subaction=search&q=${q}`,
    );
    const $ = cheerio.load(res.data);
    const hrefs = [];
    const posters = [];
    const links = [];
    const titles = [];

    $('div.b-content__inline_item-cover a').each((i, el) => {
      hrefs.push($(el).attr('href'));
    });

    $('div.b-content__inline_item-link a').each((i, el) => {
      titles.push($(el).text());
    });

    $('div.b-content__inline_item-cover img').each((i, el) => {
      posters.push($(el).attr('src'));
    });

    for (let i = 0; i < hrefs.length; i++) {
      links.push({
        href: hrefs[i],
        poster: posters[i],
        title: titles[i],
      });
    }

    return links;
  }

  async getFilm(
    url: string,
  ): Promise<{ url: string; title: string; qualities: string[] }> {
    const page = await this.browser.newPage();
    await page.tracing.start({
      categories: ['devtools.timeline'],
      path: './tracing.json',
    });
    // await page.setRequestInterception(true);

    // page.on('request', (req) => {
    //   if (
    //     req.resourceType() == 'stylesheet' ||
    //     req.resourceType() == 'font' ||
    //     req.resourceType() == 'image'
    //   ) {
    //     req.abort();
    //   } else {
    //     req.continue();
    //   }
    // });

    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // const iframe = await page.$('iframe');
    // iframe.click();

    page.waitForSelector(
      '#oframecdnplayer > pjsdiv:nth-child(17) > pjsdiv:nth-child(3)',
    );
    page.click('#oframecdnplayer > pjsdiv:nth-child(17) > pjsdiv:nth-child(3)');

    await delay(1000);

    // Scroll to the iframe element
    await page.evaluate(() => {
      const iframe = document.querySelector(
        '#cdnplayer_settings > pjsdiv > pjsdiv:nth-child(1) > pjsdiv:nth-child(4)',
      ) as HTMLElement;
      iframe.click();
    });

    const html = await page.content();
    const $ = cheerio.load(html);
    const title = $('h1').text();
    // const qualities = $('#cdnplayer_settings > pjsdiv > pjsdiv');
    // qualities.each((i, el) => {
    //   console.log($(el).text());
    // });
    // Click on .b-post__info_rates.kp a and get the redirected link

    const trace = JSON.parse((await page.tracing.stop()).toString());
    const events = trace.traceEvents;

    for (let i = 0; i < events.length; i++) {
      if (events[i].name === 'ResourceSendRequest') {
        const url = events[i].args.data.url;

        if (url.includes('mp4')) {
          // page.close();
          return {
            url: url,
            title: title,
            qualities: [],
          };
        }
      }
    }

    // page.close();
    return {
      url: '',
      title: '',
      qualities: [],
    };
  }
}
