require('dotenv').config();


const notification = async () => {
   const url = 'https://db-pubs.vercel.app';
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
             body: JSON.stringify({ key: process.env.PASSWORD }),
        });

        if (response.ok) {
    
            console.log('Notificação enviada com sucesso');
        } else {
            console.error(`Falha ao enviar notificação. Código de status: ${response.status}`);
        }
    } catch (error) {
        console.error('Erro ao enviar notificação:', error.message);
    }
};

module.exports = {
    notification
}
