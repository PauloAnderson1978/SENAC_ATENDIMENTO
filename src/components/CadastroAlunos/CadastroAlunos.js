import React, { useState } from 'react';
import { IMaskInput } from 'react-imask'; // Importando a biblioteca de máscaras
import './CadastroAlunos.css';

const CadastroAlunos = () => {
    const [aluno, setAluno] = useState({
        nome: '',
        data_nascimento: '',
        cpf: '',
        sexo: '',
        telefone: '',
        email: '',
        numero_matricula: '',
        serie: '',
        turma: '',
        turno: '',
        nome_responsavel: '',
        telefone_responsavel: '',
        cpf_responsavel: '',
        situacao: '',
        necessidade_especial: '',
        observacoes: '',
        foto: ''
    });

    const [erros, setErros] = useState({});

    // Funções de validação
    const validarCPF = (cpf) => {
        cpf = cpf.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
        return cpf.length === 11;
    };

    const validarEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validarTelefone = (telefone) => {
        telefone = telefone.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
        return telefone.length >= 10;
    };

    const validarDataNascimento = (data) => {
        const dataNascimento = new Date(data);
        const hoje = new Date();
        const idade = hoje.getFullYear() - dataNascimento.getFullYear();
        return idade >= 5;
    };

    // Atualiza o estado do aluno e valida em tempo real
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Converte o nome para UPPERCASE
        if (name === 'nome') {
            setAluno({ ...aluno, [name]: value.toUpperCase() });
        } else {
            setAluno({ ...aluno, [name]: value });
        }

        // Validação em tempo real
        const novosErros = { ...erros };
        if (name === 'cpf' && !validarCPF(value)) {
            novosErros.cpf = 'CPF inválido. O CPF deve ter 11 dígitos.';
        } else if (name === 'email' && !validarEmail(value)) {
            novosErros.email = 'Email inválido. Por favor, insira um email válido.';
        } else if (name === 'telefone' && !validarTelefone(value)) {
            novosErros.telefone = 'Telefone inválido. O telefone deve ter pelo menos 10 dígitos.';
        } else if (name === 'data_nascimento' && !validarDataNascimento(value)) {
            novosErros.data_nascimento = 'Data de nascimento inválida. O aluno deve ter pelo menos 5 anos.';
        } else {
            delete novosErros[name]; // Remove o erro se o campo estiver válido
        }
        setErros(novosErros);
    };

    // Validação ao perder o foco (onBlur)
    const handleBlur = (e) => {
        const { name, value } = e.target;
        const novosErros = { ...erros };

        if (name === 'cpf' && !validarCPF(value)) {
            novosErros.cpf = 'CPF inválido. O CPF deve ter 11 dígitos.';
        } else if (name === 'email' && !validarEmail(value)) {
            novosErros.email = 'Email inválido. Por favor, insira um email válido.';
        } else if (name === 'telefone' && !validarTelefone(value)) {
            novosErros.telefone = 'Telefone inválido. O telefone deve ter pelo menos 10 dígitos.';
        } else if (name === 'data_nascimento' && !validarDataNascimento(value)) {
            novosErros.data_nascimento = 'Data de nascimento inválida. O aluno deve ter pelo menos 5 anos.';
        } else {
            delete novosErros[name]; // Remove o erro se o campo estiver válido
        }
        setErros(novosErros);
    };

    // Manipulação de arquivo de foto
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAluno({ ...aluno, foto: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    // Envio do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verifica se há erros antes de enviar
        if (Object.keys(erros).length > 0) {
            alert('Por favor, corrija os erros antes de enviar.');
            return;
        }

        // Verifica se todos os campos obrigatórios estão preenchidos
        const camposObrigatorios = [
            'nome', 'data_nascimento', 'cpf', 'sexo', 'telefone', 'email',
            'numero_matricula', 'serie', 'turma', 'turno', 'nome_responsavel',
            'telefone_responsavel', 'cpf_responsavel', 'situacao'
        ];

        const novosErros = {};
        camposObrigatorios.forEach(campo => {
            if (!aluno[campo]) {
                novosErros[campo] = 'Este campo é obrigatório.';
            }
        });

        if (Object.keys(novosErros).length > 0) {
            setErros(novosErros);
            return;
        }

        try {
            console.log('Dados enviados:', aluno); // Log para depuração

            const response = await fetch('http://localhost:3000/alunos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(aluno),
            });

            if (!response.ok) {
                const errorData = await response.json(); // Captura o erro retornado pelo backend
                throw new Error(errorData.error || 'Erro ao cadastrar aluno.');
            }

            const data = await response.json();
            alert(data.message || 'Aluno cadastrado com sucesso!'); // Exibe a mensagem de sucesso

            // Limpa o formulário após o cadastro
            setAluno({
                nome: '',
                data_nascimento: '',
                cpf: '',
                sexo: '',
                telefone: '',
                email: '',
                numero_matricula: '',
                serie: '',
                turma: '',
                turno: '',
                nome_responsavel: '',
                telefone_responsavel: '',
                cpf_responsavel: '',
                situacao: '',
                necessidade_especial: '',
                observacoes: '',
                foto: ''
            });
            setErros({}); // Limpa os erros
        } catch (error) {
            console.error('Erro:', error);
            alert(error.message || 'Erro ao conectar com o servidor.');
        }
    };

    return (
        <div className="cadastro-alunos">
            <h2>Cadastro de Alunos</h2>
            <form onSubmit={handleSubmit}>
                {/* Campo de Foto */}
                <div className="foto-container">
                    <label htmlFor="foto">Foto 3x4</label>
                    {aluno.foto ? (
                        <img src={aluno.foto} alt="Foto do Aluno" />
                    ) : (
                        <div style={{ width: '150px', height: '200px', border: '1px dashed #ddd', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                            Sem foto
                        </div>
                    )}
                    <input
                        type="file"
                        id="foto"
                        name="foto"
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                    <label htmlFor="foto" className="upload-button">
                        Escolher Foto
                    </label>
                </div>

                {/* Campos do Formulário */}
                <div className="campos-formulario">
                    {/* Nome */}
                    <div className="form-group">
                        <label>Nome:</label>
                        <input
                            type="text"
                            name="nome"
                            value={aluno.nome}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        {erros.nome && <span className="erro">{erros.nome}</span>}
                    </div>

                    {/* Data de Nascimento */}
                    <div className="form-group">
                        <label>Data de Nascimento:</label>
                        <input
                            type="date"
                            name="data_nascimento"
                            value={aluno.data_nascimento}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        {erros.data_nascimento && <span className="erro">{erros.data_nascimento}</span>}
                    </div>

                    {/* CPF */}
                    <div className="form-group">
                        <label>CPF:</label>
                        <IMaskInput
                            mask="000.000.000-00"
                            name="cpf"
                            value={aluno.cpf}
                            onChange={(e) => handleChange({ target: { name: 'cpf', value: e.target.value } })}
                            onBlur={handleBlur}
                            required
                        />
                        {erros.cpf && <span className="erro">{erros.cpf}</span>}
                    </div>

                    {/* Sexo */}
                    <div className="form-group">
                        <label>Sexo:</label>
                        <select
                            name="sexo"
                            value={aluno.sexo}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Feminino">Feminino</option>
                            <option value="Outro">Outro</option>
                        </select>
                        {erros.sexo && <span className="erro">{erros.sexo}</span>}
                    </div>

                    {/* Telefone */}
                    <div className="form-group">
                        <label>Telefone:</label>
                        <IMaskInput
                            mask="(00) 0 0000-0000"
                            name="telefone"
                            value={aluno.telefone}
                            onChange={(e) => handleChange({ target: { name: 'telefone', value: e.target.value } })}
                            onBlur={handleBlur}
                            required
                        />
                        {erros.telefone && <span className="erro">{erros.telefone}</span>}
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={aluno.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        {erros.email && <span className="erro">{erros.email}</span>}
                    </div>

                    {/* Número de Matrícula */}
                    <div className="form-group">
                        <label>Número de Matrícula:</label>
                        <input
                            type="text"
                            name="numero_matricula"
                            value={aluno.numero_matricula}
                            onChange={handleChange}
                            required
                        />
                        {erros.numero_matricula && <span className="erro">{erros.numero_matricula}</span>}
                    </div>

                    {/* Série */}
                    <div className="form-group">
                        <label>Série:</label>
                        <input
                            type="text"
                            name="serie"
                            value={aluno.serie}
                            onChange={handleChange}
                            required
                        />
                        {erros.serie && <span className="erro">{erros.serie}</span>}
                    </div>

                    {/* Turma */}
                    <div className="form-group">
                        <label>Turma:</label>
                        <select
                            name="turma"
                            value={aluno.turma}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione</option>
                            <option value="Administração">Administração</option>
                            <option value="Enfermagem">Enfermagem</option>
                            <option value="Desenvolvedor de Sistema">Desenvolvedor de Sistema</option>
                            <option value="Programador Web">Programador Web</option>
                        </select>
                        {erros.turma && <span className="erro">{erros.turma}</span>}
                    </div>

                    {/* Turno */}
                    <div className="form-group">
                        <label>Turno:</label>
                        <select
                            name="turno"
                            value={aluno.turno}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione</option>
                            <option value="Manhã">Manhã</option>
                            <option value="Tarde">Tarde</option>
                            <option value="Noite">Noite</option>
                        </select>
                        {erros.turno && <span className="erro">{erros.turno}</span>}
                    </div>

                    {/* Nome do Responsável */}
                    <div className="form-group">
                        <label>Nome do Responsável:</label>
                        <input
                            type="text"
                            name="nome_responsavel"
                            value={aluno.nome_responsavel}
                            onChange={handleChange}
                            required
                        />
                        {erros.nome_responsavel && <span className="erro">{erros.nome_responsavel}</span>}
                    </div>

                    {/* Telefone do Responsável */}
                    <div className="form-group">
                        <label>Telefone do Responsável:</label>
                        <IMaskInput
                            mask="(00) 0 0000-0000"
                            name="telefone_responsavel"
                            value={aluno.telefone_responsavel}
                            onChange={(e) => handleChange({ target: { name: 'telefone_responsavel', value: e.target.value } })}
                            required
                        />
                        {erros.telefone_responsavel && <span className="erro">{erros.telefone_responsavel}</span>}
                    </div>

                    {/* CPF do Responsável */}
                    <div className="form-group">
                        <label>CPF do Responsável:</label>
                        <IMaskInput
                            mask="000.000.000-00"
                            name="cpf_responsavel"
                            value={aluno.cpf_responsavel}
                            onChange={(e) => handleChange({ target: { name: 'cpf_responsavel', value: e.target.value } })}
                            required
                        />
                        {erros.cpf_responsavel && <span className="erro">{erros.cpf_responsavel}</span>}
                    </div>

                    {/* Situação */}
                    <div className="form-group">
                        <label>Situação:</label>
                        <select
                            name="situacao"
                            value={aluno.situacao}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione</option>
                            <option value="Ativo">Ativo</option>
                            <option value="Inativo">Inativo</option>
                            <option value="Transferido">Transferido</option>
                        </select>
                        {erros.situacao && <span className="erro">{erros.situacao}</span>}
                    </div>

                    {/* Necessidade Especial */}
                    <div className="form-group">
                        <label>Necessidade Especial:</label>
                        <input
                            type="text"
                            name="necessidade_especial"
                            value={aluno.necessidade_especial}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Observações */}
                    <div className="form-group full-width">
                        <label>Observações:</label>
                        <textarea
                            name="observacoes"
                            value={aluno.observacoes}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Botão de Cadastro */}
                    <button type="submit">Cadastrar</button>
                </div>
            </form>
        </div>
    );
};

export default CadastroAlunos;