const { google } = require('googleapis')
const authorize = require('./authorizeGoogleAPI.js')
const fs = require('fs')
const convertPayload = require('./convertPayload')

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

function decodePayload(payload) {
  if (!payload) {
    return console.log('No payload!')
  } else if (payload.parts) {
    return decodePayload(payload.parts[payload.parts.length - 1]) // last part is the HTML version
  } else if (payload.body && payload.body.data) {
    return convertPayload(payload.body.data)
  } else {
    return console.log('Payload has neither parts nor body.data')
  }
}

authorize()
  .then(listThreads)
  .then(threads =>
    threads.map(thread => {
      return {
        id: thread.data.id,
        messages: thread.data.messages.map(message => ({
          subject: message.payload.headers.find(header => header.name === 'Subject').value,
          from: message.payload.headers.find(header => header.name === 'From').value,
          snippet: message.snippet,
          payload: decodePayload(message.payload),
        })),
      }
    })
  )
  .then(threads => {
    fs.writeFile('threads.json', JSON.stringify(threads), err => {
      if (err) throw err
      console.log('The file has been saved!')
    })
  })
  .catch(console.error)
