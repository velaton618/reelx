import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

@Injectable()
export class AppService {
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

  async getFilm(url: string): Promise<{ url: string; title: string }> {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.tracing.start({
      categories: ['devtools.timeline'],
      path: './tracing.json',
    });
    await page.setRequestInterception(true);

    page.on('request', (req) => {
      if (
        req.resourceType() == 'stylesheet' ||
        req.resourceType() == 'font' ||
        req.resourceType() == 'image'
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(url);
    await page.waitForSelector('iframe');

    const iframe = await page.$('iframe');
    iframe.click();

    const title = await page.title();

    const trace = JSON.parse((await page.tracing.stop()).toString());
    const events = trace.traceEvents;

    for (let i = 0; i < events.length; i++) {
      if (events[i].name === 'ResourceSendRequest') {
        const url = events[i].args.data.url;

        if (url.includes('mp4')) {
          return {
            url: url,
            title: title,
          };
        }
      }
    }
    return {
      url: '',
      title: '',
    };
  }
}
