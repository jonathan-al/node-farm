import { readFileSync } from "node:fs"
import { createServer } from "node:http"
import { dirname } from "path"
import { fileURLToPath } from "url"

// console.log(import.meta.url) // file:///home/jonathan/nodejs/udemy/node-farm/index.mjs

// import.meta is an object that provides context - specific metadata about the current module.
// import.meta.url is a property of import.meta that returns the fully resolved URL of the current module.
const __filename = fileURLToPath(import.meta.url)
// console.log(__filename) // /home/jonathan/nodejs/udemy/node-farm/index.mjs
const __dirname = dirname(__filename)
// console.log(__dirname) // /home/jonathan/nodejs/udemy/node-farm

const replaceTempalte = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
  output = output.replace(/{%IMAGE%}/g, product.image)
  output = output.replace(/{%PRICE%}/g, product.price)
  output = output.replace(/{%FROM%}/g, product.from)
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
  output = output.replace(/{%QUANTITY%}/g, product.quantity)
  output = output.replace(/{%DESCRIPTION%}/g, product.description)
  output = output.replace(/{%ID%}/g, product.id)

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic")
  }
  return output
}

// Templates
const tempOverview = readFileSync("./templates/template-overview.html", "utf-8")
const tempCard = readFileSync("./templates/template-card.html", "utf-8")
const tempProduct = readFileSync("./templates/template-product.html", "utf-8")

// this will be read ONCE because is read before server.listen
const data = readFileSync("./dev-data/data.json", "utf-8")
const dataObj = JSON.parse(data)

const server = createServer(async (req, res) => {
  console.log(req.url)

  const pathName = req.url

  // Overview page
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" })

    const cardsHtml = dataObj
      .map((el) => replaceTempalte(tempCard, el))
      .join("")

    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml)

    res.end(output)

    // Product page
  } else if (pathName === "/product") {
    res.end(`This is the PRODUCT`)

    // API
  } else if (pathName === "/api") {
    console.log(`This is the API`)
    res.writeHead(200, { "Content-type": "application/json" })
    res.end(data)

    // Not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello",
    })
    res.end("<h1>Page not found</h1>")
  }
})

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on port 8000")
})
