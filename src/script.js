document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.querySelector('.generate-btn');
    const downloadButton = document.querySelector('.save-btn');

    // Generate workout plan logic
    generateButton.addEventListener('click', async () => {
        const ageInput = document.querySelector('#age');
        const heightInput = document.querySelector('#height');
        const weightInput = document.querySelector('#weight');
        const daysInput = document.querySelector('#days-per-week');
        const hoursInput = document.querySelector('#hours-per-day');
        const muscleGroupsInputs = document.querySelectorAll('input[name="muscle-groups[]"]:checked');

        if (!ageInput || !heightInput || !weightInput || !daysInput || !hoursInput || muscleGroupsInputs.length === 0) {
            console.error('One or more form fields are missing!');
            return;
        }

        const age = ageInput.value;
        const height = heightInput.value;
        const weight = weightInput.value;
        const days = daysInput.value;
        const hours = hoursInput.value;
        const muscleGroups = Array.from(muscleGroupsInputs).map(input => input.value).join(', ');

        const prompt = `I am ${age} years old, ${height} inches tall, and weigh ${weight} lbs. I want to work out ${days} days a week for ${hours} hours per day, focusing on the following muscle groups: ${muscleGroups}. Please create a personalized workout plan for me.`;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 75
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const workoutPlan = data.choices[0].message.content;

            // Format and display the workout plan
            const formattedPlan = `
                <h2>Workout Plan for ${age}-year-old</h2>
                <p><strong>Height:</strong> ${height} inches</p>
                <p><strong>Weight:</strong> ${weight} lbs</p>
                <p><strong>Workout Frequency:</strong> ${days} days per week</p>
                <p><strong>Workout Duration:</strong> ${hours} hours per day</p>
                <p><strong>Targeted Muscle Groups:</strong> ${muscleGroups}</p>

                <h3>Detailed Plan</h3>
                <p>${workoutPlan}</p>
            `;

            document.querySelector('.calendar').innerHTML = formattedPlan;
        } catch (error) {
            console.error('Error:', error);
            document.querySelector('.calendar').innerHTML = `<p>Error generating workout plan. Please try again later.</p>`;
        }
    });

    // Calendar download logic
    downloadButton.addEventListener('click', () => {
        const calendarContent = document.querySelector('.calendar').outerHTML;

        const blob = new Blob([calendarContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'workout_calendar.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});
