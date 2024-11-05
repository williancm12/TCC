<?php
$dbPath = '..\Banco de Dados\teste.db';

try {
    $db = new PDO("sqlite:" . $dbPath);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $stmt = $db->prepare("INSERT INTO ContaBancaria (NomeBanco, NumeroConta, Agencia) 
                          VALUES (:nomeBanco, :numeroConta, :agencia)");

    $stmt->bindParam(':nomeBanco', $_POST['Nome']);
    $stmt->bindParam(':numeroConta', $_POST['numeroConta']);
    $stmt->bindParam(':agencia', $_POST['agencia']);
    if ($stmt->execute()) {
        echo "Sucesso!";
        header('Location: ../casa.html');
        exit();
    } else {
        echo "Erro ao realizar o cadastro!";
    }

} catch (PDOException $e) {
    echo "Erro: " . $e->getMessage();
}
?>
