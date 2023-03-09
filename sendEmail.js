document.addEventListener('DOMContentLoaded', function () {
  // Get the "Send Email" button
  const sendEmailBtn = document.getElementById('sendEmailBtn');

  // Attach an event listener to the button
  sendEmailBtn.addEventListener('click', function () {
    // Disable the button and change the label to "Sending"
    sendEmailBtn.disabled = true;
    sendEmailBtn.textContent = 'Sending...';

    // Define the SMTP server settings
    const smtpHost = 'smtp.gmail.com';
    const smtpPort = 456;
    const smtpUsername = 'cimaciojay0@gmail.com';
    const smtpPassword = 'gqqzkdyczroxwfbq';

    // Load the HTML email template from file
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'index.html');
    xhr.onload = function () {
      if (xhr.status === 200) {
        // const html = xhr.responseText;
        const html = "<h1>Yawa</h1>";
        // Define the email message
        const from = smtpUsername;
        const to = 'yawapisting7@gmail.com';
        const subject = 'Test HTML email';
        const message = `From: ${from}\r\nTo: ${to}\r\nSubject: ${subject}\r\nMIME-Version: 1.0\r\nContent-Type: text/html\r\n\r\n${html}`;

        // Connect to the SMTP server
        const client = new XMLHttpRequest();
        client.open('POST', `http://${smtpHost}:${smtpPort}/`);
        client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        client.withCredentials = true;

        // Send the SMTP commands to send the email
        client.onreadystatechange = function () {
          if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            console.log('Email sent successfully');
          } else if (this.readyState === XMLHttpRequest.DONE && this.status !== 200) {
            console.error('Failed to send email:', this.responseText);
          }

          // Enable the button and change the label back to "Send Email"
          sendEmailBtn.disabled = false;
          sendEmailBtn.textContent = 'Send Email';
        };

        client.send(`from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&message=${encodeURIComponent(message)}&smtpUsername=${encodeURIComponent(smtpUsername)}&smtpPassword=${encodeURIComponent(smtpPassword)}`);

      } else {
        console.error('Failed to load HTML email template:', xhr.statusText);

        // Enable the button and change the label back to "Send Email"
        sendEmailBtn.disabled = false;
        sendEmailBtn.textContent = 'Send Email';
      }
    };
    xhr.send();
  });
});
