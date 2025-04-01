---
title: 'Web3 Storage'
description: 'Use decentralized protocols like IPFS and UCAN to liberate your data.'
date: 2022-06-01
demoURL: 'https://web3.storage/'
repoURL: 'https://github.com/web3-storage/web3.storage'
cover: web3-storage.png
---

:::image-figure[Web3 Storage.]
![Web3 Storage logo.](./logo.png)
:::

Store your files with web3.storage and retrieve them via their unique Content ID. Our tools make it simple to hash your content locally, so you can verify the service only ever stores the exact bytes you asked us to. Pick the method of using with web3.storage that works for you!

**Website**

Create an account via [https://web3.storage](https://web3.storage/) and upload right from the website using our uploader. Under the hood it uses the web3.storage client that we publish to npm to chunk and hash your files to calculate the root IPFS CID **in your browser** before sending them to [https://api.web3.storage](https://api.web3.storage/).

Once uploaded you can fetch your data from any IPFS gateway via [`https://dweb.link/ipfs/<root cid>`](https://dweb.link/ipfs/bafkreigh2akiscaildcqabsyg3dfr6chu3fgpregiymsck7e7aqa4s52zy)

Create an api token for your account and you can use any of the following alternatives to upload your data.

**JS Client**

Use npm to install the [`web3.storage`](https://www.npmjs.com/package/web3.storage) module into your JS project, create an instance of the client with your api token, and use the `.put` method to upload your files in node.js or the browser.

**node.js**

```ts
const { Web3Storage, getFilesFromPath } = require('web3.storage')
const storage = new Web3Storage({ token: process.env.WEB3_TOKEN })
const files = await getFilesFromPath(process.env.PATH_TO_ADD)
const cid = await storage.put(files)
console.log(`IPFS CID: ${cid}`)
console.log(`Gateway URL: https://dweb.link/ipfs/${cid}`)
```

See https://web3.storage/docs/#quickstart for a guide to using the js client for the first time.
