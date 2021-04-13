const Discord = require('discord.js');
const VirusTotalApi = require('virustotal-api')
const fs = require("fs");
const request = require("request");
const Client = new Discord.Client();
const virusAPI = new VirusTotalApi('d816b4c69ec8605865d04e1dd8d08c677b72c9a61ab04d8f182d06dde68f8fa8') // <- esta api é um exemplo percisas de gerar a tua.

Client.on('ready', () =>{ 
	console.log("Login Feito.");
});

Client.on("message", (message) => {

	if (message.author.bot || message.channel.type === "dm") return;
	if (message.attachments.first() && message.attachments.first().size > 0) {

	const urlarchive = message.attachments.array()[0].url; 
	const tempName = urlarchive.split("/");
	const attachName = tempName[tempName.length-1]
	const l = attachName;

	function download(url){ require("request").get(url).pipe(fs.createWriteStream(attachName));}
		
	if (l.lenght <= 0) return;	
	if (l.includes(".jpeg") || l.includes(".png") || l.includes(".jpg") || l.includes(".gif") || l.includes(".txt") || l.includes(".mp4") || l.includes(".mp3") || l.includes(".mkv") || l.includes(".JPEG") || l.includes(".PNG") || l.includes(".JPG") || l.includes(".GIF") || l.includes(".TXT") || l.includes(".MP4") || l.includes(".MP3") || l.includes(".MKV")) {return;}
				
    	download(urlarchive);			
	message.delete().catch(O_o => O_o);

	message.channel.send("⚠️ | A Verificar o ficheiro "+ "``"+attachName+"``" +", caso o mesmo for seguro o download será liberado na finalização da análise. O tempo estimado poderá aumentar consoante o tamanho do ficheiro.").then(mensageminicial => {
    
		let replies = ["30000", "45000", "60000", "120000", "180000", "240000"]
		let result = Math.floor((Math.random() * replies.length));
	
		setTimeout(() => {
	
			function intervalo() {
			fs.readFile(attachName, (err, data) => { 
			  if (err) {console.log(err)} else {
				virusAPI.fileScan(data, 'file.js').then((response) => {
					virusAPI.fileReport(response.resource).then((result) => {
					if (result.verbose_msg == 'Your resource is queued for analysis') return;
				if (result.verbose_msg === 'Scan finished, information embedded') {
				clearInterval(this);
				if (result.positives > 1 || result.positives === 1) {
						message.delete().catch(O_o => O_o);
						fs.unlinkSync(attachName);
						  message.channel.send("**(VIRUS)** Arquivo verificado. Download não LIBERADO. (Quem enviou: <@"+message.author.id + "> ["+message.author.id+"])");
						  mensageminicial.delete().catch(O_o => O_o);
						  return;
				  } else {
						message.channel.send("**(SEGURO)** Arquivo verificado. Download do arquivo: (Quem enviou: <@"+message.author.id + "> ["+message.author.id+"])", {files: [urlarchive]});
						fs.unlinkSync(attachName);
						mensageminicial.delete().catch(O_o => O_o);
				  }
				  return;
				}
				}).catch(err => {clearInterval(this); setInterval(intervalo, replies[result]);});
			}).catch(err => {clearInterval(this); setInterval(intervalo, replies[result]);});
			}})}
		setInterval(intervalo, 15000);
	
		}, 5000); 
	})}});

	Client.login('O teu token');
