<?php
// Simple contact form handler for AG CONSULTING AUTO
// Sends form data by email to ag.consulting.auto@gmail.com

// Destination email
$to = "ag.consulting.auto@gmail.com";

// Basic security: only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo "Méthode non autorisée.";
    exit;
}

// Helper to sanitize text
function clean($value) {
    return trim(strip_tags($value ?? ''));
}

$name    = clean($_POST['name'] ?? '');
$email   = clean($_POST['email'] ?? '');
$phone   = clean($_POST['phone'] ?? '');
$service = clean($_POST['service'] ?? '');
$type    = clean($_POST['type_demande'] ?? '');
$budget  = clean($_POST['budget'] ?? '');
$delai   = clean($_POST['delai'] ?? '');
$message = trim($_POST['message'] ?? '');
$source  = clean($_POST['source'] ?? '');

// Basic validation
if ($name === '' || $email === '') {
    echo "Merci d’indiquer au minimum votre nom et votre email.";
    exit;
}

$subject = "Nouvelle demande depuis le site AG CONSULTING AUTO";

$bodyLines = [
    "Nom : " . $name,
    "Email : " . $email,
    "Téléphone : " . $phone,
    "Pack souhaité : " . $service,
    "Type de demande : " . $type,
    "Budget : " . $budget,
    "Délai souhaité : " . $delai,
    "Source : " . $source,
    "",
    "Message :",
    $message,
];

$body = implode("\n", $bodyLines);

// Prepare headers
$headers   = [];
$headers[] = "From: AG CONSULTING AUTO <no-reply@".$_SERVER['SERVER_NAME'].">";
$headers[] = "Reply-To: ".$email;
$headers[] = "Content-Type: text/plain; charset=UTF-8";

$success = mail($to, "=?UTF-8?B?".base64_encode($subject)."?=", $body, implode("\r\n", $headers));

?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8"/>
  <title>Merci – AG CONSULTING AUTO</title>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <link rel="stylesheet" href="styles.css"/>
</head>
<body class="page-contact">
  <main class="section alt">
    <div class="container">
      <?php if ($success): ?>
        <h1>Merci, votre demande a bien été envoyée.</h1>
        <p>Nous revenons vers vous à l’adresse <strong><?php echo htmlspecialchars($email, ENT_QUOTES, 'UTF-8'); ?></strong>
        dans les meilleurs délais.</p>
      <?php else: ?>
        <h1>Un problème est survenu.</h1>
        <p>Votre demande n’a pas pu être envoyée automatiquement.
        Vous pouvez nous écrire directement à
        <a href="mailto:ag.consulting.auto@gmail.com">ag.consulting.auto@gmail.com</a>.</p>
      <?php endif; ?>
      <p><a href="index.html">Retour à l’accueil</a></p>
    </div>
  </main>
</body>
</html>
