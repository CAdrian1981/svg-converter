const express = require("express");
const puppeteer = require("puppeteer");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json({ limit: "10mb" }));

app.post("/convert", async (req, res) => {
  try {
    const svg = req.body.svg;
    if (!svg) return res.status(400).send("SVG content missing");

    const html = `
      <html>
        <body style="margin:0;padding:0;">
          ${svg}
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html);

    const element = await page.$("svg");
    const screenshot = await element.screenshot({ type: "png" });

    await browser.close();

    res.setHeader("Content-Type", "image/png");
    res.send(screenshot);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Conversion failed");
  }
});

app.listen(3000, () => {
  console.log("SVG Converter running on port 3000");
});


