<?php

require '/vendor/phpmailer/PHPMailerAutoload.php';

/*
*  CONFIGURE EVERYTHING HERE
*/

// an email address that will be in the From field of the email.
$fromEmail = 'hello@studio91.co.za';
$fromName = 'Digital Nomads';

// an email address that will receive the email with the output of the form
$sendToEmail = 'hello@studio91.co.za';
$sendToName = 'Digital Nomads';

// subject of the email
$subject = 'New message from contact form';

// smtp credentials and server

$smtpHost = 'smtp.studio91.co.za';
$smtpUsername = 'hello@studio91.co.za';
$smtpPassword = 'PASSWORD';

// form field names and their translations.
// array variable name => Text to appear in the email
$fields = array('name' => 'Name', 'email' => 'Email', 'message' => 'Message', 'service' => 'Service Required', 'budget' => 'Budget');

// message that will be displayed when everything is OK :)
$okMessage = 'Contact form successfully submitted. Thank you, I will get back to you soon!';

// If something goes wrong, display this message.
$errorMessage = 'There was an error while submitting the form. Please try again later';

/*
*  DO THE SENDING
*/

// debug error reporting, turn this off by error_reporting(0);
error_reporting(E_ALL & ~E_NOTICE);

try {
    if (count($_POST) == 0) {
        throw new \Exception('Form is empty');
    }
    
    $emailTextHtml = "<h1>New message from our contact form</h1><hr>";
    $emailTextHtml .= "<table>";
    
    foreach ($_POST as $key => $value) {
        // If the field exists in the $fields array, include it in the email
        if (isset($fields[$key])) {
            $emailTextHtml .= "<tr><th>$fields[$key]</th><td>$value</td></tr>";
        }
    }
    $emailTextHtml .= "</table><hr>";
    // $emailTextHtml .= "<p>Have a nice day,<br>Best,<br>Digital Nomads</p>";
    
    $mail = new PHPMailer;
    
    $mail->setFrom($fromEmail, $fromName);
    $mail->addAddress($sendToEmail, $sendToName);
    $mail->addReplyTo($from);
    
    $mail->isHTML(true);
    
    $mail->Subject = $subject;
    $mail->Body    = $emailTextHtml;
    $mail->msgHTML($emailTextHtml); // create a plain-text version of the email
    
    
    $mail->isSMTP();
    
    //Enable SMTP debugging
    // 0 = off (for production use)
    // 1 = client messages
    // 2 = client and server messages
    $mail->SMTPDebug = 0;
    $mail->Debugoutput = 'html';
    
    //Set the hostname of the mail server
    // use
    // $mail->Host = gethostbyname('smtp.gmail.com');
    // if your network does not support SMTP over IPv6
    $mail->Host = gethostbyname($smtpHost);
    
    //Set the SMTP port number - 587 for authenticated TLS, a.k.a. RFC4409 SMTP submission
    $mail->Port = 587;
    
    //Set the encryption system to use - ssl (deprecated) or tls
    $mail->SMTPSecure = 'tls';
    
    //Whether to use SMTP authentication
    $mail->SMTPAuth = true;
    
    //Username to use for SMTP authentication - use full email address for gmail
    $mail->Username = $smtpHost;
    
    //Password to use for SMTP authentication
    $mail->Password = $smtpPassword;
    
    if (!$mail->send()) {
        throw new \Exception('I could not send the email.' . $mail->ErrorInfo);
    }
    
    $responseArray = array('type' => 'success', 'message' => $okMessage);
} catch (\Exception $e) {
    // $responseArray = array('type' => 'danger', 'message' => $errorMessage);
    $responseArray = array('type' => 'danger', 'message' => $e->getMessage());
}


// if requested by AJAX request return JSON response
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    $encoded = json_encode($responseArray);
    
    header('Content-Type: application/json');
    
    echo $encoded;
}
// else just display the message
else {
    echo $responseArray['message'];
}