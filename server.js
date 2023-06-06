const axios      = require('axios');
const express    = require('express');
const { Client } = require('whatsapp-web.js');

const app = express();

async function fetchBaconIpsum() {
  try {
    const response  = await axios.get("https://baconipsum.com/api/?type=all-meat-filler&paras=1");
    const data      = response.data;
    return data[0];
  } catch (error) {
    return error;
  }
}
async function sendMensageRobot(classClient, entrada, tipo, numero, minutos) {
    if ( entrada == 'in' ) {
        if ( tipo == 'chat' ) {
            var mensagem = await fetchBaconIpsum();
            setTimeout(() => {
                classClient.sendMessage(numero, mensagem);
            }, minutos * 60 * 1000);
        }
    }
}
async function ClientWhatsAppWeb(index) {
    const client = new Client({
    puppeteer: {
        headless: false
    }
    });
    client.on('ready', () => {
        console.log(`Chip ${ index } está conectado!`);
    });
    client.on('disconnected', (reason) => {
        console.log(`Chip ${ index } foi desconectado`);
    });
    client.on('message', message => {
        sendMensageRobot(client, message._data.self, message._data.type, message._data.from, 1);
    });
    await client.initialize();
}

app.get('/robot/initialize/:amount', async (req, res) => {
    var { amount } = req.params;
    res.json({ message: `Robot inicializado com ${ amount } números` });
    for (let index = 0; index < amount; index++) {
        await ClientWhatsAppWeb((index+1)); 
    }
});

app.listen('3333', () => {
    console.log('SERVIDOR RODANDO NA PORTA 3333');
});