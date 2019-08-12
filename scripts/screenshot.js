const puppeteer = require('puppeteer');

const http = require('http');
const fs = require('fs');
const path = require('path');
const finalhandler = require('finalhandler');
const serveStatic = require('serve-static');

const helpRequired = process.argv.indexOf('--help') !== -1 || process.argv.indexOf('-?') !== -1 || process.argv.indexOf('/?') !== -1

if(helpRequired) {
    console.log(`
        Generates screenshots for html files located in the specified folder

        Usage: screenshot [--folder targetFolder --selector domSelector]

        --folder : the relative path to the folder containing html files for which to generate screenshots, defaults to 'examples'
        --selector: the DOM selector query of elements to generate screenshots for, defaults to 'canvas, svg'
    `)
    return
}

const getArg = (arg) => process.argv.indexOf(arg) !== -1 ? process.argv[process.argv.indexOf(arg) + 1] : null
const selectorArg = '--selector'
const captureSelector = getArg(selectorArg) || 'canvas, svg'

    
const folderArg = '--folder'
const folder = getArg(folderArg) || 'examples'

const port = 8080;

const capture = (url, file, browser) =>
    new Promise(async (resolve, reject) => {
        const screenshot = path.resolve('screenshots', file.substr(0, file.length - 5)) + '.png'
        const page = await browser.newPage()
        await page.goto(url, { waitUntil: 'networkidle2'})
        const rect = await page.evaluate((captureSelector) => {
            const elem = document.querySelector(captureSelector)
            if(!elem) { return null }
            const { x, y, width, height } = elem.getBoundingClientRect()
            return {x, y, height, width, id: elem.id }
        }, captureSelector)
        try {
            await page.screenshot({path: screenshot, clip: rect})
            console.log(`${file} ✔️`)
            resolve()
        } catch(e) {
            console.log(`${file} ❌ (${e})`)
            reject(e)
        }
})

const takeScreenshots = (browser) =>
    new Promise((resolve, reject) => {
        const files = fs.readdirSync(`${process.cwd()}/${folder}`)
            .filter(file => file.substr(-4) === 'html')
        const pkgInfo = require(`${process.cwd()}/package.json`)
        const name = pkgInfo.name.replace('@d3fc/', '')
        console.log(`Producing ${files.length} screenshot(s) for package : ${name}`)
        const promises = files
        .map(async (file) => {
            const url = `http://localhost:${port}/packages/${name}/examples/${file}`;
            return capture(url, file, browser)
        })
        Promise.all(promises).then(resolve).catch(reject)
    })

const serve = serveStatic('../..');

const server = http.createServer(function(req, res) {
    const done = finalhandler(req, res);
    serve(req, res, done);
});

server.listen(port, () => {
    puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']}).then(async(browser) => {
        takeScreenshots(browser).then(() => {
            console.log('Screenshots complete 📷');
        }).catch(err => {
                console.error('Screenshots failed ❌ ', err);
        }).finally(() =>{
            browser.close()
            server.close();
        })
    })
})