// 自分自身へのDMチャンネルIDを返す
function getMyChannel(): string {
  const conversationsOpenUrl = 'https://slack.com/api/conversations.open';
  const oauthToken = PropertiesService.getScriptProperties().getProperty('BOT_OAUTH_TOKEN')
  const payload = {
    users: 'USLACKBOT',
  }
  const headers = {
    Authorization: `Bearer ${oauthToken}`
  }
  const params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: 'post',
    contentType: 'application/json',
    headers: headers,
    payload: JSON.stringify(payload),
  }
  const res = UrlFetchApp.fetch(conversationsOpenUrl, params);
  if (res.getResponseCode() != 200) {
    Logger.log(`res=${res}`)
    return ""
  }
  const resPayload = JSON.parse(res.getContentText())
  if (!('channel' in resPayload)) {
    Logger.log(`resPayload=${resPayload}`)
    return ""
  }
  return resPayload['channel']['id']
}

// 自分自身へDMを送る
function postMessage(text: string): boolean {
  const postMessageUrl = "https://slack.com/api/chat.postMessage";
  const oauthToken = PropertiesService.getScriptProperties().getProperty('BOT_OAUTH_TOKEN')
  const channel = getMyChannel()
  if (channel == '') {
    return false
  }
  const payload = {
    channel: channel,
    text: text,
  }
  const headers = {
    Authorization: `Bearer ${oauthToken}`
  }
  const params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: 'post',
    contentType: 'application/json',
    headers: headers,
    payload: JSON.stringify(payload),
  }  
  const res = UrlFetchApp.fetch(postMessageUrl, params);
  if (res.getResponseCode() != 200) {
    Logger.log(`res=${res}`)
    return false
  }
  return true
}

function doPost(e: GoogleAppsScript.Events.DoPost) {
  const params = e.parameter
  if (!('payload' in params)) {
    Logger.log(`params=${params}`)
    return ContentService.createTextOutput('Payload not found in post data.');
  }
  const payload = JSON.parse(decodeURIComponent(params['payload']));
  const verificationToken = PropertiesService.getScriptProperties().getProperty('APP_VERIFICATION_TOKEN')
  if (payload['token'] != verificationToken) {
    return ContentService.createTextOutput('Illegal app token specified.');
  }
  if (postMessage(JSON.stringify(payload)) != true) {
    return ContentService.createTextOutput('Invalid API request.');
  }
  return ContentService.createTextOutput();
}

function doGet(e: GoogleAppsScript.Events.DoGet) {
  const verificationToken = PropertiesService.getScriptProperties().getProperty('APP_VERIFICATION_TOKEN')
  if (verificationToken == '') {
    return ContentService.createTextOutput('Not specified required property: APP_VERIFICATION_TOKEN');
  }
  const oauthToken = PropertiesService.getScriptProperties().getProperty('BOT_OAUTH_TOKEN')
  if (oauthToken == '') {
    return ContentService.createTextOutput('Not specified required property: BOT_OAUTH_TOKEN');
  }
  return ContentService.createTextOutput('OK');
}