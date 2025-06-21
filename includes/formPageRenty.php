<?php

$servername = "localhost"; 
$username = "isyonatanpa_yuvalgantz";   
$password = "q%GAdB5uM5~P";   
$dbname = "isyonatanpa_rentyDB";      

$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $fullName = $_POST['fullName'];
    $email = $_POST['email'];
    $startDate = $_POST['startDate'];
    $endDate = $_POST['endDate'];

    $dailyPrice = 15;

    $start = new DateTime($startDate);
    $end = new DateTime($endDate);
    $diff = $start->diff($end);
    $totalDays = $diff->days + 1; 


    $totalPrice = $totalDays * $dailyPrice;

    $sql = "INSERT INTO bookings (full_name, email, start_date, end_date, total_days, total_price)
            VALUES ('$fullName', '$email', '$phone', '$startDate', '$endDate', $totalDays, $totalPrice)";

    if ($conn->query($sql) === TRUE) {

        $adminEmail = "admin@example.com";
        $subject = "Yoga Mat Booking";
        $message = "Yoga Mat Booking\n";
        $message .= "Name: $fullName\n";
        $message .= "Email: $email\n";
		$message .= "Phone: $phone\n";
        $message .= "Start Date: $startDate\n";
        $message .= "End Date: $endDate\n";
        $message .= "Total Days: $totalDays\n";
        $message .= "Total Price: $totalPrice ILS";

        mail($adminEmail, $subject, $message);

        $clientSubject = "Yoga Mat Booking Confirmation";
        $clientMessage = "Hello $fullName,\n\n";
        $clientMessage .= "Thank you for booking a yoga mat. Here are your booking details:\n";
        $clientMessage .= "Start Date: $startDate\n";
        $clientMessage .= "End Date: $endDate\n";
        $clientMessage .= "Total Days: $totalDays\n";
        $clientMessage .= "Total Price: $totalPrice ILS\n\n";
        $clientMessage .= "Your booking has been successfully completed. We will contact you soon.";

        mail($email, $clientSubject, $clientMessage);

        echo "<p>Thank you for your booking. A confirmation email has been sent to you.</p>";
    } else {
        echo "Booking error: " . $conn->error;
    }
} else {
    echo "<p>No data was submitted from the form.</p>";
}

$conn->close();
?>
