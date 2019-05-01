// This code is closely based on https://developers.google.com/gmail/api/quickstart/nodejs

const fs = require('fs')
const readline = require('readline')
const { google } = require('googleapis')

if(process.env.NODE_ENV !== 'production') require('./secrets.js')
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS)

const TOKEN_PATH = 'token.json'

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly'],
  })

  console.log('Authorize this app by visiting this url:', authUrl)

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  rl.question('Enter the code from that page here: ', code => {
    rl.close()

    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err)
      oAuth2Client.setCredentials(token)
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error(err)
        console.log('Token stored to', TOKEN_PATH)
      })
      callback(oAuth2Client)
    })
  })
}

/**
 * Create an OAuth2 client with the given credentials, returning a promise that resolves to the OAuth2 client
 * @param {Object} credentials The authorization client credentials.
 */
function authorize(callback) {
  const oAuth2Client = new google.auth.OAuth2(
    credentials.installed.client_id,
    credentials.installed.client_secret,
    credentials.installed.redirect_uris[0]
  )

  return new Promise((resolve, reject) => {
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) {
        resolve(getNewToken(oAuth2Client, callback))
      } else {
        oAuth2Client.setCredentials(JSON.parse(token))
        resolve(oAuth2Client)
      }
    })
  })
}

module.exports = authorize
