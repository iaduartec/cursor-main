import { getAllProjects } from '../../lib/db-projects.new';

export const metadata: Metadata = {
  title: 'Proyectos - Duartec Instalaciones Informáticas',
  description:
    'Proyectos realizados por Duartec en Burgos. Instalaciones de informática, videovigilancia, sonido y electricidad.',
};

export const dynamic = 'force-dynamic';

export default async function ProyectosPage() {
  const proyectos = await getAllProjects();
                  <span>{p.date ? new Date(String(p.date)).getFullYear() : ''}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">{p.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{p.description}</p>
                <Link href={`/proyectos/${p.slug}`} className="flex items-center text-accent hover:text-accent-700 text-sm font-medium transition-colors">
                  Ver detalles
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

