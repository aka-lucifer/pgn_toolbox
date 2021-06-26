fx_version 'bodacious'
game 'gta5'

ui_page "ui/index.html"

files {
	"ui/assets/css/style.css",
	"ui/assets/fonts/*.eot",
	"ui/assets/fonts/*.svg",
	"ui/assets/fonts/*.ttf",
	"ui/assets/img/*.jpeg",
	"ui/libraries/js/vue.js",
	"ui/libraries/css/*.css",
	"ui/events.js",
	"ui/index.html",
	"ui/script.js"
}

client_script "dist/client/main.js"
server_script "dist/server/main.js"
