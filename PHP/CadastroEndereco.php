<?php
$dbPath = '..\Banco de Dados\teste.db';

try {
    $db = new PDO("sqlite:" . $dbPath);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Prepara a inserção
    $stmt = $db->prepare("INSERT INTO Endereco (CEP, Rua, Numero, Bairro, Cidade, Estado, Complemento) 
                          VALUES (:cep, :rua, :numero, :bairro, :cidade, :estado, :complemento)");

    // Liga os parâmetros
    $stmt->bindParam(':cep', $_POST['cep']);
    $stmt->bindParam(':rua', $_POST['rua']);
    $stmt->bindParam(':numero', $_POST['numero']);
    $stmt->bindParam(':bairro', $_POST['bairro']);
    $stmt->bindParam(':cidade', $_POST['cidade']); // Corrigido de 'cidaded' para 'cidade'
    $stmt->bindParam(':estado', $_POST['estado']);
    $stmt->bindParam(':complemento', $_POST['complemento']);
    
    // Executa a inserção e redireciona
    if ($stmt->execute()) {
        echo "Dados inseridos com sucesso!"; // Adicionado para depuração
        header('Location: ../login.html'); // Redireciona após o cadastro
        exit();
    } else {
        echo "Erro ao realizar o cadastro!";
    }

} catch (PDOException $e) {
    echo "Erro: " . $e->getMessage();
}
