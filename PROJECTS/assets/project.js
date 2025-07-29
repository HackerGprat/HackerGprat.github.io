// List your projects here. 'url' is relative to index.html
const projects = [
    {
    name: 'HOUR - Fibo Revision Scheduler',
    url: './fibo-time-revision/fibo-revision-scheduler-day/index.html',
    thumb: './fibo-time-revision/fibo-revision-scheduler-hour/thumbnail.jpg'
  },
  {
    name: 'DAY - Fibo Revision Scheduler',
    url: './fibo-time-revision/fibo-revision-scheduler-day/index.html',
    thumb: './fibo-time-revision/fibo-revision-scheduler-day/thumbnail.jpg'
  },
  // …add more entries as needed
];


// ==== Render the project cards dynamically ====

// Wait for the HTML document to finish loading
document.addEventListener('DOMContentLoaded', () => {

  // Grab the container element where project cards will be inserted
  const projects_row = document.getElementById('projects-row');

  // Loop through each project object in the `projects` array
  projects.forEach(project_item => {

    // Create a new <div> to act as a Bootstrap column wrapper
    const project_col = document.createElement('div');

    // Add responsive column classes for different screen sizes
    project_col.className = 'col-6 col-sm-4 col-md-3 col-lg-2';

    // Build the card’s inner HTML (link → card → thumbnail or placeholder → title)
    project_col.innerHTML = `
      <a href="${project_item.url}" class="text-decoration-none text-dark">
        <div class="card project-card shadow-sm">
          ${
            // If `thumb` exists, render an <img>; otherwise show a gray “No Image” box
            project_item.thumb
              ? `<img 
                   src="${project_item.thumb}" 
                   alt="${project_item.name}" 
                   class="card-img-top" />`
              : `<div 
                   class="bg-secondary text-white 
                          d-flex align-items-center justify-content-center" 
                   style="height:150px;">
                   <span>No Image</span>
                 </div>`
          }
          <div class="card-body p-2">
            <p class="card-title text-center small mb-0">
              ${project_item.name}
            </p>
          </div>
        </div>
      </a>
    `;

    // Append this populated column into the main container
    projects_row.appendChild(project_col);
  });
});
// ==== End of - Render the project cards dynamically ====