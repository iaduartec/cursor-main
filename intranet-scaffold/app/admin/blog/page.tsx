import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';

interface Post {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  category?: string;
  image?: string;
  date: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    description: '',
    content: '',
    category: '',
    image: '',
    date: new Date().toISOString().split('T')[0],
    published: false,
  });

  // Fetch posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/posts');
      if (!response.ok) throw new Error('Error al cargar posts');
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingPost
        ? `/api/admin/posts/${editingPost.id}`
        : '/api/admin/posts';

      const method = editingPost ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al guardar post');

      await fetchPosts();
      setShowForm(false);
      setEditingPost(null);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este post?')) return;

    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar post');

      await fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  // Handle edit
  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({
      slug: post.slug,
      title: post.title,
      description: post.description,
      content: post.content,
      category: post.category || '',
      image: post.image || '',
      date: new Date(post.date).toISOString().split('T')[0],
      published: post.published,
    });
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      slug: '',
      title: '',
      description: '',
      content: '',
      category: '',
      image: '',
      date: new Date().toISOString().split('T')[0],
      published: false,
    });
  };

  // Cancel form
  const handleCancel = () => {
    setShowForm(false);
    setEditingPost(null);
    resetForm();
  };

  if (loading) {
    return (
      <AdminLayout title='Gestión de Blog' description='Cargando posts...'>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title='Gestión de Blog'
      description='Administra los posts y artículos del blog de Duartec'
    >
      {/* Header */}
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Blog</h1>
          <p className='text-gray-600'>
            Gestiona todos los posts y artículos del blog
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors'
        >
          Nuevo Post
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
          <div className='relative top-20 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto'>
            <div className='mt-3'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                {editingPost ? 'Editar Post' : 'Nuevo Post'}
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
                      placeholder='mi-primer-post'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Categoría
                    </label>
                    <input
                      type='text'
                      value={formData.category}
                      onChange={e =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                      placeholder='Instalaciones'
                    />
                  </div>
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
                    placeholder='Mi Primer Post'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Descripción
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={e =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    placeholder='Breve descripción del post...'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Contenido (Markdown)
                  </label>
                  <textarea
                    required
                    rows={8}
                    value={formData.content}
                    onChange={e =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm'
                    placeholder='# Título del post

Contenido del post en formato Markdown...'
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
                      Fecha
                    </label>
                    <input
                      type='date'
                      required
                      value={formData.date}
                      onChange={e =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    />
                  </div>
                </div>

                <div className='flex items-center'>
                  <input
                    id='published'
                    type='checkbox'
                    checked={formData.published}
                    onChange={e =>
                      setFormData({ ...formData, published: e.target.checked })
                    }
                    className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                  />
                  <label
                    htmlFor='published'
                    className='ml-2 block text-sm text-gray-900'
                  >
                    Publicar post
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
                    {editingPost ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className='bg-white shadow overflow-hidden sm:rounded-md'>
        <ul className='divide-y divide-gray-200'>
          {posts.map(post => (
            <li key={post.id} className='px-6 py-4'>
              <div className='flex items-center justify-between'>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between'>
                    <div className='flex-1 min-w-0'>
                      <h3 className='text-lg font-medium text-gray-900 truncate'>
                        {post.title}
                      </h3>
                      <p className='text-sm text-gray-500 truncate'>
                        {post.description}
                      </p>
                      <div className='flex items-center space-x-4 mt-2'>
                        <span className='text-sm text-gray-500'>
                          Slug: {post.slug}
                        </span>
                        {post.category && (
                          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                            {post.category}
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            post.published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {post.published ? 'Publicado' : 'Borrador'}
                        </span>
                      </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <span className='text-sm text-gray-500'>
                        {new Date(post.date).toLocaleDateString('es-ES')}
                      </span>
                      <button
                        onClick={() => handleEdit(post)}
                        className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors'
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors'
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Empty State */}
        {posts.length === 0 && !loading && (
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
                d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
              />
            </svg>
            <h3 className='mt-2 text-sm font-medium text-gray-900'>
              No hay posts
            </h3>
            <p className='mt-1 text-sm text-gray-500'>
              Comienza creando tu primer post del blog.
            </p>
            <div className='mt-6'>
              <button
                onClick={() => setShowForm(true)}
                className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'
              >
                Crear Post
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
