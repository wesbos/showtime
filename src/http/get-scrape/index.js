const puppeteer = require('puppeteer');
const fs = require('fs');
// const youtubedl = require('youtube-dl');
const data = require('@begin/data');

const url = `https://www.hgtv.ca/videos/`;

async function getRecentShows() {
  console.log('Getting shows');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);
  const shows = await page.evaluate(() => {
    const drawer = document.querySelector('.shawVideo_drawer');
    const els = Array.from(drawer.querySelectorAll('li'));
    const shows = els.map(el => ({
      series: el.querySelector('[class*=title]').textContent,
      title: el.querySelector('[class*=episodeName]').textContent,
      season: el.querySelector('[class*=season]').textContent,
      episode: el.querySelector('[class*=_footer] [class*=_episode]')
        .textContent,
      url: window.location.origin + el.dataset.video_url,
      id: el.dataset.video_id,
      scrapeDate: Date.now(),
    }));
    return shows;
  });

  shows.forEach(async show => {
    // check if we have it
    const existingShow = await data.get({ table: 'shows', key: show.id });
    if (existingShow) return;
    await data.set({
      table: 'shows',
      key: show.id,
      show,
    });
  });

  await browser.close();
  return shows;
}

// HTTP function
exports.handler = async function http(req) {
  getRecentShows();
  // const shows = await getRecentShows();
  const shows = await data.get({ table: 'shows' });
  console.log(shows);
  const html = `hey`;
  return {
    headers: {
      'content-type': 'text/html; charset=utf8',
      'cache-control':
        'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
    },
    body: JSON.stringify(shows),
  };
};
