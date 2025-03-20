
-- Script de criação do Banco de Dados para o Sistema de Fidelidade
CREATE DATABASE SistemaFidelidade;
GO

USE SistemaFidelidade;
GO

-- Tabela de Clientes
CREATE TABLE Clientes (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Nome NVARCHAR(100) NOT NULL,
    CPF VARCHAR(14) NOT NULL UNIQUE,
    Email NVARCHAR(100) NULL,
    Telefone VARCHAR(20) NOT NULL,
    Senha NVARCHAR(100) NULL,
    Pontos INT NOT NULL DEFAULT 0,
    DataRegistro DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabela de Compras
CREATE TABLE Compras (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ClienteId UNIQUEIDENTIFIER NOT NULL,
    Valor DECIMAL(10, 2) NOT NULL,
    PontosGanhos INT NOT NULL,
    Data DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (ClienteId) REFERENCES Clientes(Id)
);

-- Tabela de Resgates
CREATE TABLE Resgates (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ClienteId UNIQUEIDENTIFIER NOT NULL,
    Pontos INT NOT NULL,
    Descricao NVARCHAR(200) NOT NULL,
    Data DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (ClienteId) REFERENCES Clientes(Id)
);

-- Tabela de Usuários Administradores
CREATE TABLE Administradores (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Senha NVARCHAR(100) NOT NULL,
    CodigoLoja VARCHAR(20) NOT NULL
);

-- Inserir um administrador padrão
INSERT INTO Administradores (Username, Senha, CodigoLoja)
VALUES ('Admin', '1234', 'LOJA123');
GO

-- Índices para melhorar a performance
CREATE INDEX IX_Clientes_CPF ON Clientes(CPF);
CREATE INDEX IX_Compras_ClienteId ON Compras(ClienteId);
CREATE INDEX IX_Resgates_ClienteId ON Resgates(ClienteId);
GO
