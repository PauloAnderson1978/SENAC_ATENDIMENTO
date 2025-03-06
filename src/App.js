import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Aside from './components/Aside/Aside';
import Main from './components/Main/Main';
import Footer from './components/Footer/Footer';
import CadastroAlunos from './components/CadastroAlunos/CadastroAlunos';
import PesquisaAlunos from './components/PesquisaAlunos/PesquisaAlunos'; // Importe o componente de pesquisa
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <div className="container">
                    <Aside />
                    <Routes>
                        <Route path="/" element={<Main />} />
                        <Route path="/cadastro-alunos" element={<CadastroAlunos />} />
                        <Route path="/pesquisa-alunos" element={<PesquisaAlunos />} /> {/* Rota para pesquisa */}
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;