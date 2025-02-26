async function login() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = '/dashboard.html';  // Redirecionar para o dashboard
    } else {
        alert(data.erro);
    }
}

//// AUTENTICAÇÃO
async function listarAlunos() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';  // Redirecionar para o login se não houver token
    }

    const response = await fetch('http://127.0.0.1:5000/alunos', {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    });

    const data = await response.json();
    if (response.ok) {
        console.log(data);  // Exibir a lista de alunos
    } else {
        alert(data.erro);
    }
}