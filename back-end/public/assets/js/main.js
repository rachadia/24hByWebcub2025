// Main JavaScript file for The End Page

document.addEventListener('DOMContentLoaded', function() {
  // Initialize any components that need JavaScript
  initializeTooltips();
  initializeModals();
  initializeDropdowns();
  initializeAnimations();
  initializeFormValidation();
  
  // Add event listeners for specific actions
  setupMoodDetection();
  setupReactions();
  setupCommentForms();
  setupProfileActions();
  setupNotifications();
});

// Component Initializations
function initializeTooltips() {
  const tooltips = document.querySelectorAll('[data-tooltip]');
  tooltips.forEach(tooltip => {
    const content = tooltip.getAttribute('data-tooltip');
    
    tooltip.addEventListener('mouseenter', () => {
      const tooltipEl = document.createElement('div');
      tooltipEl.className = 'absolute z-50 bg-gray-800 text-white text-sm rounded py-1 px-2 pointer-events-none';
      tooltipEl.style.bottom = '100%';
      tooltipEl.style.left = '50%';
      tooltipEl.style.transform = 'translateX(-50%) translateY(-5px)';
      tooltipEl.textContent = content;
      tooltipEl.id = 'active-tooltip';
      
      document.body.appendChild(tooltipEl);
    });
    
    tooltip.addEventListener('mouseleave', () => {
      const activeTooltip = document.getElementById('active-tooltip');
      if (activeTooltip) {
        activeTooltip.remove();
      }
    });
  });
}

function initializeModals() {
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloseButtons = document.querySelectorAll('[data-modal-close]');
  
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modalId = trigger.getAttribute('data-modal-target');
      const modal = document.getElementById(modalId);
      
      if (modal) {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
        
        // Animation
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
          modalContent.classList.add('animate-fade-in');
        }
      }
    });
  });
  
  modalCloseButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      if (modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    });
  });
  
  // Close modal when clicking outside content
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  });
}

function initializeDropdowns() {
  const dropdownTriggers = document.querySelectorAll('[data-dropdown-toggle]');
  
  dropdownTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-dropdown-toggle');
      const target = document.getElementById(targetId);
      
      if (target) {
        target.classList.toggle('hidden');
      }
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-dropdown-toggle]')) {
      const dropdowns = document.querySelectorAll('[data-dropdown]');
      dropdowns.forEach(dropdown => {
        if (!dropdown.classList.contains('hidden')) {
          dropdown.classList.add('hidden');
        }
      });
    }
  });
}

function initializeAnimations() {
  // Animate elements as they enter the viewport
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  animatedElements.forEach(el => {
    observer.observe(el);
  });
}

function initializeFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      let isValid = true;
      
      // Get all required fields
      const requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('border-red-500');
          
          // Add error message if it doesn't exist
          let errorMsg = field.nextElementSibling;
          if (!errorMsg || !errorMsg.classList.contains('error-message')) {
            errorMsg = document.createElement('p');
            errorMsg.classList.add('error-message', 'text-red-500', 'text-xs', 'mt-1');
            errorMsg.textContent = 'This field is required';
            field.parentNode.insertBefore(errorMsg, field.nextSibling);
          }
        } else {
          field.classList.remove('border-red-500');
          
          // Remove error message if it exists
          const errorMsg = field.nextElementSibling;
          if (errorMsg && errorMsg.classList.contains('error-message')) {
            errorMsg.remove();
          }
        }
      });
      
      if (!isValid) {
        e.preventDefault();
      }
    });
  });
}

