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

// Para mapeamento dos menus
const opcoesMenu = {
    "1": "laboratorio",
    "2": "acessos_senhas",
    "3": "computadores",
    "4": "rede",
    "5": "impressoras",
    "6": "ponto",
    "7": "telefonia",
    "8": "seguranca",
    "9": "outros"
};

// 📩 Quando chega uma mensagem
client.on('message', async message => {
    const contato = await message.getContact();
    const numero = contato.number;
    const nome = contato.pushname || "Usuário";
    const texto = message.body.toLowerCase();
    let contexto = {};
    
    if (!contextUser.has(numero)){
        contextUser.set(numero, contexto); 
    }

    // Ativa o atendimento ao usuário. 
    if (!usuerActive.has(numero)) {
        usuerActive.add(numero);
        stateUser.set(numero, "menu_init"); // Seta o estado do usuário para o menu principal. 
        await message.reply(`
            👋 Olá ${nome}, bem-vindo ao setor de TI do IFMG Campus Ibirité. 🖥️🤓\n
            \n
            Você é:\n
            🔭 - 1 - Laboratórios\n
            🔐 - 2 - Acessos e senhas\n
            🖥️ - 3 - Computadores\n
            📡 - 4 - Rede (Wireless e cabeada)\n
            🖨️ - 5 - Impressoras\n
            📟 - 6 - Máquina de ponto\n
            📞 - 7 - Telefonia e Ramais\n
            🔒 - 8 - Segurança da informação\n
            ⚠️ - 9 - Outros assuntos\n
            \n
            Digite o número da opção ou "sair" para encerrar:`);
            return;
    }
        
    // Encerra o atendimento a qualquer momento que o usuário digitar sair. 
    if (texto === "sair"){
        usuerActive.delete(numero);
        stateUser.delete(numero);
        await message.reply("❌ Atendimento encerrado. Mande qualquer mensagem para começar de novo.");
        return;
    }
    
    const stateNow = stateUser.get(numero);
    
    switch (stateNow) {
        case "menu_init":
            if (opcoesMenu[texto]) {
                stateUser.set(numero, opcoesMenu[texto]);
                await message.reply(`✅ Você selecionou a opção: ${opcoesMenu[texto].replaceAll("_", " ")}`);
                return;
            } else {
                await message.reply(`⚠️ Resposta inválida, escolha uma das opções do menu ou digite sair!! ⚠️`);    
                return
            }
    
        case "ponto":
            if (texto === "1") {
                await message.reply("⚡ Obrigado! Vamos verificar o desligamento da máquina de ponto.");
                // Você pode mudar de estado aqui se quiser
            } else if (texto === "2") {
                await message.reply("🛠️ Entendido! Vamos checar o registro de ponto da máquina.");
                // Idem
            } else {
                await message.reply("⚠️ Escolha inválida! Digite 1 ou 2, ou 'sair'.");
            }
            return;
    
        case "acessos_senhas":
            // futuro fluxo para senhas
            break;
    
        case "computadores":
            break
        
        case "redes":
            break

        case "impressora":
        
        case "telefonia":

        case "seguranca":

        case "outros":
            
        default:
            await message.reply("❓ Estado desconhecido. Mande 'sair' e tente de novo.");
    }






    // Início da individualização dos menus de atendimento!
    //1
    //if (stateUser.get(numero) === "laboratorio"){
    //    
    //}
    ////2
    //if (stateUser.get(numero) === "acessos_senhas"){
    //    
    //}
    ////3
    //if (stateUser.get(numero) === "computadores"){
    //    
    //}
    ////4
    //if (stateUser.get(numero) === "rede"){
//
    //}
    ////5
    //if (stateUser.get(numero) === "impressoras"){
    //
    //}
    ////6
    //if (stateUser.get(numero) === "ponto"){
    //    contextUser.get(numero).maquina = "maquina de ponto";
    //    await message.reply(`
    //        🫱🏻‍🫲🏼 ${nome}, obrigado pelo seu reporte sobre nossa máquina de ponto, por favor, nos de mais detalhes sobre o problema enfrentado.👇🏻
    //        \n
    //        🔌 1 - Informar desligamento do equipamento.\n     
    //        ⚠️ 2 - Máquina não está registrando o ponto.\n 
    //        \n
    //         Digite o número da opção ou "sair" para encerrar:
    //    `)
    //    return    
    //}
    //if (contextUser.get(numero).maquina === "maquina de ponto" && texto === "1"){
    //    // LÓGICA 
    //} else if (contextUser.get(numero).maquina === "maquina de ponto" && texto === "2"){
    //    // LÓGICA
    //}
//
    ////7
    //if (stateUser.get(numero) === "telefonia"){
//
    //}
    ////8
    //if (stateUser.get(numero) === "seguranca"){
//
    //}
    ////9 
    //if (stateUser.get(numero) === "outros"){
//
    //}
//
    })