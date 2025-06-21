<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // לצורך הדוגמה – סיסמה קבועה
    if ($email === 'user@example.com' && $password === '123456') {
        $_SESSION['user_id'] = 1; // אפשר לשים כאן ID אמיתי מבסיס נתונים
        $_SESSION['email'] = $email;
        header("Location: publish_product.html");
        exit;
    } else {
        $error = "אימייל או סיסמה שגויים.";
    }
}
?>

<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>התחברות</title>
</head>
<body>
    <h2>התחברות</h2>
    <?php if (isset($error)) echo "<p style='color:red;'>$error</p>"; ?>
    <form method="POST">
        <label>אימייל:</label>
        <input type="email" name="email" required><br>
        <label>סיסמה:</label>
        <input type="password" name="password" required><br>
        <button type="submit">התחבר</button>
    </form>
</body>
</html>
