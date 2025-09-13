import dotenv from 'dotenv';
dotenv.config();
import { allProyectos } from 'contentlayer/generated';
import { getAllProjects } from '../lib/db-projects.new';

(async ()=>{
  console.log('allProyectos length =', allProyectos.length);
  try{
    const p = await getAllProjects();
    console.log('getAllProjects length =', p.length);
    console.log('sample first 3 slugs:', p.slice(0,3).map(x=>x.slug));
  }catch(e){
    console.error('error calling getAllProjects', e);
  }
})();