// Specific Functionality
function setupMoodDetection() {
  const contentFields = document.querySelectorAll('[data-detect-mood]');
  
  contentFields.forEach(field => {
    field.addEventListener('blur', async () => {
      const content = field.value.trim();
      
      if (content.length > 20) {
        try {
          const response = await fetch('/api/analyze-mood', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ text: content })
          });
          
          if (response.ok) {
            const data = await response.json();
            
            // Update mood and theme
            const moodField = document.querySelector('[name="mood"]');
            const themeField = document.querySelector('[name="theme"]');
            
            if (moodField) moodField.value = data.mood;
            if (themeField) themeField.value = data.theme.name;
            
            // Show a preview of the theme
            const themePreview = document.getElementById('theme-preview');
            if (themePreview) {
              themePreview.className = '';
              themePreview.classList.add('theme-' + data.mood, 'p-4', 'rounded-md', 'mt-2');
              themePreview.innerHTML = `
                <p class="text-sm font-medium">Detected mood: <span class="capitalize">${data.mood}</span></p>
                <p class="text-sm">Theme: ${data.theme.name}</p>
              `;
            }
          }
        } catch (error) {
          console.error('Error detecting mood:', error);
        }
      }
    });
  });
}

function setupReactions() {
  const reactionButtons = document.querySelectorAll('[data-reaction]');
  
  reactionButtons.forEach(button => {
    button.addEventListener('click', async function() {
      const eventId = this.getAttribute('data-event-id');
      const reaction = this.getAttribute('data-reaction');
      
      try {
        const response = await fetch(`/events/${eventId}/react`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          },
          body: JSON.stringify({ reaction })
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // Update reaction counts
          const likeCount = document.querySelector(`[data-like-count="${eventId}"]`);
          const dislikeCount = document.querySelector(`[data-dislike-count="${eventId}"]`);
          
          if (likeCount) likeCount.textContent = data.likes;
          if (dislikeCount) dislikeCount.textContent = data.dislikes;
          
          // Highlight active reaction
          if (reaction === 'like') {
            this.classList.add('text-blue-500');
            document.querySelector(`[data-reaction="dislike"][data-event-id="${eventId}"]`).classList.remove('text-red-500');
          } else {
            this.classList.add('text-red-500');
            document.querySelector(`[data-reaction="like"][data-event-id="${eventId}"]`).classList.remove('text-blue-500');
          }
          
          // Show animation
          this.classList.add('animate-pulse');
          setTimeout(() => {
            this.classList.remove('animate-pulse');
          }, 1000);
        }
      } catch (error) {
        console.error('Error submitting reaction:', error);
      }
    });
  });
}

function setupCommentForms() {
  const commentForms = document.querySelectorAll('.comment-form');
  
  commentForms.forEach(form => {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const eventId = this.getAttribute('data-event-id');
      const commentContent = this.querySelector('textarea').value.trim();
      
      if (!commentContent) return;
      
      try {
        const response = await fetch(`/events/${eventId}/comment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            content: commentContent
          })
        });
        
        if (response.redirected) {
          window.location.href = response.url;
        }
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    });
  });
}

function setupProfileActions() {
  const followButtons = document.querySelectorAll('[data-follow]');
  
  followButtons.forEach(button => {
    button.addEventListener('click', async function() {
      const userId = this.getAttribute('data-user-id');
      
      try {
        const response = await fetch(`/users/follow/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // Update button text and style
          if (data.following) {
            this.textContent = 'Unfollow';
            this.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
            this.classList.add('bg-gray-600', 'hover:bg-gray-700');
          } else {
            this.textContent = 'Follow';
            this.classList.remove('bg-gray-600', 'hover:bg-gray-700');
            this.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
          }
        }
      } catch (error) {
        console.error('Error following/unfollowing user:', error);
      }
    });
  });
}

function setupNotifications() {
  // Check for new notifications periodically
  if (document.querySelector('[data-notification-count]')) {
    setInterval(checkNotifications, 60000); // Check every minute
  }
}

async function checkNotifications() {
  try {
    const response = await fetch('/api/notifications/unread', {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      const count = data.count;
      
      // Update notification badge
      const badge = document.querySelector('[data-notification-count]');
      if (badge) {
        badge.textContent = count;
        
        if (count > 0) {
          badge.classList.remove('hidden');
        } else {
          badge.classList.add('hidden');
        }
      }
    }
  } catch (error) {
    console.error('Error checking notifications:', error);
  }
}

// Helper Functions
function getToken() {
  // This should be implemented according to how you store JWT tokens
  // For example, from localStorage or cookies
  return localStorage.getItem('auth_token') || '';
}