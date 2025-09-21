import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';

interface Service {
  id: number;
  slug: string;
  title: string;
  description: string;
  image?: string;
  areaServed?: string;
  hasOfferCatalog: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    description: '',
    image: '',
    areaServed: '',
    hasOfferCatalog: false,
  });

  // Fetch services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/services');
      if (!response.ok) throw new Error('Error al cargar servicios');
      const data = await response.json();
      setServices(data.services || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingService
        ? `/api/admin/services/${editingService.id}`
        : '/api/admin/services';

      const method = editingService ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al guardar servicio');

      await fetchServices();
      setShowForm(false);
      setEditingService(null);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este servicio?'))
      return;

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar servicio');

      await fetchServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  // Handle edit
  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      slug: service.slug,
      title: service.title,
      description: service.description,
      image: service.image || '',
      areaServed: service.areaServed || '',
      hasOfferCatalog: service.hasOfferCatalog,
    });
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      slug: '',
      title: '',
      description: '',
      image: '',
      areaServed: '',
      hasOfferCatalog: false,
    });
  };

  // Cancel form
  const handleCancel = () => {
    setShowForm(false);
    setEditingService(null);
    resetForm();
  };

  if (loading) {
    return (
      <AdminLayout
        title='Gestión de Servicios'
        description='Cargando servicios...'
      >
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title='Gestión de Servicios'
      description='Administra los servicios ofrecidos por Duartec'
    >
      {/* Header */}
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Servicios</h1>
          <p className='text-gray-600'>
            Gestiona todos los servicios y ofertas de Duartec
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors'
        >
          Nuevo Servicio
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className='mb-8 bg-red-50 border border-red-200 rounded-lg p-4'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg
                className='h-5 w-5 text-red-400'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='ml-3'>
              <p className='text-sm text-red-800'>{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
          <div className='relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white'>
            <div className='mt-3'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h3>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Slug
                    </label>
                    <input
                      type='text'
                      required
                      value={formData.slug}
                      onChange={e =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                      placeholder='electricidad'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Título
                    </label>
                    <input
                      type='text'
                      required
                      value={formData.title}
                      onChange={e =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                      placeholder='Instalaciones Eléctricas'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Descripción
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={e =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    placeholder='Descripción detallada del servicio...'
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      URL de Imagen
                    </label>
                    <input
                      type='url'
                      value={formData.image}
                      onChange={e =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                      placeholder='https://ejemplo.com/imagen.jpg'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Área de Servicio
                    </label>
                    <input
                      type='text'
                      value={formData.areaServed}
                      onChange={e =>
                        setFormData({ ...formData, areaServed: e.target.value })
                      }
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                      placeholder='Burgos y alrededores'
                    />
                  </div>
                </div>

                <div className='flex items-center'>
                  <input
                    id='hasOfferCatalog'
                    type='checkbox'
                    checked={formData.hasOfferCatalog}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        hasOfferCatalog: e.target.checked,
                      })
                    }
                    className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                  />
                  <label
                    htmlFor='hasOfferCatalog'
                    className='ml-2 block text-sm text-gray-900'
                  >
                    Tiene catálogo de ofertas
                  </label>
                </div>

                <div className='flex justify-end space-x-3 pt-4'>
                  <button
                    type='button'
                    onClick={handleCancel}
                    className='bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition-colors'
                  >
                    Cancelar
                  </button>
                  <button
                    type='submit'
                    className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors'
                  >
                    {editingService ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {services.map(service => (
          <div
            key={service.id}
            className='bg-white rounded-lg shadow-md overflow-hidden'
          >
            {service.image && (
              <img
                src={service.image}
                alt={service.title}
                className='w-full h-48 object-cover'
              />
            )}
            <div className='p-6'>
              <div className='flex justify-between items-start mb-2'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  {service.title}
                </h3>
                {service.hasOfferCatalog && (
                  <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                    Catálogo
                  </span>
                )}
              </div>

              <p className='text-gray-600 text-sm mb-4 line-clamp-3'>
                {service.description}
              </p>

              <div className='space-y-2 mb-4'>
                <p className='text-sm text-gray-500'>
                  <span className='font-medium'>Slug:</span> {service.slug}
                </p>
                {service.areaServed && (
                  <p className='text-sm text-gray-500'>
                    <span className='font-medium'>Área:</span>{' '}
                    {service.areaServed}
                  </p>
                )}
              </div>

              <div className='flex justify-between items-center text-xs text-gray-400'>
                <span>
                  Creado:{' '}
                  {new Date(service.createdAt).toLocaleDateString('es-ES')}
                </span>
                <span>
                  Actualizado:{' '}
                  {new Date(service.updatedAt).toLocaleDateString('es-ES')}
                </span>
              </div>

              <div className='flex space-x-2 mt-4'>
                <button
                  onClick={() => handleEdit(service)}
                  className='flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors'
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className='flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors'
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {services.length === 0 && !loading && (
        <div className='text-center py-12'>
          <svg
            className='mx-auto h-12 w-12 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
            />
          </svg>
          <h3 className='mt-2 text-sm font-medium text-gray-900'>
            No hay servicios
          </h3>
          <p className='mt-1 text-sm text-gray-500'>
            Comienza creando tu primer servicio.
          </p>
          <div className='mt-6'>
            <button
              onClick={() => setShowForm(true)}
              className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'
            >
              Crear Servicio
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
