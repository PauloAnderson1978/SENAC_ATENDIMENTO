from flask import Flask, request, jsonify
from flask_cors import CORS  # Importe o CORS
import mysql.connector
from datetime import datetime, timedelta
from functools import wraps
import jwt
import bcrypt

# Cria a instância do Flask
app = Flask(__name__)

# Configura o CORS
CORS(app)  # Agora o 'app' está definido

# Configuração do banco de dados
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="DiscR@dic@l04",  # Substitua pela sua senha do MySQL
    database="senac_atendimento"
)

# Função para gerar tokens JWT
def gerar_token(usuario_id):
    payload = {
        'usuario_id': usuario_id,
        'exp': datetime.utcnow() + timedelta(hours=1)  # Token expira em 1 hora
    }
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    return token

# Decorator para verificar o token JWT
def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"erro": "Token de acesso ausente!"}), 401
        try:
            dados = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            request.usuario_id = dados['usuario_id']
        except jwt.ExpiredSignatureError:
            return jsonify({"erro": "Token expirado!"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"erro": "Token inválido!"}), 401
        return f(*args, **kwargs)
    return decorator

# Função para gerar hash da senha
def gerar_hash_senha(senha):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(senha.encode('utf-8'), salt)

# Função para verificar a senha
def verificar_senha(senha, senha_hash):
    return bcrypt.checkpw(senha.encode('utf-8'), senha_hash.encode('utf-8'))

# Rota de login
@app.route('/login', methods=['POST'])
def login():
    dados = request.json
    email = dados.get('email')
    senha = dados.get('senha')

    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id, senha FROM alunos WHERE email = %s", (email,))
    aluno = cursor.fetchone()
    cursor.close()

    if aluno and verificar_senha(senha, aluno['senha']):
        token = gerar_token(aluno['id'])
        return jsonify({"token": token})
    else:
        return jsonify({"erro": "Credenciais inválidas!"}), 401

# Rota para cadastrar alunos
@app.route('/cadastrar_aluno', methods=['POST'])
def cadastrar_aluno():
    dados = request.json
    cursor = db.cursor()
    try:
        sql = """
            INSERT INTO alunos (nome, cpf, email, telefone, curso, situacao_socioeconomica, necessidades_especiais, senha)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        senha_hash = gerar_hash_senha(dados['senha'])  # Gera o hash da senha
        valores = (
            dados['nome'], dados['cpf'], dados['email'], dados['telefone'],
            dados['curso'], dados['situacao_socioeconomica'], dados['necessidades_especiais'],
            senha_hash  # Armazena o hash da senha
        )
        cursor.execute(sql, valores)
        db.commit()
        return jsonify({"mensagem": "Aluno cadastrado com sucesso!"}), 201
    except mysql.connector.Error as err:
        return jsonify({"erro": f"Erro ao cadastrar aluno: {err}"}), 500
    finally:
        cursor.close()

# Rota para listar alunos
@app.route('/alunos', methods=['GET'])
def listar_alunos():
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM alunos")
        alunos = cursor.fetchall()
        return jsonify(alunos)
    except mysql.connector.Error as err:
        return jsonify({"erro": f"Erro ao listar alunos: {err}"}), 500
    finally:
        cursor.close()

# Rota para cadastrar assistentes sociais
@app.route('/cadastrar_assistente', methods=['POST'])
def cadastrar_assistente():
    dados = request.json
    cursor = db.cursor()
    try:
        sql = """
            INSERT INTO assistentes_sociais (nome, crp, email, telefone, especializacao)
            VALUES (%s, %s, %s, %s, %s)
        """
        valores = (
            dados['nome'], dados['crp'], dados['email'],
            dados['telefone'], dados['especializacao']
        )
        cursor.execute(sql, valores)
        db.commit()
        return jsonify({"mensagem": "Assistente social cadastrado com sucesso!"}), 201
    except mysql.connector.Error as err:
        return jsonify({"erro": f"Erro ao cadastrar assistente social: {err}"}), 500
    finally:
        cursor.close()

# Rota para solicitar atendimento
@app.route('/solicitar_atendimento', methods=['POST'])
@token_required  # Protege a rota com autenticação JWT
def solicitar_atendimento():
    dados = request.json
    cursor = db.cursor()
    try:
        sql = """
            INSERT INTO atendimentos (aluno_id, assistente_id, data_atendimento, descricao)
            VALUES (%s, %s, %s, %s)
        """
        valores = (
            dados['aluno_id'], dados['assistente_id'],
            dados['data_atendimento'], dados['descricao']
        )
        cursor.execute(sql, valores)
        db.commit()
        return jsonify({"mensagem": "Atendimento solicitado com sucesso!"}), 201
    except mysql.connector.Error as err:
        return jsonify({"erro": f"Erro ao solicitar atendimento: {err}"}), 500
    finally:
        cursor.close()

# Rota para registrar atendimento e diagnóstico
@app.route('/registrar_atendimento/<int:id>', methods=['PUT'])
@token_required  # Protege a rota com autenticação JWT
def registrar_atendimento(id):
    dados = request.json
    cursor = db.cursor()
    try:
        sql = """
            UPDATE atendimentos
            SET diagnostico = %s
            WHERE id = %s
        """
        valores = (dados['diagnostico'], id)
        cursor.execute(sql, valores)
        db.commit()
        return jsonify({"mensagem": "Atendimento registrado com sucesso!"}), 200
    except mysql.connector.Error as err:
        return jsonify({"erro": f"Erro ao registrar atendimento: {err}"}), 500
    finally:
        cursor.close()

# Rota para enviar mensagem ao aluno
@app.route('/enviar_mensagem', methods=['POST'])
@token_required  # Protege a rota com autenticação JWT
def enviar_mensagem():
    dados = request.json
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT email FROM alunos WHERE id = %s", (dados['aluno_id'],))
        aluno = cursor.fetchone()
        if aluno:
            # Simulação de envio de e-mail
            mensagem = f"Olá, você recebeu uma mensagem do Senac: {dados['mensagem']}"
            print(f"E-mail enviado para {aluno['email']}: {mensagem}")
            return jsonify({"mensagem": "Mensagem enviada com sucesso!"}), 200
        else:
            return jsonify({"erro": "Aluno não encontrado!"}), 404
    except mysql.connector.Error as err:
        return jsonify({"erro": f"Erro ao enviar mensagem: {err}"}), 500
    finally:
        cursor.close()

if __name__ == '__main__':
    app.run(debug=True)