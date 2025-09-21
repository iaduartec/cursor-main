'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';

interface Stream {
  id: number;
  title: string;
  description: string;
  slug: string;
  streamUrl: string;
  isLive: boolean;
  scheduledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function StreamingAdminPage() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStream, setEditingStream] = useState<Stream | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slug: '',
    streamUrl: '',
    isLive: false,
    scheduledAt: '',
  });

  useEffect(() => {
    fetchStreams();
  }, []);

  const fetchStreams = async () => {
    try {
      const response = await fetch('/api/streams');
      if (response.ok) {
        const data = await response.json();
        setStreams(data);
      }
    } catch (error) {
      console.error('Error fetching streams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingStream
      ? `/api/streams/${editingStream.slug}`
      : '/api/streams';
    const method = editingStream ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          scheduledAt: formData.scheduledAt || null,
        }),
      });

      if (response.ok) {
        await fetchStreams();
        setShowModal(false);
        resetForm();
      } else {
        console.error('Error saving stream');
      }
    } catch (error) {
      console.error('Error saving stream:', error);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este stream?')) return;

    try {
      const response = await fetch(`/api/streams/${slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchStreams();
      }
    } catch (error) {
      console.error('Error deleting stream:', error);
    }
  };

  const handleEdit = (stream: Stream) => {
    setEditingStream(stream);
    setFormData({
      title: stream.title,
      description: stream.description,
      slug: stream.slug,
      streamUrl: stream.streamUrl,
      isLive: stream.isLive,
      scheduledAt: stream.scheduledAt
        ? new Date(stream.scheduledAt).toISOString().slice(0, 16)
        : '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      slug: '',
      streamUrl: '',
      isLive: false,
      scheduledAt: '',
    });
    setEditingStream(null);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  if (loading) {
    return (
      <AdminLayout
        title='Streaming'
        description='Gestionar transmisiones en vivo'
      >
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-red-500'></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title='Streaming'
      description='Gestionar transmisiones en vivo'
    >
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Transmisiones en Vivo
          </h1>
          <p className='text-gray-600'>Gestiona tus streams y transmisiones</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors'
        >
          Nuevo Stream
        </button>
      </div>

      {/* Streams Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {streams.map(stream => (
          <div
            key={stream.id}
            className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'
          >
            <div className='flex items-start justify-between mb-4'>
              <div className='flex-1'>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  {stream.title}
                </h3>
                <p className='text-gray-600 text-sm mb-3 line-clamp-2'>
                  {stream.description}
                </p>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  stream.isLive
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {stream.isLive ? 'EN VIVO' : 'PROGRAMADO'}
              </div>
            </div>

            <div className='space-y-2 mb-4'>
              <div className='text-sm text-gray-500'>
                <span className='font-medium'>URL:</span> {stream.streamUrl}
              </div>
              {stream.scheduledAt && (
                <div className='text-sm text-gray-500'>
                  <span className='font-medium'>Programado:</span>{' '}
                  {new Date(stream.scheduledAt).toLocaleString('es-ES')}
                </div>
              )}
            </div>

            <div className='flex space-x-2'>
              <button
                onClick={() => handleEdit(stream)}
                className='flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors'
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(stream.slug)}
                className='flex-1 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors'
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {streams.length === 0 && (
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
              d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
            />
          </svg>
          <h3 className='mt-2 text-sm font-medium text-gray-900'>
            No hay streams
          </h3>
          <p className='mt-1 text-sm text-gray-500'>
            Comienza creando tu primera transmisión.
          </p>
          <div className='mt-6'>
            <button
              onClick={() => setShowModal(true)}
              className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700'
            >
              Crear Stream
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md mx-4'>
            <h2 className='text-xl font-bold mb-4'>
              {editingStream ? 'Editar Stream' : 'Nuevo Stream'}
            </h2>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Título
                </label>
                <input
                  type='text'
                  value={formData.title}
                  onChange={e => handleTitleChange(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Slug
                </label>
                <input
                  type='text'
                  value={formData.slug}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, slug: e.target.value }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  URL del Stream
                </label>
                <input
                  type='url'
                  value={formData.streamUrl}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      streamUrl: e.target.value,
                    }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Fecha programada
                </label>
                <input
                  type='datetime-local'
                  value={formData.scheduledAt}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      scheduledAt: e.target.value,
                    }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
                />
              </div>

              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='isLive'
                  checked={formData.isLive}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, isLive: e.target.checked }))
                  }
                  className='h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded'
                />
                <label
                  htmlFor='isLive'
                  className='ml-2 block text-sm text-gray-900'
                >
                  Stream en vivo
                </label>
              </div>

              <div className='flex space-x-3 pt-4'>
                <button
                  type='submit'
                  className='flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors'
                >
                  {editingStream ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type='button'
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className='flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors'
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
