<?php
$dbPath = '..\Banco de Dados\teste.db';

try {
    $db = new PDO("sqlite:" . $dbPath);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $db->prepare("INSERT INTO usuarios (nome, celular, email, data_nasc, telefone, cpf, sexo, deficiencia, senha) 
                          VALUES (:nome, :celular, :email, :data_nasc, :telefone, :cpf, :sexo, :deficiencia, :senha)");

    $stmt->bindParam(':nome', $_POST['nome']);
    $stmt->bindParam(':celular', $_POST['celular']);
    $stmt->bindParam(':email', $_POST['email']);
    $stmt->bindParam(':data_nasc', $_POST['data_nasc']);
    $stmt->bindParam(':telefone', $_POST['telefone']);
    $stmt->bindParam(':cpf', $_POST['cpf']);
    $stmt->bindParam(':sexo', $_POST['sexo']);
    $stmt->bindParam(':deficiencia', $_POST['deficiencia']);
    $stmt->bindParam(':senha', $_POST['senha']);

    if ($stmt->execute()) {
        header('Location: ../banco.html');
        exit();
    } else {
        echo "Erro ao realizar o cadastro!";
    }

} catch (PDOException $e) {
    echo "Erro: " . $e->getMessage();
}
?>
