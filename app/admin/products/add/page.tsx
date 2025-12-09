'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import toast from 'react-hot-toast';
import { generateSlug } from '@/lib/utils';
import { categories, brands, sizes, colors } from '@/lib/utils/sample-data';

export default function AddProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    basePrice: '',
    comparePrice: '',
    sku: '',
    inventory: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.brand) newErrors.brand = 'Brand is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.basePrice || Number(formData.basePrice) <= 0)
      newErrors.basePrice = 'Valid price is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.inventory || Number(formData.inventory) < 0)
      newErrors.inventory = 'Valid inventory count is required';
    if (imageUrls.filter((url) => url.trim()).length === 0)
      newErrors.images = 'At least one product image is required';
    if (selectedSizes.length === 0) newErrors.sizes = 'Select at least one size';
    if (selectedColors.length === 0) newErrors.colors = 'Select at least one color';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const productId = `prod-${Date.now()}`;
      const timestamp = new Date().toISOString();
      
      // Create the product
      const newProduct = {
        id: productId,
        name: formData.name,
        slug: generateSlug(formData.name),
        brand: formData.brand,
        category: formData.category,
        description: formData.description,
        base_price: Number(formData.basePrice),
        compare_price: formData.comparePrice ? Number(formData.comparePrice) : undefined,
        is_active: true,
        rating: 4.5,
        reviews_count: 0,
        images: imageUrls.filter((url) => url.trim()).map((url, index) => ({
          id: `${productId}-img-${index + 1}`,
          product_id: productId,
          url: url,
          alt: `${formData.name} - Image ${index + 1}`,
          position: index + 1,
        })),
        created_at: timestamp,
        updated_at: timestamp,
      };

      // Create variants for each size and color combination
      // Create variants for each size and color combination
      const newVariants = [];
      // Better inventory distribution
      const totalVariants = selectedSizes.length * selectedColors.length;
      let inventoryPerVariant = Math.floor(Number(formData.inventory) / totalVariants);
      const remainder = Number(formData.inventory) % totalVariants;
      
      // Ensure minimum 1 per variant if total inventory allows
      if (inventoryPerVariant === 0 && Number(formData.inventory) > 0) {
        inventoryPerVariant = 1;
      }
      
      let variantIndex = 1;
      for (const size of selectedSizes) {
        for (const color of selectedColors) {
          const variantId = `${productId}-v${variantIndex}`;
          const variantSku = `${formData.sku}-${color.substring(0, 2).toUpperCase()}-${size.replace('.', '')}`;
          
          newVariants.push({
            id: variantId,
            product_id: productId,
            sku: variantSku,
            size: size,
            color: color,
            price: Number(formData.basePrice),
            inventory_count: inventoryPerVariant,
            is_available: true,
          });
          
          variantIndex++;
        }
      }

      // Save to localStorage
      const existingProducts = JSON.parse(localStorage.getItem('admin_products') || '[]');
      const existingVariants = JSON.parse(localStorage.getItem('admin_variants') || '[]');
      
      localStorage.setItem('admin_products', JSON.stringify([...existingProducts, newProduct]));
      localStorage.setItem('admin_variants', JSON.stringify([...existingVariants, ...newVariants]));

      toast.success(`Product added successfully with ${newVariants.length} variants!`);
      setIsSubmitting(false);
      router.push('/admin/products');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" icon={<ArrowLeft size={18} />}>
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-neutral-900">Add New Product</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
                placeholder="e.g., Air Max 270 React"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Brand <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    required
                  >
                    <option value="">Select Brand</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                  {errors.brand && <p className="mt-1.5 text-sm text-red-600">{errors.brand}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1.5 text-sm text-red-600">{errors.category}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  placeholder="Describe your product..."
                  required
                />
                {errors.description && <p className="mt-1.5 text-sm text-red-600">{errors.description}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Base Price"
                  name="basePrice"
                  type="number"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={handleChange}
                  error={errors.basePrice}
                  required
                  placeholder="159.99"
                />

                <Input
                  label="Compare at Price (Optional)"
                  name="comparePrice"
                  type="number"
                  step="0.01"
                  value={formData.comparePrice}
                  onChange={handleChange}
                  placeholder="199.99"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="SKU Base"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  error={errors.sku}
                  required
                  placeholder="AM270R"
                  helperText="Will be combined with size and color"
                />

                <Input
                  label="Total Stock Quantity"
                  name="inventory"
                  type="number"
                  value={formData.inventory}
                  onChange={handleChange}
                  error={errors.inventory}
                  required
                  placeholder="100"
                  helperText="Will be divided among variants"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Sizes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      selectedSizes.includes(size)
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-300 text-neutral-700 hover:border-neutral-900'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {errors.sizes && <p className="mt-2 text-sm text-red-600">{errors.sizes}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Colors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => toggleColor(color)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      selectedColors.includes(color)
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-300 text-neutral-700 hover:border-neutral-900'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
              {errors.colors && <p className="mt-2 text-sm text-red-600">{errors.colors}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    label={`Image URL ${index + 1}`}
                    value={url}
                    onChange={(e) => handleImageUrlChange(index, e.target.value)}
                    placeholder="https://images.unsplash.com/photo-123?auto=format&fit=crop&w=800&q=80"
                  />
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageUrl(index)}
                      className="mt-7 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addImageUrl}
                icon={<Plus size={18} />}
              >
                Add Another Image
              </Button>

              {errors.images && <p className="text-sm text-red-600">{errors.images}</p>}
            </CardContent>
          </Card>

          {selectedSizes.length > 0 && selectedColors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Variants Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600 mb-2">
                  {selectedSizes.length} sizes × {selectedColors.length} colors = {selectedSizes.length * selectedColors.length} total variants
                </p>
                <p className="text-sm text-neutral-600">
                  Each variant will have approximately{' '}
                  {formData.inventory ? Math.floor(Number(formData.inventory) / (selectedSizes.length * selectedColors.length)) : 0}{' '}
                  items in stock
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-end gap-4">
            <Link href="/admin/dashboard">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" isLoading={isSubmitting}>
              {isSubmitting ? 'Adding Product...' : 'Add Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
