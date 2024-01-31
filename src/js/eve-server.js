'use strict';

const phin = require('phin')
const $ = require('jquery')
const AppConfig = require('../configuration')
// const { setSelectOptions } = require('./select-options')
const { getLocale } = require('./change-language')
const { findProfiles } = require('./eve-folder.js')
const { readDefaultFolders } = require('./eve-folder')

const urls = {
  "status": {
    "tranquility": "https://esi.evetech.net/latest/status/",
    "serenity": "https:/ali-esi.evepc.163.com/latest/status/?datasource=serenity",
    "singularity": "",
    "infinity": "https://ali-esi.evepc.163.com/latest/status/?datasource=infinity",
    "thunderdome": ""
  },
}

// when server select changes
async function changeServer(server) {
  AppConfig.saveSettings('server', server)
  const locale = getLocale()
  const title = locale.servers[server]
  $('#server-title').text(title)

  // await getServerStatus()
  await readDefaultFolders()
  await findProfiles()
}

// update server status and player count
async function getServerStatus() {
  const server = $('#server-select').val()
  const serverStatus = $('#server-status')
  const playerCount = $('#player-count')
  serverStatus.text('')
  playerCount.text('')

  const locale = getLocale()
  let status = 'N/A',
  players = 'N/A',
  cssClass = 'text-warning fw-bold';

  if (['tranquility', 'serenity', 'infinity'].includes(server)) {
    const res = await phin({
      'url': urls.status[server],
      'parse': 'json'
    })
    if (res.statusCode == 504) {
      status = locale.serverStatus.offline
      cssClass = 'text-danger fw-bold'
    } else if (res.statusCode == 200) {
      status = locale.serverStatus.online
      players = res.body.players
      cssClass = 'text-success fw-bold'
    }
  }

  serverStatus.text(status)
  serverStatus.attr('class', cssClass)
  playerCount.text(players)
  playerCount.attr('class', cssClass)
}

module.exports = {
  changeServer,
  getServerStatus,
}