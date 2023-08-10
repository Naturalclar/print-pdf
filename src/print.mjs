import { promises} from "node:fs"
import { Puppeteer } from "puppeteer"
import os from "node:os"

async function deleteTmpDir(dir) {
    await promises.rm(dir, { recursive: true, force: true })
  }

async function createTmpDir() {  
  const tempDir = promises.mkdir(`${os.tmpdir()}/puppeteer-`)

  return tempDir
}

async function main () {
    // PDFを作成するディレクトリを一時的に作成
    const tempDir = await createTmpDir()

    // ブラウザを起動
    const browser = await Puppeteer.launch()
    const page = await browser.newPage();

    // 印刷用のページに遷移
    await page.goto('https://www.example.com/');

    // 印刷用のページをPDFに変換
    await page.pdf({
      path: tempDir + '/sample.pdf',
    });

    // 印刷されたPDFをダウンロードできる場所に保管
    // 保管するための upload という関数があることを想定
    await upload(tempDir + '/sample.pdf')

    // 一時ディレクトリを削除
    await deleteTmpDir(tempDir)
  
    browser.close();
}