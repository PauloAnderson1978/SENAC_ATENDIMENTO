import React, { useState, useEffect } from 'react';
import './PesquisaAlunos.css';

const PesquisaAlunos = () => {
    const [termoPesquisa, setTermoPesquisa] = useState('');
    const [sugestoes, setSugestoes] = useState([]); // Lista de sugestões
    const [alunos, setAlunos] = useState([]); // Lista de alunos encontrados
    const [erro, setErro] = useState('');

    // Buscar sugestões enquanto o usuário digita
    useEffect(() => {
        if (termoPesquisa.length > 0) {
            fetch(`http://localhost:3000/alunos/autocomplete?q=${termoPesquisa}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Erro ao buscar sugestões.');
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data.message) {
                        setSugestoes([]); // Nenhuma sugestão encontrada
                    } else {
                        setSugestoes(data); // Define as sugestões
                    }
                })
                .catch((error) => {
                    console.error('Erro:', error);
                    setSugestoes([]);
                });
        } else {
            setSugestoes([]); // Limpa as sugestões se o campo estiver vazio
        }
    }, [termoPesquisa]);

    // Função para realizar a pesquisa
    const handlePesquisa = async (e) => {
        e.preventDefault(); // Evita o comportamento padrão do formulário

        try {
            console.log('Termo de pesquisa:', termoPesquisa); // Log para depuração

            const response = await fetch(`http://localhost:3000/alunos?q=${termoPesquisa}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar aluno.');
            }

            const data = await response.json();
            console.log('Dados recebidos:', data); // Log para depuração

            if (data.message) {
                setErro(data.message); // Mensagem de "Nenhum aluno encontrado"
                setAlunos([]);
            } else {
                console.log('Dados dos alunos:', data); // Log detalhado dos dados recebidos
                setAlunos(data); // Define a lista de alunos encontrados
                setErro('');
            }
        } catch (error) {
            console.error('Erro:', error);
            setErro('Erro ao buscar aluno. Tente novamente.');
            setAlunos([]);
        }
    };

    // Função para lidar com o clique em uma sugestão
    const handleCliqueSugestao = (nome) => {
        setTermoPesquisa(nome); // Preenche o campo de pesquisa com o nome selecionado
        setSugestoes([]); // Limpa a lista de sugestões
    };

    return (
        <div className="pesquisa-alunos">
            <h2>Pesquisar Aluno</h2>
            <form onSubmit={handlePesquisa}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Digite o nome, CPF ou número de matrícula"
                        value={termoPesquisa}
                        onChange={(e) => setTermoPesquisa(e.target.value)}
                        required
                    />
                    <button type="submit">Pesquisar</button>
                </div>

                {/* Lista de sugestões */}
                {sugestoes.length > 0 && (
                    <div className="sugestoes">
                        {sugestoes.map((aluno) => (
                            <div
                                key={aluno.id}
                                className="sugestao"
                                onClick={() => handleCliqueSugestao(aluno.nome)}
                            >
                                {aluno.nome}
                            </div>
                        ))}
                    </div>
                )}
            </form>

            {erro && <p className="erro">{erro}</p>}

            {alunos.length > 0 ? (
                <div className="resultado">
                    <h3>Resultados da Pesquisa</h3>
                    {alunos.map((aluno) => (
                        <div key={aluno.id} className="aluno">
                            <div className="foto-container">
                                {aluno.foto ? (
                                    <img src={aluno.foto} alt="Foto do Aluno" />
                                ) : (
                                    <div className="sem-foto">Sem foto</div>
                                )}
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>CPF</th>
                                        <th>Matrícula</th>
                                        <th>Email</th>
                                        <th>Telefone</th>
                                        <th>Situação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{aluno.nome || 'N/A'}</td>
                                        <td>{aluno.cpf || 'N/A'}</td>
                                        <td>{aluno.numero_matricula || 'N/A'}</td>
                                        <td>{aluno.email || 'N/A'}</td>
                                        <td>{aluno.telefone || 'N/A'}</td>
                                        <td>{aluno.situacao || 'N/A'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            ) : (
                !erro && <p>Nenhum aluno encontrado.</p>
            )}
        </div>
    );
};

export default PesquisaAlunos;