# slack-interactive-message-proxy

Slackのインタラクティブメッセージをボット自身宛てのDMとして転送するGoogle Apps Script (GAS)です。

Slackボットを作る際、リアルタイムメッセージング (RTM) APIを使うとWebサーバを立てる必要がなくて楽ですが、外部URLが必須の機能は利用できません。たとえばSlackのインタラクティブメッセージの内容は外部URLに送信されるので、RTM APIによるボットとは相性が悪いことになります。

このようにRTM APIを使ったSlackボットでもインタラクティブメッセージを使いたい場合、このGASを中継することでインタラクティブメッセージのリクエストをRTMで受け取れるようになります。

## Install

```
$ git clone https://github.com/hnw/slack-interactive-message-proxy/
$ cd slack-interactive-message-proxy
$ npm install -g @google/clasp
$ clasp login
$ clasp create "Slack interactive message proxy"
$ git co -- appsscript.json
$ clasp push
```

## Setting property of GAS

GASエディタの「ファイル」「プロジェクトのプロパティ」から以下のプロパティを設定する必要があります。

- `BOT_OAUTH_TOKEN`
  - Slackの「Your Apps」「OAuth & Permissions」「OAuth Tokens for Your Team」の「Bot User OAuth Access Token」を設定
- `APP_VERIFICATION_TOKEN`
  - Slackの「Your Apps」「Basic Information」「App Credentials」の「Verification Token」を設定

## Setting GAS URL as Slack interactive request URL

GASエディタから「公開」「ウェブアプリケーションとして導入」として、URLを取得してください。その際、アクセス権限は「Anyone, Even anonymous」を選んでください。

GASのURLをSlackの「Your Apps」「Interactivity & Shortcuts」「Interactivity」の「Request URL」に設定すれば設定完了です。

あとはBotユーザーからSlackにインタラクティブメッセージを送ってユーザーが何か入力すれば、それに対応するJSONがボットからボット自身へのDMとして届きます。
