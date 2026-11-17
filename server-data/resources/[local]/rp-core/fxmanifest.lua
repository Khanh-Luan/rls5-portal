fx_version 'cerulean'
game 'gta5'

author 'RLS5 Dev'
description 'RLS5 (Royal Los Santos 5) - Core Roleplay Economy, Jobs & NUI Dashboard'
version '1.0.0'

shared_script 'shared/config.js'

server_scripts {
    'server/economy.js',
    'server/main.js'
}

client_script 'client/main.js'

ui_page 'web/index.html'

files {
    'web/index.html',
    'web/style.css',
    'web/app.js',
    'web/rls5-logo.png'
}
