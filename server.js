import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
app.use(express.json({ limit: '5mb' }));

app.post('/svg-to-png', async (req, res) => {
  try {
    const { svg } = req.body;

    if (!svg) return res.status(400).send('Missing SVG data');

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.setContent(svg);
    const element = await page.$('svg');
    const buffer = await element.screenshot({ type: 'png' });

    await browser.close();

    res.set('Content-Type', 'image/png');
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error converting SVG to PNG');
  }
});

app.listen(3000, () => {
  console.log('SVG converter listening on port 3000');
});

