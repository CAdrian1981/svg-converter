const express = require('express');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

if (!fs.existsSync('./public')) fs.mkdirSync('./public');

app.post('/svg-to-png', async (req, res) => {
  const svg = req.body?.svg;
  if (!svg) return res.status(400).json({ error: 'SVG missing' });

  try {
    const filename = `${uuidv4()}.png`;
    const filepath = path.join(__dirname, 'public', filename);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(svg, { waitUntil: 'networkidle0' });

    const elementHandle = await page.$('svg');
    const clip = await elementHandle.boundingBox();

    await page.screenshot({
      path: filepath,
      clip,
      omitBackground: true
    });

    await browser.close();

    const url = `https://svg.vozipyme.es/public/${filename}`;
    res.json({ url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('SVG Converter listening on port 3000');
});
