<?php
// chat.php
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$message = $input['message'] ?? '';

if (!$message) {
    echo json_encode(['reply' => 'לא קיבלתי שאלה. נסו שוב בבקשה.']);
    exit;
}


$apiKey = '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';

$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
]);

$systemPrompt = "אתה צ'אט בוט חכם בעברית עבור אתר Renty. אתה עוזר ללקוחות לשאול שאלות על:
- הזמנת ציוד
- ביטולים
- תמיכה טכנית
- שעות פעילות
- מוצרים להשכרה
- ציוד לגינה, לים, לבית הספר, לתינוקות ועוד
- שאלות כלליות כגון 'היי', 'איך יוצרים קשר', 'עזרה', 'טלפון', 'מייל', 'שאלה'
תמיד תהיה ידידותי, ברור, תשתמש באימוג'ים כשאפשר, ותפנה ליצירת קשר אם לא ברור לך מה נשאל.
";

$data = [
    'model' => 'gpt-3.5-turbo',
    'messages' => [
        ['role' => 'system', 'content' => $systemPrompt],
        ['role' => 'user', 'content' => $message]
    ],
    'temperature' => 0.7
];

curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
$reply = $result['choices'][0]['message']['content'] ?? 'מצטער, לא הצלחתי להבין. נסו לנסח שוב או ליצור קשר עם התמיכה.';

echo json_encode(['reply' => $reply]);
?>
