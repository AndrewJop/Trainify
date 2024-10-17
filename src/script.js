document.addEventListener('DOMContentLoaded', () => {
    const downloadButton = document.querySelector('.save-btn');

    downloadButton.addEventListener('click', () => {
        const calendarContent = document.querySelector('.calendar').outerHTML;
        
        // Create a Blob with the calendar content
        const blob = new Blob([calendarContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        // Create an anchor element for the download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'workout_calendar.html'; // The name of the file to download
        document.body.appendChild(a);
        a.click(); // Programmatically click the link to trigger the download
        document.body.removeChild(a); // Remove the link after downloading
        URL.revokeObjectURL(url); // Free up memory
    });
});
