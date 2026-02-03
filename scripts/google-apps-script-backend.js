// ==========================================
// GOOGLE APPS SCRIPT BACKEND GUIDE
// ==========================================

/*
Since this is a static website (HTML/CSS/JS), we can't save directly to Excel on the server.
However, we can use a free Google Sheet as a database!

FOLLOW THESE STEPS:

1. Go to https://sheets.google.com and create a new Sheet.
2. Name it "Infosec Summit Registrations".
3. Add the following headers to the first row (Row 1):
   [Timestamp, Full Name, Email, Phone, Organization, Ticket Type, Payment Screenshot URL]

4. Click on "Extensions" > "Apps Script" in the top menu.
5. In the code editor that opens, delete everything and paste the code below.
*/

// ==========================================
// PASTE THIS CODE INTO APPS SCRIPT EDITOR
// ==========================================

function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        const timestamp = new Date();

        // Handle File Upload (Save to Drive)
        let fileUrl = "No File";
        if (data.paymentProof) {
            const folderName = "InfosecPayments";
            const folders = DriveApp.getFoldersByName(folderName);
            let folder;
            if (folders.hasNext()) {
                folder = folders.next();
            } else {
                folder = DriveApp.createFolder(folderName);
            }

            const blob = Utilities.newBlob(Utilities.base64Decode(data.paymentProof), data.mimeType, data.fileName);
            const file = folder.createFile(blob);
            file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
            fileUrl = file.getUrl();
        }

        // Append to Sheet
        sheet.appendRow([
            timestamp,
            data.fullName,
            data.email,
            data.phone,
            data.organization,
            data.ticketType,
            fileUrl
        ]);

        return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Data saved" }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// ==========================================
// DEPLOYMENT INSTRUCTIONS
// ==========================================

/*
6. Save the project (Ctrl+S or disk icon).
7. Click "Deploy" (top right) > "New deployment".
8. Click "Select type" (gear icon) > "Web app".
9. Configuration:
   - Description: "Infosec Backend"
   - Execute as: "Me" (your email)
   - Who has access: "Anyone" (IMPORTANT!)
10. Click "Deploy".
11. You will may need to "Authorize access". Login and click "Advanced" > "Go to... (unsafe)" (it is safe, it's your own code).
12. Copy the "Web app URL" generated.

13. Open your local project's `script.js` file.
14. Find the line: const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
15. Replace the placeholder string with your new Web app URL.
16. Save `script.js`.

DONE! Your form will now submit data to your Google Sheet and images to your Google Drive.
*/
