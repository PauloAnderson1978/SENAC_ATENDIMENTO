import React from 'react';
import { Link } from 'react-router-dom'; // Importe o Link do react-router-dom
import './Aside.css';

const Aside = () => {
    return (
        <aside>
            <h2>Menu</h2>
            <ul>
                <li><Link to="/">Início</Link></li>
                <li><Link to="/atendimentos">Atendimentos</Link></li>
                <li><Link to="/cadastro-alunos">Cadastro de Alunos</Link></li>
                <li><Link to="/pesquisa-alunos">Pesquisar Alunos</Link></li>
                <li><Link to="/cadastro-profissional">Cadastro de Profissional</Link></li>
                <li><Link to="/pesquisa-profissional">Pesquisar Profissional</Link></li>
                <li><Link to="/relatorios">Relatórios</Link></li>
                <li><Link to="/configuracoes">Configurações</Link></li>
            </ul>
        </aside>
    );
};

export default Aside;