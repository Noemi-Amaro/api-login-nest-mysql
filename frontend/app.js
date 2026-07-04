const API_URL = 'http://127.0.0.1:3000';
 
const formCadastro = document.getElementById('formCadastro');
 
if (formCadastro) {
  formCadastro.addEventListener('submit', async function (event) {
    event.preventDefault();
 
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('emailCadastro').value;
    const senha = document.getElementById('senhaCadastro').value;
 
    const resposta = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome, email, senha }),
    });
 
    const dados = await resposta.json();
 
    document.getElementById('mensagemCadastro').textContent =
      dados.mensagem || 'Erro ao cadastrar usuário.';
 
    formCadastro.reset();
  });
}
 
const formLogin = document.getElementById('formLogin');
 
if (formLogin) {
  formLogin.addEventListener('submit', async function (event) {
    event.preventDefault();
 
    const email = document.getElementById('emailLogin').value;
    const senha = document.getElementById('senhaLogin').value;
 
    const resposta = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    });
 
    const dados = await resposta.json();
 
    if (resposta.ok) {
      document.getElementById('mensagemLogin').textContent = dados.mensagem;
 
      document.getElementById('areaToken').style.display = 'block';
      document.getElementById('token').textContent = dados.access_token;

      document.getElementById('linkPerfil').style.display = 'block';
    } else {
      document.getElementById('mensagemLogin').textContent =
        dados.message || 'Erro ao realizar login.';
 
      document.getElementById('areaToken').style.display = 'none';
      document.getElementById('linkPerfil').style.display = 'none';
    }
 
    formLogin.reset();
  });
}

const paginaPerfil = document.getElementById('paginaPerfil');
  if (paginaPerfil){
    const campoToken = document.getElementById('campoToken');
    const botaoValidar = document.getElementById('botaoValidar');
     const mensagemPerfil = document.getElementById('mensagemPerfil');
      const dadosUsuario = document.getElementById('dadosUsuario');

      botaoValidar.addEventListener('click', async function () {
        const token = campoToken.value;

        if(!token) {
          mensagemPerfil.textContent = 'Informe o token para acessar';
          dadosUsuario.style.display = 'none';
          return;
        }
        const resposta = await fetch(`${API_URL}/auth/privada`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const dados = await resposta.json();

        if (resposta.ok) {
          mensagemPerfil.textContent = dados.mensagem;
          document.getElementById('idUsuario').textContent = dados.usuario?.id || dados.usuario?.sub || 'Não informado';

          document.getElementById('emailUsuario').textContent = dados.usuario?.email || 'Não informado';

          dadosUsuario.style.display = 'block';
        } else {
          mensagemPerfil.textContent = dados.message || 'Acesso negado';
          dadosUsuario.style.display = 'none';
        }
        
      });
  }

  const paginaSession = document.getElementById('paginaSession');

  if(paginaSession){
    const formSessionLogin = document.getElementById('formSessionLogin');
    const mensagemSession = document.getElementById('mensagemSession');
    const dadosSession = document.getElementById('dadosSession');

    formSessionLogin.addEventListener('submit', async function (event) {
      event.preventDefault();

      const email = document.getElementById('emailSession').value;
      const senha = document.getElementById('senhaSession').value;

      const resposta = await fetch(`${API_URL}/auth/session-login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, senha})
      });
      const dados = await resposta.json();

      if(resposta.ok) {
        mensagemSession.textContent = dados.usuario.mensagem;
        document.getElementById('idSession').textContent = dados.usuario.id;
        document.getElementById('nomeSession').textContent = dados.usuario.nome;
        document.getElementById('emailSessionUsuario').textContent = dados.usuario.email;

        dadosSession.style.display = 'block';
      } else {
        mensagemSession.textContent = dados.message || 'Erro ao realizar login com session';
        dadosSession.style.display = 'none';
      }
      formSessionLogin.reset();
    });

    document.getElementById('botaoVerificarSession').addEventListener('click', async function () {
      const resposta = await fetch(`${API_URL}/auth/session-area`, {
        method: 'GET',
        credentials: 'include'
      });
    const dados = await resposta.json();

    if (resposta.ok) {
      mensagemSession.textContent = dados.mensagem;
      document.getElementById('idSession').textContent = dados.usuario.id;
      document.getElementById('nomeSession').textContent = dados.usuario.nome;
      document.getElementById('emailSessionUsuario').textContent = dados.usuario.email;

      dadosSession.style.display = 'block';
    } else {
      mensagemSession.textContent = dados.message || 'Sessão não encontrada';
      dadosSession.style.display = 'none'; 
    }
    });

    document.getElementById('botaoLogoutSession').addEventListener('click', async function() {
      const resposta = await fetch(`${API_URL}/auth/session-logout`, {
        method: 'POST',
        credentials: 'include'
      });
      const dados = await resposta.json()

      mensagemSession.textContent = dados.mensagem;
      dadosSession.style.display = 'none';
    });
    
  }