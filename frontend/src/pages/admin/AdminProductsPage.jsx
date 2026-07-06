import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { addProduct, deleteProduct, updateProduct } from '../../store/slices/productSlice.js';

const PRODUCTS_PER_PAGE = 5;

export function AdminProductsPage() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    brand: 'Apple',
    price: '',
    stock: '',
    imageUrl: '',
    description: '',
    category: 'iPhone',
  });

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return products;
    }

    return products.filter((product) =>
      [product.name, product.brand, product.category, product.description]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [products, searchTerm]);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const page = Math.min(currentPage, totalPages);
    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [currentPage, filteredProducts, totalPages]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const resetForm = () => {
    setEditingProductId(null);
    setFormData({
      name: '',
      brand: 'Apple',
      price: '',
      stock: '',
      imageUrl: '',
      description: '',
      category: 'iPhone',
    });
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    };

    if (editingProductId) {
      dispatch(updateProduct({ ...payload, id: editingProductId }));
      toast.success('Product updated successfully.');
    } else {
      dispatch(addProduct(payload));
      toast.success('Product added successfully.');
    }

    closeModal();
  };

  const handleEdit = (product) => {
    setEditingProductId(product.id);
    setFormData({
      name: product.name,
      brand: product.brand,
      price: String(product.price),
      stock: String(product.stock),
      imageUrl: product.imageUrl,
      description: product.description,
      category: product.category,
    });
    setIsModalOpen(true);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  return (
    <section className="page-shell space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Product Inventory</h1>
          <p className="mt-1 text-sm text-steel">Add products, update details, remove listings, and manage stock.</p>
        </div>
        <button className="btn-primary" type="button" onClick={openAddModal}>
          Add Product
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-ink">Inventory List</h2>
        <input
          className="input-field sm:max-w-xs"
          placeholder="Search inventory"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {filteredProducts.length === 0 ? (
        <EmptyState title="No inventory matches" message="Clear the search or add a new product above." />
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-steel">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Brand</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-3 font-semibold text-ink">{product.name}</td>
                    <td className="px-4 py-3 text-steel">{product.brand}</td>
                    <td className="px-4 py-3 text-steel">{product.category}</td>
                    <td className="px-4 py-3 text-steel">₹{product.price.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {product.stock}
                        {product.stock <= 0 ? (
                          <span className="rounded-md bg-red-50 px-2 py-1 text-xs font-bold text-red-700">
                            Out of Stock
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="btn-secondary" type="button" onClick={() => handleEdit(product)}>
                          Edit
                        </button>
                        <button
                          className="inline-flex min-h-10 items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                          type="button"
                          onClick={() => setProductToDelete(product)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
      }

      {
        filteredProducts.length > PRODUCTS_PER_PAGE ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-steel">
              Page {Math.min(currentPage, totalPages)} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                className="btn-secondary"
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              >
                Previous
              </button>
              <button
                className="btn-secondary"
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              >
                Next
              </button>
            </div>
          </div>
        ) : null
      }

      {
        isModalOpen ? (
          <Modal title={editingProductId ? 'Edit Product' : 'Add Product'} onClose={closeModal}>
            <form className="grid gap-4 lg:grid-cols-2" onSubmit={handleSubmit}>
              <input className="input-field" name="name" placeholder="Product name" value={formData.name} onChange={handleChange} required />
              <input className="input-field" name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} required />
              <input className="input-field" name="price" type="number" min="0" placeholder="Price" value={formData.price} onChange={handleChange} required />
              <input className="input-field" name="stock" type="number" min="0" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
              <input className="input-field" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
              <input className="input-field" name="imageUrl" type="url" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} required />
              <textarea
                className="input-field min-h-28 resize-y lg:col-span-2"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <div className="flex flex-wrap gap-3 lg:col-span-2">
                <button className="btn-primary" type="submit">
                  {editingProductId ? 'Update Product' : 'Add Product'}
                </button>
                <button className="btn-secondary" type="button" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </Modal>
        ) : null
      }

      {
        productToDelete && (
          <Modal
            title="Confirm Delete"
            fullWidth={false}
            onClose={() => setProductToDelete(null)}
          >
            <div className="space-y-4">
              <p>
                Are you sure you want to delete
                <strong> {productToDelete.name}</strong>?
              </p>

              <div className="flex gap-3">
                <button
                  className="btn-secondary"
                  onClick={() => setProductToDelete(null)}
                >
                  Cancel
                </button>

                <button
                  className="bg-red-600 px-4 py-2 rounded-md text-white"
                  onClick={() => {
                    dispatch(deleteProduct(productToDelete.id));
                    setProductToDelete(null);
                    toast.success('Product deleted successfully.');
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </Modal>
        )
      }
    </section >
  );
}
