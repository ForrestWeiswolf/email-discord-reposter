const { google } = require('googleapis')
const authorize = require('./authorizeGoogleAPI.js')
const fs = require('fs')

function listThreadIds(auth) {
  const gmail = google.gmail({ version: 'v1', auth })

  return new Promise((resolve, reject) => {
    gmail.users.threads.list(
      {
        userId: 'me',
      },
      (err, res) => {
        if (err) reject(err)
        resolve(res.data.threads.map(thread => thread.id))
      }
    )
  })
}

function getThread(auth, id) {
  const gmail = google.gmail({ version: 'v1', auth })

  return new Promise((resolve, reject) => {
    gmail.users.threads.get(
      {
        userId: 'me',
        id,
      },
      (err, res) => {
        if (err) reject(err)
        resolve(res)
      }
    )
  })
}

async function listThreads(auth) {
  const ids = await listThreadIds(auth)
  const threadPromises = ids.slice(0, 3).map(id => getThread(auth, id))

  return Promise.all(threadPromises)
}

function decodePart(part) {
  if (part.parts) {
    return part.parts.map(decodePart)
  } else {
    return Buffer.from(part.body.data, 'base64').toString('ascii')
  }
}

authorize()
  .then(listThreads)
  .then(threads =>
    threads.map(thread => {
      return {
        id: thread.data.id,
        messages: thread.data.messages//.map(message => decodePart(message.payload))
      }
    })
  )
  .then(threads => {
    console.log(threads)
    fs.writeFile('threads.json', JSON.stringify(threads), err => {
      if (err) throw err
      console.log('The file has been saved!')
    })
  })
  .catch(console.error)
