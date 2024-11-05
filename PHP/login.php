<?php
$dbPath = '..\Banco de Dados\teste.db';

try {
    $db = new PDO("sqlite:" . $dbPath);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $email = trim($_POST['email']);
        $senha = trim($_POST['senha']);

        $stmt = $db->prepare("SELECT senha FROM usuarios WHERE LOWER(email) = LOWER(:email)");
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user && $user['senha'] === $senha) {
            header('Location: ../inicio.html');
            exit();
        } else {
            echo "Email ou senha incorretos!";
        }
    }
} catch (PDOException $e) {
    echo "Erro: " . $e->getMessage();
}
?>
