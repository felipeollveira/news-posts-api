// auth.js

    const obterToken = () => {
        $.ajax({
            url: '/token.php',
            type: 'GET',
            headers: {
            'X-Requested-With': 'XMLHttpRequest' 
        },
        success: function(data) {
            console.log('Token recebido:', data.token);
        },
        error: function(xhr, status, error) {
            console.error('Erro na solicitação AJAX:', error);
        }
    });
};


module.exports = obterToken
