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
const usuariosAtivos = new Set(); // Quem está no atendimento
const estadosUsuarios = new Map(); // Em que menu o usuário está

// 📩 Quando chega uma mensagem
client.on('message', async message => {
    const contato = await message.getContact();
    const numero = contato.number;
    const nome = contato.pushname || "Usuário";
    const texto = message.body.toLowerCase();

    // Se ele digitar "sair", limpa tudo
    if (texto === "sair") {
        usuariosAtivos.delete(numero);
        estadosUsuarios.delete(numero);
        await message.reply("❌ Atendimento encerrado. Mande qualquer mensagem para começar de novo.");
        return;
    }

    // Se não estiver em atendimento ainda
    if (!usuariosAtivos.has(numero)) {
        usuariosAtivos.add(numero);
        estadosUsuarios.set(numero, "menu_inicial");
        await message.reply(`👋 Olá ${nome}, bem-vindo ao setor de TI do IFMG Campus Ibirité.\n\nVocê é:\n1 - Aluno(a)\n2 - Docente\n3 - Servidor(a)\n\nDigite o número da opção ou "sair" para encerrar.`);
        return;
    }

    // Se já está em atendimento, pega o estado
    const estadoAtual = estadosUsuarios.get(numero);

    // Menu inicial
    if (estadoAtual === "menu_inicial") {
        if (texto === "1") {
            estadosUsuarios.set(numero, "aluno_wifi");
            await message.reply("📡 Você está com problema na rede Wi-Fi?\nDigite sua matrícula e aguarde o atendimento.\n\nOu digite 'sair' para encerrar.");
        } else if (texto === "2") {
            estadosUsuarios.set(numero, "docente_menu");
            await message.reply("👨‍🏫 Selecione o problema:\n1 - Rede Wi-Fi/Cabeada\n2 - Problema com a máquina\n3 - Problema com o Moodle\n\nOu digite 'sair'.");
        } else if (texto === "3") {
            estadosUsuarios.set(numero, "servidor_rede");
            await message.reply("🖥️ Descreva o problema com a rede (Wi-Fi ou cabeada) e aguarde atendimento.\n\nOu digite 'sair'.");
        } else {
            await message.reply("❗ Opção inválida. Escolha 1, 2 ou 3, ou digite 'sair'.");
        }
        return;
    }

    // Exemplo: se for aluno mandando matrícula
    if (estadoAtual === "aluno_wifi") {
        estadosUsuarios.set(numero, "aguardando");
        await message.reply(`✅ Matrícula registrada: ${texto}\nAguarde atendimento, ${nome}.\nDigite "sair" para encerrar quando quiser.`);
        return;
    }

    // Exemplo: docente submenu
    if (estadoAtual === "docente_menu") {
        if (texto === "1") {
            estadosUsuarios.set(numero, "docente_rede");
            await message.reply("📡 Descreva o problema com a rede.\nOu digite 'sair'.");
        } else if (texto === "2") {
            estadosUsuarios.set(numero, "docente_maquina");
            await message.reply("💻 Descreva o problema com a máquina.\nOu digite 'sair'.");
        } else if (texto === "3") {
            estadosUsuarios.set(numero, "docente_moodle");
            await message.reply("🌐 Descreva o problema com o Moodle.\nOu digite 'sair'.");
        } else {
            await message.reply("❗ Opção inválida. Digite 1, 2 ou 3 ou 'sair'.");
        }
        return;
    }

    // Para qualquer estado que precise de uma resposta aberta
    if (["docente_rede", "docente_maquina", "docente_moodle", "servidor_rede"].includes(estadoAtual)) {
        estadosUsuarios.set(numero, "aguardando");
        await message.reply(`✅ Mensagem recebida: "${texto}"\nAguarde atendimento, ${nome}.\n\nDigite "sair" para encerrar.`);
    }
});

client.initialize();