const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const FILE = path.join(__dirname, "data.json");
const fs = require("fs");

app.use(express.urlencoded());

app.post("/api/newpro", (req, res, next) => {
  read(FILE).then(products => {
    products.push(req.body);
    write(FILE, products).then(() => res.status(201));
  });
  res.status(201).redirect('/')
});

app.delete("/api/delpro/:idx", (req, res, next) => {
  read(FILE)
  .then(products => {
     const delProd = products.filter((product, i) => req.params.idx*1 !== i)
    write(FILE, delProd)
    })
    res.status(204).send("Removed Item")
});

app.get("/api/products", (req, res, next) => {
  read(FILE).then(products => res.send(products));
});

app.get("/", (req, res, next) =>
  res.sendFile(path.join(__dirname, "./index.html"))
);

const write = (filePath, data) => {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(data)) {
      return reject("data must be an Array");
    }
    fs.writeFile(filePath, JSON.stringify(data), err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

const read = filePath => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }
      let results;
      try {
        results = JSON.parse(data.toString());
        if (!Array.isArray(results)) {
          return reject("data is not an array");
        }
      } catch (ex) {
        return reject(ex);
      }
      resolve(results);
    });
  });
};

app.listen(port, () => console.log(`listening on port ${port}`));
