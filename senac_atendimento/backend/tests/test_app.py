import unittest
import json
from app import app

class TestApp(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_cadastrar_aluno(self):
        response = self.app.post('/cadastrar_aluno', json={
            "nome": "João Silva",
            "cpf": "123.456.789-00",
            "email": "joao@example.com",
            "telefone": "(11) 99999-9999",
            "curso": "Informática",
            "situacao_socioeconomica": "Baixa renda",
            "necessidades_especiais": "Nenhuma"
        })
        self.assertEqual(response.status_code, 201)
        self.assertIn("mensagem", json.loads(response.data))

if __name__ == '__main__':
    unittest.main()