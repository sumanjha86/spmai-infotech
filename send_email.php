<?php
// Prevent unauthorized direct access
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('HTTP/1.1 405 Method Not Allowed');
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Set JSON content-type header
header('Content-Type: application/json');

// Get POST input (both JSON and form urlencoded)
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if (!$input) {
    $input = $_POST;
}

$name = isset($input['name']) ? trim($input['name']) : '';
$email = isset($input['email']) ? trim($input['email']) : '';
$service = isset($input['service']) ? trim($input['service']) : '';
$message = isset($input['message']) ? trim($input['message']) : '';

// Validation
if (empty($name) || empty($email) || empty($service) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
    exit;
}

// Destination email
$to = 'info@spmaii.com';

// Subject
$subject = "New Inquiry from " . strip_tags($name) . " - SPMAI Infotech";

// Map service to a readable name
$service_map = [
    'ai-agents' => 'Autonomous AI Agents',
    'software' => 'Custom Software & Apps',
    'saas' => 'SAAS Engineering',
    'consulting' => 'IT Strategy & Cloud',
    'marketing' => 'Digital Marketing / Growth'
];
$service_readable = isset($service_map[$service]) ? $service_map[$service] : $service;

// Build HTML email message
$message_body = "
<html>
<head>
  <title>New Project Inquiry</title>
  <style>
    body { font-family: 'Inter', sans-serif; color: #333; line-height: 1.6; }
    .container { padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; }
    h2 { color: #0284c7; border-bottom: 2px solid #0284c7; padding-bottom: 10px; margin-top: 0; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #555; }
    .value { margin-top: 5px; padding: 10px; background-color: #fff; border: 1px solid #ddd; border-radius: 4px; }
    .footer { margin-top: 20px; font-size: 12px; color: #888; text-align: center; }
  </style>
</head>
<body>
  <div class='container'>
    <h2>New Inquiry Received</h2>
    
    <div class='field'>
      <div class='label'>Name:</div>
      <div class='value'>" . htmlspecialchars($name) . "</div>
    </div>
    
    <div class='field'>
      <div class='label'>Corporate Email:</div>
      <div class='value'><a href='mailto:" . htmlspecialchars($email) . "'>" . htmlspecialchars($email) . "</a></div>
    </div>
    
    <div class='field'>
      <div class='label'>Requested Service:</div>
      <div class='value'>" . htmlspecialchars($service_readable) . "</div>
    </div>
    
    <div class='field'>
      <div class='label'>Project Requirements:</div>
      <div class='value'>" . nl2br(htmlspecialchars($message)) . "</div>
    </div>
    
    <div class='footer'>
      This inquiry was submitted via the contact form on spmaii.com.
    </div>
  </div>
</body>
</html>
";

// Headers
$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=UTF-8';
$headers[] = 'From: SPMAI Contact Form <no-reply@spmaii.com>';
$headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';
$headers[] = 'X-Mailer: PHP/' . phpversion();

// Send
if (mail($to, $subject, $message_body, implode("\r\n", $headers))) {
    echo json_encode(['success' => true, 'message' => 'Your inquiry has been sent successfully!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to send inquiry. Please try again or email info@spmaii.com directly.']);
}
?>
