// Demo CRUD against an in-memory adapter (standalone)
(async function(){
  function createInMemoryAdapter() {
    const state = { projects: [], nextId: 1 };
    const sqlTag = async function(strings, ...values) {
      let q = '';
      for (let i = 0; i < strings.length; i++) {
        q += strings[i];
        if (i < values.length) q += values[i];
      }
      const nq = q.replace(/\s+/g,' ').trim().toLowerCase();
      if (nq.startsWith('select') && nq.includes('from projects')) {
        return state.projects.slice().sort((a,b)=> (b.created_at||0)-(a.created_at||0));
      }
      if (nq.includes('insert into projects')) {
        const [slug, title, description, hero_image] = values;
        const now = Date.now();
        const row = { id: state.nextId++, slug: slug ?? null, title: title ?? null, description: description ?? null, hero_image: hero_image ?? null, created_at: now };
        state.projects.push(row);
        return [row];
      }
      if (nq.includes('update projects set')) {
        const id = values[values.length-1];
        const slug = values[0];
        const title = values[1];
        const description = values[2];
        const hero_image = values[3];
        const idx = state.projects.findIndex(p=>p.id===Number(id));
        if (idx===-1) return [];
        const updated = Object.assign({}, state.projects[idx], { slug: slug ?? state.projects[idx].slug, title: title ?? state.projects[idx].title, description: description ?? state.projects[idx].description, hero_image: hero_image ?? state.projects[idx].hero_image });
        state.projects[idx] = updated;
        return [updated];
      }
      if (nq.includes('delete from projects')) {
        const id = values[0];
        const idx = state.projects.findIndex(p=>p.id===Number(id));
        if (idx!==-1) state.projects.splice(idx,1);
        return { ok: true };
      }
      return [];
    };
    sqlTag.__state = state;
    sqlTag.end = async ()=>{};
    return sqlTag;
  }

  const sql = createInMemoryAdapter();

  console.log('CREATE');
  const created = (await sql`INSERT INTO projects (slug,title,description,hero_image) VALUES (${ 'demo-slug' }, ${ 'Demo Project' }, ${ null }, ${ null }) RETURNING id, slug, title, description, hero_image, created_at`)[0];
  console.log(JSON.stringify(created, null, 2));

  console.log('\nLIST AFTER CREATE');
  let list = await sql`SELECT id, slug, title, description, hero_image, created_at FROM projects ORDER BY created_at DESC`;
  console.log(JSON.stringify(list, null, 2));

  console.log('\nUPDATE');
  const id = created.id;
  const updated = (await sql`UPDATE projects SET slug = ${ 'demo-slug-upd' }, title = ${ 'Updated demo' }, description = ${ null }, hero_image = ${ null } WHERE id = ${ id } RETURNING id, slug, title, description, hero_image, created_at`)[0];
  console.log(JSON.stringify(updated, null, 2));

  console.log('\nLIST AFTER UPDATE');
  list = await sql`SELECT id, slug, title, description, hero_image, created_at FROM projects ORDER BY created_at DESC`;
  console.log(JSON.stringify(list, null, 2));

  console.log('\nDELETE');
  const del = await sql`DELETE FROM projects WHERE id = ${ id }`;
  console.log(JSON.stringify(del, null, 2));

  console.log('\nLIST AFTER DELETE');
  list = await sql`SELECT id, slug, title, description, hero_image, created_at FROM projects ORDER BY created_at DESC`;
  console.log(JSON.stringify(list, null, 2));

})();
