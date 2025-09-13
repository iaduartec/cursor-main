import { getAllProjects } from '../lib/db-projects.new';

(async () => {
  const projects = await getAllProjects();
  console.log('projects count:', projects.length);
  if (projects.length > 0) {
    console.log(projects.slice(0,3));
  }
})();
