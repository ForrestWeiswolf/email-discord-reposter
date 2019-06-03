A program to automatically repost messages from a Google Group to a Discord server.

# How to run locally:

- `npm install`
- Set up a Gmail account that's subscribed to the Google Group
  - This should work without a Google Group if you just want to repost emails, but I haven't tested that use case
- Get credentials for the Google API
  - See step 1 [here](https://developers.google.com/gmail/api/quickstart/nodejs) for how to do this
- Set up a webhook on the Discord server in question
- Create a `secrets.js` file, with the following:

```javascript
process.env.POST_HOOK = '' // Add your webhook URL here
process.env.GOOGLE_CREDENTIALS = JSON.stringify('') // Add Your credentials for the Google API here
process.env.GMAIL_QUERY = ''
// Add the query to repost emails according to. Supports the same query format as the Gmail search box; I recommend 'newer_than:1h list:<name_of_your_group_here>@googlegroups.com'
process.env.NEW_THREAD_ROLE = '' // This line is optional, but if you add the ID of a role, that role will be pinged when the first email of a thread is reposted. You can get the ID of a role by enabling developer mode in Discord, in Settings in the Appearance section, and then right-clicking the role.
```

- Regarding the Gmail query `newer_than:1h list:<name_of_your_group_here>@googlegroups.com -subject:"re:"` - that's emails
  - From the mailing list (for obvious reasons),
  - That are newer than one hour (since we'll be setting this up to automatically run every hour),
- `npm run repost` should give you a URL to visit to authorize the app. Do that, and past in the code it gives you.

-The app will display a token, and ask you to add it as process.env.OAUTH_TOKEN.

Add this to the end of secrets.js:
`process.env.OAUTH_TOKEN =` your token

Now, you should be able to `npm run repost` and have it work.

# How to deploy:

I deployed this to Heroku, so that's what the instructions will cover. It shouldn't be hard to adapt to other hosting services, however.

[Create a heroku app](https://devcenter.heroku.com/articles/getting-started-with-nodejs?singlepage=true), and push this to it

From this point on, the process should be very similar to running locally, with the following exceptions:

- Everything that you added to `secrets.js` before will now be added to the config vars. Also, you'll need to set the config var `NODE_ENV` to `production`, if it isn't already.

- You may need to replace `http://localhost` in the Google credentials with the url of your Heroku app, as well.

- Instead of `npm run repost`, you'll need to use `heroku run npm run repost`

- To get it to run automatically every hour, I used [Heroku scheduler](https://devcenter.heroku.com/articles/scheduler).
  - Run `heroku addons:create scheduler:standard`
  - Open the Scheduler dashboard by finding the app in My Apps, clicking “General Info”, then selecting “Scheduler” from the Add-ons drop down
  - Click "Add job" on the scheduler dashboard. The job should be `npm run repost`, and the frequesncy you pick should match the query - if we're getting emails from the last hour, than we want it to run once per hour.
