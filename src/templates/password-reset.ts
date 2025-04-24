// import "./styles/password-reset.css";
export default function PasswordResetHTML(data: any) {
  return `<html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Password Reset</title>
          <style>
              body,html{margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f4f4f9}.email-container{max-width:600px;margin:0 auto;background-color:#fff;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.1)}.header,.reset-button{background-color:#007bff;text-align:center}.header{color:#fff;padding:20px}.header h1{margin:0;font-size:24px;font-weight:700}.content{padding:20px;color:#333;line-height:1.6}.content p{margin:0 0 20px}.reset-button{display:inline-block;padding:12px 24px;color:#fff!important;text-decoration:none;border-radius:4px;font-size:16px;font-weight:700}.footer{text-align:center;padding:20px;color:#888;font-size:12px;background-color:#f4f4f9}.footer a{color:#007bff;text-decoration:none}@media (max-width:600px){.email-container{border-radius:0}.header h1{font-size:20px}.reset-button{width:100%;box-sizing:border-box}}
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>

            <div class="content">
              <p>Hello ${data.name},</p>
              <p>
                We received a request to reset your password. If you did not
                make this request, you can safely ignore this email.
              </p>
              <p>To reset your password, click the button below:</p>

              <p style="text-align:center">
                <a href="${data.resetLink}" class="reset-button">
                  Reset Password
                </a>
              </p>

              <p>
                If the button doesn't work, copy and paste the following link
                into your browser:
              </p>
              <p style="word-break:break-all">{data.resetLink}</p>

              <p>
                This link will expire in
                ${data.expirationTime}
                hours for security reasons.
              </p>
            </div>

            <div class="footer">
              <p>&copy; 2023 Your Company. All rights reserved.</p>
              <p>
                <a href="${data.supportLink}">Contact Support</a>
              </p>
            </div>
          </div>
        </body>
      </html>`;
}
