const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client();

// QR Code
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('🤖 Bot está pronto!');
});

// 🌟 Armazenamentos
const usuerActive = new Set(); // Quem está no atendimento
const stateUser = new Map(); // Em que menu o usuário está
const contextUser = new Map(); // Guarda o contexto de atnedimento do usuário


// 📩 Quando chega uma mensagem
client.on('message', async message => {
    const contato = await message.getContact();
    const numero = contato.number;
    const nome = contato.pushname || "Usuário";
    const texto = message.body.toLowerCase();
    let contexto = {};

    contextUser.set(numero, contexto); 

    // Ativa o atendimento ao usuário. 
    if (!usuariosAtivos.has(numero)) {
        usuariosAtivos.add(numero);
        estadosUsuarios.set(numero, "menu_init"); // Seta o estado do usuário para o menu principal. 
        await message.reply(`
            👋 Olá ${nome}, bem-vindo ao setor de TI do IFMG Campus Ibirité. 🖥️\n
            \n
            Você é:\n
            1 - Aluno(a)\n
            2 - Docente\n
            3 - Servidor(a)\n
            \n
            Digite o número da opção ou "sair" para encerrar.`);
        return;
    }

    })