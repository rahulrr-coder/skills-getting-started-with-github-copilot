// Main JavaScript file for Mergington High School Activities

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const activitiesList = document.getElementById('activities-list');
  const activitySelect = document.getElementById('activity');
  const signupForm = document.getElementById('signup-form');
  const messageDiv = document.getElementById('message');
  
  // Load activities on page load
  fetchActivities();

  // Event listener for form submission
  signupForm.addEventListener('submit', handleSignup);

  // Function to fetch activities from the API
  async function fetchActivities() {
    try {
      const response = await fetch('/activities');
      const data = await response.json();
      
      // Clear loading message
      activitiesList.innerHTML = '';
      activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';
      
      // Display activities
      Object.entries(data).forEach(([name, details]) => {
        // Create activity card
        const card = document.createElement('div');
        card.className = 'activity-card';
        
        // Create card content
        const title = document.createElement('h4');
        title.textContent = name;
        
        const description = document.createElement('p');
        description.textContent = details.description;
        
        const schedule = document.createElement('p');
        schedule.innerHTML = `<strong>Schedule:</strong> ${details.schedule}`;
        
        const spots = document.createElement('p');
        const spotsLeft = details.max_participants - details.participants.length;
        spots.innerHTML = `<strong>Available Spots:</strong> ${spotsLeft} of ${details.max_participants}`;

        // Create participants list
        const participantsSection = document.createElement('div');
        participantsSection.className = 'participants-section';
        
        const participantsTitle = document.createElement('p');
        participantsTitle.innerHTML = '<strong>Current Participants:</strong>';
        
        const participantsList = document.createElement('ul');
        if (details.participants.length > 0) {
          details.participants.forEach(participant => {
            const item = document.createElement('li');
            item.textContent = participant;
            participantsList.appendChild(item);
          });
        } else {
          const item = document.createElement('li');
          item.textContent = "No participants yet";
          participantsList.appendChild(item);
        }
        
        participantsSection.appendChild(participantsTitle);
        participantsSection.appendChild(participantsList);
        
        // Add all elements to the card
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(schedule);
        card.appendChild(spots);
        card.appendChild(participantsSection);
        
        // Add card to the activities list
        activitiesList.appendChild(card);
        
        // Add option to dropdown
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
      
    } catch (error) {
      activitiesList.innerHTML = '<p class="error">Error loading activities. Please try again later.</p>';
      console.error('Error fetching activities:', error);
    }
  }

  // Function to handle the signup form submission
  async function handleSignup(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const activity = document.getElementById('activity').value;
    
    if (!email || !activity) {
      showMessage('Please fill out all fields.', 'error');
      return;
    }
    
    try {
      const response = await fetch(`/activities/${encodeURIComponent(activity)}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showMessage(data.message, 'success');
        // Refresh the activities list
        fetchActivities();
        // Reset the form
        signupForm.reset();
      } else {
        showMessage(data.detail || 'Error signing up for activity.', 'error');
      }
      
    } catch (error) {
      showMessage('Error connecting to the server. Please try again later.', 'error');
      console.error('Error signing up:', error);
    }
  }

  // Function to show messages to the user
  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    
    // Hide the message after 5 seconds
    setTimeout(() => {
      messageDiv.className = 'hidden';
    }, 5000);
  }
});
